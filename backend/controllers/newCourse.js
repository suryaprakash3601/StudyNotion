require("dotenv").config();
const Course = require("../modules/course");
const User = require("../modules/user");
const { uploadImage } = require("../utils/imageUploader");
const Category = require("../modules/category");
const Section = require("../modules/section");
const SubSection = require("../modules/subSection");
const secondsToDuration = require("../utils/secToDuration");
const CourseProgress = require("../modules/courseProgress");

// ─────────────────────────────────────────────────
// Create Course
// ─────────────────────────────────────────────────
exports.createCourse = async (req, res) => {
  try {
    let { title, description, whatYouWillLearn, price, tag, category, status, instructions } =
      req.body;

    const thumbnail = req.files?.thumbnail;

    // Validate required fields
    if (!title || !description || !whatYouWillLearn || !price || !thumbnail || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!status || status === undefined) {
      status = "Draft";
    }

    // Check instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor details not found",
      });
    }

    // Validate category
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Invalid category",
      });
    }

    // Upload thumbnail to Cloudinary
    let thumbnailUrl = "https://i.ibb.co/7Xyj3PC/logo.png";
    if (process.env.API_KEY && !process.env.API_KEY.includes("your_")) {
      try {
        const thumbnailDetails = await uploadImage(thumbnail, process.env.FOLDER_NAME);
        thumbnailUrl = thumbnailDetails.secure_url;
      } catch (uploadErr) {
        console.warn("Cloudinary upload failed, using default placeholder:", uploadErr.message);
      }
    } else {
      console.log("Cloudinary credentials not set, using default placeholder.");
    }

    // Parse tag and instructions if they come as JSON strings
    const parsedTag = tag ? (typeof tag === "string" ? JSON.parse(tag) : tag) : [];
    const parsedInstructions =
      instructions
        ? typeof instructions === "string"
          ? JSON.parse(instructions)
          : instructions
        : [];

    // Create course
    const createdCourse = await Course.create({
      title,
      description,
      whatYouWillLearn,
      price,
      category: categoryDetails._id,
      instructor: instructorDetails._id,
      thumbnail: thumbnailUrl,
      tag: parsedTag,
      status,
      instructions: parsedInstructions,
    });

    // Add course to instructor's course list
    await User.findByIdAndUpdate(
      instructorDetails._id,
      { $push: { courses: createdCourse._id } },
      { new: true }
    );

    // Add course to category
    await Category.findByIdAndUpdate(
      categoryDetails._id,
      { $push: { courses: createdCourse._id } },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: createdCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).json({
      success: false,
      message: "Error while creating course",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────
// Get All Courses (Public)
// ─────────────────────────────────────────────────
exports.getAllCourses = async (req, res) => {
  try {
    const courseData = await Course.find(
      { status: "Published" },
      {
        title: true,
        instructor: true,
        price: true,
        thumbnail: true,
        studentsEnrolled: true,
        ratingAndReviews: true,
        category: true,
        tag: true,
      }
    )
      .populate("instructor", "fName lName")
      .populate("ratingAndReviews")
      .exec();

    return res.status(200).json({
      success: true,
      message: "All courses fetched",
      data: courseData,
    });
  } catch (error) {
    console.error("Error fetching all courses:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while fetching courses",
    });
  }
};

// ─────────────────────────────────────────────────
// Get Course Details (Public – no video URLs)
// ─────────────────────────────────────────────────
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const courseDetails = await Course.findById(courseId)
      .populate({
        path: "instructor",
        select: "fName lName email profilePic",
        populate: {
          path: "additionalInfo",
          select: "bio gender dob contactNumber",
        },
      })
      .populate({
        path: "ratingAndReviews",
        populate: {
          path: "user",
          select: "fName lName email profilePic",
        },
      })
      .populate({
        path: "content",
        populate: {
          path: "subSection",
          select: "title timeDuration description",
        },
      })
      .populate("category", "name")
      .exec();

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Calculate total duration
    let totalDurationInSeconds = 0;
    courseDetails.content.forEach((section) => {
      section.subSection.forEach((sub) => {
        totalDurationInSeconds += parseInt(sub.timeDuration) || 0;
      });
    });

    const totalDuration = secondsToDuration(totalDurationInSeconds);

    // Compute average rating
    const totalRatings = courseDetails.ratingAndReviews.length;
    const avgRating =
      totalRatings > 0
        ? courseDetails.ratingAndReviews.reduce((sum, r) => sum + r.rating, 0) / totalRatings
        : 0;

    return res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      data: { courseDetails, totalDuration, avgRating },
    });
  } catch (error) {
    console.error("Error fetching course details:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching course details",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────
// Get Full Course Details (Authenticated – includes video URLs)
// ─────────────────────────────────────────────────
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.query;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const courseDetails = await Course.findById(courseId)
      .populate({
        path: "instructor",
        select: "fName lName email profilePic",
        populate: {
          path: "additionalInfo",
          select: "bio gender dob contactNumber",
        },
      })
      .populate({
        path: "ratingAndReviews",
        populate: {
          path: "user",
          select: "fName lName email profilePic",
        },
      })
      .populate({
        path: "content",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Get course progress for this user
    const progressRecord = await CourseProgress.findOne({
      courseId,
      userId,
    });

    // Calculate total duration
    let totalDurationInSeconds = 0;
    courseDetails.content.forEach((section) => {
      section.subSection.forEach((sub) => {
        totalDurationInSeconds += parseInt(sub.timeDuration) || 0;
      });
    });

    const totalDuration = secondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      data: {
        courseDetails,
        totalDuration,
        completedVideos: progressRecord?.completedVideos ?? [],
      },
    });
  } catch (error) {
    console.error("Error fetching full course details:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching course details",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────
// Get Instructor Courses
// ─────────────────────────────────────────────────
exports.getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user.id;

    const instructorCourses = await Course.find({ instructor: instructorId })
      .populate("category", "name")
      .populate("ratingAndReviews")
      .sort({ createdAt: -1 })
      .exec();

    return res.status(200).json({
      success: true,
      data: instructorCourses,
    });
  } catch (error) {
    console.error("Error fetching instructor courses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────
// Edit Course
// ─────────────────────────────────────────────────
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Ownership check – only the instructor who owns the course can edit it
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this course",
      });
    }

    // Handle thumbnail update
    if (req.files?.thumbnail) {
      const uploadedThumbnail = await uploadImage(
        req.files.thumbnail,
        process.env.FOLDER_NAME
      );
      course.thumbnail = uploadedThumbnail.secure_url;
    }

    const updates = req.body;
    const updatableFields = [
      "title",
      "description",
      "whatYouWillLearn",
      "price",
      "tag",
      "category",
      "status",
      "instructions",
    ];

    for (const field of updatableFields) {
      if (updates[field] !== undefined) {
        if (field === "instructions" || field === "tag") {
          course[field] =
            typeof updates[field] === "string"
              ? JSON.parse(updates[field])
              : updates[field];
        } else {
          course[field] = updates[field];
        }
      }
    }

    await course.save();

    const updatedCourse = await Course.findById(courseId)
      .populate("category", "name")
      .populate({
        path: "instructor",
        select: "-password",
        populate: { path: "additionalInfo" },
      })
      .populate({
        path: "content",
        populate: { path: "subSection" },
      })
      .populate("ratingAndReviews");

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Error editing course:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────
// Delete Course
// ─────────────────────────────────────────────────
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Validate courseId BEFORE attempting DB operations
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const courseInfo = await Course.findById(courseId);
    if (!courseInfo) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Ownership check – only the instructor who owns the course can delete it
    if (courseInfo.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this course",
      });
    }

    // Unenroll all students
    for (const studentId of courseInfo.studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });
    }

    // Delete all sections and their subsections
    for (const sectionId of courseInfo.content) {
      const sectionInfo = await Section.findById(sectionId);
      if (sectionInfo) {
        for (const subSectionId of sectionInfo.subSection) {
          await SubSection.findByIdAndDelete(subSectionId);
        }
        await Section.findByIdAndDelete(sectionId);
      }
    }

    // Remove course from category
    await Category.findByIdAndUpdate(courseInfo.category, {
      $pull: { courses: courseId },
    });

    // Remove course from instructor
    await User.findByIdAndUpdate(courseInfo.instructor, {
      $pull: { courses: courseId },
    });

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

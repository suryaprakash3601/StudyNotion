const Category = require("../modules/category");
const Course = require("../modules/course");

// ─────────────────────────────────────────────────
// Create Category (Admin only)
// ─────────────────────────────────────────────────
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // Check for duplicate category
    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({ name, description });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────────
// Show All Categories
// ─────────────────────────────────────────────────
exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find({}, { name: true, description: true });

    return res.status(200).json({
      success: true,
      data: allCategories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────────
// Category Page Details
// ─────────────────────────────────────────────────
exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryName } = req.query;

    if (!categoryName) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // Convert slug to readable name (e.g., "web-development" → "web development")
    const formattedName = categoryName.split("-").join(" ");

    // Find category – case-insensitive match
    const selectedCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${formattedName}$`, "i") },
    }).populate({
      path: "courses",
      match: { status: "Published" },
      populate: [
        {
          path: "ratingAndReviews",
        },
        {
          path: "instructor",
          select: "fName lName",
        },
      ],
    });

    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: `Category '${categoryName}' not found`,
      });
    }

    const categoryId = selectedCategory._id;

    // Courses from other categories
    const differentCategories = await Course.find({
      category: { $ne: categoryId },
      status: "Published",
    })
      .populate("category", "name")
      .populate("ratingAndReviews")
      .populate("instructor", "fName lName")
      .limit(10)
      .exec();

    // Top trending in this category (by enrollment)
    const trending = await Course.find({ category: categoryId, status: "Published" })
      .sort({ studentsEnrolled: -1 })
      .populate("instructor", "fName lName")
      .populate("ratingAndReviews")
      .limit(10)
      .exec();

    // Top 10 selling courses overall
    const topSellingCourse = await Course.find({ status: "Published" })
      .sort({ studentsEnrolled: -1 })
      .limit(10)
      .populate("instructor", "fName lName")
      .populate("ratingAndReviews")
      .exec();

    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategories,
        topSellingCourse,
        trending,
      },
    });
  } catch (error) {
    console.error("Error in categoryPageDetails:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

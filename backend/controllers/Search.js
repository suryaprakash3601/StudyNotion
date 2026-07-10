const Course = require("../modules/course");
const Category = require("../modules/category");

/**
 * Smart Course Search
 * Supports: keyword, category filter, price range, rating filter, sort
 * GET /api/v1/course/search?q=react&category=web&minPrice=0&maxPrice=1000&minRating=4&sort=popular
 */
exports.searchCourses = async (req, res) => {
  try {
    const {
      q = "",
      category,
      minPrice,
      maxPrice,
      minRating,
      sort = "popular", // popular | newest | price-asc | price-desc
      page = 1,
      limit = 12,
    } = req.query;

    const query = { status: "Published" };

    // Full-text / keyword search across title, description, and tags
    if (q.trim()) {
      query.$or = [
        { title: { $regex: q.trim(), $options: "i" } },
        { description: { $regex: q.trim(), $options: "i" } },
        { tag: { $in: [new RegExp(q.trim(), "i")] } },
      ];
    }

    // Category filter
    if (category) {
      const cat = await Category.findOne({ name: { $regex: category, $options: "i" } });
      if (cat) query.category = cat._id;
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    // Build sort option
    let sortOption = {};
    switch (sort) {
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      case "price-asc":
        sortOption = { price: 1 };
        break;
      case "price-desc":
        sortOption = { price: -1 };
        break;
      case "popular":
      default:
        sortOption = { "studentsEnrolled.length": -1, createdAt: -1 };
        break;
    }

    const skip = (Number(page) - 1) * Number(limit);

    let courses = await Course.find(query)
      .populate("instructor", "fName lName profilePic")
      .populate("category", "name")
      .populate("ratingAndReviews", "rating")
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .select("title description thumbnail price studentsEnrolled ratingAndReviews instructor category tag createdAt");

    // Compute avgRating per course
    const coursesWithStats = courses.map((course) => {
      const ratings = course.ratingAndReviews.map((r) => r.rating);
      const avgRating =
        ratings.length > 0
          ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
          : 0;
      return {
        ...course.toObject(),
        avgRating,
        totalStudents: course.studentsEnrolled.length,
        totalReviews: ratings.length,
      };
    });

    // Filter by minRating after computing (MongoDB doesn't store computed avg)
    const filtered =
      minRating !== undefined
        ? coursesWithStats.filter((c) => c.avgRating >= Number(minRating))
        : coursesWithStats;

    const total = await Course.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: filtered,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while searching courses",
      error: error.message,
    });
  }
};

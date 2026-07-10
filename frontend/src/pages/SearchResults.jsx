import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { courseEndpoints } from "../services/api";
import RatingStars from "../components/common/RatingStars";
import { debounce } from "lodash";

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(searchParams.get("q") || "");

  const q = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "popular";
  const page = Number(searchParams.get("page") || 1);
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const minRating = searchParams.get("minRating") || "";

  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const params = { q, sort, page, limit: 12 };
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (minRating) params.minRating = minRating;

      const response = await apiConnector(
        "GET",
        courseEndpoints.SEARCH_COURSES_API,
        null,
        null,
        params
      );

      if (response?.data?.success) {
        setResults(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }, [q, sort, page, minPrice, maxPrice, minRating]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // Debounced search input handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("q", value);
        next.set("page", "1");
        return next;
      });
    }, 400),
    []
  );

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    debouncedSearch(e.target.value);
  };

  const updateParam = (key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      next.set("page", "1");
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-richblack-900 text-white px-4 py-10">
      <div className="max-w-[1260px] mx-auto">
        {/* Search bar */}
        <div className="mb-8">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Search for courses, topics, skills..."
            className="w-full rounded-lg bg-richblack-700 border border-richblack-500 px-5 py-4 text-lg text-white placeholder:text-richblack-400 focus:outline-none focus:border-yellow-400 transition-colors"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-richblack-800 rounded-xl p-5 space-y-6">
              <h3 className="text-lg font-semibold text-yellow-400">Filters</h3>

              {/* Sort */}
              <div>
                <p className="text-sm font-medium text-richblack-200 mb-2">Sort By</p>
                <select
                  value={sort}
                  onChange={(e) => updateParam("sort", e.target.value)}
                  className="w-full bg-richblack-700 border border-richblack-500 rounded-lg px-3 py-2 text-sm text-white"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price range */}
              <div>
                <p className="text-sm font-medium text-richblack-200 mb-2">Price Range (₹)</p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => updateParam("minPrice", e.target.value)}
                    className="w-full bg-richblack-700 border border-richblack-500 rounded-lg px-3 py-2 text-sm text-white"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => updateParam("maxPrice", e.target.value)}
                    className="w-full bg-richblack-700 border border-richblack-500 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              {/* Min rating */}
              <div>
                <p className="text-sm font-medium text-richblack-200 mb-2">Minimum Rating</p>
                <select
                  value={minRating}
                  onChange={(e) => updateParam("minRating", e.target.value)}
                  className="w-full bg-richblack-700 border border-richblack-500 rounded-lg px-3 py-2 text-sm text-white"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5 & up</option>
                  <option value="4">4.0 & up</option>
                  <option value="3.5">3.5 & up</option>
                  <option value="3">3.0 & up</option>
                </select>
              </div>

              {/* Reset filters */}
              <button
                onClick={() => {
                  setSearchParams({ q });
                  setInputValue(q);
                }}
                className="w-full text-sm text-yellow-400 hover:text-yellow-300 underline text-left"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Result count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-richblack-300 text-sm">
                {loading
                  ? "Searching..."
                  : pagination
                  ? `${pagination.total} result${pagination.total !== 1 ? "s" : ""} for "${q}"`
                  : ""}
              </p>
            </div>

            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-richblack-700 rounded-xl h-72 animate-pulse"
                  />
                ))}
              </div>
            )}

            {!loading && results.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-richblack-300">
                <span className="text-5xl">🔍</span>
                <p className="text-xl font-semibold">No courses found</p>
                <p className="text-sm">Try different keywords or adjust your filters</p>
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {results.map((course) => (
                  <Link
                    key={course._id}
                    to={`/courses/${course._id}`}
                    className="bg-richblack-800 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-richblack-700 transition-shadow duration-200 flex flex-col"
                  >
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-44 w-full object-cover"
                    />
                    <div className="p-4 flex flex-col gap-2 flex-1">
                      <h3 className="font-semibold text-base line-clamp-2 leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs text-richblack-300">
                        {course.instructor?.fName} {course.instructor?.lName}
                      </p>
                      <div className="flex items-center gap-1 mt-auto">
                        <span className="text-yellow-400 text-sm font-semibold">
                          {course.avgRating.toFixed(1)}
                        </span>
                        <RatingStars Review_Count={course.avgRating} Star_Size={14} />
                        <span className="text-xs text-richblack-300">
                          ({course.totalReviews})
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-lg font-bold text-richblack-5">
                          ₹{course.price}
                        </span>
                        <span className="text-xs text-richblack-400">
                          {course.totalStudents} students
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                <button
                  disabled={page <= 1}
                  onClick={() => updateParam("page", String(page - 1))}
                  className="px-4 py-2 rounded-lg bg-richblack-700 disabled:opacity-40 hover:bg-richblack-600 transition-colors"
                >
                  ← Prev
                </button>
                <span className="px-4 py-2 text-richblack-300">
                  Page {page} of {pagination.totalPages}
                </span>
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => updateParam("page", String(page + 1))}
                  className="px-4 py-2 rounded-lg bg-richblack-700 disabled:opacity-40 hover:bg-richblack-600 transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

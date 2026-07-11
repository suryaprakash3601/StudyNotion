import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { fetchInstructorCourses, fetchInstructorReviews } from "../../../services/operations/courseApi";

import InstructorChart from "../Dashboard/DashboardChart/InstructorChart";
import { getInstructorData } from "../../../services/operations/profileApi";
import ReactStars from "react-rating-stars-component";
import { FaStar } from "react-icons/fa";

export default function Instructor() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(false);
  const [instructorData, setInstructorData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const instructorApiData = await getInstructorData(token);
      const result = await fetchInstructorCourses(token);
      const reviewsResult = await fetchInstructorReviews(token);
      console.log("Data", instructorApiData);
      if (instructorApiData.length) setInstructorData(instructorApiData);
      if (result) {
        setCourses(result);
      }
      if (reviewsResult) {
        setReviews(reviewsResult);
      }
      setLoading(false);
    })();
  }, []);

  const totalAmount = instructorData?.reduce(
    (acc, curr) => acc + curr.totalAmountGenerated,
    0
  );

  const totalStudents = instructorData?.reduce(
    (acc, curr) => acc + curr.totalStudentsEnrolled,
    0
  );

  return (
    <div className="flex flex-col gap-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-richblack-5">
          Hi {user?.fName} 👋
        </h1>
        <p className="font-medium text-richblack-200">
          Let's start something new
        </p>
      </div>
      {loading ? (
        <>
          <div className=" flex items-center justify-center h-full w-full mt-10">
            <div className="spinner "></div>
          </div>
          
        </>
      ) : courses.length > 0 ? (
        <div>
          <div className="my-4 flex flex-col lg:flex-row h-auto lg:h-[450px] gap-4">
            {/* Render chart / graph */}
            <div className="flex-1 min-h-[300px] lg:h-full">
              {totalAmount > 0 || totalStudents > 0 ? (
                <InstructorChart courses={instructorData} />
              ) : (
                <div className="h-full rounded-md bg-richblack-800 p-6">
                  <p className="text-lg font-bold text-richblack-5">Visualize</p>
                  <p className="mt-4 text-xl font-medium text-richblack-50">
                    Not Enough Data To Visualize
                  </p>
                </div>
              )}
            </div>
            {/* Total Statistics */}
            <div className="flex w-full lg:min-w-[250px] lg:w-auto flex-col rounded-md bg-richblack-800 p-6">
              <p className="text-lg font-bold text-richblack-5">Statistics</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-lg text-richblack-200">Total Courses</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    {courses.length}
                  </p>
                </div>
                <div>
                  <p className="text-lg text-richblack-200">Total Students</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    {totalStudents}
                  </p>
                </div>
                <div>
                  <p className="text-lg text-richblack-200">Total Income</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    Rs. {totalAmount}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-md bg-richblack-800 p-6">
            {/* Render 3 courses */}
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-richblack-5">Your Courses</p>
              <Link to="/dashboard/my-courses">
                <p className="text-xs font-semibold text-yellow-50">View All</p>
              </Link>
            </div>
            <div className="my-4 flex flex-col md:flex-row gap-6 md:gap-0 md:space-x-6 items-start">
              {courses.slice(0, 3).map((course) => (
                <div key={course._id} className="w-full md:w-1/3">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-[201px] w-full rounded-md object-cover"
                  />
                  <div className="mt-3 w-full">
                    <p className="text-sm font-medium text-richblack-50">
                      {course.title}
                    </p>
                    <div className="mt-1 flex items-center space-x-2">
                      <p className="text-xs font-medium text-richblack-300">
                        {course.studentsEnrolled.length} students
                      </p>
                      <p className="text-xs font-medium text-richblack-300">
                        |
                      </p>
                      <p className="text-xs font-medium text-richblack-300">
                        Rs. {course.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Reviews Section */}
          <div className="rounded-md bg-richblack-800 p-6 mt-6">
            <p className="text-lg font-bold text-richblack-5">Recent Student Reviews & Feedback</p>
            {reviews.length > 0 ? (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviews.map((review) => (
                  <div key={review._id} className="rounded-md bg-richblack-900 p-4 border border-richblack-700 flex flex-col gap-y-3">
                    <div className="flex items-center gap-x-3">
                      <img
                        src={
                          review?.user?.profilePic
                            ? review?.user?.profilePic
                            : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.fName} ${review?.user?.lName}`
                        }
                        alt="User Profile"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold text-richblack-5">
                          {review?.user?.fName} {review?.user?.lName}
                        </p>
                        <p className="text-xs text-richblack-300">
                          Course: <span className="text-yellow-50">{review?.course?.title}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-x-2">
                      <ReactStars
                        count={5}
                        value={review.rating}
                        size={18}
                        edit={false}
                        activeColor="#ffd700"
                        emptyIcon={<FaStar />}
                        fullIcon={<FaStar />}
                      />
                      <span className="text-xs font-medium text-yellow-100 mt-0.5">
                        ({review.rating.toFixed(1)})
                      </span>
                    </div>
                    
                    <p className="text-sm text-richblack-200 italic">
                      "{review.reviews}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-richblack-300">No reviews received yet for your courses.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
          <p className="text-center text-2xl font-bold text-richblack-5">
            You have not created any courses yet
          </p>
          <Link to="/dashboard/add-course">
            <p className="mt-1 text-center text-lg font-semibold text-yellow-50">
              Create a course
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}

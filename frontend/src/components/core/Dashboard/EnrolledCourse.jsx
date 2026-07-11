import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProgressBar from "@ramonak/react-progress-bar";
import { getUserEnrolledCourses } from "../../../services/operations/profileApi";
import { useNavigate } from "react-router-dom";

const EnrolledCourses = () => {
  const { token } = useSelector((state) => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState(null);
  const navigate=useNavigate();

  const getEnrolledCourses = async () => {
    try {
      const response = await getUserEnrolledCourses(token);
      setEnrolledCourses(response);
    } catch (error) {
      console.log("Unable to Fetch Enrolled Courses");
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, []);
  console.log(enrolledCourses);

  return (
    <div className="text-white w-11/12 max-w-[1000px] mx-auto mt-10">
      <h1 className="text-3xl font-semibold mb-6">Enrolled Courses</h1>

      {!enrolledCourses ? (
        <div className="text-lg text-yellow-400">Loading...</div>
      ) : !enrolledCourses.length ? (
        <p className="text-lg text-gray-300">
          You have not enrolled in any course yet
        </p>
      ) : (
        <div className="space-y-6">
          {/* Table Header */}
          <div className="hidden sm:grid grid-cols-12 bg-gray-800 py-2 px-4 rounded-md text-sm font-semibold text-gray-300">
            <p className="col-span-6">Course Name</p>
            <p className="col-span-3">Duration</p>
            <p className="col-span-3">Progress</p>
          </div>

          {/* Course List */}
          {enrolledCourses.map((course, index) => (
            <div
              key={index}
              className="flex flex-col sm:grid sm:grid-cols-12 items-start sm:items-center bg-richblack-800 hover:bg-richblack-700 transition-colors duration-200 py-4 px-4 gap-4 sm:gap-0 rounded-md shadow-md cursor-pointer"
              onClick={() => {
                if (!course.content?.length || !course.content[0]?.subSection?.length) {
                  return;
                }
                navigate(`/view-course/${course._id}/section/${course.content[0]._id}/sub-section/${course.content[0].subSection[0]._id}`);
              }}
            >
              {/* Course Info */}
              <div className="col-span-6 flex items-center gap-4 w-full">
                <img
                  src={course.thumbnail}
                  alt={course.courseName}
                  className="w-16 h-12 sm:w-20 sm:h-16 rounded object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-base font-medium truncate sm:whitespace-normal">{course.title}</p>
                  <p className="text-sm text-gray-400 truncate sm:whitespace-normal">
                    {course.description.split(" ").length > 5
                      ? course.description.split(" ").splice(0,5).join(" ") +
                        "..."
                      : course.description}
                  </p>
                </div>
              </div>

              {/* Duration */}
              <div className="col-span-3 text-sm text-gray-300 flex items-center gap-2 sm:block">
                <span className="sm:hidden font-semibold text-gray-400">Duration:</span>
                {course?.totalDuration || `02hr : 50min`}
              </div>

              {/* Progress */}
              <div className="col-span-3 w-full sm:w-auto">
                <p className="text-sm text-gray-300 mb-1">
                  Progress: {course.progressPercentage || 0}%
                </p>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="8px"
                  isLabelVisible={false}
                  baseBgColor="#374151"
                  bgColor="#22c55e"
                  labelAlignment="center"
                  animateOnRender
                />
                {course.progressPercentage >= 100 && (
                  <button
                    className="mt-2 text-xs font-semibold text-yellow-400 hover:text-yellow-300 underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/certificate/${course._id}`);
                    }}
                  >
                    🎓 Get Certificate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;

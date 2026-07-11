import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ReactStars from "react-rating-stars-component";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import { FaStar } from "react-icons/fa";
import { apiConnector } from "../../services/apiConnector";
import { courseEndpoints } from "../../services/api";

export default function ReviewSlider() {
  const { GET_ALL_REVIEWS } = courseEndpoints;
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function getReviews() {
      try {
        const response = await apiConnector("GET", GET_ALL_REVIEWS, null, null);
        if (response) {
          setReviews(response.data.data);
        }
      } catch (error) {
        console.log("Error fetching reviews:", error);
      }
    }
    getReviews();
  }, [GET_ALL_REVIEWS]);

  return (
    <div className="text-white w-full">
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        freeMode={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 25,
          },
          1200: {
            slidesPerView: 4,
            spaceBetween: 25,
          },
        }}
        modules={[FreeMode, Pagination, Autoplay]}
        className="w-full"
      >
        {reviews.map((review, i) => {
          return (
            <SwiperSlide key={i}>
              <div className="flex flex-col gap-3 bg-richblack-800 p-4 text-[14px] text-richblack-25 rounded-lg border border-richblack-700 min-h-[180px] justify-between shadow-md">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      review?.user?.profilePic
                        ? review?.user?.profilePic
                        : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.fName} ${review?.user?.lName}`
                    }
                    alt={`${review?.user?.fName}'s profile`}
                    className="h-9 w-9 rounded-full object-cover shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <h1 className="font-semibold text-richblack-5 truncate">
                      {`${review?.user?.fName} ${review?.user?.lName}`}
                    </h1>
                    <h2 className="text-[12px] font-medium text-richblack-500 truncate">
                      {review?.course?.title}
                    </h2>
                  </div>
                </div>
                
                <p className="font-medium text-richblack-100 flex-1 my-2 line-clamp-3">
                  {review?.reviews}
                </p>

                <div className="flex items-center gap-2 mt-auto">
                  <span className="font-semibold text-yellow-100 mt-0.5">
                    {review.rating.toFixed(1)}
                  </span>
                  <ReactStars
                    count={5}
                    value={review.rating}
                    size={20}
                    edit={false}
                    activeColor="#ffd700"
                    emptyIcon={<FaStar />}
                    fullIcon={<FaStar />}
                  />
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

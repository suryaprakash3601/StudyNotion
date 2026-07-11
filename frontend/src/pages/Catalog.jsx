import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCategoryPageDetails } from "../services/operations/categoryApi";
import CourseCard from "../components/core/Catalog/Course_Card";
import CourseSlider from "../components/core/Catalog/CourseSlider";

export default function Catalog() {
  const { catogryName } = useParams();
  //console.log("route name", catogryName);

  const [catalogPageData, setCatalogPageData] = useState(null);
  let CourseDetails;
  const [tab, setTab] = useState("Most Popular");

  useEffect(() => {
    const getCategoryPageData = async () => {
      try {
        const result = await getCategoryPageDetails(catogryName);
        console.log(result);
        if (result) {
          setCatalogPageData(result);
        }
      } catch (error) {
        console.log("Error while fetching categories data", error);
      }
    };
    getCategoryPageData();
  }, [catogryName]);

  if(tab==='Most Popular'){
    CourseDetails=catalogPageData?.selectedCategory?.courses
      ?.slice()
      .sort((a,b)=> (b.studentsEnrolled?.length || 0) - (a.studentsEnrolled?.length || 0))
  }else if(tab==="Trending"){
    CourseDetails=catalogPageData?.trending
  }
  else if(tab==='New'){
    CourseDetails=catalogPageData?.selectedCategory?.courses
      ?.slice()
      .sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt))
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between bg-richblack-800 w-full py-8 px-4 md:py-16 md:px-12 text-pure-greys-25 gap-8">
        <div className="w-full md:w-[65%] flex flex-col gap-3">
          <div className="text-pure-greys-300 text-sm">
            {`Home / Catalog / `}
            <span className="text-yellow-50">{catogryName}</span>
          </div>
          <div className="text-2xl md:text-3xl font-bold">{catogryName}</div>
          <div className="text-pure-greys-200 text-sm md:text-base">
            {catalogPageData?.selectedCategory?.description}
          </div>
        </div>
        <div className="w-full md:w-[30%] flex flex-col gap-2 text-sm sm:text-base">
          <div className="font-semibold">Related resources</div>
          <ul className="list-disc text-pure-greys-200 ml-5">
            <li>Doc {catogryName}</li>
            <li>cheatSheets</li>
            <li>Articles</li>
            <li>Community Forums</li>
            <li>Projects</li>
          </ul>
        </div>
      </div>
      <div className="w-full p-4 md:p-10 mt-8 text-pure-greys-25">
        <div className="text-xl font-semibold mb-4">
          Courses to get you started
        </div>
        <div className="flex gap-3 text-pure-greys-25 border-b border-richblack-600">
          <ul className="flex gap-6">
            {["Most Popular", "New", "Trending"].map((item) => (
              <li
                key={item}
                className={`cursor-pointer pb-2 ${
                  tab === item
                    ? "text-yellow-50 border-b-2 border-yellow-50 font-semibold"
                    : "text-pure-greys-300"
                }`}
                onClick={() => setTab(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-10"><CourseSlider Courses={CourseDetails} selectedCategory={catalogPageData?.selectedCategory?.name}/></div>
      </div>
      <div className="p-4 md:p-10 flex flex-col gap-5">
        <div className="text-3xl font-semibold text-pure-greys-25">Our others courses</div>
        <div>
          <CourseSlider Courses={catalogPageData?.differentCategories}/>
        </div>
        
      </div>
      <div className="bg-richblack-800 w-full px-4 py-8 md:px-10 md:py-14 text-pure-greys-25 mt-12">
        <div className="text-2xl font-semibold mb-6">
          Frequently Bought Courses
        </div>

        {catalogPageData?.topSellingCourse?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
            {catalogPageData.topSellingCourse.map((course, index) => (
              <CourseCard course={course} key={index} height="h-[200px]" />
            ))}
          </div>
        ) : (
          <p className="text-pure-greys-300 italic">
            No frequently bought courses available right now.
          </p>
        )}
      </div>
    </div>
  );
}

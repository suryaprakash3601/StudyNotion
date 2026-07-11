import { HomePageExplore } from "../../../data/homepage-explore";

import React, { useState } from "react";
import HighlightedText from "./HightlightedText";
import Cards from "./Cards";

const tabs = [
  "Free",
  "New to coding",
  "Most popular",
  "Skills paths",
  "Career paths",
];

export default function TabExplore() {
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCourses, setCurrentCourses] = useState(
    HomePageExplore[0].courses[0]
  );
 // console.log("original data", HomePageExplore);
 // console.log("courses are", courses);
 // console.log("current couse", currentCourses);

  const handleClick = (value) => {
    setCurrentTab(value);
    let data = HomePageExplore.filter((el) => {
      return el.tag === value;
    });
    //by looking at data
    setCourses(data[0].courses);
    setCurrentCourses(data[0].courses[0])
  };

  const handleCard=(value)=>{
    let data=courses.filter((el)=>{
        return el === value
    })
    setCurrentCourses(data[0]);
  }



  return (
    <>
      <div className="w-full flex flex-col mt-16 lg:mt-24 relative px-4">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Unlock the <HighlightedText text={"Power of Code"} />
          </h1>
          <p className="text-pure-greys-200 text-sm sm:text-lg">
            Learn to build anything you can imagine
          </p>
        </div>

        <div className="bg-richblack-800 flex flex-wrap justify-center items-center gap-2 sm:gap-4 w-fit mx-auto mt-8 lg:mt-10 p-1 sm:p-2 rounded-lg sm:rounded-full text-pure-greys-200 font-semibold relative h-auto min-h-[50px]">
          {tabs.map((el, index) => (
            <div
              key={index}
              className={`cursor-pointer flex items-center justify-center px-3 py-1.5 sm:px-5 sm:py-2 rounded-full hover:bg-richblack-900 transition-all duration-200 text-xs sm:text-sm md:text-base ${
                el === currentTab ? "bg-richblack-900 text-white" : ""
              }`}
              onClick={() => {
                handleClick(el);
              }}
            >
              {el}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap lg:flex-nowrap gap-10 justify-center mt-12 lg:mt-24 relative">
            
            {
                courses.map((el,index)=>{
                    return(
                        
                        <div key={index} className="w-full max-w-[350px] lg:w-auto">
                            <Cards el={el} handleCard={handleCard} curretCard={currentCourses}/>
                        </div>
                    )
                })
            }
        </div>


      </div>
    </>
  );
}

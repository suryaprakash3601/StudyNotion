import React from "react";
import HighlightedText from "../components/core/HomePage/HightlightedText";
import about1 from "../assets/Images/aboutus1.webp";
import about2 from "../assets/Images/aboutus2.webp";
import about3 from "../assets/Images/aboutus3.webp";
import HighlightedYellow from "../components/core/AboutPage/HighletedYellow";
import HighlightedRed from "../components/core/AboutPage/HighletedRed";
import funding from "../assets/Images/FoundingStory.png";
import BodyHeading from "../components/core/AboutPage/BodyHeading";
import Button from "../components/core/HomePage/Button";
import AboutCards from "../components/core/AboutPage/AboutCards";
import Footer from "../components/core/Footer/Footer";
import AboutForm from "../components/core/AboutPage/AboutForm";

export default function About() {
  return (
    <div className="w-full">
      <div className="w-full flex flex-col m-auto bg-richblack-700 text-pure-greys-25 items-center">
        <div className="flex flex-col gap-7 w-11/12 max-w-[800px] items-center text-center py-10 px-4 md:py-20 md:px-0">
          <div className="text-3xl sm:text-4xl font-bold w-full">
            <h1>Driving Innovation in Online Education for a</h1>
            <HighlightedText text={"Brighter Future"} />
          </div>

          <p className="text-pure-greys-200 text-sm sm:text-lg font-semibold w-full">
            Studynotion is at the forefront of driving innovation in online
            education. We're passionate about creating a brighter future by
            offering cutting-edge courses, leveraging emerging technologies, and
            nurturing a vibrant learning community.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 md:gap-10 -mb-16 sm:-mb-28 px-4 sm:px-0">
          <div className="w-full sm:w-1/3">
            <img src={about1} alt="" className="rounded-lg w-full h-auto sm:-mb-11" />
          </div>
          <div className="w-full sm:w-1/3">
            <img src={about2} alt="" className="rounded-lg w-full h-auto" />
          </div>
          <div className="w-full sm:w-1/3">
            <img src={about3} alt="" className="rounded-lg w-full h-auto" />
          </div>
        </div>
      </div>

      <div className="bg-richblack-900 w-full flex flex-col items-center">
        <div className="flex flex-col w-11/12 max-w-[900px] items-center text-center text-2xl sm:text-3xl md:text-4xl font-bold text-pure-greys-25 py-10 px-4 md:py-20 md:px-0 mt-20 sm:mt-36">
          <h1>We are passionate about revolutionizing the way we learn. Our</h1>
          <h1 className="mt-2">
            innovative platform{" "}
            <HighlightedText text={" combines technology"} />{" "}
            <HighlightedYellow text={"expertise"} /> and community to create an{" "}
            <HighlightedYellow text={"unparalleled educational experience."} />
          </h1>
        </div>

        <div className="w-full h-px bg-richblack-500"></div>

        {/* Founding Story */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 py-10 px-4 md:py-20 md:px-32 justify-between w-11/12 max-w-maxContent mx-auto items-center">
          <div className="text-pure-greys-200 w-full lg:w-[50%] flex flex-col gap-6 md:gap-10">
            <div className="text-3xl md:text-4xl font-bold text-center lg:text-left">
              <HighlightedRed text={"Our Founding Story"} />
            </div>

            <p className="font-semibold text-sm md:text-base text-justify lg:text-left">
              Our e-learning platform was born out of a shared vision and
              passion for transforming education. It all began with a group of
              educators, technologists, and lifelong learners who recognized the
              need for accessible, flexible, and high-quality learning
              opportunities in a rapidly evolving digital world.
            </p>
            <p className="font-semibold text-sm md:text-base text-justify lg:text-left">
              As experienced educators ourselves, we witnessed firsthand the
              limitations and challenges of traditional education systems. We
              believed that education should not be confined to the walls of a
              classroom or restricted by geographical boundaries. We envisioned
              a platform that could bridge these gaps and empower individuals
              from all walks of life to unlock their full potential.
            </p>
          </div>
          <div className="w-full lg:w-[45%] max-w-[450px] flex justify-center mt-6 lg:mt-0">
            <img
              src={funding}
              alt=""
              className="drop-shadow-[10px_10px_10px_rgba(239,68,68,0.8)] rounded-md w-full h-auto"
            />
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="flex flex-col md:flex-row w-11/12 max-w-maxContent mx-auto py-10 px-4 md:py-20 md:px-0 gap-10 md:gap-20 text-center">
          <div className="w-full md:w-1/2 flex flex-col gap-4 text-justify md:text-left">
            <BodyHeading
              heading={<HighlightedYellow text={"Our Mission"} />}
              text={
                "With this vision in mind, we set out on a journey to create an e-learning platform that would revolutionize the way people learn. Our team of dedicated experts worked tirelessly to develop a robust and intuitive platform that combines cutting-edge technology with engaging content, fostering a dynamic and interactive learning experience."
              }
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col gap-4 text-justify md:text-left">
            <BodyHeading
              heading={<HighlightedText text={"Our Vision"} />}
              text={
                "Our mission goes beyond just delivering courses online. We wanted to create a vibrant community of learners, where individuals can connect, collaborate, and learn from one another. We believe that knowledge thrives in an environment of sharing and dialogue, and we foster this spirit of collaboration through forums, live sessions, and networking opportunities."
              }
            />
          </div>
        </div>

        {/* Stats */}
        <div className="bg-richblack-700 w-full h-fit grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-20 p-8 md:p-10 justify-items-center">
          <div className="flex flex-col gap-3 text-pure-greys-300 text-base sm:text-lg items-center">
            <h1 className="text-2xl sm:text-3xl text-pure-greys-25 font-bold">5K</h1>
            <p>Active Students</p>
          </div>
          <div className="flex flex-col gap-3 text-pure-greys-300 text-base sm:text-lg items-center">
            <h1 className="text-2xl sm:text-3xl text-pure-greys-25 font-bold">10+</h1>
            <p>Mentors</p>
          </div>
          <div className="flex flex-col gap-3 text-pure-greys-300 text-base sm:text-lg items-center">
            <h1 className="text-2xl sm:text-3xl text-pure-greys-25 font-bold">200+</h1>
            <p>Courses</p>
          </div>
          <div className="flex flex-col gap-3 text-pure-greys-300 text-base sm:text-lg items-center">
            <h1 className="text-2xl sm:text-3xl text-pure-greys-25 font-bold">50+</h1>
            <p>Awards</p>
          </div>
        </div>

        {/* World-Class Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-11/12 max-w-maxContent mx-auto mt-16 p-4 md:p-10 gap-0 items-start">
          <div className="lg:col-span-2 flex flex-col gap-5 items-start p-6">
            <h1 className="text-3xl md:text-4xl text-pure-greys-25 font-bold">
              World-Class Learning for <br />{" "}
              <HighlightedText text={"Anyone, Anywhere"} />
            </h1>
            <p className="text-pure-greys-400 text-sm md:text-base">
              Studynotion partners with more than 275+ leading universities and
              companies to bring flexible, affordable, job-relevant online
              learning to individuals and organizations worldwide.
            </p>
            <div className="w-fit">
              <Button active={true} linkto={"/"}>
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="h-[300px]">
            <AboutCards
              heading={"Curriculum Based on Industry Needs"}
              text={
                "Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs."
              }
              background="bg-richblack-700"
            />
          </div>
          
          <div className="h-[300px]">
            <AboutCards
              heading={"Our Learning Methods"}
              text={
                "Studynotion partners with more than 275+ leading universities and companies to bring"
              }
              background="bg-richblack-800"
            />
          </div>

          {/* Row 2 Spacer (Desktop only) */}
          <div className="hidden lg:block lg:col-span-1"></div>
          
          <div className="h-[300px]">
            <AboutCards
              heading={"Certifications"}
              text={
                "Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs."
              }
              background="bg-richblack-700"
            />
          </div>
          
          <div className="h-[300px]">
            <AboutCards
              heading={"Rating Auto-grading"}
              text={
                "Studynotion partners with more than 275+ leading universities and companies to bring"
              }
              background="bg-richblack-800"
            />
          </div>
          
          <div className="h-[300px]">
            <AboutCards
              heading={"Ready to Work"}
              text={
                "Studynotion partners with more than 275+ leading universities and companies to bring"
              }
              background="bg-richblack-700"
            />
          </div>
        </div>

        <div className="mt-20 w-full px-4">
          <AboutForm />
        </div>
      </div>

      <Footer />
    </div>
  );
}

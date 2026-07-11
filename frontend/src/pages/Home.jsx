import { FaLongArrowAltRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import Button from "../components/core/HomePage/Button";
import HighlightedText from "../components/core/HomePage/HightlightedText";
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import BodyHeading from "../components/core/HomePage/BodyHeading";
import Logo1 from "../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../assets/TimeLineLogo/Logo4.svg";
import TimeLine from "../assets/Images/TimelineImage.png";
import LeftSkills from "../components/core/HomePage/leftSkills";
import knowProgress from "../assets/Images/Know_your_progress.svg";
import compareOthers from "../assets/Images/Compare_with_others.svg";
import planLessons from "../assets/Images/Plan_your_lessons.svg";
import instructor from "../assets/Images/Instructor.png";
import TabExplore from "../components/core/HomePage/TabExplore";
import Footer from "../components/core/Footer/Footer";
import ReviewSlider from "../components/common/ReviewSlider";

function Home() {
  const htmlCode = `<!DOCTYPE html>\n<html>\n<head><title>Example<title>\n</head><body>\n<h1><a href="">Welcome</a>\n</h1>\n<p>This is a beautifully crafted paragraph</p>\n<p>This is a beginner-friendly guide.</p>\n<a href">Visit Our Blog</a>\n<button>Click Me for a Surprise</button>\n</body\n</html\n`;

  return (
    <>
      {/* section 1  till black background*/}
      <div className="px-4 sm:px-6 lg:px-20  bg-richblack-900">
        {/* Section 1 */}

        <div className="flex justify-center mt-10">
          <Link to="/signup">
            <div className="bg-richblack-700 flex items-center gap-3 p-2 sm:p-3 rounded-lg mt-5 transition-all duration-300 font-semibold hover:bg-richblack-800 hover:scale-105 w-fit text-pure-greys-100 text-sm sm:text-base">
              <p>Become an Instructor</p>
              <FaLongArrowAltRight />
            </div>
          </Link>
        </div>

        <div className="flex flex-col items-center text-center mt-10 space-y-6">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
            Empower Your Future with <HighlightedText text="Coding Skills" />
          </h1>

          <p className="text-pure-greys-200 text-sm sm:text-base max-w-2xl">
            With our online coding courses, you can learn at your own pace, from
            anywhere in the world, and get access to a wealth of resources,
            including hands-on projects, quizzes, and personalized feedback from
            instructors.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
            <Button linkto={"/signup"} active={true}>
              Learn More
            </Button>
            <Button linkto={"/login"} active={false}>
              Book a Demo
            </Button>
          </div>
        </div>

        {/* Video Section */}
        <div className="flex justify-center mt-16 w-full">
          <div className=" relative w-fit sm:w-11/12 md:w-3/4 lg:w-2/3">
            <div className="absolute bg-white w-full h-full -right-4 -bottom-4 z-0"></div>
            <video
              src={Banner}
              autoPlay
              loop
              muted
              playsInline
              className="rounded-md w-full z-10 relative"
            ></video>
          </div>
        </div>

        {/* Section with CodeBlocks/Heading */}
        <div className="flex flex-col md:flex-row justify-between items-center w-full mt-16 gap-8">
          <div className="w-full md:w-1/2">
            <BodyHeading
              heading={
                <>
                  Unlock your <HighlightedText text="coding potential" /> with
                  our online courses.
                </>
              }
              subheading={`Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you.`}
              button1={{
                active: true,
                linkto: "signup",
                btntext: "Try it yourself",
              }}
              button2={{
                active: false,
                linkto: "login",
                btntext: "Learn More",
              }}
            />
          </div>

          <div className=" w-full md:w-[45%] mt-10 border flex  border-richblack-700 border-r-richblack-700 rounded-lg relative p-10 bg-gradient-to-br from-[#3b1e35] via-[#334155] to-[#475569] shadow-md shadow-cyan-500/10">
            <CodeBlocks Codeblock={htmlCode} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center w-full mt-16 gap-8">
          <div className=" w-full md:w-[45%] mt-10 border flex  border-richblack-700 border-r-richblack-700 rounded-lg relative p-10 bg-gradient-to-br from-[#4ab684] via-[#3baea6] to-[#475569] shadow-md shadow-cyan-500/10">
            <CodeBlocks Codeblock={htmlCode} />
          </div>

          <div className="w-full md:w-1/2">
            <BodyHeading
              heading={
                <>
                  Start <HighlightedText text="coding in seconds" />
                </>
              }
              subheading={`Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson.`}
              button1={{
                active: true,
                linkto: "signup",
                btntext: "Continue Lesson",
              }}
              button2={{
                active: false,
                linkto: "login",
                btntext: "Learn More",
              }}
            />
          </div>
        </div>

        {/* Footer/Other Sections can go here */}
        <div>
            <TabExplore/>
        </div>
      </div>

      

      {/* section 2 before instructor white background*/}
      <div className="bg-pure-greys-5 text-black">
        <div className="homepage_bg h-[333px]">
          <div className="w-11/12 max-w-maxContent h-[100%] mx-auto flex justify-center items-center ">
            <div className="flex gap-10 items-center justify-center">
              <Button active={true} linkto={"/signup"}>
                <div className="flex  items-center gap-2">
                  Explore Full Catalog
                  <FaLongArrowAltRight />
                </div>
              </Button>
              <Button active={false} linkto={"/signup"}>
                Learn More
              </Button>
            </div>
          </div>
        </div>

        <div className="w-11/12 max-w-maxContent flex flex-col justify-center mx-auto gap-7">
          <div className="flex flex-col md:flex-row mt-12 md:mt-28 gap-10 md:gap-16 items-center">
            <div className="font-bold text-3xl sm:text-4xl w-full md:w-[50%] text-center md:text-left">
              <h1>
                Get the Skills you need for a{" "}
                <HighlightedText text={"Job that is in demand"} />
              </h1>
            </div>
            <div className="flex flex-col gap-6 md:gap-9 w-full md:w-[50%] text-center md:text-left text-pure-greys-500 relative">
              <p>
                The modern StudyNotion dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </p>
              <div className="self-center md:self-start mt-4 md:mt-10">
                <Button active={true} linkto={"/signup"}>
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-11/12 max-w-maxContent flex flex-col mx-auto mt-20 lg:mt-36">
          <div className="flex flex-col-reverse lg:flex-row gap-12 lg:gap-7 justify-between items-center">
            <div className="w-full lg:w-[45%] flex flex-col gap-5 mt-10 lg:mt-0">
              <LeftSkills
                logo={Logo1}
                heading={"Leadership"}
                description={"Develop management skills to lead teams effectively"}
              />
              <LeftSkills
                logo={Logo2}
                heading={"Responsibility"}
                description={"Build accountability and ownership mindset"}
              />
              <LeftSkills
                logo={Logo3}
                heading={"Flexibility"}
                description={"Adapt quickly to changing tech environments"}
              />
              <LeftSkills
                logo={Logo4}
                heading={"Problem Solving"}
                description={"Master analytical and creative thinking"}
              />
            </div>
            <div className="w-full lg:w-[50%] flex justify-center">
              <div className="relative w-fit">
                <div className="mr-0 lg:mr-16">
                  <img src={TimeLine} alt="Timeline" className="w-full max-w-[600px] h-auto object-contain" />
                </div>

                <div className="bg-caribbeangreen-800 absolute left-[50%] -translate-x-[50%] -bottom-10 flex flex-col sm:flex-row p-5 gap-4 sm:gap-10 h-auto sm:h-[80px] w-[90%] sm:w-[400px] items-center justify-around rounded-md shadow-lg">
                  <div className="flex gap-4 items-center">
                    <h1 className="font-bold text-2xl sm:text-3xl text-white">10</h1>
                    <h2 className="text-xs text-caribbeangreen-400 font-semibold leading-tight">
                      YEARS OF EXPERIENCE
                    </h2>
                  </div>

                  {/* Vertical Divider */}
                  <div className="hidden sm:block w-px h-2/3 bg-white opacity-30"></div>

                  <div className="flex gap-4 items-center">
                    <h1 className="font-bold text-2xl sm:text-3xl text-white">250</h1>
                    <h2 className="text-xs text-caribbeangreen-400 font-semibold leading-tight">
                      TYPES OF COURSES
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* swiss knife */}
        <div className="w-11/12 max-w-maxContent flex flex-col justify-center mx-auto gap-7 mt-28 lg:mt-44">
          <div className="flex flex-col text-center gap-4 lg:gap-7">
            <h1 className="font-bold text-3xl sm:text-4xl text-white">
              Your Swiss Knife for{" "}
              <HighlightedText text={"learning any language"} />
            </h1>
            <p className="text-sm sm:text-base text-pure-greys-500 max-w-2xl mx-auto">
              Using spin making learning multiple languages easy. with 20+
              languages realistic voice-over, progress tracking, custom
              schedule and more.
            </p>
          </div>
        </div>

        {/* characters */}
        <div className="w-11/12 max-w-maxContent flex flex-col justify-center mx-auto gap-7 mt-8 lg:mt-16">
          <div className="flex flex-col items-center">
            <div className="flex flex-col lg:flex-row items-center justify-center w-full mb-10">
              <img src={knowProgress} alt="Know your progress" className="object-contain w-[280px] sm:w-[340px] lg:w-auto" />
              <img src={compareOthers} alt="Compare with others" className="object-contain w-[280px] sm:w-[340px] lg:w-auto -mt-12 lg:mt-0 lg:-ml-28" />
              <img src={planLessons} alt="Plan your lessons" className="object-contain w-[280px] sm:w-[340px] lg:w-auto -mt-16 lg:mt-0 lg:-ml-36" />
            </div>
            <div className="w-fit">
              <Button active={true} linkto={"/signup"}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3 black background */}
      <div className="w-full flex flex-col mx-auto bg-richblack-900 mt-20 lg:mt-28">
        <div className="w-11/12 max-w-maxContent mx-auto px-4 py-16 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center justify-center">
          <div className="relative w-full lg:w-[45%] max-w-[400px] flex justify-center">
            <div className="absolute bg-white w-full h-full -z-0 -top-4 -left-4 sm:-top-6 sm:-left-6"></div>
            <img src={instructor} alt="Become an Instructor" className="z-10 relative w-full h-auto object-cover" />
          </div>
          <div className="flex flex-col gap-6 lg:gap-10 lg:w-[50%] items-center lg:items-start text-center lg:text-left">
            <div className="text-3xl lg:text-4xl font-bold text-pure-greys-25">
              <h1>Become an</h1>
              <HighlightedText text={"Instructor"} />
            </div>
            <div className="text-pure-greys-200 text-sm lg:text-base max-w-md">
              <p>
                Instructors from around the world teach millions of students
                on StudyNotion. We provide the tools and skills to teach what
                you love.
              </p>
            </div>
            <div className="w-fit">
              <Button active={true} linkto={"/signup"}>
                <div className="flex items-center gap-2">
                  Start Teaching Today
                  <FaLongArrowAltRight />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="h-fit p-10 ">
        <div className=" flex  justify-center w-screen mb-6">
          <h1 className="text-richblack-25 text-3xl font-bold">Reviews from other learners</h1>
        </div>
        
        <ReviewSlider/>
      </div>

      <div className="mt-7">
        <Footer/>
      </div>
    </>
  );
}

export default Home;


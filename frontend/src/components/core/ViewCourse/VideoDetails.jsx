import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BigPlayButton, Player } from "video-react";
import IconBtn from "../../common/IconBtn";
import { markLectureAsComplete } from "../../../services/operations/courseApi";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";

export default function VideoDetails() {
  const { token } = useSelector((state) => state.auth);
  const { sectionId, courseId, subSectionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const playerRef = useRef(null);
  const location = useLocation();
  const {
    courseSectionData,
    courseEntireData,
    completedLectures,
  } = useSelector((state) => state.viewCourse);
  //console.log("course section", courseSectionData);

  const [previewSource, setPreviewSource] = useState("");
  const [videoData, setVideoData] = useState(false);
  const [videoEnded, setvideoEnded] = useState(false);
  const[loading,setLoading]=useState(false);

  useEffect(() => {
    async function videoPlayer() {
      if (!courseId || !sectionId || !subSectionId) {
        navigate(`/dashboard/enrolled-courses`);
        return;
      }
      // Guard: wait until course data is loaded into Redux
      if (!courseSectionData || courseSectionData.length === 0) return;

      const filteredSection = courseSectionData.find(
        (section) => section._id === sectionId
      );
      if (!filteredSection) return;

      const filteredSubSection = filteredSection.subSection.find(
        (subSec) => subSec._id === subSectionId
      );
      if (!filteredSubSection) return;

      setPreviewSource(courseEntireData?.thumbnail || "");
      setVideoData(filteredSubSection);
      setvideoEnded(false);
    }
    videoPlayer();
  }, [courseEntireData, courseSectionData, location.pathname, courseId, navigate, sectionId, subSectionId]);

  const isFirstVideo = () => {
    if (!courseSectionData || courseSectionData.length === 0) return true;
    const sectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    if (sectionIndex === -1) return true;
    const subSectionIndex = courseSectionData[sectionIndex].subSection.findIndex(
      (data) => data._id === subSectionId
    );
    return sectionIndex === 0 && subSectionIndex === 0;
  };

  const goToNextVideo = () => {
    if (!courseSectionData || courseSectionData.length === 0) return;

    const sectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    if (sectionIndex === -1) return;

    const subSectionIndex = courseSectionData[sectionIndex].subSection.findIndex(
      (data) => data._id === subSectionId
    );

    const isLastSubInSection =
      subSectionIndex === courseSectionData[sectionIndex].subSection.length - 1;

    if (isLastSubInSection) {
      // Last sub-section of this section — move to next section if it exists
      if (sectionIndex === courseSectionData.length - 1) {
        // Already the very last video — do nothing
        return;
      }
      const nextSection = courseSectionData[sectionIndex + 1];
      if (!nextSection || !nextSection.subSection?.length) return;
      navigate(
        `/view-course/${courseId}/section/${nextSection._id}/sub-section/${nextSection.subSection[0]._id}`
      );
    } else {
      const nextSubSectionId =
        courseSectionData[sectionIndex].subSection[subSectionIndex + 1]._id;
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      );
    }
  };
  const islastVideo = () => {
    if (!courseSectionData || courseSectionData.length === 0) return true;
    const sectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    if (sectionIndex === -1) return true;
    const subSectionIndex = courseSectionData[sectionIndex].subSection.findIndex(
      (data) => data._id === subSectionId
    );
    return (
      sectionIndex === courseSectionData.length - 1 &&
      subSectionIndex === courseSectionData[sectionIndex].subSection.length - 1
    );
  };
  const goToPrev = () => {
    if (!courseSectionData || courseSectionData.length === 0) return;

    const sectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    if (sectionIndex === -1) return;

    const subSectionIndex = courseSectionData[sectionIndex].subSection.findIndex(
      (data) => data._id === subSectionId
    );

    if (sectionIndex === 0 && subSectionIndex === 0) {
      return; // Already at first video
    }

    if (subSectionIndex === 0) {
      const prevSection = courseSectionData[sectionIndex - 1];
      if (!prevSection || !prevSection.subSection?.length) return;
      const lastSubInPrevSection = prevSection.subSection[prevSection.subSection.length - 1];
      navigate(
        `/view-course/${courseId}/section/${prevSection._id}/sub-section/${lastSubInPrevSection._id}`
      );
    } else {
      const newSubSectionId =
        courseSectionData[sectionIndex].subSection[subSectionIndex - 1]._id;
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${newSubSectionId}`
      );
    }
  };

  const handleLectureCompletion = async () => {
    setLoading(true)
    const res = await markLectureAsComplete(
      { courseId: courseId, subsectionId: subSectionId },
      token
    )
    if (res) {
      dispatch(updateCompletedLectures(subSectionId))
    }
    setLoading(false)
  }
  
  return (
    <div className="flex flex-col gap-5 text-white">
      {
        !videoData?(
          <img src={previewSource} alt="preview" className="h-full w-full rounded-md object-cover"/>
        ):(
          <Player
          ref={playerRef}
          aspectRatio="16:9"
          playsInline
          onEnded={()=>setvideoEnded(true)}
          src={videoData?.videoUrl}
          >
            <BigPlayButton position="center" />
            {/* render when video ends */}
            {videoEnded&&(
              <div style={{
                backgroundImage:
                  "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
              }}
              className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter">
                {!completedLectures?.includes(subSectionId)&&(
                  <IconBtn
                  disabled={loading}
                  onClick={handleLectureCompletion}
                  text={!loading?"Mark as completed":"Loading..."}
                  customClass={"text-xl max-w-max px-4 mx-auto"}
                  />
                  
                )}
                <IconBtn
                disabled={loading}
                onClick={()=>{
                  if(playerRef?.current){
                    playerRef.current.seek(0)
                    setvideoEnded(false)
                  }
                }}
                text="Rewatch"
                customClass={"text-xl max-w-max px-4 mx-auto mt-2"}
                />
                <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                {!isFirstVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToPrev}
                    className="blackButton"
                  >
                    Prev
                  </button>
                )}
                {!islastVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToNextVideo}
                    className="blackButton"
                  >
                    Next
                  </button>
                )}
              </div>
              </div>
            )}

          </Player>
        )
      }
      <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
      <p className="pt-2 pb-6">{videoData?.description}</p>
    </div>
  )
}

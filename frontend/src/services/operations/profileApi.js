import toast from "react-hot-toast";
import { setLoading, setUser } from "../../slices/profileSlice";
import { profileApi } from "../api";
import { apiConnector } from "../apiConnector";


const { GET_PROFILE,GET_USER_ENROLLED_COURSES_API ,GET_INSTRUCTOR_DATA_API} = profileApi;

export function getProfile({ token }) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", GET_PROFILE, null, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const userData = response.data.data;
      const userImage =
        userData?.profilePic ||
        `https://api.dicebear.com/5.x/initials/svg?seed=${userData.fName}%20${userData.lName}`;

      dispatch(setUser({ ...userData, image: userImage }));
    } catch (error) {
      console.log("FETCH_USER_DETAILS ERROR", error);
      toast.error("Failed fetching user details");
    }
    dispatch(setLoading(false));
  };
}



export async function getUserEnrolledCourses(token) {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    console.log("BEFORE Calling BACKEND API FOR ENROLLED COURSES");
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    console.log("AFTER Calling BACKEND API FOR ENROLLED COURSES");
    // console.log(
    //   "GET_USER_ENROLLED_COURSES_API API RESPONSE............",
    //   response
    // )

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data.data
  } catch (error) {
    console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
    toast.error("Could Not Get Enrolled Courses")
  }
  toast.dismiss(toastId)
  return result
}

export async function getInstructorData(token) {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {
      Authorization: `Bearer ${token}`,
    })
    console.log("GET_INSTRUCTOR_DATA_API API RESPONSE............", response)
    result = response?.data?.data
  } catch (error) {
    console.log("GET_INSTRUCTOR_DATA_API API ERROR............", error)
    toast.error("Could Not Get Instructor Data")
  }
  toast.dismiss(toastId)
  return result
}
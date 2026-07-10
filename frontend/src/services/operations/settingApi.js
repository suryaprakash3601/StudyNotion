import toast from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { settingApi, profileApi } from "../api"
import { setUser } from "../../slices/profileSlice";
import { logout } from "./authApi";

const{CHANGE_PICTURE,UPDATE_PROFILE_API,CHANGE_PASSWORD_API ,DELETE_PROFILE_API}=settingApi;
const { GET_PROFILE } = profileApi;

export function changeProfilePic(token,formData){
    return async(dispatch)=>{
        const toastId=toast.loading("Loading...")
        try {
            const response=await apiConnector("PUT",CHANGE_PICTURE,formData,{
                "content-type":"multipart/form-data",
                Authorization: `Bearer ${token}`
            })

            if(!response.data.success){
                throw new Error(response.data.message)
            }

            console.log("UPDATE_PROFILE_RESPONSE...",response.data.data);
            toast.success("Profile Picture Updated")
            localStorage.setItem("user",JSON.stringify(response.data.data))
            dispatch(setUser(response.data.data));
            
            
        } catch (error) {
            console.log("Update profile pic",error);
            toast.error("Cannot upload picture");
        }
        toast.dismiss(toastId);
    }
}



export function updateProfile(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
        Authorization: `Bearer ${token}`,
      })
      console.log("UPDATE_PROFILE_API API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      // Re-fetch the full user to refresh Redux store
      const userResponse = await apiConnector("GET", GET_PROFILE, null, {
        Authorization: `Bearer ${token}`,
      }).catch(() => null);

      if (userResponse?.data?.success) {
        const userData = userResponse.data.data;
        const userImage =
          userData?.profilePic ||
          `https://api.dicebear.com/5.x/initials/svg?seed=${userData.fName}%20${userData.lName}`;
        dispatch(setUser({ ...userData, image: userImage }));
        localStorage.setItem("user", JSON.stringify({ ...userData, image: userImage }));
      }

      toast.success("Profile Updated Successfully")
    } catch (error) {
      console.log("UPDATE_PROFILE_API API ERROR............", error)
      toast.error("Could Not Update Profile")
    }
    toast.dismiss(toastId)
  }
}

export async function changePassword(token, formData) {
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", CHANGE_PASSWORD_API, formData, {
      Authorization: `Bearer ${token}`,
    })
    console.log("CHANGE_PASSWORD_API API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Password Changed Successfully")
  } catch (error) {
    console.log("CHANGE_PASSWORD_API API ERROR............", error)
    toast.error(error?.response?.data?.message || "Could not change password")
  }
  toast.dismiss(toastId)
}


export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      })
      console.log("DELETE_PROFILE_API API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Profile Deleted Successfully")
      dispatch(logout(navigate))
    } catch (error) {
      console.log("DELETE_PROFILE_API API ERROR............", error)
      toast.error("Could Not Delete Profile")
    }
    toast.dismiss(toastId)
  }
}
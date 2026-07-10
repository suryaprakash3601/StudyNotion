import toast from "react-hot-toast";
import { setLoading, setToken } from "../../slices/authSlice";
import { apiConnector } from "../apiConnector";
import { authApi } from "../api";
import { setUser } from "../../slices/profileSlice";
import { resetCart } from "../../slices/cartSlice";

const { SIGNUP_API, SEND_OTP, LOGIN_API, GENERATE_TOKEN, RESET_PASSWORD } = authApi;

// ─────────────────────────────────────────────────────────────
// Send OTP
// ─────────────────────────────────────────────────────────────
export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Sending OTP...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SEND_OTP, { email });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP sent to your email");
      navigate("/verify-email");
    } catch (error) {
      console.error("Send OTP error:", error);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send OTP";
      toast.error(msg);
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

// ─────────────────────────────────────────────────────────────
// Sign Up
// ─────────────────────────────────────────────────────────────
export function signUp(
  fName,
  lName,
  email,
  password,
  confirmPassword,
  accountType,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Creating your account...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        fName,
        lName,
        email,
        password,
        confirmPassword,
        accountType,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Account created! Please login.");
      navigate("/login");
    } catch (error) {
      console.error("Sign up error:", error);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Sign up failed. Please try again.";
      toast.error(msg);
      navigate("/signup");
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

// ─────────────────────────────────────────────────────────────
// Login
// ─────────────────────────────────────────────────────────────
export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Logging in...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Login failed");
      }

      toast.success("Login successful!");

      const userData = response.data.user;
      const userImage =
        userData?.profilePic ||
        `https://api.dicebear.com/5.x/initials/svg?seed=${userData.fName}%20${userData.lName}`;

      dispatch(setToken(response.data.token));
      dispatch(setUser({ ...userData, image: userImage }));

      localStorage.setItem("user", JSON.stringify({ ...userData, image: userImage }));
      localStorage.setItem("token", JSON.stringify(response.data.token));

      navigate("/dashboard/my-profile");
    } catch (error) {
      console.error("Login error:", error);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed. Please try again.";
      toast.error(msg);
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

// ─────────────────────────────────────────────────────────────
// Logout
// ─────────────────────────────────────────────────────────────
export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };
}

// ─────────────────────────────────────────────────────────────
// Generate Password Reset Link
// ─────────────────────────────────────────────────────────────
export function generateTokenLink(email, setSendEmail) {
  return async (dispatch) => {
    const toastId = toast.loading("Sending reset link...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", GENERATE_TOKEN, { email });

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Failed to send reset link");
      }

      toast.success("Password reset link sent to your email");
      setSendEmail(true);
    } catch (error) {
      console.error("Generate token error:", error);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send reset link";
      toast.error(msg);
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

// ─────────────────────────────────────────────────────────────
// Reset Password
// ─────────────────────────────────────────────────────────────
export function resetPassword(password, confirmPassword, token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Resetting password...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESET_PASSWORD, {
        password,
        confirmPassword,
        token,
      });

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Password reset failed");
      }

      toast.success("Password reset successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error("Reset password error:", error);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Cannot reset password. Please try again.";
      toast.error(msg);
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}
const User = require("../modules/user");
const OTP = require("../modules/OTP");
const Profile = require("../modules/profile");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
require("dotenv").config();

// ────────────────────────────────────────────────
// Send OTP
// ────────────────────────────────────────────────
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered. Please login instead.",
      });
    }

    // Generate a unique 6-digit numeric OTP
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    // Ensure uniqueness
    let existing = await OTP.findOne({ otp });
    while (existing) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      existing = await OTP.findOne({ otp });
    }

    // Save OTP – pre-save hook will send the email
    await OTP.create({ email, otp });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully. Please check your email.",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while sending OTP",
    });
  }
};

// ────────────────────────────────────────────────
// Sign Up
// ────────────────────────────────────────────────
exports.signUp = async (req, res) => {
  try {
    const {
      fName,
      lName,
      email,
      password,
      confirmPassword,
      accountType,
    } = req.body;

    // Validate all fields
    if (
      !fName ||
      !lName ||
      !email ||
      !password ||
      !confirmPassword ||
      !accountType
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Password match check
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists. Please login.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create profile entry
    const profileDetails = await Profile.create({
      gender: null,
      bio: null,
      contactNumber: null,
      dob: null,
    });

    // Generate avatar from initials
    const profilePic = `https://api.dicebear.com/5.x/initials/svg?seed=${fName}%20${lName}`;

    // Create user
    const newUser = await User.create({
      fName,
      lName,
      email,
      password: hashedPassword,
      accountType,
      additionalInfo: profileDetails._id,
      profilePic,
    });

    // Don't return password in response
    newUser.password = undefined;

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred during registration",
    });
  }
};

// ────────────────────────────────────────────────
// Login
// ────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user and populate profile
    const user = await User.findOne({ email }).populate("additionalInfo");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No account found with this email. Please sign up.",
      });
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Please try again.",
      });
    }

    // Generate JWT
    const payload = {
      email: user.email,
      accountType: user.accountType,
      id: user._id,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Remove password before sending
    user.password = undefined;

    // Set cookie
    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res
      .cookie("loginCookie", token, cookieOptions)
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        token,
        user,
      });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred during login",
    });
  }
};

// ────────────────────────────────────────────────
// Change Password (requires old password)
// ────────────────────────────────────────────────
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    const userId = req.user.id;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    // Send password change confirmation email
    try {
      await mailSender(
        user.email,
        "Password Changed Successfully - StudyNotion",
        passwordUpdated(user.email, `${user.fName} ${user.lName}`)
      );
    } catch (mailErr) {
      console.error("Failed to send password change email:", mailErr.message);
      // Non-fatal — password was still changed
    }

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while changing password",
    });
  }
};
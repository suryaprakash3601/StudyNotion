const crypto = require("crypto");
const User = require("../modules/user");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const resetPasswordTemplate = require("../template/resetPassword");

// ─────────────────────────────────────────────────
// Generate Reset Password Token & Send Email
// ─────────────────────────────────────────────────
exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required to reset password",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account registered with this email address",
      });
    }

    // Generate a secure random token
    const token = crypto.randomBytes(32).toString("hex");

    // Store token and expiry (15 minutes)
    await User.findOneAndUpdate(
      { email },
      {
        token,
        resetPasswordExpires: Date.now() + 15 * 60 * 1000,
      },
      { new: true }
    );

    // Build reset URL using env variable (supports both local and production)
    const frontendUrl =
      process.env.FRONTEND_URL || "http://localhost:3000";
    const resetUrl = `${frontendUrl}/update-password/${token}`;

    // Send email (non-fatal if SMTP fails)
    let emailSent = false;
    try {
      await mailSender(
        email,
        "Reset Your StudyNotion Password",
        resetPasswordTemplate(resetUrl)
      );
      emailSent = true;
    } catch (mailErr) {
      console.warn("SMTP failure, could not send reset email:", mailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: emailSent
        ? "Password reset link sent to your email"
        : "Password reset link generated successfully (SMTP is disabled/unconfigured)",
      resetLink: resetUrl,
    });
  } catch (error) {
    console.error("Error generating reset password link:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while resetting password link",
    });
  }
};

// ─────────────────────────────────────────────────
// Reset Password using Token
// ─────────────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    if (!password || !confirmPassword || !token) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match",
      });
    }

    // Find user by token
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link. Please request a new one.",
      });
    }

    // Check token expiry
    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Reset link has expired. Please request a new one.",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear token
    await User.findOneAndUpdate(
      { token },
      {
        password: hashedPassword,
        token: undefined,
        resetPasswordExpires: undefined,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now login.",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while resetting password",
    });
  }
};
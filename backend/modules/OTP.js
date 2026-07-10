const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // OTP expires in 5 minutes
  },
});

const sendVerificationEmail = async (email, otp) => {
  try {
    const mailResponse = await mailSender(
      email,
      "Email Verification Code – StudyNotion",
      `<div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2563eb;">StudyNotion Email Verification</h2>
        <p>Use the OTP below to verify your email address. It expires in <strong>5 minutes</strong>.</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e293b; background: #f1f5f9; padding: 16px; border-radius: 6px; text-align: center;">${otp}</div>
        <p style="color: #64748b; margin-top: 16px;">If you did not request this, please ignore this email.</p>
      </div>`
    );
    console.log("OTP verification email sent:", mailResponse?.messageId);
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};

OTPSchema.pre("save", async function (next) {
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;
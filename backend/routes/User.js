const express=require('express');
const {login, signUp, sendOTP, changePassword}=require("../controllers/Auth");
const { resetPasswordToken, resetPassword } = require('../controllers/resetPassword');
const {isAuth}=require("../middlewares/auth");
const rateLimit = require("express-rate-limit");
const router=express.Router();

// Rate limiters
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, message: "Too many login attempts. Please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3,
  message: { success: false, message: "Too many OTP requests. Please wait 5 minutes before requesting again." },
  standardHeaders: true,
  legacyHeaders: false,
});

const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: "Too many reset password attempts. Please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

//*********************************************************************************************************************************** */
//                            Authentication routes
//************************************************************************************************************************************** */
router.post("/login", loginLimiter, login);
router.post("/signup", signUp);
router.post("/sendotp", otpLimiter, sendOTP);
router.post("/changepassword", isAuth, changePassword);

//************************************************************************************************************ */
//             reset password routes
//************************************************************************************************************* */
router.post("/generate-reset-token", resetLimiter, resetPasswordToken);
router.post("/reset-password", resetLimiter, resetPassword);

module.exports=router;
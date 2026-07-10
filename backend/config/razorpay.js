const Razorpay = require("razorpay");
require("dotenv").config();

let instance = null;

if (process.env.RAZORPAY_KEY && process.env.RAZORPAY_SECRET) {
  instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  });
  console.log("Razorpay initialized successfully");
} else {
  console.warn(
    "⚠️  Razorpay credentials not set in .env – payment features will be unavailable"
  );
}

exports.instance = instance;
const express = require("express");
const { isAuth, isStudent } = require("../middlewares/auth");
const {
  capturePayment,
  verifySignature,
  sendPaymentSuccessEmail,
} = require("../controllers/Payment");
const router = express.Router();

// All payment routes require authentication
router.post("/capturePayment", isAuth, isStudent, capturePayment);
router.post("/verifyPayment", isAuth, isStudent, verifySignature);
router.post("/sendPaymentSuccessEmail", isAuth, isStudent, sendPaymentSuccessEmail);

module.exports = router;
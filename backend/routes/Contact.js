const express = require("express");
const { contactUs } = require("../controllers/Contact");
const router = express.Router();

// POST /api/v1/reach/contact
router.post("/contact", contactUs);

module.exports = router;

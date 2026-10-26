const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { createBooking } = require("../controllers/bookingController");

const router = express.Router();

router.post("/",authMiddleware,createBooking);

module.exports = router;
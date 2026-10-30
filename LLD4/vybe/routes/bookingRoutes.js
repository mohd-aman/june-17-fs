const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { createBooking, cancelBooking, confirmBooking, getBookingByUser } = require("../controllers/bookingController");

const router = express.Router();

router.use(authMiddleware)

router.post("/",createBooking);
router.put("/cancel/:id",cancelBooking);
router.put("/confirm/:id",confirmBooking);
router.get("/my/bookings",getBookingByUser);

module.exports = router;
const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { createBooking, cancelBooking, confirmBooking } = require("../controllers/bookingController");

const router = express.Router();

router.use(authMiddleware)

router.post("/",createBooking);
router.put("/cancel/:id",cancelBooking);
router.put("/confirm/:id",confirmBooking)

module.exports = router;
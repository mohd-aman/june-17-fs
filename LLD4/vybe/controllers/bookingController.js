const Booking = require("../models/bookingModel");
const Show = require("../models/showModel");

const createBooking = async (req, res) => {
  try {
    const { showId, seats } = req.body;

    //step 1 validate input
    if (!showId || !seats) {
      return res.status(400).json({
        success: false,
        message: "Show Id and Number of seats are required",
      });
    }

    if (seats < 1) {
      return res.status(400).json({
        success: false,
        message: "Must book at least 1 seat",
      });
    }

    //step 2 : Find the show
    const show = await Show.findById(showId);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    //step 3 : check if show is active
    if (!show.isActive) {
      return res.status(400).json({
        success: false,
        message: "Show is not available for booking currently",
      });
    }

    //step 4 : Atomic seat check and decrement
    const updatedShow = await Show.findOneAndUpdate(
      { _id: showId, availableSeats: { $gte: seats } },
      {
        $inc: { seats: -seats },
      },
      { new: true },
    );

    if (!updatedShow) {
      return res.status(400).json({
        success: false,
        message: "Not enough seats available",
      });
    }

    //calculate total price
    const totalPrice = show.ticketPrice * seats;

    //step 6: create the booking
    const booking = await Booking.create({
      show: showId,
      user: req.user.userId,
      seats: seats,
      totalPrice: totalPrice,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "booking created successfully. Proceed to Payment",
      data: booking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this booking",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    //restore the seats in shows
    await Show.findByIdAndUpdate(booking.show, {
      $inc: { availableSeats: booking.seats },
    });

    //update the status
    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully. Seats have been restored.",
      data: booking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message:
          "Only pending bookings can be confirmed. Current status: " +
          booking.status,
      });
    }

    booking.status = "confirmed";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking confirmed successfully",
      data: booking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = { createBooking, cancelBooking, confirmBooking };

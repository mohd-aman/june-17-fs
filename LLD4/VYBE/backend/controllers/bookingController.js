const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
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

    if (booking.stripePaymentIntentId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        booking.stripePaymentIntentId,
      );
      if (paymentIntent.status === "succeeded") {
        await stripe.refunds.create({
          payment_intent: booking.stripePaymentIntentId,
        });
      } else if (paymentIntent.status === "processing") {
        return res.status(400).json({
          success: false,
          message: "Payment is still processing. Please try again shortly.",
        });
      } else if (paymentIntent.status !== "canceled") {
        await stripe.paymentIntents.cancel(booking.stripePaymentIntentId);
      }
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

const getBookingByUser = async (req, res) => {
  try {
    const booking = await Booking.find({ user: req.user.userId })
      .populate({
        path: "show",
        populate: [
          { path: "movie", select: "title genre language poster" },
          { path: "theatre", select: "name address" },
        ],
        select: "movie theatre date time ticketPrice",
      })
      .sort({ createdAt: -1 }); // newest first, {createdAt:1} - it means oldest first.

    res.status(200).json({
      success: true,
      message: "Booking fetched successfully",
      data: booking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getTicket = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: "show",
        populate: [
          { path: "movie", select: "title genre language poster" },
          { path: "theatre", select: "name address" },
        ],
      })
      .populate("user", "name email");
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.user._id.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only view your own tickets",
      });
    }

    if (booking.status !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: "Ticket is only available for confirmed bookings",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ticket generated",
      data: {
        bookingId: booking._id,
        movie: booking.show.movie.title,
        genre: booking.show.movie.genre,
        language: booking.show.movie.language,
        theatre: booking.show.theatre.name,
        address: booking.show.theatre.address,
        showDate: booking.show.date,
        showTime: booking.show.time,
        seats: booking.seats,
        totalPrice: booking.totalPrice,
        userName: booking.user.name,
        userEmail: booking.user.email,
        status: booking.status,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate ticket",
    });
  }
};

module.exports = {
  createBooking,
  cancelBooking,
  confirmBooking,
  getBookingByUser,
  getTicket
};

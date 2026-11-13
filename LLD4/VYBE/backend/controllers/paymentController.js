const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Booking = require("../models/bookingModel");
const sendEmail = require("../utils/emailSender");
const User = require("../models/userModel");


const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only pay for your own bookings",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Booking is not in pending status",
      });
    }

    if (booking.stripePaymentIntentId) {
      const existingIntent = await stripe.paymentIntents.retrieve(
        booking.stripePaymentIntentId,
      );

      return res.status(200).json({
        success: true,
        message: "Payment intent already exists",
        data: { clientSecret: existingIntent.client_secret },
      });
    }

    const amountInSmallestUnit = Math.round(booking.totalPrice * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInSmallestUnit,
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
      metadata: {
        bookingId: booking._id.toString(),
        userId: req.user.userId,
      },
    });

    booking.stripePaymentIntentId = paymentIntent.id;
    await booking.save();

    return res.status(201).json({
      success: true,
      message: "Payment intent created",
      data: { clientSecret: paymentIntent.client_secret },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Oops Something went wrong",
    });
  }
};

// Placeholder - to be implemented in the next section
const verifyPayment = async (req, res) => {
  try {
    const { paymentIntentId, bookingId } = req.body;

    if (!paymentIntentId || !bookingId) {
      return res.status(400).json({
        success: false,
        message: "Payment intent ID and booking ID are required",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only verify your own payments",
      });
    }

    if (booking.status === "confirmed") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified and booking confirmed",
        data: booking,
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Booking is not in pending status",
      });
    }

    if (
      booking.stripePaymentIntentId &&
      booking.stripePaymentIntentId !== paymentIntentId
    ) {
      return res.status(400).json({
        success: false,
        message: "This payment does not belong to this booking",
      });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        success: false,
        message: "Payment has not been completed",
      });
    }

    if (
      paymentIntent.metadata.bookingId !== booking._id.toString() ||
      paymentIntent.metadata.userId !== booking.user.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment does not match this booking",
      });
    }

    if (
      paymentIntent.amount !== Math.round(booking.totalPrice * 100) ||
      paymentIntent.currency !== "inr"
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment amount or currency does not match this booking",
      });
    }

    booking.status = "confirmed";
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id).populate({
      path: "show",
      populate: [
        { path: "movie", select: "title genre language" },
        { path: "theatre", select: "name address" },
      ],
    });
 
    const user = await User.findById(booking.user);
 
    sendEmail({
      to: user.email,
      subject: "VYBE - Booking Confirmed!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #18181b; color: #f4f4f5; padding: 32px; border-radius: 12px;">
          <h1 style="color: #8B7CFF; margin-bottom: 24px;">Booking Confirmed</h1>
          <h2 style="color: #f4f4f5;">${populatedBooking.show.movie.title}</h2>
          <p style="color: #a1a1aa;">
            <strong>Theatre:</strong> ${populatedBooking.show.theatre.name}<br/>
            <strong>Date:</strong> ${populatedBooking.show.date}<br/>
            <strong>Time:</strong> ${populatedBooking.show.time}<br/>
            <strong>Seats:</strong> ${populatedBooking.seats}<br/>
            <strong>Amount Paid:</strong> ₹${populatedBooking.totalPrice}
          </p>
          <p style="color: #a1a1aa; margin-top: 24px;">Booking ID: ${booking._id}</p>
          <p style="color: #71717a; font-size: 12px; margin-top: 32px;">This is an automated email from VYBE. Do not reply.</p>
        </div>
      `,
    });


    if (paymentIntent.status === "succeeded") {
      return res.status(200).json({
        success: true,
        message: "Payment verified and booking confirmed",
        data: booking,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Oops Something went wrong",
    });
  }
};

module.exports = { createPaymentIntent, verifyPayment };

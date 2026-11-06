import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import api from "../services/api";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ bookingId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setError("");
    const { error: stripeError, paymentIntent } =
    await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
        if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
      return;
    }
    if (paymentIntent && paymentIntent.status === "succeeded") {
      try {
        await api.post("/api/payments/verify-payment", {
          paymentIntentId: paymentIntent.id,
          bookingId,
        });
        navigate(`/bookings/ticket/${bookingId}`);
      } catch (err) {
        setError(
          "Payment succeeded but verification failed. Contact support."
        );
        setProcessing(false);
      }
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Payment Details</h2>
        <PaymentElement />
        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
        <button
          type="submit"
          disabled={!stripe || processing}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-medium py-3 rounded-lg transition-colors mt-6"
        >
          {processing ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </form>
  );
};

const Checkout = () => {
  const [clientSecret,setClientSecret] = useState(null);
  const {bookingId} = useParams()
  const [booking,setBooking] = useState();
  const [error,setError] = useState(null);
  useEffect(() => {
  const initCheckout = async () => {
    try {
      // 1. Create the PaymentIntent
      const paymentRes = await api.post(
        "/api/payments/create-payment-intent",
        { bookingId }
      );
      setClientSecret(paymentRes.data.data.clientSecret);
      // 2. Fetch the user's bookings for the order summary
      try {
        const listRes = await api.get("/api/bookings/my/bookings");
        const found = listRes.data.data.find(
          (b) => b._id === bookingId
        );
        if (found) {
          setBooking({
            movie: found.show.movie.title,
            theatre: found.show.theatre.name,
            showDate: found.show.date,
            showTime: found.show.time,
            seats: found.seats,
            totalPrice: found.totalPrice,
          });
        }
      } catch (summaryErr) {
        console.error("Summary fetch failed:", summaryErr);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not start checkout"
      );
    } finally {
      setLoading(false);
    }
  };
  initCheckout();
}, [bookingId]);

  return (
  <div className="max-w-6xl mx-auto px-6 py-8">
    {error && <p className="text-red-400 mb-4">{error}</p>}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      {/* LEFT — order summary */}
      <div>
        {booking && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Order Summary
            </h2>
            <div className="space-y-2 text-zinc-400">
              <p>Movie: <span className="text-white">{booking.movie}</span></p>
              <p>Theatre: <span className="text-white">{booking.theatre}</span></p>
              <p>Date: <span className="text-white">{booking.showDate}</span></p>
              <p>Time: <span className="text-white">{booking.showTime}</span></p>
              <p>Seats: <span className="text-white">{booking.seats}</span></p>
              <p className="text-lg pt-2 border-t border-zinc-800">
                Total:{" "}
                <span className="text-violet-400 font-semibold">
                  ₹{booking.totalPrice}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
      {/* RIGHT — Stripe form */}
      <div>
        {clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "night",
                variables: { colorPrimary: "#8B7CFF" },
              },
            }}
          >
            <PaymentForm bookingId={bookingId} />
          </Elements>
        )}
      </div>
    </div>
  </div>

)};
export default Checkout;
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const badge = {
  confirmed: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  pending: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  cancelled: "text-red-400 bg-red-500/10 border-red-500/30",
};

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/api/bookings/my/bookings");
        setBookings(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
  if (!window.confirm("Cancel this booking? Any payment will be refunded.")) return;

  setCancelError("");

  try {
    await api.put(`/api/bookings/cancel/${bookingId}`);

    setBookings(
      bookings.map((b) =>
        b._id === bookingId ? { ...b, status: "cancelled" } : b
      )
    );
  } catch (err) {
    setCancelError(err.response?.data?.message || "Could not cancel booking");
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-zinc-500">Loading bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-zinc-400 mb-4">You have no bookings yet.</p>
        <Link
          to="/movies"
          className="inline-block bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg"
        >
          Browse Movies
        </Link>
      </div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">My Bookings</h1>
      {cancelError && <p className="text-red-400 mb-4">{cancelError}</p>}
      <div className="space-y-4">
        {bookings.map((b) => (
          <div
            key={b._id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-white font-semibold text-lg">
                  {b.show?.movie?.title || "Movie unavailable"}
                </h2>
                <span
                  className={`text-xs border px-2 py-0.5 rounded capitalize ${badge[b.status]}`}
                >
                  {b.status}
                </span>
              </div>
              <p className="text-zinc-400 text-sm">
                {b.show?.theatre?.name} · {formatDate(b.show?.date)} ·{" "}
                {b.show?.time}
              </p>
              <p className="text-zinc-500 text-sm mt-1">
                {b.seats} seat{b.seats > 1 ? "s" : ""} · ₹{b.totalPrice}
              </p>
            </div>

            {b.status === "confirmed" && (
              <Link
                to={`/bookings/ticket/${b._id}`}
                className="text-center bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                View Ticket
              </Link>
            )}

            {b.status === "pending" && (
              <Link
                to={`/checkout/${b._id}`}
                className="text-center bg-amber-500 hover:bg-amber-600 text-black font-medium px-4 py-2 rounded-lg text-sm"
              >
                Complete Payment
              </Link>
            )}

            {b.status !== "cancelled" && (
              <button
                onClick={() => handleCancel(b._id)}
                className="text-center border border-red-500/30 text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;

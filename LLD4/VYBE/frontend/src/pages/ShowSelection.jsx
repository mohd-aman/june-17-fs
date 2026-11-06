import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
const ShowSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchShow = async () => {
      try {
        const response = await api.get(`/shows/${id}`);
        setShow(response.data.data);
      } catch (error) {
        console.error("Failed to fetch show:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShow();
  }, [id]);

    const handleBooking = async () => {
    setBooking(true);
    setError("");
    try {
      const response = await api.post("/api/bookings", {
        showId: id,
        seats: seats,
        totalPrice: seats * show.ticketPrice,
      });
      const bookingId = response.data.data._id;
      navigate(`/checkout/${bookingId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
      setBooking(false);
    }
  };

    if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-zinc-500">Loading show details...</p>
      </div>
    );
  }
  if (!show) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-zinc-500">Show not found</p>
      </div>
    );
  }

    return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          {show.movie?.title || "Movie"}
        </h1>
        <p className="text-zinc-400 mb-6">
          {show.theatre?.name} | {show.date} | {show.time}
        </p>
        <div className="border-t border-zinc-800 pt-6">
          <div className="flex items-center justify-between mb-6">
            <label className="text-zinc-300">Number of Seats</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSeats(Math.max(1, seats - 1))}
                className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-lg text-white hover:border-violet-500 transition-colors"
              >
                -
              </button>
              <span className="text-white text-xl font-semibold w-8 text-center">
                {seats}
              </span>
              <button
                onClick={() =>
                  setSeats(Math.min(show.availableSeats, seats + 1))
                }
                className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-lg text-white hover:border-violet-500 transition-colors"
              >
                +
              </button>
            </div>
          </div>
          <p className="text-zinc-500 text-sm mb-2">
            {show.availableSeats} seats available
          </p>
          <div className="flex items-center justify-between py-4 border-t border-zinc-800">
            <span className="text-zinc-400">Price per ticket</span>
            <span className="text-zinc-300">₹{show.ticketPrice}</span>
          </div>
          <div className="flex items-center justify-between py-4 border-t border-zinc-800">
            <span className="text-white font-semibold text-lg">Total</span>
            <span className="text-violet-400 font-semibold text-lg">
              ₹{seats * show.ticketPrice}
            </span>
          </div>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <button
            onClick={handleBooking}
            disabled={booking}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-medium py-3 rounded-lg transition-colors mt-4"
          >
            {booking ? "Creating booking..." : "Proceed to Pay"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ShowSelection;
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const Ticket = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await api.get(`/api/bookings/ticket/${id}`);
        setTicket(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load ticket");
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-zinc-500">Loading ticket...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <Link to="/my/bookings" className="text-violet-400 hover:underline">
          Go to My Bookings
        </Link>
      </div>
    );
  }
  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6 text-center">
        <p className="text-emerald-400 font-semibold">
          Payment successful — your booking is confirmed 🎉
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="border-b border-dashed border-zinc-700 p-6">
          <p className="text-xs tracking-widest text-zinc-500 uppercase mb-2">
            VYBE Ticket
          </p>
          <h1 className="text-2xl font-bold text-white">{ticket.movie}</h1>
          <p className="text-zinc-400 text-sm mt-1">
            {ticket.genre} · {ticket.language}
          </p>
        </div>

        <div className="p-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-zinc-500">Theatre</p>
            <p className="text-white">{ticket.theatre}</p>
          </div>
          <div>
            <p className="text-zinc-500">Address</p>
            <p className="text-white">{ticket.address}</p>
          </div>
          <div>
            <p className="text-zinc-500">Date</p>
            <p className="text-white">{formatDate(ticket.showDate)}</p>
          </div>
          <div>
            <p className="text-zinc-500">Time</p>
            <p className="text-white">{ticket.showTime}</p>
          </div>
          <div>
            <p className="text-zinc-500">Seats</p>
            <p className="text-white">{ticket.seats}</p>
          </div>
          <div>
            <p className="text-zinc-500">Amount paid</p>
            <p className="text-white">₹{ticket.totalPrice}</p>
          </div>
        </div>

        <div className="border-t border-dashed border-zinc-700 p-6 flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-xs">Booking ID</p>
            <p className="text-zinc-300 text-sm font-mono break-all">
              {ticket.bookingId}
            </p>
          </div>
          <span className="text-emerald-400 text-sm font-semibold tracking-wide">
            CONFIRMED
          </span>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Link
          to="/my/bookings"
          className="flex-1 text-center bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-lg transition-colors"
        >
          My Bookings
        </Link>
        <Link
          to="/movies"
          className="flex-1 text-center bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg transition-colors"
        >
          Book Another
        </Link>
      </div>
    </div>
  );
};

export default Ticket;
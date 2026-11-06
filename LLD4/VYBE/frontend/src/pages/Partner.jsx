import { useState, useEffect } from "react";
import api from "../services/api";
import Tabs from "../components/Tabs";
import ListRow from "../components/ListRow";
import { inputClass } from "../utils/styles";

const TABS = [
  { key: "theatres", label: "My Theatres" },
  { key: "shows", label: "My Shows" },
];

const emptyTheatre = { name: "", address: "", phone: "", email: "" };

const emptyShow = {
  movie: "",
  theatre: "",
  date: "",
  time: "",
  ticketPrice: "",
  totalSeats: "",
};


const Partner = () => {
  const [activeTab, setActiveTab] = useState("theatres");
  const [theatres, setTheatres] = useState([]);
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatreForm, setTheatreForm] = useState(emptyTheatre);
  const [showForm, setShowForm] = useState(emptyShow);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [theatresRes, showsRes, moviesRes] = await Promise.all([
          api.get("/theatres/my/theatres"),
          api.get("/shows/my/shows"),
          api.get("/movies"),
        ]);
        setTheatres(theatresRes.data.data);
        setShows(showsRes.data.data);
        setMovies(moviesRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load your data");
      }
    };
    fetchData();
  }, []);

    // Each input has a name matching its field, so one handler serves a whole form
  const handleTheatreChange = (e) =>
    setTheatreForm({ ...theatreForm, [e.target.name]: e.target.value });

  const handleShowChange = (e) =>
    setShowForm({ ...showForm, [e.target.name]: e.target.value });

   const handleAddTheatre = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("/theatres", theatreForm);
      setTheatres([...theatres, response.data.data]);
      setTheatreForm(emptyTheatre);
    } catch (err) {
      setError(err.response?.data?.message || "Could not add theatre");
    }
  };

  const handleAddShow = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("/shows", showForm);
      // The create response has plain IDs, so look up the names we already have
      setShows([
        ...shows,
        {
          ...response.data.data,
          movie: movies.find((m) => m._id === showForm.movie),
          theatre: theatres.find((t) => t._id === showForm.theatre),
        },
      ]);
      setShowForm(emptyShow);
    } catch (err) {
      setError(err.response?.data?.message || "Could not add show");
    }
  };

    return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Partner Dashboard</h1>
      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
      {error && <p className="text-red-400 mb-4">{error}</p>}
      {activeTab === "theatres" && (
        <div>
          <form
            onSubmit={handleAddTheatre}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6"
          >
            <h2 className="text-white font-semibold mb-4">Add Theatre</h2>
            <div className="grid grid-cols-2 gap-4">
              <input name="name" placeholder="Theatre Name" required value={theatreForm.name} onChange={handleTheatreChange} className={inputClass} />
              <input name="phone" placeholder="Phone" required value={theatreForm.phone} onChange={handleTheatreChange} className={inputClass} />
              <input name="email" type="email" placeholder="Email" required value={theatreForm.email} onChange={handleTheatreChange} className={inputClass} />
              <input name="address" placeholder="Address" required value={theatreForm.address} onChange={handleTheatreChange} className={inputClass} />
            </div>
            <button
              type="submit"
              className="mt-4 bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Add Theatre
            </button>
          </form>

          <div className="space-y-3">
            {theatres.map((theatre) => (
              <ListRow
                key={theatre._id}
                title={theatre.name}
                subtitle={theatre.address}
                isActive={theatre.isActive}
              />
            ))}
          </div>
        </div>
      )}  
      {activeTab === "shows" && (
        <div>
          <form
            onSubmit={handleAddShow}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6"
          >
            <h2 className="text-white font-semibold mb-4">Add Show</h2>
            <div className="grid grid-cols-2 gap-4">
              <select name="movie" required value={showForm.movie} onChange={handleShowChange} className={inputClass}>
                <option value="">Select Movie</option>
                {movies.map((movie) => (
                  <option key={movie._id} value={movie._id}>
                    {movie.title}
                  </option>
                ))}
              </select>
              <select name="theatre" required value={showForm.theatre} onChange={handleShowChange} className={inputClass}>
                <option value="">Select Theatre</option>
                {theatres
                  .filter((t) => t.isActive)
                  .map((theatre) => (
                    <option key={theatre._id} value={theatre._id}>
                      {theatre.name}
                    </option>
                  ))}
              </select>
              <input name="date" type="date" required value={showForm.date} onChange={handleShowChange} className={inputClass} />
              <input name="time" type="time" required value={showForm.time} onChange={handleShowChange} className={inputClass} />
              <input name="ticketPrice" type="number" min="0" placeholder="Ticket Price" required value={showForm.ticketPrice} onChange={handleShowChange} className={inputClass} />
              <input name="totalSeats" type="number" min="1" placeholder="Total Seats" required value={showForm.totalSeats} onChange={handleShowChange} className={inputClass} />
            </div>
            <button
              type="submit"
              className="mt-4 bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Add Show
            </button>
          </form>

          <div className="space-y-3">
            {shows.map((show) => (
              <ListRow
                key={show._id}
                title={`${show.movie?.title || "Movie"} at ${show.theatre?.name || "Theatre"}`}
                subtitle={`${new Date(show.date).toLocaleDateString("en-IN")} · ${show.time} · ₹${show.ticketPrice} · ${show.totalSeats} seats`}
                isActive={show.isActive}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Partner;
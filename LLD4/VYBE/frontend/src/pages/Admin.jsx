import { useState, useEffect } from "react";
import api from "../services/api";
import Tabs from "../components/Tabs";
import ListRow from "../components/ListRow";
import { inputClass } from "../utils/styles";
 
const TABS = [
  { key: "movies", label: "Movies" },
  { key: "theatres", label: "Theatres" },
  { key: "shows", label: "Shows" },
];
const GENRES = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance", "Thriller", "Documentary"];
const emptyMovie = {
  title: "",
  description: "",
  genre: "Action",
  language: "English",
  releaseDate: "",
  rating: "",
  poster: "",
};

const Admin = () => {
  const [activeTab, setActiveTab] = useState("movies");
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [shows, setShows] = useState([]);
  const [movieForm, setMovieForm] = useState(emptyMovie);
  const [error, setError] = useState("");
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, theatresRes, showsRes] = await Promise.all([
          api.get("/movies"),
          api.get("/api/admin/theatres"),
          api.get("/api/admin/shows"),
        ]);
        setMovies(moviesRes.data.data);
        setTheatres(theatresRes.data.data);
        setShows(showsRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load admin data");
      }
   };
    fetchData();
  }, []);

  const handleMovieChange = (e) =>
    setMovieForm({ ...movieForm, [e.target.name]: e.target.value });
 
  const handleAddMovie = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("/api/movies", movieForm);
      setMovies([...movies, response.data.data]);
      setMovieForm(emptyMovie);
    } catch (err) {
      setError(err.response?.data?.message || "Could not add movie");
    }
  };
// type is "theatres" or "shows". action is "approve" or "reject".
  const handleApproval = async (type, action, id) => {
    setError("");
    try {
      await api.put(`/api/admin/${type}/${action}/${id}`);
      const isActive = action === "approve";
 
      if (type === "theatres") {
        setTheatres(theatres.map((t) => (t._id === id ? { ...t, isActive } : t)));
        // The backend also deactivates every show at a rejected theatre
        if (!isActive) {
          setShows(shows.map((s) => (s.theatre?._id === id ? { ...s, isActive } : s)));
        }
      } else {
        setShows(shows.map((s) => (s._id === id ? { ...s, isActive } : s)));
      }
    } catch (err) {
      setError(err.response?.data?.message || `Could not ${action}`);
    }
  };
const approvalButton = (type, item) =>
    item.isActive ? (
      <button
        onClick={() => handleApproval(type, "reject", item._id)}
        className="text-red-400 hover:underline text-sm"
      >
        Reject
      </button>
    ) : (
      <button
        onClick={() => handleApproval(type, "approve", item._id)}
        className="text-emerald-400 hover:underline text-sm"
      >
        Approve
      </button>
    );
return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
      {error && <p className="text-red-400 mb-4">{error}</p>}
 
      {activeTab === "movies" && (
        <div>
          <form
            onSubmit={handleAddMovie}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6"
          >
            <h2 className="text-white font-semibold mb-4">Add Movie</h2>
            <div className="grid grid-cols-2 gap-4">
              <input name="title" placeholder="Title" required value={movieForm.title} onChange={handleMovieChange} className={inputClass} />
              <select name="genre" value={movieForm.genre} onChange={handleMovieChange} className={inputClass}>
                {GENRES.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
              <input name="language" placeholder="Language" required value={movieForm.language} onChange={handleMovieChange} className={inputClass} />
              <input name="releaseDate" type="date" required value={movieForm.releaseDate} onChange={handleMovieChange} className={inputClass} />
              <input name="rating" type="number" step="0.1" min="0" max="10" placeholder="Rating (0-10, optional)" value={movieForm.rating} onChange={handleMovieChange} className={inputClass} />
              <input name="poster" placeholder="Poster URL (optional)" value={movieForm.poster} onChange={handleMovieChange} className={inputClass} />
              <textarea name="description" placeholder="Description" required value={movieForm.description} onChange={handleMovieChange} className={`${inputClass} col-span-2 h-20 resize-none`} />
            </div>
            <button
              type="submit"
              className="mt-4 bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Add Movie
            </button>
          </form>
 
          <div className="space-y-3">
            {movies.map((movie) => (
              <ListRow key={movie._id} title={movie.title} subtitle={`${movie.genre} · ${movie.language}`} />
            ))}
          </div>
        </div>
      )}
{activeTab === "theatres" && (
        <div className="space-y-3">
          {theatres.map((theatre) => (
            <ListRow
              key={theatre._id}
              title={theatre.name}
              subtitle={`${theatre.address} · Owner: ${theatre.owner?.name || "Unknown"}`}
              isActive={theatre.isActive}
            >
              {approvalButton("theatres", theatre)}
            </ListRow>
          ))}
        </div>
      )}
 
      {activeTab === "shows" && (
        <div className="space-y-3">
          {shows.map((show) => (
            <ListRow
              key={show._id}
              title={`${show.movie?.title || "Movie"} at ${show.theatre?.name || "Theatre"}`}
              subtitle={`${new Date(show.date).toLocaleDateString("en-IN")} · ${show.time} · ₹${show.ticketPrice}`}
              isActive={show.isActive}
            >
              {approvalButton("shows", show)}
            </ListRow>
          ))}
        </div>
      )}
    </div>
  );
};
 
export default Admin;
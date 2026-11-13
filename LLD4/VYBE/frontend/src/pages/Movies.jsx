import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

   const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchError("");
    try {
      const response = await api.post("/api/ai/search-shows", {
        query: searchQuery,
      });
      setSearchResult(response.data);
    } catch (err) {
      setSearchError(err.response?.data?.message || "Search failed");
    } finally {
      setSearching(false);
    }
  };
 
  const clearSearch = () => {
    setSearchResult(null);
    setSearchQuery("");
  };


  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get("/movies");
        setMovies(response.data.data);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-zinc-500">Loading movies...</p>
      </div>
    );
  }
   return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Now Showing</h1>
      <form onSubmit={handleSearch} className="mb-8 flex gap-3">
        <input
          type="text"
          placeholder="Search with AI... e.g. 'comedy movies after 6pm'"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
        />
        <button
          type="submit"
          disabled={searching}
          className="bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          {searching ? "Searching..." : "Search"}
        </button>
      </form>
 
      {searchError && <p className="text-red-400 mb-4">{searchError}</p>}
 
      {searchResult ? (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              AI Search Results
            </h2>
            <button
              onClick={clearSearch}
              className="text-violet-400 hover:underline text-sm"
            >
              Clear search
            </button>
          </div>
 
          {searchResult.data.length === 0 ? (
            <p className="text-zinc-400">No matching shows found.</p>
          ) : (
            <div className="space-y-3">
              {searchResult.data.map((show) => (
                <Link
                  key={show._id}
                  to={`/shows/${show._id}/book`}
                  className="block bg-zinc-900 border border-zinc-800 hover:border-violet-500 rounded-xl p-4 transition-colors"
                >
                  <h3 className="text-white font-medium">
                    {show.movie?.title || "Movie"} at{" "}
                    {show.theatre?.name || "Theatre"}
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    {new Date(show.date).toLocaleDateString("en-IN")} ·{" "}
                    {show.time} · ₹{show.ticketPrice}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : movies.length === 0 ? (

        <p className="text-zinc-500">No movies available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <Link
              key={movie._id}
              to={`/movies/${movie._id}`}
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-violet-500 transition-colors group"
            >
              {movie.poster && (
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-64 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-white font-semibold text-lg group-hover:text-violet-400 transition-colors">
                  {movie.title}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded">
                    {movie.genre}
                  </span>
                  <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded">
                    {movie.language}
                  </span>
                </div>
                {movie.rating && (
                  <p className="text-zinc-500 text-sm mt-2">
                    {movie.rating}/10
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
export default Movies;
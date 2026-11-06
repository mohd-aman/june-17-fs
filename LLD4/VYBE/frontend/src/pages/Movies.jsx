import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
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
      {movies.length === 0 ? (
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
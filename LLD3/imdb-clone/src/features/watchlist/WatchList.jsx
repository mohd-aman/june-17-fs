import { Link } from "react-router-dom";
const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE;
function WatchListPage({
  watchlist,
  removeFromWatchlist,
}) {
  if (watchlist.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh] text-white gap-4">
        <h1 className="text-3xl font-bold text-gray-400">
          Your watchlist is empty
        </h1>
        <Link className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition" to="/">
          Browse Movies
        </Link>
      </div>
    );
  }
  return (
    <div className="p-8">
      <h1 className="text-white text-3xl font-bold text-center mb-8">
        My Watchlist ({watchlist.length})
      </h1>
      <div className="max-w-4xl mx-auto">
        {watchlist.map((movie) => {
          const posterUrl = movie.poster_path
            ? `${IMAGE_BASE}/w200${movie.poster_path}`
            : "[https://via.placeholder.com/200x300?text=No+Image](https://via.placeholder.com/200x300?text=No+Image)";

          return (
            <div
              key={movie.id}
              className="flex items-center gap-6 bg-gray-900 rounded-xl p-4 mb-4 hover:bg-gray-800 transition"
            >
              <Link to="{`/movie/${movie.id}`}">
                <img
                  src={posterUrl}
                  alt={movie.title}
                  className="w-20 h-28 object-cover rounded-lg"
                  loading="lazy"
                />
              </Link>
              <div className="flex-1">
                <Link to={`/movie/${movie.id}`}>
                  <h3 className="text-white text-xl font-bold hover:text-yellow-400 transition">
                    {movie.title}
                  </h3>
                </Link>
                <div className="flex gap-4 mt-1">
                  <span className="text-yellow-400 text-sm">
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {movie.release_date}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                  {movie.overview}
                </p>
              </div>
              <button
                onClick={() => removeFromWatchlist(movie.id)}
                className="text-red-400 hover:text-red-300 text-sm font-bold px-4 py-2 border border-red-400 rounded-lg hover:bg-red-400/10 transition"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WatchListPage;

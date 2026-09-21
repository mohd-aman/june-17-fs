import { useState } from "react";
import { Link } from "react-router-dom";
const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE;
function WatchListPage({
  watchlist,
  removeFromWatchlist,
}) {
  const [search,setSearch] = useState("");
  const [sortBy,setSortBy] = useState("none");

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

  //filtering based on search
  let filteredMovies = watchlist.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  //sorting on filtered Arr.
  if (sortBy === "rating-high") {
    filteredMovies = [...filteredMovies].sort(
      (a, b) => b.vote_average - a.vote_average
    );
  } else if (sortBy === "rating-low") {
    filteredMovies = [...filteredMovies].sort(
      (a, b) => a.vote_average - b.vote_average
    );
  } else if (sortBy === "title-az") {
    filteredMovies = [...filteredMovies].sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  } else if (sortBy === "title-za") {
    filteredMovies = [...filteredMovies].sort((a, b) =>
      b.title.localeCompare(a.title)
    );
  }


  return (
    <div className="p-8">
      <h1 className="text-white text-3xl font-bold text-center mb-8">
        My Watchlist ({watchlist.length})
      </h1>
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center gap-4">
        <input
          className="flex-1 min-w-[200px] px-5 py-3 rounded-full bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-yellow-400 text-lg"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your watchlist..."
          type="text"
          value={search}
        />
        <select
          className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
          onChange={(e) => setSortBy(e.target.value)}
          value={sortBy}
        >
          <option value="none">Sort by</option>
          <option value="rating-high">Rating: High to Low</option>
          <option value="rating-low">Rating: Low to High</option>
          <option value="title-az">Title: A to Z</option>
          <option value="title-za">Title: Z to A</option>
        </select>
      </div>
      <div className="max-w-4xl mx-auto">
        {filteredMovies.map((movie) => {
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

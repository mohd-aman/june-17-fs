import { Link } from "react-router-dom";

const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE;

function MovieCard({
  movie,
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
}) {
  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE}/w500${movie.poster_path}`
    : "[https://via.placeholder.com/500x750?text=No+Image](https://via.placeholder.com/500x750?text=No+Image)";

  const inList = isInWatchlist(movie.id)  
  function handleToggle(e) {
    e.preventDefault();
    if(inList){
      removeFromWatchlist(movie.id)
    }else{
      addToWatchlist(movie)
    }
  }
  return (
    <Link to={`/movie/${movie.id}`}>
      <div className="relative rounded-xl overflow-hidden hover:scale-105 duration-300 cursor-pointer shadow-lg group">
        <img
          alt="{movie.title}"
          className="w-full h-[350px] object-cover"
          loading="lazy"
          src={`${posterUrl}`}
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-4">
          <h3 className="text-white font-bold text-lg">{movie.title}</h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-yellow-400 text-sm">
              {movie.vote_average.toFixed(1)}
            </span>
            <span className="text-gray-300 text-sm">{movie.release_date}</span>
          </div>
        </div>
         <button
          onClick={handleToggle}
          className="absolute top-2 right-2 z-10 text-2xl bg-black/50 rounded-full w-9 h-9 flex items-center justify-center hover:bg-black/80 transition"
        >
          {inList ? "❤️" : "🤍"}
        </button>
      </div>
    </Link>
  );
}
export default MovieCard;

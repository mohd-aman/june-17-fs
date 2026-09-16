import { Link } from "react-router-dom";

const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE;

function MovieCard({ movie }) {
  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE}/w500${movie.poster_path}`
    : "[https://via.placeholder.com/500x750?text=No+Image](https://via.placeholder.com/500x750?text=No+Image)";
  return (
    <Link to="{`/movie/${movie.id}`}">
      <div className="relative rounded-xl overflow-hidden hover:scale-105 duration-300 cursor-pointer shadow-lg group">
        <img alt="{movie.title}" className="w-full h-[350px] object-cover" loading="lazy" src={`${posterUrl}`}/>
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-4">
          <h3 className="text-white font-bold text-lg">{movie.title}</h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-yellow-400 text-sm">
              {movie.vote_average.toFixed(1)}
            </span>
            <span className="text-gray-300 text-sm">{movie.release_date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
export default MovieCard;
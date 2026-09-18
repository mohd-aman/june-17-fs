import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import movieService from "../../services/movieService";
import { useParams } from "react-router-dom";
import Loader from "../../components/ui/Loader";
import ErrorMessage from "../../components/ui/ErrorMessage";


const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE;

function MovieDetailPage() {
  const {id} = useParams(); // read id from the url which is after /movie
  const [movie,setMovie] = useState(null);
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(true);

  //  async function fetchMovie(){
  //     try{
  //       // setLoading(true);
  //       // setError(null);
  //       const data = await movieService.getById(id);
  //       setMovie(data)
  //     }catch(err){
  //       setError(err.message);
  //     }finally{
  //       setLoading(false);
  //     }
  //   }
  //   fetchMovie(); // it will fetch infinitely

  useEffect(()=>{
    let cancelled = false;
    async function fetchMovie(){
      try{
        // setLoading(true);
        // setError(null);
        const data = await movieService.getById(id);
        if(!cancelled)setMovie(data)
      }catch(err){
        if(!cancelled)setError(err.message);
      }finally{
        if(!cancelled)setLoading(false);
      }
    }
    fetchMovie();

    return ()=>{
      cancelled = true;
    }
  },[])//will run once, on mount

  if(loading){
    return <Loader/>
  }
  if(error){
    return <ErrorMessage message={error}/>
  }

  const backdropUrl = movie.backdrop_path
    ? `${IMAGE_BASE}/original${movie.backdrop_path}`
    : "";

  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE}/w500${movie.poster_path}`
    : "[https://via.placeholder.com/500x750?text=No+Image](https://via.placeholder.com/500x750?text=No+Image)";

return (
    <div className="text-white">
      {backdropUrl && (
        <div
          className="h-[50vh] bg-cover bg-center relative"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent" />
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 -mt-32 relative z-10 flex flex-col md:flex-row gap-8 pb-12">
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-64 rounded-xl shadow-2xl flex-shrink-0"
          loading="lazy"
        />

        <div className="flex flex-col justify-end">
          <h1 className="text-4xl font-extrabold mb-2">{movie.title}</h1>

          {movie.tagline && (
            <p className="text-gray-400 italic mb-4">"{movie.tagline}"</p>
          )}

          <div className="flex flex-wrap gap-4 mb-4">
            <span className="text-yellow-400 font-bold text-lg">
              {movie.vote_average.toFixed(1)}
            </span>
            <span className="text-gray-400">{movie.release_date}</span>
            <span className="text-gray-400">{movie.runtime} min</span>
            <span className="text-gray-400">
              $
              {movie.revenue
                ? (movie.revenue / 1_000_000).toFixed(1) + "M"
                : "N/A"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres?.map((g) => (
              <span
                key={g.id}
                className="px-3 py-1 bg-gray-800 rounded-full text-sm text-yellow-300 border border-gray-700"
              >
                {g.name}
              </span>
            ))}
          </div>

          <h3 className="text-xl font-bold mb-2">Overview</h3>
          <p className="text-gray-300 leading-relaxed mb-6">
            {movie.overview}
          </p>

          <Link className="inline-block w-fit px-6 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition" to="/">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
export default MovieDetailPage;
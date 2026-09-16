import { useEffect, useState } from "react";
import movieService from "../../services/movieService";
import Loader from "../../components/ui/Loader";

const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE;

export default function Banner(){
  const [movie,setMovie] = useState(null);

  useEffect(()=>{
    movieService.getPopular().then((data)=>{
      console.log(data.results);
      const movies = data.results;
      const randomMovie = movies[Math.floor(Math.random() * movies.length)]
      setMovie(randomMovie);
    })

  },[]) //it will execute effect only on mounting(once)
  
  if(!movie){
    return <Loader/>
  }

  return (
    <div
      className="h-[30vh] md:h-[75vh] bg-cover bg-center flex items-end relative"
      style={{
        backgroundImage: `url(${IMAGE_BASE}/original${movie.backdrop_path})`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="relative z-10 p-8 max-w-2xl">
        <h1 className="text-white text-4xl font-bold mb-2">{movie.title}</h1>
        <p className="text-gray-300 text-sm line-clamp-3">{movie.overview}</p>
        <div className="flex items-center gap-4 mt-3">
          <span className="text-yellow-400 font-bold">
            {movie.vote_average.toFixed(1)}
          </span>
          <span className="text-gray-400">{movie.release_date}</span>
        </div>
      </div>
    </div>
  );
}
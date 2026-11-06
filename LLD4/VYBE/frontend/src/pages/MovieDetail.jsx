import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, showsRes] = await Promise.all([
          api.get(`/movies/${id}`),
          api.get(`/shows/movie/${id}`),
        ]);
        setMovie(movieRes.data.data);
        setShows(showsRes.data.data);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

   const groupedByTheatre = shows.reduce((acc, show) => {
    const theatreId = show.theatre._id;
    if (!acc[theatreId]) {
      acc[theatreId] = {
        theatre: show.theatre,
        shows: [],
      };
    }
    acc[theatreId].shows.push(show);
    return acc;
  }, {});
  // {
  //   theatreId1:{theatre: show.theatre,shows:[show1,show2,show3]},
  //   theatreId2:{theatre:show.theatre.shows:[show4,show6]}
  // }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-zinc-500">Movie not found</p>
      </div>
    );
  }

   return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {movie.poster && (
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full md:w-72 h-96 object-cover rounded-xl"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold text-white mb-4">{movie.title}</h1>
          <div className="flex gap-2 mb-4">
            <span className="text-sm bg-zinc-800 text-zinc-400 px-3 py-1 rounded">
              {movie.genre}
            </span>
            <span className="text-sm bg-zinc-800 text-zinc-400 px-3 py-1 rounded">
              {movie.language}
            </span>
          </div>
          <p className="text-zinc-400 leading-relaxed">{movie.description}</p>
          {movie.rating && (
            <p className="text-zinc-500 mt-4">{movie.rating}/10</p>
          )}
        </div>
      </div>
      <h2 className="text-2xl font-bold text-white mb-6">Available Shows</h2>
      {Object.keys(groupedByTheatre).length === 0 ? (
        <p className="text-zinc-500">No shows available for this movie</p>
      ) : (
        Object.values(groupedByTheatre).map(({ theatre, shows }) => (
          <div
            key={theatre._id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-4"
          >
            <h3 className="text-white font-semibold text-lg">{theatre.name}</h3>
            <p className="text-zinc-500 text-sm mb-4">{theatre.address}</p>
            <div className="flex flex-wrap gap-3">
              {shows.map((show) => (
                <Link
                  key={show._id}
                  to={`/shows/${show._id}/book`}
                  className="bg-zinc-800 border border-zinc-700 hover:border-violet-500 text-zinc-300 hover:text-violet-400 px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  {show.time} | ₹{show.ticketPrice} | {show.availableSeats}{" "}
                  seats
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
export default MovieDetail;
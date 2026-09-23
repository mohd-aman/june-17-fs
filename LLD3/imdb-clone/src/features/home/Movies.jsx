import { useState, useEffect } from "react";
import Loader from "../../components/ui/Loader";
import MovieCard from "./MovieCard";
import movieService from "../../services/movieService";
import ErrorMessage from "../../components/ui/ErrorMessage";
import MovieCardShimmer from "../../components/ui/MovieCardShimmer";

const shimmerMovies = Array.from({ length: 20 }, () => 1);

export default function Movies() {
  const [movies, setMovies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPage] = useState(500);
  const [search, setSearch] = useState("");

  function handlePrevious() {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  }
  function handleNext() {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  }

  function handleSearch(e) {
    setSearch(e.target.value);
    setCurrentPage(1);
  }

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        setError(null);
        const data = search.trim()
          ? await movieService.getSearch(search, currentPage)
          : await movieService.getPopular(currentPage);
        if (data) {
          setMovies(data.results);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, [currentPage, search]); // it run on mount, change on currentPage/search

  if (error) {
    return <ErrorMessage message={error} />;
  }

  // if (loading) {
  //   return <Loader />;
  // }

  return (
    <div className="p-6">
      <div className="flex justify-center mb-8">
        <input
          className="w-full max-w-lg px-5 py-3 rounded-full bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-yellow-400 text-lg"
          onChange={handleSearch}
          placeholder="Search movies..."
          type="text"
          value={search}
        />
      </div>
      <h2 className="text-white text-3xl font-bold text-center mb-8">
        {search.trim() ? `Results for "${search}"` : "Popular Movies"}
      </h2>
      {movies?.length === 0 ? (
        <p className="text-center text-gray-400 text-xl">No movies found.</p>
      ) : (
        <>
          {loading ? (
            <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {shimmerMovies.map((shim,index) => {
                return <MovieCardShimmer key={index}/>;
              })}
            </div>
            </>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                />
              ))}
            </div>
          )}
          <div className="flex justify-center items-center gap-6 mt-10">
            <button
              className="px-5 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition"
              disabled={currentPage === 1}
              onClick={handlePrevious}
            >
              Previous
            </button>
            <span className="text-white text-lg">
              Page{" "}
              <span className="text-yellow-400 font-bold">{currentPage}</span>{" "}
              of <span className="text-yellow-400 font-bold">{totalPages}</span>
            </span>
            <button
              className="px-5 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition"
              disabled={currentPage === totalPages}
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

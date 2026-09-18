import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RootLayout from "../components/layout/RootLayout";
//without lazy loading
import HomePage from "../features/home/HomePage";
import Loader from "../components/ui/Loader";
// import WatchListPage from "../features/watchlist/WatchList";
// import MovieDetailPage from "../features/movie-detail/MovieDetailPage";
// import NotFound from "../components/ui/NotFound";

// const HomePage = lazy(()=>(
//   import("../features/home/HomePage")
// ))

const MovieDetailPage = lazy(
  () => import("../features/movie-detail/MovieDetailPage"),
);

const WatchListPage = lazy(() => import("../features/watchlist/WatchList"));

const NotFound = lazy(() => import("../components/ui/NotFound"));

function AppRouter() {
  const [watchlist, setWatchlist] = useState(()=>{
    try{
      const saved = localStorage.getItem('watchlist');
      return saved ? JSON.parse(saved): []
    }catch{
      return []
    }
  });

  useEffect(()=>{
    localStorage.setItem('watchlist',JSON.stringify(watchlist));
  },[watchlist])

  function addToWatchlist(movie) {
    setWatchlist((prev) => {
      return [...prev, movie];
    });
  }

  function removeFromWatchlist(movieId) {
    setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
  }

  function isInWatchlist(movieId) {
    return watchlist.some((m) => m.id === movieId);
  }

  return (
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route
            element={
              <HomePage
                addToWatchlist={addToWatchlist}
                removeFromWatchlist={removeFromWatchlist}
                isInWatchlist={isInWatchlist}
              />
            }
            path="/"
          />
          <Route
            element={
              <WatchListPage
                watchlist={watchlist}
                removeFromWatchlist={removeFromWatchlist}
              />
            }
            path="/watchlist"
          />
          <Route element={<MovieDetailPage />} path="/movie/:id" />
          <Route element={<NotFound />} path="*" />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRouter;

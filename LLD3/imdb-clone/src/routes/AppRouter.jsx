import { lazy,Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RootLayout from "../components/layout/RootLayout";
//without lazy loading
import HomePage from "../features/home/HomePage";
// import WatchListPage from "../features/watchlist/WatchList";
// import MovieDetailPage from "../features/movie-detail/MovieDetailPage";
// import NotFound from "../components/ui/NotFound";

// const HomePage = lazy(()=>(
//   import("../features/home/HomePage")
// ))

const MovieDetailPage = lazy(
  () => import("../features/movie-detail/MovieDetailPage")
);

const WatchListPage = lazy(
  () => import("../features/watchlist/WatchList")
);

const NotFound = lazy(()=>(
  import("../components/ui/NotFound")
))


function AppRouter(){
return(
  <Suspense fallback={<div>Loading....</div>}>
    <Routes>
      <Route element={<RootLayout/>}>
        <Route element={<HomePage/>} path="/"/>
        <Route element={<WatchListPage/>} path="/watchlist"/>
        <Route element={<MovieDetailPage/>} path="/movie/:id"/>
        <Route element={<NotFound/>} path="*"/>
      </Route>
    </Routes>
    </Suspense>
)
}

export default AppRouter;
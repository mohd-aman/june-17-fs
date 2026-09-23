import { Link, useLocation } from "react-router-dom";
import { useWatchlist } from "../../context/WatchlistContext";

function NavBar() {
  const location = useLocation();
  const {watchlist} = useWatchlist();

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <Link className="flex items-center gap-3" to="/">
        <span className="text-yellow-400 text-3xl font-extrabold tracking-wide">
          IMDb <span className="text-white text-lg font-normal">Clone</span>
        </span>
      </Link>
      <div className="flex items-center gap-8 text-lg">
        <Link to="/">
          Home
        </Link>
        <Link to="/watchlist">
          Watchlist
          {watchlist.length>0 &&(
            <span className="ml-2 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
              {watchlist.length}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
export default NavBar;
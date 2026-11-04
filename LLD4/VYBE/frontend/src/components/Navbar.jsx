import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/movies" className="text-xl font-bold tracking-wide text-white">
        VYBE
      </Link>
      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link
              to="/movies"
              className="text-zinc-400 hover:text-violet-400 transition-colors"
            >
              Movies
            </Link>
            <Link
              to="/my/bookings"
              className="text-zinc-400 hover:text-violet-400 transition-colors"
            >
              My Bookings
            </Link>
            <span className="text-zinc-500 text-sm">{user.name}</span>
            <button
              onClick={handleLogout}
              className="text-zinc-400 hover:text-red-400 transition-colors text-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-zinc-400 hover:text-violet-400 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-zinc-400 hover:text-violet-400 transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
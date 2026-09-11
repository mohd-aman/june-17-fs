import { Link, useLocation } from "react-router-dom";

function NavBar() {
  const location = useLocation();
  const links = [
    { label: "Home", path: "/" },
    { label: "Watchlist", path: "/watchlist" },
  ];
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <Link className="flex items-center gap-3" to="/">
        <span className="text-yellow-400 text-3xl font-extrabold tracking-wide">
          IMDb <span className="text-white text-lg font-normal">Clone</span>
        </span>
      </Link>
      <div className="flex items-center gap-8 text-lg">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link key={link.path} to={link.path}>
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
export default NavBar;
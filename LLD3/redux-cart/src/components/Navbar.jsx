import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

function NavBar() {
  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-yellow-400 font-bold"
      : "text-gray-300 hover:text-white transition";

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-8 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <NavLink className="text-yellow-400 text-2xl font-bold" to="/">
          Redux Cart
        </NavLink>
        <div className="flex gap-6 items-center">
          <NavLink className="{linkClass}" to="/">
            Products
          </NavLink>
          <NavLink className="{linkClass}" to="/cart">
            Cart
            {totalQuantity > 0 && (
              <span className="ml-2 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                {totalQuantity}
              </span>
            )}
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
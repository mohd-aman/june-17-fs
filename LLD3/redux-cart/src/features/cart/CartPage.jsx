import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  clearCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  selectCartItems,
  selectCartTotalPrice,
} from "../../store/cartSlice";

export default function CartPage() {
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotalPrice)
  const dispatch = useDispatch();

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh] text-white gap-4">
        <h1 className="text-3xl font-bold text-gray-400">Your cart is empty</h1>
        <Link
          to="/"
          className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-white text-3xl font-bold">Shopping Cart</h1>
        <button
          onClick={() => dispatch(clearCart())}
          className="px-4 py-2 border border-red-400 text-red-400 rounded-lg hover:bg-red-400/10 transition text-sm font-bold"
        >
          Clear Cart
        </button>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-8">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-6 bg-gray-900 rounded-xl p-4"
          >
            {/* Product Image */}
            <div className="bg-white rounded-lg p-2 w-24 h-24 flex items-center justify-center flex-shrink-0">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1">
              <h3 className="text-white font-bold line-clamp-1">
                {item.title}
              </h3>
              <p className="text-green-400 font-bold mt-1">${item.price}</p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => dispatch(decrementQuantity(item.id))}
                className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600 transition text-lg font-bold"
              >
                -
              </button>
              <span className="text-white text-lg font-bold w-8 text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => dispatch(incrementQuantity(item.id))}
                className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600 transition text-lg font-bold"
              >
                +
              </button>
            </div>

            {/* Item Total */}
            <div className="text-right min-w-[80px]">
              <p className="text-yellow-400 font-bold">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => dispatch(removeFromCart(item.id))}
              className="text-red-400 hover:text-red-300 transition text-sm"
            >
              X
            </button>
          </div>
        ))}
      </div>

      {/* Cart Total */}
      <div className="bg-gray-900 rounded-xl p-6">
        <div className="flex justify-between items-center text-xl">
          <span className="text-gray-300 font-bold">Total:</span>
          <span className="text-yellow-400 font-bold text-2xl">
            ${cartTotal.toFixed(2)}
          </span>
        </div>
        <button className="w-full mt-4 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition text-lg">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

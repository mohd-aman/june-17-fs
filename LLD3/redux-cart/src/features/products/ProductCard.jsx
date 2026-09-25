import { useDispatch } from "react-redux";
import { addToCart } from "../../store/cartSlice";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg flex flex-col h-full">
      <div className="bg-white p-6 flex items-center justify-center h-56">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-white font-bold text-sm line-clamp-2 mb-2">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-yellow-400 text-sm">
            {product.rating.rate}
          </span>
          <span className="text-gray-500 text-xs">
            ({product.rating.count})
          </span>
        </div>
        <p className="text-gray-400 text-xs line-clamp-3 mb-4 flex-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-green-400 text-xl font-bold">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => dispatch(addToCart(product))}
            className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition text-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
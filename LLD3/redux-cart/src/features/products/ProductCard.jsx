import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/cartSlice";

function ProductCard({ product }) {
  const quantity = useSelector((state)=>{
  const item = state.cart.items.find((item)=>item.id===product.id)
  if(item){
    return item.quantity;
  }
  return 0;
});
  const dispatch = useDispatch();

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg flex flex-col h-full">
      <div className="bg-white p-6 flex items-center justify-center h-56">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-white font-bold text-sm line-clamp-2 mb-2">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-yellow-400 text-sm">{product.rating}</span>
          <span className="text-gray-500 text-xs">
            ({product.reviews.length})
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
            className={`px-4 py-2 font-bold rounded-lg transition text-sm ${
              quantity > 0
                ? "bg-green-600 text-white hover:bg-green-500"
                : "bg-yellow-500 text-black hover:bg-yellow-400"
            }`}
          >
            {quantity > 0 ? `In cart ${quantity}` : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

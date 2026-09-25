import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../../store/productsSlice";
import ProductCard from "./ProductCard";

function ProductList() {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector(
    (state) => state.products // products slice state
  );

  useEffect(() => {
    dispatch(fetchProducts()); //dispatching the thunk
  }, []); // on mount

  if (loading) {
    return (
      <p className="text-center text-gray-400 text-xl mt-20">
        Loading products...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 text-xl mt-20">{error}</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product}/>
      ))}
    </div>
  );
}

export default ProductList;
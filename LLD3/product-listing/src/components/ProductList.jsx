import ProductCard from "./ProductCard";

function ProductList({ products, onAddToCart }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
      {products.map(function (product, index) {
        return <ProductCard key={product.id} {...product} onAddToCart={onAddToCart} />;
      })}
    </div>
  );
}

export default ProductList;
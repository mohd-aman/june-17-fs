import ProductCard from "./ProductCard";

function ProductList({ products }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
      {products.map(function (product, index) {
        return <ProductCard key={product.id} {...product} />;
      })}
    </div>
  );
}

export default ProductList;
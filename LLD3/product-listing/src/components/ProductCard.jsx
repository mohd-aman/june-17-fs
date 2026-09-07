import { useState } from "react";

function ProductCard({ name, price, category, image }) {
  //   console.log(product);
  //   const { name, price, category, image } = product;
  //   console.log(props);
  console.log("Re rendering")
  const [quantity,setQuantity] = useState(0);
  const [isFav,setIsFav] = useState(false);

  function handleInc(incVal){
    setQuantity(quantity+incVal);
  }

  function handleDec(){
    if(quantity === 0) return;
    setQuantity(quantity-1);
  }

  function handleFav(){
    setIsFav(!isFav);
  }

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "16px",
        borderRadius: "8px",
        width: "250px",
      }}
    >
      <img src={image} alt={name} style={{ width: "100%" }} />
      <h2>{name}</h2>
      <button onClick={handleFav}>{isFav?"Remove from fav":"Add to Fav"}</button>
      <p>Category: {category}</p>
      <p>Price: {price}</p>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
        <button onClick={handleDec}>-</button>
        <span>{quantity}</span>
        <button onClick={function(){handleInc(20)}}>+</button>
         <button onClick={()=>handleInc(20)}></button>
      </div>
    </div>
  );
}

export default ProductCard;
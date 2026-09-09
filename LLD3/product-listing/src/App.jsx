import "./App.css";
import ProductList from "./components/ProductList";
import ProductCard from "./components/ProductCard";
import products from "./data/products";
import Section from "./components/Section";
import { useState, useEffect } from "react";
import OrderForm from "./components/OrderForm";
function App() {
  console.log("App rendering");
  const [searchTerm,setSearchTerm] = useState("");
  const [count,setCount] = useState(0);

  const [loading,setLoading] = useState(true);

  const onAddToCart = (quantity)=>{
    setCount(count+quantity);
  }

  // useEffect(cb,[])
  useEffect(()=>{
    console.log("Inside useEffect")
    setTimeout(()=>{
      setLoading(false)
    },2000);
  },[]); // cb will be invoked once, on mount.

  useEffect(function(){
    console.log("useEffect without dependency array");
  }) // no dependency array passed at all, it will execute cb on every re render.


  useEffect(function(){
    console.log("Cart updated : ", count);
  },[count])

  function handleChange(event){
    // console.log(event.target.value);
    // searchTerm = event.target.value;
    setSearchTerm(event.target.value); 
    // console.log("Search Term : ", searchTerm);
  }

  function handleClick(){
    setCount(count+1);
    setCount(count+1);
    // setCount((prevState)=>prevState+1);
    // setCount((prevState)=>prevState+1);
  }

  const filteredProduct = products.filter((product)=>{
    return product.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase());
  })

  if(loading){
    return <h1>Loading......</h1>
  }

  return (
    <div>
      <h1>Our Product Listing</h1>
      <h2>In Cart : {count}</h2>
      <input
        type="search"
        placeholder="Search Products..."
        onChange={handleChange}
        style={{
          padding: "10px",
          fontSize: "16px",
          width: "300px",
          marginBottom: "20px",
        }}
      />
      {/* <ProductCard
        name="Wireless Mouse"
        price={599}
        category="Electronoc"
        image="asd"
      />
      <ProductCard {...product1} />
      <ProductCard {...product2} /> */}
      <Section title="Featured Products">
        <ProductList products={filteredProduct} onAddToCart={onAddToCart} />
      </Section>
      <OrderForm/>
      <Section title="About Us">
        <p>We sell the best tech accesories at affordable prices</p>
      </Section>
    </div>
  );
}

export default App;

// input.addEventListener('change',cb)
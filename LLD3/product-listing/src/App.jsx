import "./App.css";
import ProductList from "./components/ProductList";
import ProductCard from "./components/ProductCard";
import Section from "./components/Section";
import { useState } from "react";
import OrderForm from "./components/OrderForm";
function App() {
  const [searchTerm,setSearchTerm] = useState("");
  const [count,setCount] = useState(0);

  const onAddToCart = (quantity)=>{
    setCount(count+quantity);
  }

  const products = [
    {
      id: 1,
      name: "Wireless mouse",
      price: 599,
      category: "Electronics",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRACyXw5N7dX3aM-YGIcMjVULufbfQMLTstN-4Y9hjGDw&s=10",
    },
    {
      id: 2,
      name: "Wireless keyboard",
      price: 1599,
      category: "Electronics",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTprunAqCBQSvW2KObUDE9JVUVfB5ZwsTvDio9vfaLyPA&s",
    },
    {
      id: 3,
      name: "Laptop Stand",
      price: 2499,
      category: "Electronics",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdyaiA0QntxjUwRL0azD-KKueFOxki01ch_T1zKPOcrQ&s=10",
    },
  ];
  const product1 = {
    id: 1,
    name: "Wireless mouse",
    price: 599,
    category: "Electronics",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRACyXw5N7dX3aM-YGIcMjVULufbfQMLTstN-4Y9hjGDw&s=10",
  };
  const product2 = {
    id: 1,
    name: "Wireless keyboard",
    price: 1599,
    category: "Electronics",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTprunAqCBQSvW2KObUDE9JVUVfB5ZwsTvDio9vfaLyPA&s",
  };

  function handleChange(event){
    // console.log(event.target.value);
    // searchTerm = event.target.value;
    setSearchTerm(event.target.value); 
    console.log("Search Term : ", searchTerm);
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
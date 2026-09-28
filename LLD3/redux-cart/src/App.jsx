import { Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar";
import ProductList from "./features/products/ProductList";
import CartPage from "./features/cart/CartPage";

function App() {
  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar/>
      <Routes>
        <Route element={<ProductList />} path="/" />
        <Route element={<CartPage/>}  path="/cart"/>
      </Routes>
    </div>
  );
}

export default App;
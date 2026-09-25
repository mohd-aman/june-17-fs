import { Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar";
import ProductList from "./features/products/ProductList";

function App() {
  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar/>
      <Routes>
        <Route element={<ProductList />} path="/" />
        <Route className="text-white p-8 text-center text-xl" element={<div >Cart page coming next class!</div>}  path="/cart"/>
      </Routes>
    </div>
  );
}

export default App;
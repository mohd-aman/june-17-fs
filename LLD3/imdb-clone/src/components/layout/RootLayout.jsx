import { Outlet } from "react-router-dom";
import NavBar from "./Navbar"
import Footer from "./Footer";

function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <NavBar/>
      <main className="flex-1">
        <Outlet/>
      </main>
      <Footer/>
    </div>
  );
}
export default RootLayout;
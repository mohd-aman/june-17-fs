import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Movies from "./pages/Movies";
import MovieDetail from "./pages/MovieDetail";
import ShowSelection from "./pages/ShowSelection";
import Checkout from "./pages/Checkout";
import Ticket from "./pages/Ticket";
import MyBookings from "./pages/MyBookings";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-zinc-950">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/:id" element={<MovieDetail />} />
            <Route
              path="/shows/:id/book"
              element={
                <ProtectedRoute>
                  <ShowSelection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout/:bookingId"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings/ticket/:id"
              element={
                <ProtectedRoute>
                  <Ticket />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my/bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
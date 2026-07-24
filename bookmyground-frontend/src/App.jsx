import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";


// Public Pages
import Home from "./components/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";

// User Pages
import Grounds from "./pages/user/Grounds"; // Ground details + booking
import MyBookings from "./pages/user/MyBookings";

// Admin Pages
import AddGround from "./pages/admin/AddGround";
import UpdateGround from "./pages/admin/UpdateGround";
import DeleteGround from "./pages/admin/DeleteGround";
import TotalGrounds from "./pages/admin/TotalGrounds";

// Route Protection
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />


        {/* Ground Details Page (public view, booking requires login inside page) */}
        <Route path="/ground/:id" element={<Grounds />} />

        {/* User Protected Routes */}
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute role="USER">
              <MyBookings />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/add-ground"
          element={
            <ProtectedRoute role="ADMIN">
              <AddGround />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/update-ground"
          element={
            <ProtectedRoute role="ADMIN">
              <UpdateGround />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/delete-ground"
          element={
            <ProtectedRoute role="ADMIN">
              <DeleteGround />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/grounds"
          element={
            <ProtectedRoute role="ADMIN">
              <TotalGrounds />
            </ProtectedRoute>
          }
        />

        {/* Optional: 404 Page */}
        <Route path="*" element={<p className="text-center mt-5">Page Not Found</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

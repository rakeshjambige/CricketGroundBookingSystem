import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getUser, isLoggedIn, logout } from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-secondary fixed-top shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">BookMyGround</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">

            {/* Guest Links */}
            {!isLoggedIn() && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/") ? "active" : ""}`} to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/login") ? "active" : ""}`} to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/register") ? "active" : ""}`} to="/register">Register</Link>
                </li>
              </>
            )}

            {/* User Links */}
            {isLoggedIn() && user?.role === "USER" && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/") ? "active" : ""}`} to="/">Home</Link>
                </li>
                
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/my-bookings") ? "active" : ""}`} to="/my-bookings">My Bookings</Link>
                </li>
              </>
            )}

            {/* Admin Links */}
            {isLoggedIn() && user?.role === "ADMIN" && (
              <>
                <li className="nav-item">
                  <Link className="btn btn-success me-2" to="/admin/add-ground">Add Ground</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-warning me-2" to="/admin/update-ground">Update Ground</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-danger me-2" to="/admin/delete-ground">Delete Ground</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary me-2" to="/admin/grounds">Total Grounds</Link>
                </li>
              </>
            )}

            {/* Profile / Logout */}
            {isLoggedIn() && (
              <li className="nav-item dropdown">
                <button
                  className="btn btn-light rounded-circle dropdown-toggle d-flex align-items-center justify-content-center"
                  data-bs-toggle="dropdown"
                  style={{ width: "40px", height: "40px" }}
                >
                  <i className="bi bi-person-fill"></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/profile">My Profile</Link></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                </ul>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

import React, { useState } from "react";
import { register } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Role is intentionally not sent from the frontend.
      // Backend will always assign USER during public registration.
      await register({
        name,
        email,
        password,
      });

      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error(error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert("Registration failed: " + error.response.data.message);
      } else {
        alert("Registration failed!");
      }
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-start"
      style={{
        minHeight: "80vh",
        paddingTop: "80px",
        background: "#f4f6f8",
      }}
    >
      <div
        className="card p-4 shadow-sm"
        style={{
          width: "350px",
          borderRadius: "12px",
        }}
      >
        <h2 className="text-center mb-4">Register</h2>

        <form onSubmit={handleRegister}>
          {/* Name */}
          <div className="mb-3">
            <label className="form-label">Name</label>

            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>

            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>

            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>

            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
          >
            Register
          </button>

          {/* Login Link */}
          <p className="text-center mb-0">
            Already registered?{" "}
            <Link
              to="/login"
              className="text-decoration-none fw-semibold"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
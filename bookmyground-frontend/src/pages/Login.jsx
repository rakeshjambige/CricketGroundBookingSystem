import React, { useState, useEffect } from "react";
import { login } from "../api/authApi";
import { saveUser, saveToken, getUser, isLoggedIn } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn()) {
      const user = getUser();
      if (user.role === "ADMIN") {
        navigate("/admin/grounds"); // Admin dashboard
      } else {
        navigate("/grounds");       // User dashboard
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });

      // Save token and user info
      saveToken(res.token);
      saveUser(res.user);

      // Redirect based on role
      if (res.user.role === "ADMIN") {
        navigate("/admin/grounds");
      } else {
        navigate("/"); // User lands directly on grounds dashboard
      }
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-start"
      style={{ minHeight: "80vh", paddingTop: "80px" }}
    >
      <div className="card p-4 shadow-sm" style={{ width: "350px" }}>
        <h3 className="text-center mb-3">Login</h3>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary w-100">Login</button>
        </form>

        <p className="text-center mt-3">
          New user? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

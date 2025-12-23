import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "../pages/Auth.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/auth/login", form);

      // 🔹 Clear old user token only
      localStorage.removeItem("bw_token");
      localStorage.removeItem("bw_currentUser");

      // ✅ Save current user
      localStorage.setItem(
        "bw_currentUser",
        JSON.stringify({
          id: res.data.userId,
          name: res.data.name,
          email: res.data.email,
        })
      );

      // Always set bw_user_id and token
      localStorage.setItem("bw_user_id", res.data.userId);
      localStorage.setItem("bw_token", res.data.token);

      // update auth context
      login({ id: res.data.userId, name: res.data.name, email: res.data.email });

      navigate("/dashboard");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-decor">
        <div className="blob one"></div>
        <div className="blob two"></div>
      </div>

      <div className="auth-card glass auth-login">
        <div className="auth-brand">
          <div className="brand-logo">💰</div>
          <div className="brand-text">
            <h1>BudgetWise</h1>
            <p>Welcome Back</p>
          </div>
        </div>

        <div className="auth-title">Login</div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <span className="input-icon">📧</span>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <span className="input-icon">🔒</span>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="primary">Login</button>

          <p className="auth-footer">
            Don’t have an account? <Link to="/signup">Signup</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

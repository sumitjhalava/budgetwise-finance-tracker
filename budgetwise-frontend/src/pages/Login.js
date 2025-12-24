import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { BiSolidLogIn, BiEnvelope, BiLockAlt, BiSolidDoughnutChart } from "react-icons/bi";
import "../pages/Auth.css";

import { useAuth } from "../contexts/AuthContext";

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

      // Token handling (Manual)
      localStorage.setItem("bw_token", res.data.token);
      localStorage.setItem("bw_user_id", res.data.email);

      // Context handling (State Update)
      login({
        name: res.data.name,
        email: res.data.email,
        token: res.data.token
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* BRAND LOGO SECTION (Emoji Version) */}
        <div className="auth-brand">
          <div className="brand-logo">💰</div>
          <div className="brand-text">
            <h1>BudgetWise</h1>
            <p>Welcome Back</p>
          </div>
        </div>

        <div className="auth-title">Login</div>

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="input-group">
            <label className="input-label">Email</label>
            <div className="input-wrapper">
              <BiEnvelope className="field-icon" />
              <input
                className="input-field"
                name="email"
                type="email"
                placeholder="Enter your email"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-wrapper">
              <BiLockAlt className="field-icon" />
              <input
                className="input-field"
                name="password"
                type="password"
                placeholder="Enter your password"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {error && <div className="auth-error" style={{ color: '#ef4444', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

          <button className="auth-btn" style={{ background: 'linear-gradient(135deg, #f43f5e, #e11d48)', boxShadow: '0 10px 25px rgba(225, 29, 72, 0.3)' }}>Login</button>

          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Signup</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

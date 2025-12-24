import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { BiSolidUserPlus, BiUser, BiEnvelope, BiLockAlt, BiSolidDoughnutChart } from "react-icons/bi";
import "../pages/Auth.css";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!emailRegex.test(form.email)) {
      setErrors({ email: "Invalid email format" });
      return;
    }

    if (!passwordRegex.test(form.password)) {
      setErrors({
        email:
          "Password must be 8+ chars, include upper, lower, number & symbol",
      });
      return;
    }

    try {
      await api.post("/api/auth/signup", form);
      navigate("/login");
    } catch (err) {
      const backendError =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Signup failed";
      setErrors({ email: backendError });
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
            <p>Manage your finances easily</p>
          </div>
        </div>

        <div className="auth-title">Create Account</div>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="input-group">
            <label className="input-label">Username</label>
            <div className="input-wrapper">
              <BiUser className="field-icon" />
              <input
                className="input-field"
                name="name"
                placeholder="Enter your username"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
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

          {/* Password */}
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

          {errors.email && <div className="auth-error" style={{ color: '#ef4444', marginBottom: '15px', fontSize: '13px', textAlign: 'center' }}>{errors.email}</div>}

          <button className="auth-btn" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)' }}>
            Create Account
          </button>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;

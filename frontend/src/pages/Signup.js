import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "../pages/Auth.css";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", income: "", savingsTarget: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();

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
        password:
          "Password must be 8+ chars, include upper, lower, number & symbol",
      });
      return;
    }

    try {
      const signupData = {
        ...form,
        income: form.income ? parseFloat(form.income) : null,
        savingsTarget: form.savingsTarget ? parseFloat(form.savingsTarget) : null,
      };

      const res = await api.post("/api/auth/signup", signupData);

      localStorage.removeItem("bw_token");
      localStorage.removeItem("bw_currentUser");

      localStorage.setItem(
        "bw_currentUser",
        JSON.stringify({
          id: res.data.userId,
          name: res.data.name,
          email: res.data.email,
        })
      );

      localStorage.setItem("bw_user_id", res.data.userId);
      localStorage.setItem("bw_token", res.data.token);

      // update auth context so protected routes work immediately
      login({ id: res.data.userId, name: res.data.name, email: res.data.email });

      navigate("/dashboard");
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Signup failed";
      setErrors({ 
        email: errorMsg,
        password: errorMsg 
      });
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-decor">
        <div className="blob one"></div>
        <div className="blob two"></div>
      </div>

      <div className="auth-card glass auth-signup">
        <div className="auth-brand">
          <div className="brand-logo">💰</div>
          <div className="brand-text">
            <h1>BudgetWise</h1>
            <p>Manage your finances easily</p>
          </div>
        </div>

        <div className="auth-title">Create Account</div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <span className="input-icon">👤</span>
            <input
              name="name"
              placeholder="Enter your username"
              onChange={handleChange}
              required
              value={form.name}
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <span className="input-icon">📧</span>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
              value={form.email}
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
              value={form.password}
            />
          </div>

          <div className="input-group">
            <label>Monthly Income (optional)</label>
            <span className="input-icon">💲</span>
            <input
              name="income"
              type="number"
              placeholder="Enter your monthly income"
              onChange={handleChange}
              value={form.income}
              min="0"
              step="0.01"
            />
          </div>

          <div className="input-group">
            <label>Savings Target (optional)</label>
            <span className="input-icon">🎯</span>
            <input
              name="savingsTarget"
              type="number"
              placeholder="Enter your savings target"
              onChange={handleChange}
              value={form.savingsTarget}
              min="0"
              step="0.01"
            />
          </div>

          {errors.email && <div className="auth-error">{errors.email}</div>}
          {errors.password && <div className="auth-error">{errors.password}</div>}

          <button className="primary">Create Account</button>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;

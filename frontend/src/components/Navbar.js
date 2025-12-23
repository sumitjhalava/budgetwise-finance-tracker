import React from "react";
import { Link } from "react-router-dom";
import { useUI } from "../contexts/UIContext";
import "./Navbar.css";

const Navbar = () => {
  const { theme, toggleTheme } = useUI();

  return (
    <nav className="navbar">
      <div className="brand">BudgetWise</div>

      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/signup" className="nav-link">Signup</Link>
        <Link to="/login" className="nav-link">Login</Link>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

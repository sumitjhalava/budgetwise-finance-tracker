import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContext";
import "./Navbar.css";

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="navbar">
      <div className="brand">BudgetWise</div>

      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/signup" className="nav-link">Signup</Link>
        <Link to="/login" className="nav-link">Login</Link>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

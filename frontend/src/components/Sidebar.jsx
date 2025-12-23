import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("bw_token");
    localStorage.removeItem("bw_currentUser");
    localStorage.removeItem("bw_user_id");

    onClose?.();
    navigate("/login");
  };

  return (
    <>
      {open && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">BudgetWise</div>

        <nav className="side-nav">
          <Link to="/dashboard" onClick={onClose}>Dashboard</Link>
          <Link to="/overview" onClick={onClose}>Overview</Link>
          <Link to="/expenses" onClick={onClose}>Expenses</Link>
          <Link to="/budget" onClick={onClose}>Budget</Link>
          <Link to="/tools" onClick={onClose}>Data Tools & Forum</Link>
          <Link to="/profile" onClick={onClose}>Profile</Link>
          
        </nav>

        {/* ✅ LOGOUT */}
        <div style={{ padding: "16px" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              background: "#ef4444",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        <div className="side-footer">Made with ❤️</div>
      </aside>
    </>
  );
};

export default Sidebar;

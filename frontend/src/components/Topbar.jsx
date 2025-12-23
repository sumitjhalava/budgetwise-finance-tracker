import React from "react";
import { useNavigate } from "react-router-dom";
import "./Topbar.css";

const Topbar = ({ title = "", onMenu }) => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(
    localStorage.getItem("bw_currentUser") || "null"
  );

  const handleLogout = () => {
    localStorage.removeItem("bw_token");
    localStorage.removeItem("bw_currentUser");
    localStorage.removeItem("bw_user_id");

    navigate("/login");
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button className="menu-btn" onClick={onMenu}>☰</button>
        <div className="topbar-title">{title}</div>
      </div>

      <div className="topbar-right">
        <span className="user-name">
          {currentUser?.name || "Guest"}
        </span>
        <button
          onClick={handleLogout}
          className="menu-btn"
          style={{ marginLeft: "12px" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;

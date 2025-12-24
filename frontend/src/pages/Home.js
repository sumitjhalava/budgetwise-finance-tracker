import React from "react";
import templateImg from "../assets/template.jpg";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-wrapper">
      <img src={templateImg} alt="Background" className="home-bg" />

      <div className="content-box">
        <h1>Welcome to BudgetWise</h1>
        <p>Use this app to track your expenses and savings.</p>
      </div>
    </div>
  );
}

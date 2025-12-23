import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Overview() {
  const [profile, setProfile] = useState({});
  const [expenses, setExpenses] = useState([]);

  const user = JSON.parse(localStorage.getItem("bw_currentUser")) || {};
  const userId = localStorage.getItem("bw_user_id");

  useEffect(() => {
    if (!userId) return;

    // ✅ Load profile (budget + savings)
    const profileKey = user.email
      ? "bw_profile_" + user.email
      : "bw_profile_guest";

    const savedProfile = JSON.parse(localStorage.getItem(profileKey) || "{}");
    setProfile(savedProfile);

    // ✅ Load expenses from Spring Boot API
    const fetchExpenses = async () => {
      try {
        const res = await api.get(`/api/transactions`);
        setExpenses(res.data || []);
      } catch (err) {
        console.error("Overview expense fetch error:", err);
      }
    };

    fetchExpenses();
  }, [userId, user.email]);

  // ---------------- CALCULATIONS ----------------

  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const monthlyBudget = Number(profile.income || 0);
  const remaining = monthlyBudget - totalSpent;
  const transactions = expenses.length;

  const categoryMap = {};
  expenses.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + Number(e.amount);
  });

  const topCategory =
    Object.keys(categoryMap).length === 0
      ? "None"
      : Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0][0];

  const savingsTarget = Number(profile.savingsTarget || 0);
  const savingsProgress = savingsTarget
    ? Math.min(100, Math.round(((monthlyBudget - totalSpent) / savingsTarget) * 100))
    : 0;

  return (
    <div
      style={{
        padding: "35px",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fafc, #eef2f7)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "34px", fontWeight: "800", color: "#0f172a" }}>
          Overview
        </h1>
        <p style={{ color: "#64748b", marginTop: "6px" }}>
          Track your spending and savings at a glance
        </p>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "26px",
        }}
      >
        <OverviewCard
          title="Total Spent"
          value={`₹${totalSpent}`}
          icon="💸"
          color="#ef4444"
        />
        <OverviewCard
          title="Monthly Budget"
          value={`₹${monthlyBudget}`}
          icon="📊"
          color="#3b82f6"
        />
        <OverviewCard
          title="Remaining"
          value={`₹${remaining < 0 ? 0 : remaining}`}
          icon="💰"
          color="#16a34a"
        />
        <OverviewCard
          title="Transactions"
          value={transactions}
          icon="🧾"
          color="#8b5cf6"
        />
        <OverviewCard
          title="Top Category"
          value={topCategory}
          icon="🏷️"
          color="#f59e0b"
        />
        <OverviewCard
          title="Savings Progress"
          value={savingsTarget ? `${savingsProgress}%` : "Not Set"}
          icon="📈"
          color="#10b981"
        />
      </div>
    </div>
  );
}

/* 🌟 Enhanced Card (UI ONLY) */
function OverviewCard({ title, value, icon, color }) {
  return (
    <div
      style={{
        padding: "24px",
        borderRadius: "20px",
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.05)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        transition: "0.25s ease",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "4px",
          width: "100%",
          background: color,
        }}
      />
      <div
        style={{
          width: "54px",
          height: "54px",
          borderRadius: "14px",
          background: `${color}22`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          marginBottom: "16px",
        }}
      >
        {icon}
      </div>
      <h3 style={{ color: "#334155", marginBottom: "6px" }}>{title}</h3>
      <p style={{ fontSize: "28px", fontWeight: "800", color }}>{value}</p>
    </div>
  );
}

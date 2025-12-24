import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./Overview.css";

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

  // 1. Calculate Income (Profile + Transactions)
  const staticIncome = Number(profile.income || 0);
  const transactionIncome = expenses
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const monthlyBudget = staticIncome + transactionIncome;

  // 2. Calculate Expense (Only type !== 'income')
  const totalSpent = expenses
    .filter(e => e.type !== 'income')
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const remaining = monthlyBudget - totalSpent;
  const transactions = expenses.length;

  const categoryMap = {};
  expenses
    .filter(e => e.type !== 'income') // Only map expenses
    .forEach((e) => {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + Number(e.amount);
    });

  const topCategory =
    Object.keys(categoryMap).length === 0
      ? "None"
      : Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0][0];

  const savingsTarget = Number(profile.savingsTarget || 0);
  const savingsProgress = savingsTarget
    ? Math.min(100, Math.round(((remaining) / savingsTarget) * 100))
    : 0;

  return (
    <div className="overview-page">
      {/* Header */}
      <div className="overview-header">
        <h1 className="overview-title">
          Overview
        </h1>
        <p className="overview-subtitle">
          Track your spending and savings at a glance
        </p>
      </div>

      {/* Grid */}
      <div className="overview-grid">
        <OverviewCard
          title="Total Spent"
          value={`₹${totalSpent}`}
          icon="💸"
          color="#ef4444"
        />
        <OverviewCard
          title="Total Income"
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

/* 🌟 Enhanced Card (Styled in CSS) */
function OverviewCard({ title, value, icon, color }) {
  return (
    <div className="overview-card">
      <div className="card-top-bar" style={{ background: color }} />
      <div className="card-icon" style={{ background: `${color}22`, color: color }}>
        {icon}
      </div>
      <h3 className="card-title">{title}</h3>
      <p className="card-value" style={{ color: color }}>{value}</p>
    </div>
  );
}

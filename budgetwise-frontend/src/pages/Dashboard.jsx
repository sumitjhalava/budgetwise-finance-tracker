import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { BiSolidCreditCardAlt, BiSolidWallet, BiSolidCoinStack } from "react-icons/bi";
import { FaBars } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import "./DashboardModern.css";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({
    totalSpent: 0,
    monthlyBudget: 0,
    remaining: 0,
    byCategory: [],
    savingsPercent: 0,
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("bw_currentUser")) || {};
  const userId = localStorage.getItem("bw_user_id");
  const token = localStorage.getItem("bw_token");

  const COLORS = [
    "#0ea5e9",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#a855f7",
    "#f43f5e",
  ];

  useEffect(() => {
    if (!userId || !token) return;

    const fetchDashboard = async () => {
      try {
        const res = await api.get(`/api/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const expensesData = res.data || [];
        setExpenses(expensesData);

        const profileKey = user.email
          ? "bw_profile_" + user.email
          : "bw_profile_guest";

        const profile = JSON.parse(localStorage.getItem(profileKey) || "{}");

        // 1. Calculate Income from Profile (Static)
        const staticIncome = Number(profile.income || 0);

        // 2. Calculate Income from Transactions (Dynamic)
        const transactionIncome = expensesData
          .filter(e => e.type === 'income')
          .reduce((sum, e) => sum + Number(e.amount || 0), 0);

        // Total Budget = Static + Dynamic
        const monthlyBudget = staticIncome + transactionIncome;

        const savingsTarget = Number(profile.savingsTarget || 0);

        // 3. Calculate Expense (Only type !== 'income')
        const totalSpent = expensesData
          .filter(e => e.type !== 'income')
          .reduce((sum, e) => sum + Number(e.amount || 0), 0);

        const remaining = monthlyBudget - totalSpent;

        const categoryMap = {};
        expensesData
          .filter(e => e.type !== 'income') // Only map expenses to categories
          .forEach((e) => {
            categoryMap[e.category] =
              (categoryMap[e.category] || 0) + Number(e.amount);
          });

        const byCategory = Object.entries(categoryMap).map(
          ([name, value]) => ({ name, value })
        );

        const savingsPercent = savingsTarget
          ? Math.min(100, Math.round((remaining / savingsTarget) * 100))
          : 0;

        setSummary({
          totalSpent,
          monthlyBudget,
          remaining: remaining < 0 ? 0 : remaining,
          byCategory,
          savingsPercent,
        });
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };

    fetchDashboard();
  }, [userId, user.email, token]);

  const chartData = summary.byCategory || [];

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const resize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div className="dashboard-wrapper" style={{ display: "flex" }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="dashboard-container" style={{ flex: 1, minWidth: 0 }}>
        {windowWidth <= 1024 && (
          <div className="mobile-header">
            <FaBars size={24} onClick={() => setSidebarOpen(!sidebarOpen)} />
            <span>BudgetWise</span>
          </div>
        )}

        <h1 className="dashboard-welcome">
          Welcome back, {user.name || "User"}
        </h1>
        <p className="dashboard-subtitle">
          Quick overview of your monthly financial activity.
        </p>

        <div className="cards-grid">
          {/* Total Spent Card */}
          <div className="card">
            <div className="card-content">
              <div className="card-icon-circle">
                <BiSolidCreditCardAlt size={28} color="#0ea5e9" />
              </div>
              <div className="card-text">
                <div className="card-title">Total Spent</div>
                <div className="card-value">₹{summary.totalSpent.toLocaleString()}</div>
              </div>
            </div>
            {/* BIG FLOATING BACKGROUND ICON */}
            <BiSolidCreditCardAlt className="card-bg-icon" />
          </div>

          {/* Monthly Budget Card */}
          <div className="card">
            <div className="card-content">
              <div className="card-icon-circle">
                <BiSolidWallet size={28} color="#22c55e" />
              </div>
              <div className="card-text">
                <div className="card-title">Total Income</div>
                <div className="card-value">₹{summary.monthlyBudget.toLocaleString()}</div>
              </div>
            </div>
            <BiSolidWallet className="card-bg-icon" />
          </div>

          {/* Remaining Card */}
          <div className="card">
            <div className="card-content">
              <div className="card-icon-circle">
                <BiSolidCoinStack size={28} color="#f59e0b" />
              </div>
              <div className="card-text">
                <div className="card-title">Remaining</div>
                <div className="card-value">₹{summary.remaining.toLocaleString()}</div>
              </div>
            </div>
            <BiSolidCoinStack className="card-bg-icon" />
          </div>
        </div>

        {/* CHARTS ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>

          {/* SPENDING BY CATEGORY (PIE) */}
          <div className="chart-card">
            <h3>Spending by Category</h3>
            <ResponsiveContainer height={250}>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={80}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* MONTHLY TRENDS (BAR) */}
          <div className="chart-card">
            <h3>Monthly Trends</h3>
            <ResponsiveContainer height={250}>
              <BarChart data={
                // Aggregate Logic inline or derived
                Object.entries(
                  expenses
                    .filter(e => e.type !== 'income')
                    .reduce((acc, e) => {
                      const date = new Date(e.date);
                      const month = date.toLocaleString('default', { month: 'short' });
                      acc[month] = (acc[month] || 0) + Number(e.amount);
                      return acc;
                    }, {})
                ).map(([name, amount]) => ({ name, amount }))
              }>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        <div className="recent-expenses">
          <h3>Recent Expenses</h3>
          <ul>
            {expenses.slice(0, 5).map((e) => (
              <li key={e.id}>
                {e.date?.slice(0, 10)} — {e.category} — ₹{e.amount}
              </li>
            ))}
          </ul>
        </div>

        <div className="savings-progress">
          <h3>Savings Progress</h3>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${summary.savingsPercent}%` }}
            />
          </div>
          <p>{summary.savingsPercent}% of target</p>
        </div>
      </div>
    </div >
  );
}

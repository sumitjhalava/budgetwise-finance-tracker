import React, { useEffect, useMemo, useState } from "react";
import { transactionAPI } from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { FaMoneyBillWave, FaWallet, FaBars } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import ErrorBoundary from "../components/ErrorBoundary";
import "./DashboardModern.css";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");

  const user = JSON.parse(localStorage.getItem("bw_currentUser")) || {};

  const COLORS = ["#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#a855f7", "#f43f5e"];

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        const res = await transactionAPI.getAll();
        if (!cancelled) setTransactions(res.data || []);
      } catch (err) {
        console.error("Failed to load transactions:", err);
      }
    };
    fetch();
    return () => (cancelled = true);
  }, []);

  // compute totals and groupings
  const { totalExpenses, totalIncome, balance, byCategory, monthlyTrend } = useMemo(() => {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ year: d.getFullYear(), month: d.getMonth(), label: d.toLocaleString(undefined, { month: "short" }) });
    }

    const monthMapExpense = {};
    const monthMapIncome = {};
    months.forEach((m) => {
      monthMapExpense[`${m.year}-${m.month}`] = 0;
      monthMapIncome[`${m.year}-${m.month}`] = 0;
    });

    let expenses = 0;
    let income = 0;
    const categoryMap = {};

    transactions.forEach((t) => {
      const amt = Number(t.amount || 0);
      const type = (t.type || "expense").toLowerCase();

      // date fallback
      const dateStr = t.date || t.createdAt || t.created_at;
      const d = dateStr ? new Date(dateStr) : new Date();
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (type === "income") {
        income += amt;
        if (monthMapIncome[key] !== undefined) monthMapIncome[key] += amt;
      } else {
        expenses += amt;
        if (monthMapExpense[key] !== undefined) monthMapExpense[key] += amt;
      }

      const cat = t.category || t.predictedCategory || "Uncategorized";
      categoryMap[cat] = (categoryMap[cat] || 0) + amt;
    });

    const byCategoryArr = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

    const monthlyTrendArr = months.map((m) => ({
      month: m.label,
      income: Math.round((monthMapIncome[`${m.year}-${m.month}`] || 0) * 100) / 100,
      expense: Math.round((monthMapExpense[`${m.year}-${m.month}`] || 0) * 100) / 100,
    }));

    return {
      totalExpenses: Math.round(expenses * 100) / 100,
      totalIncome: Math.round(income * 100) / 100,
      balance: Math.round((income - expenses) * 100) / 100,
      byCategory: byCategoryArr,
      monthlyTrend: monthlyTrendArr,
    };
  }, [transactions]);

  // profile and savings calculation (load budget from profile into state)
  const profileKey = user.email ? "bw_profile_" + user.email : "bw_profile_guest";
  useEffect(() => {
    const p = JSON.parse(localStorage.getItem(profileKey) || "{}");
    setMonthlyBudget(Number(p.income || 0));
    setBudgetInput(String(p.income || ""));
  }, [profileKey]);

  const profile = JSON.parse(localStorage.getItem(profileKey) || "{}");
  const savingsTarget = Number(profile.savingsTarget || 0);
  const remaining = Math.max(0, monthlyBudget - totalExpenses);
  const savingsPercent = savingsTarget ? Math.min(100, Math.round((remaining / savingsTarget) * 100)) : 0;

  const saveBudget = (val) => {
    const p = JSON.parse(localStorage.getItem(profileKey) || "{}");
    const next = { ...(p || {}), income: Number(val || 0) };
    try {
      localStorage.setItem(profileKey, JSON.stringify(next));
      setMonthlyBudget(Number(val || 0));
      setEditingBudget(false);
    } catch (e) {
      console.error("Failed to save budget", e);
      alert("Unable to save budget in this browser");
    }
  };

  // responsive
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1000);
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const pieWidth = Math.min(420, Math.max(300, Math.floor(windowWidth * 0.3)));
  const barWidth = Math.min(700, Math.max(320, Math.floor(windowWidth * 0.55)));

  return (
    <div className="dashboard-wrapper">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="dashboard-container">
        {windowWidth <= 1024 && (
          <div className="mobile-header">
            <FaBars size={20} onClick={() => setSidebarOpen(!sidebarOpen)} />
            <span>BudgetWise</span>
          </div>
        )}

        <header className="dashboard-header">
          <h1>Welcome back, {user.name || "User"}</h1>
          <p className="muted">Overview of your recent financial activity</p>
        </header>

        <section className="cards-grid">
          <div className="card">
            <div className="card-icon"><FaMoneyBillWave /></div>
            <div className="card-title">Total Expenses</div>
            <div className="card-value">₹{totalExpenses}</div>
          </div>

          <div className="card">
            <div className="card-icon"><FaWallet /></div>
            <div className="card-title">Monthly Budget</div>
            {!editingBudget ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="card-value">₹{monthlyBudget}</div>
                <button className="btn outline" onClick={() => setEditingBudget(true)}>Edit</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="number" value={budgetInput} onChange={(e) => setBudgetInput(e.target.value)} style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <button className="btn" onClick={() => saveBudget(budgetInput)}>Save</button>
                <button className="btn outline" onClick={() => { setEditingBudget(false); setBudgetInput(String(monthlyBudget)); }}>Cancel</button>
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-icon"><FaWallet /></div>
            <div className="card-title">Total Income</div>
            <div className="card-value">₹{totalIncome}</div>
          </div>

          {/* Balance card removed per request */}
        </section>

        <section className="charts-row">
          <div className="chart-card chart-pie" style={{ width: pieWidth }}>
            <h3>Spending by Category</h3>
            <ErrorBoundary>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <PieChart width={pieWidth} height={300}>
                  <Pie data={byCategory} dataKey="value" nameKey="name" cx="50%" cy="45%" outerRadius={90} label>
                    {byCategory.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </div>
            </ErrorBoundary>
          </div>

          <div className="chart-card chart-bar" style={{ width: barWidth }}>
            <h3>Monthly Expense Trend</h3>
            <ErrorBoundary>
              <BarChart width={barWidth} height={320} data={monthlyTrend} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#22c55e" />
                <Bar dataKey="expense" name="Expense" fill="#ef4444" />
              </BarChart>
            </ErrorBoundary>
          </div>
        </section>

        <section className="recent-expenses">
          <h3>Recent Expenses</h3>
          <ul>
            {transactions
              .filter((t) => (t.type || "").toLowerCase() !== "income")
              .slice(0, 8)
              .map((e) => (
                <li key={e.id} className="recent-item">
                  <div className="recent-left">
                    <div className="recent-desc">{e.description || e.category || "Expense"}</div>
                    <div className="recent-meta">{(e.date || e.createdAt || "").slice(0, 10)}</div>
                  </div>
                  <div className="recent-right">₹{e.amount}</div>
                </li>
              ))}
          </ul>
        </section>
        
        <section className="savings-progress" style={{ marginTop: 12 }}>
          <h3>Savings Progress</h3>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${savingsPercent}%` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <div className="muted">Remaining: ₹{remaining}</div>
            <div className="muted">Target: ₹{savingsTarget || 0} — {savingsPercent}%</div>
          </div>
        </section>
      </div>
    </div>
  );
}

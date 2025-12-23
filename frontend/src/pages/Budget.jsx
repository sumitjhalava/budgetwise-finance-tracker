import React, { useState, useEffect, useMemo } from "react";
import "./Budget.css";
import api, { budgetAPI } from "../services/api";


const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Travel",
  "Education",
  "Other"
];


const Budget = () => {
  const [budgets, setBudgets] = useState([]); // [{id, category, budgetLimit}]
  const [transactions, setTransactions] = useState([]);
  const [category, setCategory] = useState("");
  const [budgetLimit, setBudgetLimit] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBudgets();
    fetchTransactions();
    // eslint-disable-next-line
  }, []);

  const fetchBudgets = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/budgets");
      setBudgets(res.data);
    } catch (e) {
      setError("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/api/transactions");
      setTransactions(res.data);
    } catch (e) {
      setError("Failed to load transactions");
    }
  };

  const addBudget = async () => {
    if (!category || !budgetLimit) return;
    setLoading(true);
    setError("");
    try {
      await api.post("/api/budgets", { category, budgetLimit: Number(budgetLimit) });
      setCategory("");
      setBudgetLimit("");
      fetchBudgets();
    } catch (e) {
      setError("Failed to add budget");
    } finally {
      setLoading(false);
    }
  };

  const deleteBudget = async (cat) => {
    setLoading(true);
    setError("");
    try {
      await budgetAPI.delete(cat);
      fetchBudgets();
    } catch (e) {
      console.error("Delete budget failed:", e?.response || e);
      const serverMsg = e?.response?.data?.message || e?.response?.statusText || e.message;
      setError(`Failed to delete budget: ${serverMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // Map budgets to {category: budgetLimit}
  const budgetsMap = useMemo(() => {
    const map = {};
    budgets.forEach(b => { map[b.category] = b.budgetLimit; });
    return map;
  }, [budgets]);

  const categorySpent = useMemo(() => {
    const data = {};
    transactions.forEach(txn => {
      if (txn.type === "expense") {
        data[txn.category] =
          (data[txn.category] || 0) + Number(txn.amount);
      }
    });
    return data;
  }, [transactions]);

  const totalBudget = Object.values(budgetsMap).reduce((a, b) => a + b, 0);
  const totalSpent = Object.values(categorySpent).reduce((a, b) => a + b, 0);
  const remaining = totalBudget - totalSpent;
  const savings = totalBudget > 0 ? Math.max(totalBudget - totalSpent, 0) : 0;

  return (
    <div className="budget-page">
      <div className="budget-container">
        <div className="top-row">
          <div className="left-col">
            {/* SET BUDGET */}
            <div className="budget-card">
              <h3>💰 Set Budget Limits</h3>
              <div className="budget-form">
                <select value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="">-- Select Category --</option>
                  {EXPENSE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Limit ₹"
                  value={budgetLimit}
                  onChange={e => setBudgetLimit(e.target.value)}
                  min="0.01"
                  step="0.01"
                />

                <button onClick={addBudget} disabled={loading || !category || !budgetLimit}>+ Add</button>
              </div>
              {error && <div className="error-msg">{error}</div>}
            </div>
          </div>

          <div className="right-col">
            {/* TOTALS */}
            <div className="summary-card vertical-summary">
              <div className="summary-row"><div className="summary-label">Total Budget</div><div className="summary-amount">₹{totalBudget}</div></div>
              <div className="summary-row"><div className="summary-label">Total Spent</div><div className="summary-amount">₹{totalSpent}</div></div>
              <div className="summary-row"><div className="summary-label">Remaining</div><div className="summary-amount">₹{remaining}</div></div>
              <div className="summary-row"><div className="summary-label">Savings</div><div className="summary-amount">₹{savings}</div></div>
              {loading && <div className="loading-msg">Loading...</div>}
            </div>
          </div>
        </div>

        {/* CATEGORY BREAKDOWN */}
        <div className="budget-card">
          <h3>📊 Category Breakdown</h3>
          <div className="category-grid">
          {budgets.map(budget => {
            const cat = budget.category;
            const spent = categorySpent[cat] || 0;
            const limit = budget.budgetLimit;
            const remaining = limit - spent;
            const percent = Math.min((spent / limit) * 100, 100);
            return (
              <div className="category-box" key={cat}>
                <div className="cat-header">
                  <span>{cat}</span>
                  <button onClick={() => deleteBudget(cat)} disabled={loading}>🗑</button>
                </div>
                <p className={remaining >= 0 ? "ok" : "over"}>
                  {remaining >= 0 ? "On Track" : "Over Budget"}
                </p>
                <div className="numbers">
                  <span>Spent ₹{spent}</span>
                  <span>Limit ₹{limit}</span>
                </div>
                <div className="bar">
                  <div style={{ width: `${percent}%` }} />
                </div>
                <small>{percent.toFixed(0)}% Used</small>
              </div>
            );
          })}
        </div>
      </div>

    </div>
    </div>
  );
};

export default Budget;

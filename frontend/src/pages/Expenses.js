import React, { useEffect, useState, useMemo, useRef } from "react";
import api, { transactionAPI } from "../services/api";
import "./Expenses.css";

export default function Expenses() {
  const [predictedCategory, setPredictedCategory] = useState("");
  const [predicting, setPredicting] = useState(false);
  const predictTimeout = useRef();
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("expense");
  const [date, setDate] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [filterCategory, setFilterCategory] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [clearingAll, setClearingAll] = useState(false);

  const categories = [
    { value: "", label: "All Categories" },
    { value: "Food & Dining", label: "Food & Dining" },
    { value: "Transportation", label: "Transportation" },
    { value: "Shopping", label: "Shopping" },
    { value: "Entertainment", label: "Entertainment" },
    { value: "Bills & Utilities", label: "Bills & Utilities" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Travel", label: "Travel" },
    { value: "Education", label: "Education" },
    { value: "Other", label: "Other" },
  ];

  const categoryEmoji = {
    "Food & Dining": "🍔",
    "Transportation": "🚌",
    "Shopping": "🛍️",
    "Entertainment": "🎬",
    "Bills & Utilities": "💡",
    "Healthcare": "🏥",
    "Travel": "✈️",
    "Education": "🎓",
    "Other": "📦",
  };

  const userId = localStorage.getItem("bw_user_id");

  useEffect(() => {
    if (!userId) {
      alert("You must be logged in!");
      window.location.href = "/login";
      return;
    }
    loadExpenses();
    loadBudgets();
  }, [userId]);

  const loadExpenses = async () => {
    try {
      const res = await api.get(`/api/transactions`);
      setExpenses(res.data);
    } catch {
      alert("Failed to load expenses.");
    }
  };

  const loadBudgets = async () => {
    try {
      const res = await api.get(`/api/budgets`);
      setBudgets(res.data);
    } catch {
      // ignore
    }
  };
  // Calculate spent per category and budget status
  const spentByCategory = useMemo(() => {
    const map = {};
    expenses.forEach(e => {
      if (e.type === "expense") {
        map[e.category] = (map[e.category] || 0) + Number(e.amount);
      }
    });
    return map;
  }, [expenses]);

  const budgetsMap = useMemo(() => {
    const map = {};
    budgets.forEach(b => { map[b.category] = b.budgetLimit; });
    return map;
  }, [budgets]);

  const totalBudget = Object.values(budgetsMap).reduce((a, b) => a + b, 0);
  const totalSpent = Object.values(spentByCategory).reduce((a, b) => a + b, 0);
  const savings = totalBudget > 0 ? Math.max(totalBudget - totalSpent, 0) : 0;

  const resetForm = () => {
    setAmount("");
    setCategory("");
    setDescription("");
    setType("expense");
    setDate("");
    setEditingId(null);
  };

  // Predict category as user types description
  useEffect(() => {
    if (type !== "expense" || !description || description.length < 2) {
      setPredictedCategory("");
      return;
    }
    setPredicting(true);
    if (predictTimeout.current) clearTimeout(predictTimeout.current);
    predictTimeout.current = setTimeout(() => {
      transactionAPI.predictCategory(description)
        .then(res => {
          setPredictedCategory(res.data.predictedCategory || "");
        })
        .catch(() => setPredictedCategory(""))
        .finally(() => setPredicting(false));
    }, 350); // debounce
    // eslint-disable-next-line
  }, [description, type]);

  const handleUsePrediction = () => {
    if (predictedCategory) setCategory(predictedCategory);
  };

  const handleAddOrUpdate = async () => {
    if (!amount || !date || !description) return alert("Fill all fields");

    let entryCategory = category;
    if (type === "income") {
      entryCategory = "Income";
    } else {
      // Always use the label for the selected category value
      const catObj = categories.find(c => c.value === category);
      if (catObj) entryCategory = catObj.label;
    }

    try {
      const payload = {
        description,
        amount: Number(amount),
        type,
        category: entryCategory,
        date,
      };

      if (editingId) {
        await api.put(`/api/transactions/${editingId}`, payload);
      } else {
        await api.post("/api/transactions", payload);
      }
      loadExpenses();
      resetForm();
    } catch (err) {
      console.error("Save expense error:", err);
      alert("Failed to save expense.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    await api.delete(`/api/transactions/${id}`);
    loadExpenses();
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to permanently delete ALL transactions? This cannot be undone.")) return;
    try {
      setClearingAll(true);
      // delete all transactions in parallel, ignore individual failures
      await Promise.all(expenses.map(e => transactionAPI.delete(e.id).catch(() => null)));
      await loadExpenses();
    } catch (err) {
      console.error("Failed clearing transactions:", err);
      alert("Failed to clear all transactions. Check the console for details.");
    } finally {
      setClearingAll(false);
    }
  };

  const handleEdit = (e) => {
    setAmount(e.amount);
    setCategory(e.category);
    setDescription(e.description || "");
    setType(e.type || "expense");
    setDate(e.date);
    setEditingId(e.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  // Separate filtered expenses and income
  const filteredExpenses = expenses.filter((e) => {
    const c = filterCategory ? e.category === filterCategory : true;
    const f = filterFromDate ? e.date >= filterFromDate : true;
    const t = filterToDate ? e.date <= filterToDate : true;
    return c && f && t && e.type === "expense";
  });

  const filteredIncome = expenses.filter((e) => {
    const c = filterCategory ? e.category === filterCategory : true;
    const f = filterFromDate ? e.date >= filterFromDate : true;
    const t = filterToDate ? e.date <= filterToDate : true;
    return c && f && t && e.type === "income";
  });

  const totalExpenseAmount = filteredExpenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );
  const totalIncomeAmount = filteredIncome.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  return (
    <div className="expenses-wrap">
      <div className="add-card card add-card-bg">
        <div className="card-head">
          <h2>{editingId ? "Edit Expense" : "Add Expense"}</h2>
        </div>

        <div className="form-col">
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {type === "expense" && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {categoryEmoji[c.value]} {c.label}
                  </option>
                ))}
              </select>
              {predictedCategory && predictedCategory !== category && (
                <button type="button" className="btn outline" style={{ fontSize: 13, padding: '4px 8px' }} onClick={handleUsePrediction} disabled={predicting}>
                  {predicting ? "Predicting..." : `AI: ${predictedCategory} (Use)`}
                </button>
              )}
            </div>
          )}

          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn primary" onClick={handleAddOrUpdate}>
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button className="btn outline" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="filter-top">
        <div className="filter-controls">
          <div className="filter-item">
            <label>Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {categoryEmoji[c.value]} {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>From</label>
            <input
              type="date"
              value={filterFromDate}
              onChange={(e) => setFilterFromDate(e.target.value)}
            />
          </div>

          <div className="filter-item">
            <label>To</label>
            <input
              type="date"
              value={filterToDate}
              onChange={(e) => setFilterToDate(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-actions">
          <button className="btn clear" onClick={() => { setFilterCategory(''); setFilterFromDate(''); setFilterToDate(''); }}>
            Clear Filters
          </button>
          <button
            className="btn danger"
            onClick={handleClearAll}
            disabled={clearingAll}
          >
            {clearingAll ? 'Clearing...' : 'Reset All'}
          </button>
        </div>

        <div className="filter-total">Total Expenses: ₹{totalExpenseAmount} | Total Income: ₹{totalIncomeAmount}</div>
      </div>

      {/* Summary removed per request */}
      <h3 className="list-heading">Expenses</h3>
      <ul className="expenses-list">
        {filteredExpenses.length ? (
          filteredExpenses.map((e) => (
            <li key={e.id} className="expense-row">
              <div className="left">
                <span className={`badge ${e.category}`}>
                  {categoryEmoji[e.category]} {e.category}
                </span>
                <span className="meta">{e.date}</span>
                {budgetsMap[e.category] !== undefined && (
                  <span style={{marginLeft:8, fontSize:12, color: spentByCategory[e.category] > budgetsMap[e.category] ? 'red' : 'green'}}>
                    {spentByCategory[e.category] > budgetsMap[e.category] ? 'Over Budget' : 'On Track'}
                  </span>
                )}
              </div>

              <div className="right">
                <span className="amount">₹{e.amount}</span>
                <button className="delete" onClick={() => handleEdit(e)}>✏️</button>
                <button className="delete" onClick={() => handleDelete(e.id)}>❌</button>
              </div>
            </li>
          ))
        ) : (
          <li className="empty">No expenses found</li>
        )}
      </ul>

      <h3 className="list-heading">Income</h3>
      <ul className="expenses-list">
        {filteredIncome.length ? (
          filteredIncome.map((e) => (
            <li key={e.id} className="expense-row">
              <div className="left">
                <span className={`badge ${e.category}`}>
                  {categoryEmoji[e.category]} {e.category}
                </span>
                <span className="meta">{e.date}</span>
              </div>
              <div className="right">
                <span className="amount">₹{e.amount}</span>
                <button className="delete" onClick={() => handleEdit(e)}>✏️</button>
                <button className="delete" onClick={() => handleDelete(e.id)}>❌</button>
              </div>
            </li>
          ))
        ) : (
          <li className="empty">No income found</li>
        )}
      </ul>
    </div>
  );
}

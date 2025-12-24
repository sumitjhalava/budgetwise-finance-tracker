import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./Expenses.css";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [filterCategory, setFilterCategory] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");

  const expenseCategories = [
    { value: "", label: "All Categories" },
    { value: "food", label: "Food" },
    { value: "shopping", label: "Shopping" },
    { value: "healthcare", label: "Healthcare" },
    { value: "entertainment", label: "Entertainment" },
    { value: "travel", label: "Travel" },
    { value: "bills", label: "Bills" },
  ];

  const incomeCategories = [
    { value: "", label: "All Sources" },
    { value: "salary", label: "Salary" },
    { value: "bonus", label: "Bonus" },
    { value: "freelance", label: "Freelance" },
    { value: "investment", label: "Investment" },
    { value: "gift", label: "Gift" },
    { value: "other", label: "Other" },
  ];

  const categoryEmoji = {
    food: "🍔",
    shopping: "🛍️",
    healthcare: "🏥",
    entertainment: "🎬",
    travel: "✈️",
    bills: "💡",
    salary: "💼",
    bonus: "🎉",
    freelance: "💻",
    investment: "📈",
    gift: "🎁",
    other: "💰",
  };

  const userId = localStorage.getItem("bw_user_id");
  const token = localStorage.getItem("bw_token");

  useEffect(() => {
    if (!userId) {
      alert("You must be logged in!");
      window.location.href = "/login";
      return;
    }
    loadExpenses();
  }, [userId, token]);

  const loadExpenses = async () => {
    try {
      const res = await api.get(`/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch {
      alert("Failed to load expenses.");
    }
  };

  const [type, setType] = useState("expense"); // New: 'income' or 'expense'

  // ... (existing constants)

  const resetForm = () => {
    setAmount("");
    setDescription("");
    setCategory("");
    setDate("");
    setType("expense"); // Reset type
    setEditingId(null);
  };

  const handleAddOrUpdate = async () => {
    if (!amount || !category || !date) return alert("Fill all fields");

    const transactionData = { amount, description, category, date, type }; // Use selected type

    try {
      if (editingId) {
        await api.put(
          `/api/transactions/${editingId}`,
          transactionData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await api.post(
          "/api/transactions",
          transactionData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      loadExpenses();
      resetForm();
    } catch {
      alert("Failed to save transaction.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    await api.delete(`/api/transactions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    loadExpenses();
  };

  const handleEdit = (e) => {
    setAmount(e.amount);
    setCategory(e.category);
    setDate(e.date);
    setType(e.type || "expense"); // Set type for editing
    setEditingId(e.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredExpenses = expenses.filter((e) => {
    const c = filterCategory ? e.category === filterCategory : true;
    const f = filterFromDate ? e.date >= filterFromDate : true;
    const t = filterToDate ? e.date <= filterToDate : true;
    return c && f && t;
  });

  // Calculate Total (Income - Expense) or just display logic?
  // User just wants "Total Income" on dashboard, here maybe just show filtered sum?
  // Let's keep total logic simple for now or update it to be Net Balance?
  // The current code sums everything. Let's make it sum nicely: Income - Expense.

  const totalAmount = filteredExpenses.reduce((sum, e) => {
    return e.type === "income"
      ? sum + Number(e.amount)
      : sum - Number(e.amount);
  }, 0);

  return (
    <div className="expenses-wrap">
      <div className="add-card card add-card-bg">
        <div className="card-head">
          <h2>{editingId ? "Edit Transaction" : "Add Transaction"}</h2>
        </div>

        <div className="form-col">
          {/* TYPE SELECTOR */}
          <div className="type-toggle" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <button
              className={`btn ${type === 'expense' ? 'primary' : 'outline'}`}
              onClick={() => { setType('expense'); setCategory(''); }}
              style={{ flex: 1, borderColor: '#ef4444', color: type === 'expense' ? '#fff' : '#ef4444', background: type === 'expense' ? '#ef4444' : 'transparent' }}
            >
              Expense
            </button>
            <button
              className={`btn ${type === 'income' ? 'primary' : 'outline'}`}
              onClick={() => { setType('income'); setCategory(''); }}
              style={{ flex: 1, borderColor: '#10b981', color: type === 'income' ? '#fff' : '#10b981', background: type === 'income' ? '#10b981' : 'transparent' }}
            >
              Income
            </button>
          </div>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            type="text"
            placeholder="Description (e.g. Salary, Lunch)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {(type === 'income' ? incomeCategories : expenseCategories).map((c) => (
              <option key={c.value} value={c.value}>
                {categoryEmoji[c.value]} {c.label}
              </option>
            ))}
          </select>

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
              <option value="">All Categories</option>
              {/* Combine lists for filter or just show what's relevant? Showing all is safer for history */}
              {[...expenseCategories.slice(1), ...incomeCategories.slice(1)].map((c) => (
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

          <button
            className="btn outline"
            onClick={() => {
              setFilterCategory("");
              setFilterFromDate("");
              setFilterToDate("");
            }}
            style={{ padding: '8px 12px', fontSize: '12px', height: 'fit-content', alignSelf: 'flex-end', marginLeft: 'auto' }}
          >
            Clear Filters 🔄
          </button>
        </div>

        <div className="filter-total">Total: ₹{totalAmount}</div>
      </div>

      <h3 className="list-heading">Expenses List</h3>
      <ul className="expenses-list">
        {filteredExpenses.length ? (
          filteredExpenses.map((e) => (
            <li key={e.id} className="expense-row">
              <div className="left">
                <span className={`badge ${e.category}`}>
                  {categoryEmoji[e.category]} {e.category}
                </span>
                <div>
                  <span className="meta" style={{ marginRight: '10px', fontWeight: 'bold' }}>{e.description}</span>
                  <span className="meta">{e.date}</span>
                </div>
              </div>

              <div className="right">
                <span className="amount" style={{ color: e.type === 'income' ? '#10b981' : '#ef4444' }}>
                  {e.type === 'income' ? '+' : '-'}₹{e.amount}
                </span>
                <button className="delete" onClick={() => handleEdit(e)}>✏️</button>
                <button className="delete" onClick={() => handleDelete(e.id)}>❌</button>
              </div>
            </li>
          ))
        ) : (
          <li className="empty">No expenses found</li>
        )}
      </ul>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./Expenses.css";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("expense");
  const [date, setDate] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [filterCategory, setFilterCategory] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");

  const categories = [
    { value: "", label: "All Categories" },
    { value: "food", label: "Food" },
    { value: "shopping", label: "Shopping" },
    { value: "healthcare", label: "Healthcare" },
    { value: "entertainment", label: "Entertainment" },
    { value: "travel", label: "Travel" },
    { value: "bills", label: "Bills" },
  ];

  const categoryEmoji = {
    food: "🍔",
    shopping: "🛍️",
    healthcare: "🏥",
    entertainment: "🎬",
    travel: "✈️",
    bills: "💡",
  };

  const userId = localStorage.getItem("bw_user_id");

  useEffect(() => {
    if (!userId) {
      alert("You must be logged in!");
      window.location.href = "/login";
      return;
    }
    loadExpenses();
  }, [userId]);

  const loadExpenses = async () => {
    try {
      const res = await api.get(`/api/transactions`);
      setExpenses(res.data);
    } catch {
      alert("Failed to load expenses.");
    }
  };

  const resetForm = () => {
    setAmount("");
    setCategory("");
    setDescription("");
    setType("expense");
    setDate("");
    setEditingId(null);
  };

  const handleAddOrUpdate = async () => {
    if (!amount || !category || !date || !description) return alert("Fill all fields");

    try {
      const payload = {
        description,
        amount: Number(amount),
        type,
        category,
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

  const handleEdit = (e) => {
    setAmount(e.amount);
    setCategory(e.category);
    setDescription(e.description || "");
    setType(e.type || "expense");
    setDate(e.date);
    setEditingId(e.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredExpenses = expenses.filter((e) => {
    const c = filterCategory ? e.category === filterCategory : true;
    const f = filterFromDate ? e.date >= filterFromDate : true;
    const t = filterToDate ? e.date <= filterToDate : true;
    return c && f && t;
  });

  const totalAmount = filteredExpenses.reduce(
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

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
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
          <li className="empty">No expenses found</li>
        )}
      </ul>
    </div>
  );
}
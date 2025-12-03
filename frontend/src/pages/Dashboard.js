import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import MonthlySummaryPanel from '../components/MonthlySummaryPanel';
import { transactionAPI } from '../services/api';

const Dashboard = ({ user, setUser }) => {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    date: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0, expensesByCategory: {} });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = {
    expense: ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare', 'Travel', 'Education', 'Other'],
    income: ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other']
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!newTransaction.description || !newTransaction.amount || !newTransaction.category) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const transactionData = {
        ...newTransaction,
        amount: parseFloat(newTransaction.amount),
        date: newTransaction.date || new Date().toISOString().split('T')[0]
      };
      
      await transactionAPI.create(transactionData);
      await loadTransactions();
      setNewTransaction({ description: '', amount: '', type: 'expense', category: '', date: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
      setError('Failed to add transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      const response = await transactionAPI.getAll();
      setTransactions(response.data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const loadSummary = async () => {
    try {
      const response = await transactionAPI.getSummary();
      return response.data;
    } catch (error) {
      console.error('Error loading summary:', error);
      return { totalIncome: 0, totalExpenses: 0, balance: 0, expensesByCategory: {} };
    }
  };

  useEffect(() => {
    if (user) {
      // Clear previous user's data first
      setTransactions([]);
      setSummary({ totalIncome: 0, totalExpenses: 0, balance: 0, expensesByCategory: {} });
      setError('');
      
      // Load fresh data for current user
      loadTransactions();
    }
  }, [user]); // Reload when user changes

  useEffect(() => {
    const fetchSummary = async () => {
      const summaryData = await loadSummary();
      setSummary(summaryData);
    };
    fetchSummary();
  }, [transactions]);

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  const { totalIncome, totalExpenses, balance, expensesByCategory } = summary;



  const cardStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f1f5f9',
    marginBottom: '1.5rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '0.95rem',
    transition: 'border-color 0.2s',
    outline: 'none'
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  return (
    <Layout user={user} setUser={setUser}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>Financial Dashboard</h1>
            <p style={{ color: '#64748b' }}>Track your expenses and manage your budget</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              ...buttonStyle,
              backgroundColor: '#3b82f6',
              color: 'white'
            }}
          >
            ➕ Add Transaction
          </button>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ opacity: 0.9, marginBottom: '0.5rem' }}>Total Income</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>${totalIncome.toLocaleString()}</p>
              </div>
              <div style={{ fontSize: '2.5rem', opacity: 0.8 }}>📈</div>
            </div>
          </div>
          
          <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ opacity: 0.9, marginBottom: '0.5rem' }}>Total Expenses</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>${totalExpenses.toLocaleString()}</p>
              </div>
              <div style={{ fontSize: '2.5rem', opacity: 0.8 }}>📉</div>
            </div>
          </div>
          
          <div style={{ 
            ...cardStyle, 
            background: balance >= 0 
              ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' 
              : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ opacity: 0.9, marginBottom: '0.5rem' }}>Net Balance</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  ${Math.abs(balance).toLocaleString()}
                </p>
              </div>
              <div style={{ fontSize: '2.5rem', opacity: 0.8 }}>💰</div>
            </div>
          </div>
        </div>

        {/* Monthly Summary */}
        <MonthlySummaryPanel user={user} />

        {/* Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={cardStyle}>
            <h3 style={{ marginBottom: '1rem', color: '#1e293b', fontSize: '1.2rem' }}>📊 Expense Breakdown</h3>
            {Object.keys(expensesByCategory).length > 0 ? (
              <div style={{ padding: '1rem' }}>
                {Object.entries(expensesByCategory).map(([category, amount], index) => {
                  const percentage = ((amount / totalExpenses) * 100).toFixed(1);
                  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
                  return (
                    <div key={category} style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{category}</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>${amount.toFixed(2)} ({percentage}%)</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: colors[index % colors.length], borderRadius: '4px' }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
                  <p>No expense data available</p>
                </div>
              </div>
            )}
          </div>
          
          <div style={cardStyle}>
            <h3 style={{ marginBottom: '1rem', color: '#1e293b', fontSize: '1.2rem' }}>📈 Quick Stats</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Avg Income</p>
                <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#10b981' }}>${(totalIncome / Math.max(transactions.filter(t => t.type === 'income').length, 1)).toFixed(0)}</p>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💸</div>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Avg Expense</p>
                <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#ef4444' }}>${(totalExpenses / Math.max(transactions.filter(t => t.type === 'expense').length, 1)).toFixed(0)}</p>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Total Transactions</p>
                <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#3b82f6' }}>{transactions.length}</p>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#fefce8', borderRadius: '8px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Savings Rate</p>
                <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#f59e0b' }}>{totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Transaction Form Modal */}
        {showAddForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ color: '#1e293b', fontSize: '1.5rem' }}>Add New Transaction</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#64748b'
                  }}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleAddTransaction}>
                <input
                  type="text"
                  placeholder="Transaction description"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  style={inputStyle}
                  required
                />
                
                <input
                  type="number"
                  placeholder="Amount"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  style={inputStyle}
                  step="0.01"
                  min="0.01"
                  required
                />
                
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                  style={inputStyle}
                />
                
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value, category: '' })}
                  style={inputStyle}
                >
                  <option value="expense">💸 Expense</option>
                  <option value="income">💰 Income</option>
                </select>
                
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                  style={inputStyle}
                  required
                >
                  <option value="">Select Category</option>
                  {categories[newTransaction.type].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                
                {error && (
                  <div style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    {error}
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    style={{
                      ...buttonStyle,
                      backgroundColor: '#e2e8f0',
                      color: '#475569',
                      flex: 1
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      ...buttonStyle,
                      backgroundColor: loading ? '#94a3b8' : '#3b82f6',
                      color: 'white',
                      flex: 1,
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? 'Adding...' : 'Add Transaction'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Transactions Section */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#1e293b', fontSize: '1.5rem' }}>Recent Transactions</h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{
                  padding: '0.5rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '6px',
                  backgroundColor: 'white'
                }}
              >
                <option value="all">All Transactions</option>
                <option value="income">Income Only</option>
                <option value="expense">Expenses Only</option>
              </select>
            </div>
          </div>
          
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {filteredTransactions.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem',
                color: '#64748b',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '2px dashed #cbd5e1'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>💳</div>
                <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No transactions yet</p>
                <p>Start by adding your first transaction!</p>
              </div>
            ) : (
              filteredTransactions.map(transaction => (
                <div
                  key={transaction.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    marginBottom: '0.5rem',
                    borderRadius: '8px',
                    backgroundColor: transaction.type === 'income' ? '#f0fdf4' : '#fef2f2',
                    border: `1px solid ${transaction.type === 'income' ? '#bbf7d0' : '#fecaca'}`,
                    transition: 'transform 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: transaction.type === 'income' ? '#10b981' : '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.2rem'
                    }}>
                      {transaction.type === 'income' ? '💰' : '💸'}
                    </div>
                    <div>
                      <p style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#1e293b' }}>
                        {transaction.description}
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                        {transaction.category} • {new Date(transaction.date || transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      color: transaction.type === 'income' ? '#10b981' : '#ef4444'
                    }}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
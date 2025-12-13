import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import { transactionAPI } from '../services/api';

const Transactions = ({ user, setUser }) => {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    date: ''
  });
  const [predictedCategory, setPredictedCategory] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = {
    expense: ['Food & Dining', 'Shopping', 'Transport', 'Health', 'Bills & Utilities', 'Entertainment', 'Education', 'Travel', 'Other'],
    income: ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other']
  };

  const loadTransactions = useCallback(async () => {
    try {
      const response = await transactionAPI.getAll();
      setTransactions(response.data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  }, []);

  useEffect(() => {
    if (user) {
      setTransactions([]);
      setError('');
      loadTransactions();
    }
  }, [user, loadTransactions]);

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
      setPredictedCategory('');
      setConfidence(0);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
      setError('Failed to add transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction({
      ...transaction,
      date: transaction.date || new Date(transaction.createdAt).toISOString().split('T')[0]
    });
    setShowEditForm(true);
  };

  const handleUpdateTransaction = async (e) => {
    e.preventDefault();
    if (!editingTransaction.description || !editingTransaction.amount || !editingTransaction.category) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const transactionData = {
        description: editingTransaction.description,
        amount: parseFloat(editingTransaction.amount),
        type: editingTransaction.type,
        category: editingTransaction.category,
        date: editingTransaction.date
      };
      
      await transactionAPI.update(editingTransaction.id, transactionData);
      await loadTransactions();
      setEditingTransaction(null);
      setShowEditForm(false);
    } catch (error) {
      console.error('Error updating transaction:', error);
      setError('Failed to update transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      await transactionAPI.delete(id);
      await loadTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      setError('Failed to delete transaction. Please try again.');
    }
  };

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>Transactions</h1>
            <p style={{ color: '#64748b' }}>Manage your income and expenses</p>
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
                  onClick={() => {
                    setShowAddForm(false);
                    setPredictedCategory('');
                    setConfidence(0);
                  }}
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
                  onChange={async (e) => {
                    const description = e.target.value;
                    setNewTransaction({ ...newTransaction, description });
                    
                    // Auto-categorization for description field
                    if (description.length > 2) {
                      try {
                        const response = await transactionAPI.predictCategory(description);
                        setPredictedCategory(response.data.predictedCategory);
                        setConfidence(response.data.confidence);
                        
                        // Auto-fill category if not manually set or if it matches previous prediction
                        if (!newTransaction.category || newTransaction.category === predictedCategory) {
                          setNewTransaction(prev => ({ ...prev, category: response.data.predictedCategory }));
                        }
                      } catch (error) {
                        console.error('Failed to predict category:', error);
                      }
                    }
                  }}
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
                
                {predictedCategory && confidence > 0 && (
                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    fontSize: '0.875rem'
                  }}>
                    🤖 AI Suggestion: <strong>{predictedCategory}</strong> 
                    <span style={{ color: '#64748b' }}>(Confidence: {Math.round(confidence * 100)}%)</span>
                  </div>
                )}
                
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

        {/* Edit Transaction Form Modal */}
        {showEditForm && editingTransaction && (
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
                <h2 style={{ color: '#1e293b', fontSize: '1.5rem' }}>Edit Transaction</h2>
                <button
                  onClick={() => { setShowEditForm(false); setEditingTransaction(null); }}
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
              
              <form onSubmit={handleUpdateTransaction}>
                <input
                  type="text"
                  placeholder="Transaction description"
                  value={editingTransaction.description}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, description: e.target.value })}
                  style={inputStyle}
                  required
                />
                
                <input
                  type="number"
                  placeholder="Amount"
                  value={editingTransaction.amount}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, amount: e.target.value })}
                  style={inputStyle}
                  step="0.01"
                  min="0.01"
                  required
                />
                
                <input
                  type="date"
                  value={editingTransaction.date}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, date: e.target.value })}
                  style={inputStyle}
                />
                
                <select
                  value={editingTransaction.type}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, type: e.target.value, category: '' })}
                  style={inputStyle}
                >
                  <option value="expense">💸 Expense</option>
                  <option value="income">💰 Income</option>
                </select>
                
                <select
                  value={editingTransaction.category}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, category: e.target.value })}
                  style={inputStyle}
                  required
                >
                  <option value="">Select Category</option>
                  {categories[editingTransaction.type].map(cat => (
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
                    onClick={() => { setShowEditForm(false); setEditingTransaction(null); }}
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
                      backgroundColor: loading ? '#94a3b8' : '#10b981',
                      color: 'white',
                      flex: 1,
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? 'Updating...' : 'Update Transaction'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Transactions List */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#1e293b', fontSize: '1.5rem' }}>Transaction History</h2>
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
          
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
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
                        {transaction.category}
                        {transaction.categorySource === 'auto' && (
                          <span style={{ 
                            backgroundColor: '#dbeafe', 
                            color: '#1e40af', 
                            padding: '0.125rem 0.375rem', 
                            borderRadius: '4px', 
                            fontSize: '0.75rem',
                            marginLeft: '0.5rem'
                          }}>
                            AI
                          </span>
                        )}
                        • {new Date(transaction.date || transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <p style={{
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      color: transaction.type === 'income' ? '#10b981' : '#ef4444'
                    }}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTransaction(transaction);
                        }}
                        style={{
                          ...buttonStyle,
                          backgroundColor: '#f59e0b',
                          color: 'white',
                          padding: '0.5rem',
                          fontSize: '0.875rem'
                        }}
                        title="Edit transaction"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTransaction(transaction.id);
                        }}
                        style={{
                          ...buttonStyle,
                          backgroundColor: '#ef4444',
                          color: 'white',
                          padding: '0.5rem',
                          fontSize: '0.875rem'
                        }}
                        title="Delete transaction"
                      >
                        🗑️
                      </button>
                    </div>
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

export default Transactions;
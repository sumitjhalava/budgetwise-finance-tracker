import React, { useState, useEffect, useCallback } from 'react';
import { transactionAPI } from '../services/api';

const MonthlySummaryPanel = ({ user }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const loadMonthlySummary = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await transactionAPI.getMonthlySummary(selectedYear, selectedMonth);
      setSummary(response.data);
    } catch (error) {
      console.error('Error loading monthly summary:', error);
      setError('Failed to load monthly summary');
    } finally {
      setLoading(false);
    }
  }, [user, selectedYear, selectedMonth]);

  useEffect(() => {
    loadMonthlySummary();
  }, [loadMonthlySummary]);

  const cardStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f1f5f9',
    marginBottom: '1.5rem'
  };

  if (loading) {
    return (
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
          Loading monthly summary...
        </div>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#1e293b', fontSize: '1.2rem', margin: 0 }}>📊 Monthly Summary</h3>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            style={{
              padding: '0.5rem',
              border: '2px solid #e2e8f0',
              borderRadius: '6px',
              backgroundColor: 'white'
            }}
          >
            {months.map((month, index) => (
              <option key={index} value={index + 1}>{month}</option>
            ))}
          </select>
          
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            style={{
              padding: '0.5rem',
              border: '2px solid #e2e8f0',
              borderRadius: '6px',
              backgroundColor: 'white'
            }}
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {summary ? (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💰</div>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Total Income</p>
              <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#10b981', margin: 0 }}>
                ${summary.totalIncome?.toLocaleString() || '0'}
              </p>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💸</div>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Total Expenses</p>
              <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#ef4444', margin: 0 }}>
                ${summary.totalExpenses?.toLocaleString() || '0'}
              </p>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📈</div>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Balance</p>
              <p style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: summary.balance >= 0 ? '#10b981' : '#ef4444',
                margin: 0 
              }}>
                ${Math.abs(summary.balance || 0).toLocaleString()}
              </p>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#fefce8', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📊</div>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Avg Daily Expense</p>
              <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#f59e0b', margin: 0 }}>
                ${summary.avgDailyExpense?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>

          {summary.largestExpense && (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#fafafa', 
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151', fontSize: '1rem' }}>🎯 Largest Expense</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: '0 0 0.25rem 0', fontWeight: '600', color: '#1f2937' }}>
                    {summary.largestExpense.description}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                    {summary.largestExpense.date}
                  </p>
                </div>
                <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#ef4444' }}>
                  ${summary.largestExpense.amount?.toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📊</div>
          <p>No data available for {months[selectedMonth - 1]} {selectedYear}</p>
        </div>
      )}
    </div>
  );
};

export default MonthlySummaryPanel;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../utils/auth';

const Layout = ({ children, user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    setUser(null); // Clear user state
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <nav style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.75rem' }}>📊</span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', margin: 0 }}>BudgetWise</h1>
        </div>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>👤</span>
              <span style={{ fontSize: '0.95rem' }}>Welcome, {user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <span>🚪</span>
              Logout
            </button>
          </div>
        )}
      </nav>
      <main style={{ padding: '2rem 1rem' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
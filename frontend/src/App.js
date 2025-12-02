import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated } from './utils/auth';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    if (isAuthenticated()) {
      // In a real app, you'd fetch user data from the server
      const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
      setUser(userData);
    }
  }, []);

  // Save user data to sessionStorage when it changes
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
      setUser(null); // Ensure user state is cleared
    }
  }, [user]);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated() ? 
            <Navigate to="/dashboard" /> : 
            <Login setUser={setUser} />
          } 
        />
        <Route 
          path="/signup" 
          element={
            isAuthenticated() ? 
            <Navigate to="/dashboard" /> : 
            <Signup setUser={setUser} />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard user={user} setUser={setUser} />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
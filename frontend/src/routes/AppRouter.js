import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";

import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Overview from "../pages/Overview";
import Budget from "../pages/Budget";
import Expenses from "../pages/Expenses";
import CategoryAccuracy from "../pages/CategoryAccuracy";
import ToolsHub from "../pages/ToolsHub";
import Forum from "../pages/Forum";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRouter() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/overview"
          element={
            <ProtectedRoute>
              <Overview />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/budget"
          element={
            <ProtectedRoute>
              <Budget />
            </ProtectedRoute>
          }
        />

        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          }
        />
         <Route
          path="/Tools"
          element={
            <ProtectedRoute>
              <ToolsHub />
            </ProtectedRoute>
          }
        />
        <Route
         path="/forum"
         element={
           <ProtectedRoute>
             <Forum />
           </ProtectedRoute>
         }
        />
        <Route
          path="/CategoryAccuracy"
          element={
            <ProtectedRoute>
              <CategoryAccuracy />
            </ProtectedRoute>
          }
        />

        

      </Routes>
    </Router>
  );
}
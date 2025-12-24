import React, { useState, useEffect } from "react";
import api from "../services/api"; // Import API
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    income: "",
    savingsTarget: "",
    preferredCategory: "",
    photo: "",
  });

  // Dynamic Stats State
  const [stats, setStats] = useState({
    totalSaved: 0,
    budgetLevel: "Starter",
    streak: 0,
    transactionCount: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [userKey, setUserKey] = useState("bw_profile_guest");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("bw_currentUser") || "null");

    if (currentUser?.email) {
      const key = "bw_profile_" + currentUser.email;
      setUserKey(key);

      const savedProfile = JSON.parse(localStorage.getItem(key) || "{}");
      setProfile({
        name: savedProfile.name || currentUser.name || "Finance Whiz",
        email: currentUser.email,
        income: savedProfile.income || "",
        savingsTarget: savedProfile.savingsTarget || "",
        preferredCategory: savedProfile.preferredCategory || "",
        photo: savedProfile.photo || "",
      });

      // Fetch Real Data for Stats
      fetchStats(savedProfile.savingsTarget, savedProfile.income);
    }
  }, []);

  const fetchStats = async (savingsTarget, manualIncome = 0) => {
    try {
      const token = localStorage.getItem("bw_token");
      if (!token) return;

      const res = await api.get("/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const transactions = res.data || [];

      // 1. Calculate Total Saved (Manual Income + Transaction Income - Expenses)
      // Mirroring Dashboard Logic

      const transactionIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const totalIncome = Number(manualIncome || 0) + transactionIncome;

      const expenses = transactions
        .filter((t) => t.type !== "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const totalSaved = totalIncome - expenses;

      // 2. Budget Level Logic
      let level = "Bronze Saver";
      if (savingsTarget && savingsTarget > 0) {
        const percentage = (totalSaved / Number(savingsTarget)) * 100;
        if (percentage >= 70) level = "🥇 Gold Saver";
        else if (percentage >= 20) level = "🥈 Silver Saver";
      }

      // 3. Streak Logic (Mock: Days since first transaction)
      const daysActive = transactions.length > 0 ? 5 + Math.floor(transactions.length / 2) : 0;

      setStats({
        totalSaved,
        budgetLevel: level,
        streak: daysActive,
        transactionCount: transactions.length,
      });

    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile({ ...profile, photo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem(userKey, JSON.stringify(profile));

    // Update global user name if needed
    const currentUser = JSON.parse(localStorage.getItem("bw_currentUser")) || {};
    localStorage.setItem("bw_currentUser", JSON.stringify({ ...currentUser, name: profile.name }));

    setIsEditing(false);

    // Re-fetch stats in case Savings Target or Income changed
    fetchStats(profile.savingsTarget, profile.income);
  };

  // Helper to check badge status
  const isUnlocked = (type) => {
    if (type === "starter") return true; // Always true
    if (type === "goal") return profile.savingsTarget > 0;
    if (type === "wealthy") return stats.totalSaved >= 50000;
    if (type === "tracker") return stats.transactionCount >= 5;
    return false;
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-container-creative">

        {/* HERO BANNER */}
        <div className="profile-hero">
          <div className="hero-gradient"></div>
          <div className="hero-content">
            {/* FLOATING AVATAR */}
            <div className="profile-avatar-container">
              <div className="profile-avatar-ring">
                {profile.photo ? (
                  <img src={profile.photo} alt="Profile" className="profile-avatar-img" />
                ) : (
                  <span className="avatar-placeholder">👤</span>
                )}
              </div>
              {isEditing && (
                <label className="avatar-upload-overlay">
                  📷
                  <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
                </label>
              )}
            </div>

            <div className="hero-text">
              <h1 className="hero-name">{profile.name}</h1>
              <span className="hero-email">{profile.email}</span>
            </div>

            <button className={`edit-toggle-btn ${isEditing ? 'active' : ''}`} onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
              {isEditing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* GAMIFICATION & STATS ROW */}
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-icon">🏆</span>
            <div className="stat-info">
              <span className="stat-label">Budget Level</span>
              <span className="stat-value">{stats.budgetLevel}</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🔥</span>
            <div className="stat-info">
              <span className="stat-label">Activity (Exp)</span>
              <span className="stat-value">{stats.streak} Pts</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">💰</span>
            <div className="stat-info">
              <span className="stat-label">Total Saved</span>
              <span className="stat-value" style={{ color: stats.totalSaved >= 0 ? '#10b981' : '#ef4444' }}>
                ₹{stats.totalSaved.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* MAIN DETAILS SECTION */}
        <div className="details-section">
          <div className="details-card">
            <div className="card-header">
              <h3>Financial Profile</h3>
              <p>Your personal finance setup</p>
            </div>

            <div className="details-grid">

              {/* INCOME */}
              <div className="detail-item">
                <label>Monthly Income</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="income"
                    value={profile.income}
                    onChange={handleChange}
                    className="creative-input"
                    placeholder="0.00"
                  />
                ) : (
                  <div className="detail-value">₹ {profile.income || "0"}</div>
                )}
              </div>

              {/* SAVINGS TARGET */}
              <div className="detail-item">
                <label>Savings Target</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="savingsTarget"
                    value={profile.savingsTarget}
                    onChange={handleChange}
                    className="creative-input"
                    placeholder="0.00"
                  />
                ) : (
                  <div className="detail-value text-accent">₹ {profile.savingsTarget || "0"}</div>
                )}
              </div>

              {/* NAME (Editable Only) */}
              {isEditing && (
                <div className="detail-item full-width">
                  <label>Display Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="creative-input"
                  />
                </div>
              )}

            </div>
          </div>

          {/* BADGES COLLECTION */}
          <div className="badges-card">
            <h3>Achievements</h3>
            <div className="badges-grid">

              <div className={`badge-item ${isUnlocked('starter') ? 'earned' : ''}`}>
                <div className="badge-icon">🚀</div>
                <span>Starter</span>
              </div>

              <div className={`badge-item ${isUnlocked('goal') ? 'earned' : ''}`}>
                <div className={`badge-icon ${isUnlocked('goal') ? '' : 'locked'}`}>{isUnlocked('goal') ? '🎯' : '🔒'}</div>
                <span>Goal Setter</span>
              </div>

              <div className={`badge-item ${isUnlocked('wealthy') ? 'earned' : ''}`}>
                <div className={`badge-icon ${isUnlocked('wealthy') ? '' : 'locked'}`}>{isUnlocked('wealthy') ? '💰' : '🔒'}</div>
                <span>Wealthy Club</span>
              </div>

              <div className={`badge-item ${isUnlocked('tracker') ? 'earned' : ''}`}>
                <div className={`badge-icon ${isUnlocked('tracker') ? '' : 'locked'}`}>{isUnlocked('tracker') ? '📊' : '🔒'}</div>
                <span>Pro Tracker</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
import React, { useState, useEffect } from "react";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    income: "",
    savingsTarget: "",
    preferredCategory: "",
    photo: "",
  });

  const [userKey, setUserKey] = useState("bw_profile_guest");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("bw_currentUser") || "null");

    if (currentUser?.email) {
      const key = "bw_profile_" + currentUser.email;
      setUserKey(key);

      const savedProfile = JSON.parse(localStorage.getItem(key) || "{}");
      setProfile({
        name: savedProfile.name || currentUser.name || "",
        email: currentUser.email,
        income: savedProfile.income || "",
        savingsTarget: savedProfile.savingsTarget || "",
        preferredCategory: savedProfile.preferredCategory || "",
        photo: savedProfile.photo || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  /* PHOTO UPLOAD */
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

    // 🔥 UPDATE CURRENT USER NAME
    const currentUser = JSON.parse(localStorage.getItem("bw_currentUser")) || {};

    localStorage.setItem(
      "bw_currentUser",
      JSON.stringify({
        ...currentUser,
        name: profile.name,
      })
    );

    alert("Profile saved successfully!");
  };

  return (
    <div style={{ padding: "40px", display: "flex", justifyContent: "center" }}>
      <div
        style={{
          background: "linear-gradient(135deg, #ffffff, #f1f8e9)",
          padding: "32px",
          width: "100%",
          maxWidth: "500px",
          borderRadius: "18px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
        }}
      >
        {/* PROFILE PHOTO */}
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <div
            style={{
              width: "120px",
              height: "120px",
              margin: "0 auto",
              borderRadius: "50%",
              overflow: "hidden",
              background: "#e8f5e9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "42px",
              color: "#2e7d32",
            }}
          >
            {profile.photo ? (
              <img
                src={profile.photo}
                alt="profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              "👤"
            )}
          </div>

          <label
            style={{
              display: "block",
              marginTop: "10px",
              cursor: "pointer",
              color: "#2e7d32",
              fontWeight: "600",
            }}
          >
            Upload Photo
            <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
          </label>
        </div>

        {/* FORM */}
        {[
          { label: "👤 Name", name: "name", type: "text", readOnly: false },
          { label: "📧 Email", name: "email", type: "email", readOnly: true },
          { label: "💰 Income", name: "income", type: "number" },
          { label: "🏦 Savings Target", name: "savingsTarget", type: "number" },
          { label: "📌 Preferred Category", name: "preferredCategory", type: "text" },
        ].map((field) => (
          <div key={field.name} style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={profile[field.name]}
              readOnly={field.readOnly}
              onChange={handleChange}
              style={{
                ...inputStyle,
                background: field.readOnly ? "#f0f0f0" : "#fff",
              }}
            />
          </div>
        ))}

        <button style={buttonStyle} onClick={handleSave}>
          Save Profile
        </button>
      </div>
    </div>
  );
};

/* STYLES */
const labelStyle = {
  fontWeight: "600",
  color: "#2e7d32",
  marginBottom: "6px",
  display: "block",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #c8e6c9",
  fontSize: "15px",
};

const buttonStyle = {
  marginTop: "20px",
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  background: "#43a047",
  color: "#fff",
  fontWeight: "bold",
  border: "none",
  cursor: "pointer",
};

export default Profile;

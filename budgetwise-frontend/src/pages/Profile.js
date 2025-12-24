import React, { useState, useEffect } from "react";
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
    <div className="profile-container">
      <div className="profile-card">
        {/* PROFILE PHOTO */}
        <div className="profile-photo-wrapper">
          <div className="profile-photo-circle">
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

          <label className="upload-label">
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
          
        ].map((field) => (
          <div key={field.name} className="form-group">
            <label className="form-label">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={profile[field.name]}
              readOnly={field.readOnly}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        ))}

        <button className="save-btn" onClick={handleSave}>
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;

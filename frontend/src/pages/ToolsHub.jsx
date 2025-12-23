import React, { useState } from "react";
import "./ToolsHub.css";
import api from "../services/api";

export default function ToolsHub() {
  const [exporting, setExporting] = useState(false);
  const [backupStatus, setBackupStatus] = useState("");

  // Placeholder: Update endpoint when backend is ready
  const handleExport = async (format = "csv") => {
    setExporting(true);
    try {
      // Example endpoint: /api/transactions/export?format=csv
      const response = await api.get(`/api/transactions/export?format=${format}`, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: format === "pdf" ? "application/pdf" : "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `budgetwise-data.${format}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert("Export failed or not available yet.");
    } finally {
      setExporting(false);
    }
  };

  // Placeholder: Update endpoint when backend is ready
  const handleBackup = async (provider = "gdrive") => {
    setBackupStatus("Backing up...");
    try {
      // Example endpoint: /api/backup?provider=gdrive
      await api.post(`/api/backup`, { provider });
      setBackupStatus("Backup successful!");
    } catch (err) {
      setBackupStatus("Backup failed or not available yet.");
    }
    setTimeout(() => setBackupStatus(""), 3000);
  };

  return (
    <div className="tools-hub-page">
      <h2>Data Tools & Community</h2>
      <div className="tools-section">
        <h3>Export Financial Data</h3>
        <p>Export your financial records to PDF or CSV format for backup or sharing.</p>
        <button className="tools-btn" onClick={() => handleExport("csv")} disabled={exporting}>
          {exporting ? "Exporting..." : "Export CSV"}
        </button>
        <button className="tools-btn" onClick={() => handleExport("pdf")} disabled={exporting}>
          {exporting ? "Exporting..." : "Export PDF"}
        </button>
      </div>
      <div className="tools-section">
        <h3>Backup to Cloud</h3>
        <p>Backup your data to Google Drive or Dropbox for extra security.</p>
        <button className="tools-btn" onClick={() => handleBackup("gdrive")} disabled={!!backupStatus}>
          Backup to Google Drive
        </button>
        <button className="tools-btn" onClick={() => handleBackup("dropbox")} disabled={!!backupStatus}>
          Backup to Dropbox
        </button>
        {backupStatus && <div className="tools-status">{backupStatus}</div>}
      </div>
      <div className="tools-section">
        <h3>Financial Tips Forum</h3>
        <p>Join the community to share and discuss financial tips. Like, comment, and learn from others.</p>
        <button className="tools-btn" disabled>Go to Forum (Coming Soon)</button>
      </div>
    </div>
  );
}

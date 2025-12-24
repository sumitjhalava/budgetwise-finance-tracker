import React, { useState } from "react";
import "./ToolsHub.css";
import api, { dashboardAPI } from "../services/api";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FaMagic, FaFileCsv, FaFilePdf, FaCloud, FaUsers } from "react-icons/fa";

// Simple linear prediction helper: fits a line to the provided series and projects next `k` values.
function linearPredict(series = [], k = 3) {
  if (!Array.isArray(series) || series.length === 0) return Array(k).fill(0);
  const n = series.length;
  const xs = series.map((_, i) => i);
  const ys = series.map((v) => Number(v) || 0);
  const sumX = xs.reduce((s, v) => s + v, 0);
  const sumY = ys.reduce((s, v) => s + v, 0);
  const sumXY = xs.reduce((s, v, i) => s + v * ys[i], 0);
  const sumXX = xs.reduce((s, v) => s + v * v, 0);
  const denom = n * sumXX - sumX * sumX || 1;
  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  const out = [];
  for (let i = 0; i < k; i++) {
    const x = n + i; // projection x
    out.push(intercept + slope * x);
  }
  return out;
}

export default function ToolsHub() {
  const [exporting, setExporting] = useState(false);
  const [backupStatus, setBackupStatus] = useState("");
  const [monthsBack, setMonthsBack] = useState(12);
  const [monthsAhead, setMonthsAhead] = useState(3);
  const [loadingPred, setLoadingPred] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [predError, setPredError] = useState("");

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
      <h2 className="page-title"><FaUsers className="title-icon"/> Data Tools & Community</h2>

      <section className="predictions-card">
        <h3>Spending Predictions</h3>
        <p className="muted">Predict your future monthly expenses based on recent history.</p>

        <div className="pred-form">
          <label>
            Months back:
            <input
              type="number"
              min="3"
              value={monthsBack}
              onChange={(e) => setMonthsBack(Math.max(3, Number(e.target.value) || 3))}
            />
          </label>

          <label>
            Months ahead:
            <input
              type="number"
              min="1"
              value={monthsAhead}
              onChange={(e) => setMonthsAhead(Math.max(1, Number(e.target.value) || 1))}
            />
          </label>

          <button
            className="predict-btn"
            onClick={async () => {
              setPredError("");
              setLoadingPred(true);
              try {
                // Try backend trend endpoint first
                const resp = await dashboardAPI.getTrend(monthsBack).catch(() => null);
                let recent = [];
                if (resp && resp.data && Array.isArray(resp.data)) {
                  // Expecting array of { month: 'YYYY-MM', total: number }
                  recent = resp.data.slice(-monthsBack).map((r) => ({
                    month: r.month || r.label || "",
                    total: Number(r.total ?? r.value ?? 0),
                  }));
                } else {
                  // Fallback: try summary endpoint or generate mock data
                  const mock = [];
                  for (let i = monthsBack - 1; i >= 0; i--) {
                    const d = new Date();
                    d.setMonth(d.getMonth() - i);
                    const label = d.toLocaleString(undefined, { month: "short", year: "numeric" });
                    // generate gentle random totals for fallback
                    mock.push({ month: label, total: Math.round(50 + Math.random() * 300) });
                  }
                  recent = mock;
                }

                // linear regression on recent totals
                const nums = recent.map((r) => r.total);
                const preds = linearPredict(nums, monthsAhead);

                // build chart data with recent and predicted points
                const chart = [];
                recent.forEach((r) => chart.push({ name: r.month, recent: r.total }));
                preds.forEach((p, idx) => {
                  const d = new Date();
                  d.setMonth(d.getMonth() + idx + 1);
                  chart.push({ name: d.toLocaleString(undefined, { month: "short", year: "numeric" }), predicted: Math.round(p * 100) / 100 });
                });

                setChartData(chart);
                setPredictions(preds.map((p) => Math.round(p * 100) / 100));
              } catch (err) {
                setPredError("Prediction failed.");
              } finally {
                setLoadingPred(false);
              }
            }}
          >
            {loadingPred ? "Predicting..." : "Get Predictions"}
          </button>
        </div>

        <div className="pred-results">
          {predError && <div className="pred-error">{predError}</div>}

          {chartData.length > 0 && (
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={260}>
                <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="recent" barSize={30} fill="#2d6a4f" />
                  <Line type="monotone" dataKey="predicted" stroke="#1b4332" strokeWidth={3} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="chart-legend">
                <span className="swatch recent"></span>
                <span className="legend-label">Recent</span>
                <span className="swatch predicted"></span>
                <span className="legend-label">Predicted</span>
              </div>
            </div>
          )}

          {predictions.length > 0 && (
            <div className="pred-summary">
              <h4>Next {predictions.length} months</h4>
              <ul>
                {predictions.map((p, i) => (
                  <li key={i}>In {i + 1} month(s): ₹{p}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
      <div className="tools-section">
        <h3>Export Financial Data</h3>
        <p>Export your financial records to PDF or CSV format for backup or sharing.</p>
        <div className="tools-grid">
          <div className="tool-card">
            <h4><FaFileCsv /> Export as CSV</h4>
            <p>Download your transactions as a CSV file for use in spreadsheets or accounting software.</p>
            <button className="tools-btn" onClick={() => handleExport("csv")} disabled={exporting}>
              {exporting ? "Exporting..." : "Export CSV"}
            </button>
          </div>

          <div className="tool-card">
            <h4><FaFilePdf /> Export as PDF</h4>
            <p>Download a printable PDF report of your transactions and summaries.</p>
            <button className="tools-btn" onClick={() => handleExport("pdf")} disabled={exporting}>
              {exporting ? "Exporting..." : "Export PDF"}
            </button>
          </div>
        </div>
      </div>
      <div className="tools-section">
        <h3>Backup to Cloud</h3>
        <p>Backup your data to Google Drive or Dropbox for extra security.</p>
        <div className="tools-grid">
          <div className="tool-card">
            <h4><FaCloud /> Google Drive</h4>
            <p>Keep your transactions and backups synchronized with your Google Drive account.</p>
            <button className="tools-btn" onClick={() => handleBackup("gdrive")} disabled={!!backupStatus}>
              {backupStatus === "Backing up..." ? "Working..." : "Connect Google Drive"}
            </button>
          </div>

          <div className="tool-card">
            <h4><FaCloud /> Dropbox</h4>
            <p>Securely store your financial records in Dropbox. Get automatic backups and easy access.</p>
            <button className="tools-btn" onClick={() => handleBackup("dropbox")} disabled={!!backupStatus}>
              {backupStatus === "Backing up..." ? "Working..." : "Connect Dropbox"}
            </button>
          </div>
        </div>

        {backupStatus && <div className="tools-status">{backupStatus}</div>}
      </div>
      <div className="tools-section">
        <h3>Financial Tips Forum</h3>
        <p>Join the community to share and discuss financial tips. Like, comment, and learn from others.</p>
        <a className="tools-btn forum-cta" href="/forum"><FaUsers style={{marginRight:8}}/> Go to Forum</a>
      </div>
    </div>
  );
}

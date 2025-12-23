import React, { useState } from "react";
import { transactionAPI } from "../services/api";
import "./CategoryAccuracy.css";

const categories = [
  {
    name: "Food & Dining",
    accuracy: 95,
    examples: ["McDonald's", "Starbucks", "restaurant"],
  },
  {
    name: "Transport",
    accuracy: 88,
    examples: ["Uber", "taxi", "gas station"],
  },
  {
    name: "Entertainment",
    accuracy: 92,
    examples: ["Netflix", "movie", "concert"],
  },
  {
    name: "Shopping",
    accuracy: 85,
    examples: ["Amazon", "mall", "store"],
  },
];

export default function CategoryAccuracy() {
  const [desc, setDesc] = useState("");
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePredict = async () => {
    setLoading(true);
    setError("");
    setPrediction("");
    try {
      const res = await transactionAPI.predictCategory(desc);
      setPrediction(res.data.predictedCategory || "No prediction");
    } catch (e) {
      setError("Prediction failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-accuracy-page">
      <h2>Category Prediction Accuracy</h2>
      <table className="accuracy-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Accuracy</th>
            <th>Examples</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.name}>
              <td>{cat.name}</td>
              <td>{cat.accuracy}%</td>
              <td>{cat.examples.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="predict-demo">
        <h3>Try Category Prediction</h3>
        <input
          type="text"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Enter transaction description..."
          style={{ width: 320, marginRight: 8 }}
        />
        <button onClick={handlePredict} disabled={loading || !desc.trim()}>
          {loading ? "Predicting..." : "Predict"}
        </button>
        {prediction && (
          <div className="prediction-result">
            <strong>Predicted Category:</strong> {prediction}
          </div>
        )}
        {error && <div className="prediction-error">{error}</div>}
      </div>
    </div>
  );
}

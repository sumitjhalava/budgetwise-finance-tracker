import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081", // backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bw_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

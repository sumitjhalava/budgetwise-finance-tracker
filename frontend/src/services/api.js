import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
};

export const transactionAPI = {
  create: (transaction) => api.post('/api/transactions', transaction),
  getAll: () => api.get('/api/transactions'),
  getSummary: () => api.get('/api/transactions/summary'),
  getMonthlySummary: (year, month) => api.get(`/api/transactions/monthly-summary?year=${year}&month=${month}`),
  delete: (id) => api.delete(`/api/transactions/${id}`),
};

export default api;
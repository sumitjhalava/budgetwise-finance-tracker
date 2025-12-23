import axios from 'axios';

const ALLOWED_BASE_URL = 'http://localhost:8082';

const validateUrl = (url) => {
  try {
    const parsedUrl = new URL(url, ALLOWED_BASE_URL);
    return parsedUrl.origin === new URL(ALLOWED_BASE_URL).origin;
  } catch {
    return false;
  }
};

const api = axios.create({
  baseURL: ALLOWED_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (!validateUrl(config.baseURL || ALLOWED_BASE_URL)) {
    throw new Error(`Invalid URL: Only ${new URL(ALLOWED_BASE_URL).origin} is allowed`);
  }
  // prefer the app-specific stored token (`bw_token`) but fall back to session key
  const token = localStorage.getItem('bw_token') || sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  signup: (userData) => api.post('/api/auth/signup', userData),
};

const sanitizeParam = (param) => {
  // allow word chars and hyphen; no unnecessary escape
  return encodeURIComponent(String(param).replace(/[^\w-]/g, ''));
};

export const transactionAPI = {
  create: (transaction) => api.post('/api/transactions', transaction),
  getAll: () => api.get('/api/transactions'),
  getSummary: () => api.get('/api/transactions/summary'),
  getMonthlySummary: (year, month) => api.get(`/api/transactions/monthly-summary?year=${sanitizeParam(year)}&month=${sanitizeParam(month)}`),
  update: (id, transaction) => api.put(`/api/transactions/${sanitizeParam(id)}`, transaction),
  delete: (id) => api.delete(`/api/transactions/${sanitizeParam(id)}`),
  predictCategory: (description) => {
    if (!description || typeof description !== 'string' || description.length > 500) {
      throw new Error('Invalid description parameter');
    }
    // Prevent SSRF by validating description doesn't contain URLs or suspicious patterns
    if (/https?:\/\/|ftp:\/\/|file:\/\/|localhost|127\.0\.0\.1|0\.0\.0\.0/i.test(description)) {
      throw new Error('Description contains invalid content');
    }
    const sanitizedDescription = description.trim().replace(/[<>"'&]/g, '');
    return api.post('/api/transactions/predict-category', { description: sanitizedDescription });
  },
};

export const dashboardAPI = {
  getTrend: (months = 6) => api.get(`/api/dashboard/trend?months=${sanitizeParam(months)}`),
  getCategories: (months = 6) => api.get(`/api/dashboard/categories?months=${sanitizeParam(months)}`),
};

export const advisorAPI = {
  getSuggestions: (params = {}) => api.post('/api/advisor/suggest', params),
};

export const budgetAPI = {
  getAll: () => api.get('/api/budgets'),
  add: (category, budgetLimit) => api.post('/api/budgets', { category, budgetLimit }),
  delete: (category) => api.delete(`/api/budgets/${encodeURIComponent(category)}`),
};

export default api;
import axios from 'axios';
import { getToken, clearAuth } from '../utils/storage';

// ── Base instance ──────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor: attach JWT ───────────────────
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle auth errors ──────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // Token expired or invalid — clear session and redirect to login
    if (status === 401) {
      clearAuth();
      window.location.href = '/login';
    }

    // Forbidden — user doesn't have permission
    if (status === 403) {
      console.warn('Access denied:', error.response?.data?.message);
    }

    return Promise.reject(error);
  }
);

export default api;
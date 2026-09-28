import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

/**
 * Cliente Axios con interceptores:
 * - Adjunta automaticamente el token JWT a cada request.
 * - Si la API devuelve 401, limpia sesion y redirige a /login.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cn_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cn_token');
      localStorage.removeItem('cn_user');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

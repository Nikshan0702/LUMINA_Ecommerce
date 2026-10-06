import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : (import.meta.env.PROD 
      ? 'https://lumina-ecommerce-gmqq.onrender.com/api' 
      : '/api');

const api = axios.create({
  baseURL: apiBaseUrl
});

// Interceptor to add auth token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lumina_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthenticated responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      if (localStorage.getItem('lumina_token')) {
        localStorage.removeItem('lumina_token');
        localStorage.removeItem('lumina_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;

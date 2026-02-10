import axios from 'axios';
import { tokenService } from './tokenService';

// Use environment variable or fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://jwt-auth-api-1-ej2w.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url);
    
    if (error.response?.status === 401) {
      tokenService.clearStorage();
      window.location.href = '/login';
    }
    
    const errorMessage = error.response?.data?.message || 
                        error.response?.statusText || 
                        error.message || 
                        'Network error occurred';
    
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;

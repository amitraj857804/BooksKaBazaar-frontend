import axios from 'axios';

// Base URL from environment or default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to headers if available
axiosInstance.interceptors.request.use(
  (config) => {
    // Check for admin token first, then superadmin token
    const adminToken = localStorage.getItem('adminToken');
    const superAdminToken = localStorage.getItem(import.meta.env.VITE_JWT_STORAGE_KEY || 'superAdminToken');
    const token = adminToken || superAdminToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // If the 401 is from a login endpoint, it's just invalid credentials, not an expired token.
      const isLoginRequest = error.config?.url?.includes('/login');
      
      if (!isLoginRequest) {
        // Check if user is admin or superadmin
        const adminToken = localStorage.getItem('adminToken');
        const superAdminToken = localStorage.getItem(import.meta.env.VITE_JWT_STORAGE_KEY || 'superAdminToken');
        
        if (adminToken) {
          // Admin token expired - clear admin storage only
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminData');
          // Don't redirect here - let ProtectedRoute handle it
        } else if (superAdminToken) {
          // SuperAdmin token expired - clear superadmin storage and redirect
          localStorage.removeItem(import.meta.env.VITE_JWT_STORAGE_KEY || 'superAdminToken');
          localStorage.removeItem(import.meta.env.VITE_USER_STORAGE_KEY || 'superAdminUser');
          window.location.href = '/superadmin/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

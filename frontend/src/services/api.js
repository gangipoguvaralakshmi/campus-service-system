import axios from 'axios';

const API_URL = 'https://campus-service-system.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - The server took too long to respond');
    }

    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);

      // Handle 401 — only redirect if NOT on login page
      if (error.response.status === 401) {
        const token = localStorage.getItem('token');
        if (token && window.location.pathname !== '/login') {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }

      // Handle 403 Forbidden errors
      if (error.response.status === 403) {
        console.error('Access forbidden');
      }

      // Handle 500 Internal Server errors
      if (error.response.status >= 500) {
        console.error('Server error - Please try again later');
      }
    } else if (error.request) {
      console.error('No response received from server');
    } else {
      console.error('Error setting up request:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach JWT token to requests (Phase 2)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('transitops-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally (Phase 2)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('transitops-token');
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;

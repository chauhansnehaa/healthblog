import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses — but NEVER swallow errors from the login/signup calls themselves
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCall = error.config?.url?.includes('/auth/');
    const hadToken   = !!localStorage.getItem('token');

    // Only auto-redirect when:
    //  • the server said 401 (token expired / missing)
    //  • the failing request was NOT a login/signup call
    //  • the user actually had a token stored (was logged in before)
    if (error.response?.status === 401 && !isAuthCall && hadToken) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // For auth calls (login / signup) — just reject so the form can show the error
    return Promise.reject(error);
  }
);

export default axiosInstance;

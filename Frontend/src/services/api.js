import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('civicbuzz_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Standardize responses & handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // 401 Unauthorized handling
      if (error.response.status === 401 && !error.config.url.includes('/auth/login')) {
        localStorage.removeItem('civicbuzz_token');
        localStorage.removeItem('civicbuzz_user');
      }

      // Proxy connection error (502 Bad Gateway / 504 / 500 with HTML from Vite proxy)
      if (
        [502, 503, 504].includes(error.response.status) ||
        (typeof error.response.data === 'string' && error.response.data.includes('ECONNREFUSED'))
      ) {
        return Promise.reject(
          new Error(
            'Cannot connect to the CivicBuzz Backend (http://127.0.0.1:8000). Please ensure the FastAPI server is running with: cd backend && python3 -m uvicorn app.main:app --port 8000 --reload'
          )
        );
      }

      const message =
        (typeof error.response.data === 'object' &&
          (error.response.data?.message || error.response.data?.detail)) ||
        'An unexpected server error occurred. Please verify backend connectivity.';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      return Promise.reject(
        new Error(
          'Unable to reach CivicBuzz Backend (http://127.0.0.1:8000). Please ensure the backend is running with: cd backend && python3 -m uvicorn app.main:app --port 8000 --reload'
        )
      );
    }
    return Promise.reject(error);
  }
);

export default apiClient;

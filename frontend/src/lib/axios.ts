import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('edumaster_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('edumaster_token');
      localStorage.removeItem('edumaster_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

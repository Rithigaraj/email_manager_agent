import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        console.warn('Authentication expired or required. Redirecting to login...');
      } else if (status === 403) {
        console.error('Permission denied for this operation.');
      } else if (status === 429) {
        console.warn('Rate limit reached for AI services. Please try again in a few moments.');
      } else if (status >= 500) {
        console.error('Server error occurred. Please try again later.');
      }
    }
    return Promise.reject(error);
  }
);

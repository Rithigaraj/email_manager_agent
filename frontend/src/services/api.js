import axios from 'axios';

// withCredentials is required so the HTTP-only session cookie set by
// /api/auth/google/callback is sent on every subsequent request.
const API = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session missing/expired -- send the user back to sign in.
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  getGoogleUrl: () => API.get('/auth/google/url'),
  me: () => API.get('/auth/me'),
  logout: () => API.post('/auth/logout'),
};

export const emailAPI = {
  getEmails: (params) => API.get('/emails', { params }),
  getEmail: (id) => API.get(`/emails/${id}`),
  createEmail: (data) => API.post('/emails/send', data),
  updateEmail: (id, data) => API.put(`/emails/${id}`, data),
  deleteEmail: (id) => API.delete(`/emails/${id}`),
};

export const templateAPI = {
  getTemplates: () => API.get('/templates'),
  createTemplate: (data) => API.post('/templates', data),
  deleteTemplate: (id) => API.delete(`/templates/${id}`),
};

export const dashboardAPI = {
  getStats: () => API.get('/dashboard/stats'),
};

export const aiAPI = {
  generateEmail: (data) => API.post('/ai/generate-reply', data),
  summarizeEmail: (data) => API.post('/ai/summarize', data),
  classifyEmail: (data) => API.post('/ai/classify', data),
  extractActions: (data) => API.post('/ai/extract-actions', data),
  nlSearch: (data) => API.post('/ai/nl-search', data),
};

export default API;

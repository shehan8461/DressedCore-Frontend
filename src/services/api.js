import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  validate: (token) => api.post('/api/auth/validate', token),
};

// Design API
export const designAPI = {
  create: (data) => api.post('/api/designs', data),
  getAll: (category) => api.get('/api/designs', { params: { category } }),
  getById: (id) => api.get(`/api/designs/${id}`),
  getByDesigner: (designerId) => api.get(`/api/designs/designer/${designerId}`),
  updateStatus: (id, status) => api.patch(`/api/designs/${id}/status`, JSON.stringify(status), {
    headers: { 'Content-Type': 'application/json' }
  }),
  delete: (id) => api.delete(`/api/designs/${id}`),
};

// Quote API
export const quoteAPI = {
  create: (data) => api.post('/api/quotes', data),
  getById: (id) => api.get(`/api/quotes/${id}`),
  getByDesign: (designId) => api.get(`/api/quotes/design/${designId}`),
  getBySupplier: (supplierId) => api.get(`/api/quotes/supplier/${supplierId}`),
  updateStatus: (id, status) => api.patch(`/api/quotes/${id}/status`, JSON.stringify(status), {
    headers: { 'Content-Type': 'application/json' }
  }),
  delete: (id) => api.delete(`/api/quotes/${id}`),
};

export default api;

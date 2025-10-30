import axios from 'axios';

// ✅ CORRIGIDO: Usar variável de ambiente VITE_API_URL
const API_URL = import.meta.env.VITE_API_URL || 'https://portal-freguesias-freguesia-api.3isjct.easypanel.host/api';

console.log('🔧 Frontend API URL:', API_URL);

// Criar instância do axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requests
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

// Interceptor para lidar com respostas e erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH
// ============================================
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  verify: (token) => api.get(`/auth/verify/${token}`),
};

// ============================================
// INCIDENTS
// ============================================
export const incidentsService = {
  getPublic: (status) => api.get('/incidents/public', { params: { status } }),
  getMy: () => api.get('/incidents/my'),
  getById: (id) => api.get(`/incidents/${id}`),
  create: (data) => api.post('/incidents', data),
  updateStatus: (id, data) => api.patch(`/incidents/${id}/status`, data),
};

// ============================================
// NEWS
// ============================================
export const newsService = {
  getAll: () => api.get('/news'),
  getById: (id) => api.get(`/news/${id}`),
  create: (data) => api.post('/news', data),
  update: (id, data) => api.put(`/news/${id}`, data),
  delete: (id) => api.delete(`/news/${id}`),
};

// ============================================
// SLIDES
// ============================================
export const slidesService = {
  getAll: () => api.get('/slides'),
  create: (data) => api.post('/slides', data),
  update: (id, data) => api.put(`/slides/${id}`, data),
  delete: (id) => api.delete(`/slides/${id}`),
};

// ============================================
// LINKS
// ============================================
export const linksService = {
  getAll: () => api.get('/links'),
  create: (data) => api.post('/links', data),
  update: (id, data) => api.put(`/links/${id}`, data),
  delete: (id) => api.delete(`/links/${id}`),
};

// ============================================
// ADMIN
// ============================================
export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  updateUser: (id, data) => api.patch(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api;


// === Multipart helpers for news & incidents (added) ===
export const newsService = {
  async create(data, files=[]) {
    const form = new FormData();
    form.append('data', JSON.stringify(data));
    (files||[]).forEach(f=>form.append('images', f));
    const res = await api.post('/api/news', form, { headers:{ 'Content-Type':'multipart/form-data' }});
    return res.data;
  },
  async update(id, data, files=[]) {
    const form = new FormData();
    form.append('data', JSON.stringify(data));
    (files||[]).forEach(f=>form.append('images', f));
    const res = await api.put(`/api/news/${id}`, form, { headers:{ 'Content-Type':'multipart/form-data' }});
    return res.data;
  }
};

export const incidentsService = {
  async create(data, files=[]) {
    const form = new FormData();
    form.append('data', JSON.stringify(data));
    (files||[]).forEach(f=>form.append('images', f));
    const res = await api.post('/api/incidents', form, { headers:{ 'Content-Type':'multipart/form-data' }});
    return res.data;
  },
  async update(id, data, files=[]) {
    const form = new FormData();
    form.append('data', JSON.stringify(data));
    (files||[]).forEach(f=>form.append('images', f));
    const res = await api.put(`/api/incidents/${id}`, form, { headers:{ 'Content-Type':'multipart/form-data' }});
    return res.data;
  }
};

import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', timeout: 30000 });
api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('leadflow_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401 && !error.config?.url?.endsWith('/auth/login')) {
    sessionStorage.removeItem('leadflow_token');
    window.dispatchEvent(new Event('leadflow:unauthorized'));
  }
  return Promise.reject(error);
});
export const login = credentials => api.post('/auth/login', credentials).then(r => r.data);
export const getLeads = params => api.get('/leads', { params }).then(r => r.data);
export const getStats = () => api.get('/leads/stats').then(r => r.data);
export const getEnterprise = () => api.get('/leads/enterprise').then(r => r.data);
export const getLead = id => api.get(`/leads/${id}`).then(r => r.data);
export const submitLead = payload => api.post('/leads', payload).then(r => r.data);

import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', timeout: 30000 });
export const getLeads = params => api.get('/leads', { params }).then(r => r.data);
export const getStats = () => api.get('/leads/stats').then(r => r.data);
export const getEnterprise = () => api.get('/leads/enterprise').then(r => r.data);
export const getLead = id => api.get(`/leads/${id}`).then(r => r.data);
export const submitLead = payload => api.post('/leads', payload).then(r => r.data);

import api from './axios';

export const submitPublicLead = (data) => api.post('/leads/public', data);
export const getLeads = (params) => api.get('/leads', { params });
export const getLeadById = (id) => api.get(`/leads/${id}`);
export const createLead = (data) => api.post('/leads', data);
export const updateLead = (id, data) => api.put(`/leads/${id}`, data);
export const deleteLead = (id) => api.delete(`/leads/${id}`);
export const assignLead = (id, memberId) => api.put(`/leads/${id}/assign`, { memberId });
export const updateLeadStatus = (id, status) => api.put(`/leads/${id}/status`, { status });
export const getNotes = (leadId) => api.get(`/leads/${leadId}/notes`);
export const addNote = (leadId, message) => api.post(`/leads/${leadId}/notes`, { message });
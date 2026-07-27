import api from './axios';

export const getLeads = (params) => api.get('/leads', { params });
export const getRecentActivities = () => api.get('/activities/recent');
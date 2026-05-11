import api from '@/api/axiosInstance';

export const getAdminAccounts = () => api.get('/admin/accounts').then(res => res.data);

export const createAdminAccount = payload => api.post('/admin/teams', payload).then(res => res.data);

export const updateAdminAccount = (id, payload) =>
  api.patch(`/admin/accounts/${id}`, payload).then(res => res.data);

export const deleteAdminAccount = id =>
  api.delete(`/admin/accounts/${id}`).then(res => res.data);

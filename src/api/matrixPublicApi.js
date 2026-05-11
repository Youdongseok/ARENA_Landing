// src/api/matrixPublicApi.js
import api from '@/api/axiosInstance';

// GET /common/matrix-setting
export const fetchMatrixPublicSetting = async () => {
  const res = await api.get('/common/matrix-setting');
  return res.data; // { enabled: true/false }
};

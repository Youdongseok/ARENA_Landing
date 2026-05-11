// src/api/matrixSettingApi.js
import api from '@/api/axiosInstance';

/**
 * GET /admin/arena/common-matrix-setting
 * => { enabled: boolean }
 */
export const fetchMatrixSetting = async () => {
  const res = await api.get('/admin/arena/common-matrix-setting');
  return res.data; // { enabled: true/false }
};

/**
 * POST /admin/arena/common-matrix-setting/toggle
 * => { enabled: boolean }
 */
export const toggleMatrixSetting = async () => {
  const res = await api.post('/admin/arena/common-matrix-setting/toggle');
  return res.data; // { enabled: true/false }
};

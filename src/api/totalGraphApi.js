// src/api/admin/totalGraphApi.js
import api from '@/api/axiosInstance';

/**
 * 🔥 토탈 그래프 공개 여부 조회
 * GET /admin/arena/total-graph-setting
 */
export const fetchTotalGraphSetting = async () => {
  const res = await api.get('/admin/arena/total-graph-setting');
  return res.data; // { enabled: true/false }
};

/**
 * 🔥 토글 요청 (관리자)
 * POST /admin/arena/total-graph-setting/toggle
 */
export const toggleTotalGraphSetting = async () => {
  const res = await api.post('/admin/arena/total-graph-setting/toggle');
  return res.data; // { enabled: true/false }
};

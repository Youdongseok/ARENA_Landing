// src/api/adminProblemsApi.js
import api from '@/api/axiosInstance';

/**
 * 문제 활성/비활성 토글
 */
export const toggleAdminProblemActive = problemId => {
  return api.patch(`/admin/problems/${problemId}/active/toggle`).then(res => res.data);
};

/**
 * 문제 전체 조회
 */
export const getAdminProblems = () => api.get('/admin/problems/view').then(res => res.data);

/**
 * 문제 생성
 */
export const createProblem = async payload => {
  const res = await api.post('/admin/problems', payload);
  return res.data;
};

/**
 * 문제 수정 (PATCH)
 */
export const updateProblem = async (problemId, payload) => {
  const res = await api.patch(`/admin/problems/${problemId}`, payload);
  return res.data;
};

/**
 * 문제 삭제 (DELETE)
 */
export const deleteProblem = async problemId => {
  const res = await api.delete(`/admin/problems/${problemId}`);
  return res.data;
};

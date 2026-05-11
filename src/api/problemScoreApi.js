// src/api/problemScoreApi.js
import api from './axiosInstance';

/**
 * 특정 문제에 대한 팀의 최고 점수 조회
 * GET /problem/{problem_id}/best-score?team_id=X
 */
export const fetchProblemBestScore = async (problemId, teamId) => {
  const res = await api.get(`/problem/${problemId}/best-score`, {
    params: { team_id: teamId },
  });
  return res.data;
};

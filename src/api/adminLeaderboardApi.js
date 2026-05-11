// src/api/adminLeaderboardApi.js
import api from './axiosInstance';

/**
 * 🔥 관리자용 팀별 랭킹 조회
 * GET /admin/leaderboard
 *
 * - 항상 전체 랭킹 조회 가능
 * - 파라미터 없음!
 */
export const fetchAdminLeaderboard = async () => {
  const res = await api.get('/admin/leaderboard');
  return res.data; // rank, teamname, score, solved_count[]
};

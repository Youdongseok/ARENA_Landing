// src/api/leaderboardApi.js
import api from '@/api/axiosInstance';

/**
 * 사용자 리더보드 조회
 */
export const fetchLeaderboard = async ({ seasonLabel } = {}) => {
  const params = seasonLabel && seasonLabel !== 'all' ? { season_label: seasonLabel } : undefined;
  const res = await api.get('/common/leaderboard', { params });
  return res.data;
};

export const fetchLeaderboardSeasons = async () => {
  const res = await api.get('/common/leaderboard/seasons');
  return res.data;
};

/**
 * 🔥 사용자 리더보드 공개 여부 조회
 * GET /dashboard/arena/leaderboard-setting
 */
export const fetchUserLeaderboardSetting = async () => {
  const res = await api.get('/common/leaderboard-setting');
  return res.data; // { leaderboard_enabled: true/false }
};

/**
 * 관리자용 문제풀이 매트릭스
 */
export const fetchSolveMatrix = async (label = 'title') => {
  const res = await api.get('/admin/arena/solve-matrix', { params: { label } });
  return res.data;
};

export const fetchScoreSeriesTotal = async ({ start, end }) => {
  const res = await api.get('/admin/score-series/total', {
    params: { start, end },
  });
  return res.data;
};

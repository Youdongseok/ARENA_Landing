// src/api/dashboardApi.js
import api from '@/api/axiosInstance';

/** 🔥 팀별 대시보드 조회 (신규 API) */
export const fetchTeamDashboard = async (teamId, { seasonLabel } = {}) => {
  const params = seasonLabel && seasonLabel !== 'all' ? { season_label: seasonLabel } : undefined;
  const res = await api.get(`/problem/team/${teamId}`, { params });
  return res.data;
  // {
  //   solved_count,
  //   total_score,
  //   problems: [{ title, is_active, solved }]
  // }
};

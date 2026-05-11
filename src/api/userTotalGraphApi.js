// src/api/user/userTotalGraphApi.js
import api from '@/api/axiosInstance';

/**
 * 🔹 모든 팀명 리스트
 * GET /common/teams
 */
export const fetchCommonTeams = async () => {
  const res = await api.get('/common/teams');
  return res.data; // ["TeamA", "TeamB", ...]
};

/**
 * 🔹 사용자용 토탈 그래프 공개 여부
 * GET /common/total-graph-setting
 */
export const fetchUserTotalGraphSetting = async () => {
  const res = await api.get('/common/total-graph-setting');
  return res.data; // { enabled: true/false }
};

/**
 * 🔹 사용자용 토탈 점수 시계열
 * GET /common/score-series/total
 *
 * 관리자가 total_graph_enabled 꺼두면 404 발생함
 */
export const fetchUserScoreSeriesTotal = async ({ start, end }) => {
  const res = await api.get('/common/score-series/total', {
    params: { start, end },
  });
  return res.data;
};

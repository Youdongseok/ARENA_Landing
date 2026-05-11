// src/api/problemApi.js

import api from './axiosInstance'; // axiosInstance 임포트 (기존 경로 가정)

/**
 * [POST] /problem/bundle API 호출 함수
 * @param {{problem_id: number, team_id: number}} params - 문제 ID와 팀 ID
 * @returns {Promise<object>} 문제 번들 데이터
 */
export const fetchProblemBundle = async ({ problem_id, team_id }) => {
  const response = await api.post('/problem/bundle', {
    problem_id,
    team_id,
  });
  // axios는 .data에 응답 본문을 담으므로 이를 반환
  return response.data;
};

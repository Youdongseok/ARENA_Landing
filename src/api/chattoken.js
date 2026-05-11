// src/api/chattoken.js
import api from './axiosInstance';

/**
 * 특정 세션의 토큰 사용량 조회
 * @param {object} payload - { team_id, problem_id, session_id }
 */
export const getTokenUsage = async payload => {
  const res = await api.post('/chat/token-usage', payload);
  return res.data; // { team_id, problem_id, session_id, token_used }
};

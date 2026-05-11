import api from './axiosInstance'; // axios 기본 설정 인스턴스

/**
 * 챌린지 제출 요청
 * @param {number} sessionId - 현재 챌린지 세션 ID
 * @param {object} body - 추가 제출 데이터 (필요 시)
 * @returns {Promise}
 */
export const submitForJudgement = (sessionId, body = {}) => {
  return api.post(`/judge/sessions/${sessionId}/submit`, body).then(res => res.data);
};

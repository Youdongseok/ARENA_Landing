import api from './axiosInstance';

// ✅ 세션 생성
export const createSession = ({ teamId, problemId, title }) =>
  api
    .post('/chat/sessions', { team_id: teamId, problem_id: problemId, title })
    .then(res => res.data);

// ✅ 세션 메시지 조회
export const getSessionMessages = ({ sessionId, teamId, problemId }) =>
  api
    .get(`/chat/sessions/${sessionId}/messages`, {
      params: { team_id: teamId, problem_id: problemId },
    })
    .then(res => res.data);

// ✅ 메시지 전송
export const sendMessage = ({ sessionId, teamId, problemId, content }) =>
  api
    .post('/chat/send', { session_id: sessionId, team_id: teamId, problem_id: problemId, content })
    .then(res => res.data);

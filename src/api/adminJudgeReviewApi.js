// src/api/adminJudgeReviewApi.js
import api from '@/api/axiosInstance';

// 팀 목록
export const fetchJudgeTeams = () => api.get('/admin/judge/teams').then(res => res.data);

// 문제 목록
export const fetchJudgeProblems = () => api.get('/admin/judge/problems').then(res => res.data);

// 세션 목록
export const fetchJudgeSessions = (teamId, problemId) =>
  api
    .get('/admin/judge/sessions', {
      params: { team_id: teamId, problem_id: problemId },
    })
    .then(res => res.data);

// 세션 메시지
export const fetchJudgeMessages = sessionId =>
  api.get(`/admin/judge/sessions/${sessionId}/messages`).then(res => res.data);

// 저지 결과
export const fetchJudgeResult = sessionId =>
  api.get(`/admin/judge/sessions/${sessionId}/judge-result`).then(res => res.data);

// 성공 → 실패로 강제 변경
export const markSessionFail = sessionId =>
  api.post(`/admin/judge/sessions/${sessionId}/mark-fail`).then(res => res.data);

export const markSessionSuccess = sessionId =>
  api.post(`/admin/judge/sessions/${sessionId}/mark-success`).then(res => res.data);

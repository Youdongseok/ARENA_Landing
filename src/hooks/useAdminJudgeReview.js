// src/hooks/useAdminJudgeReview.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchJudgeTeams,
  fetchJudgeProblems,
  fetchJudgeSessions,
  fetchJudgeMessages,
  fetchJudgeResult,
  markSessionFail,
  markSessionSuccess,
} from '@/api/adminJudgeReviewApi';

// 팀 목록
export const useJudgeTeams = () =>
  useQuery({
    queryKey: ['judgeTeams'],
    queryFn: fetchJudgeTeams,
  });

// 문제 목록
export const useJudgeProblems = () =>
  useQuery({
    queryKey: ['judgeProblems'],
    queryFn: fetchJudgeProblems,
  });

// 세션 목록
export const useJudgeSessions = (teamId, problemId) =>
  useQuery({
    queryKey: ['judgeSessions', teamId, problemId],
    queryFn: () => fetchJudgeSessions(teamId, problemId),
    enabled: !!teamId && !!problemId,
  });

// 세션 메시지
export const useJudgeMessages = sessionId =>
  useQuery({
    queryKey: ['judgeMessages', sessionId],
    queryFn: () => fetchJudgeMessages(sessionId),
    enabled: !!sessionId,
  });

// 저지 결과
export const useJudgeResult = sessionId =>
  useQuery({
    queryKey: ['judgeResult', sessionId],
    queryFn: () => fetchJudgeResult(sessionId),
    enabled: !!sessionId,
  });

export const useMarkSessionFail = sessionId => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markSessionFail(sessionId),

    onSuccess: data => {
      let message = '';

      // 문자열이면 그대로 출력
      if (typeof data === 'string') {
        message = data;
      }
      // 객체라면 사람이 읽기 좋게 포맷팅
      else if (typeof data === 'object' && data !== null) {
        message = '[Fail 처리 완료]\n\n';
        for (const key in data) {
          message += `${key}: ${data[key]}\n`;
        }
      } else {
        message = '처리가 완료되었습니다.';
      }

      alert(message);

      // invalidate
      queryClient.invalidateQueries(['judgeSessions']);
      queryClient.invalidateQueries(['judgeResult', sessionId]);
    },

    onError: err => {
      alert('실패 처리 중 오류 발생:\n' + (err.response?.data?.detail ?? err.message));
    },
  });
};

export const useMarkSessionSuccess = sessionId => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markSessionSuccess(sessionId),

    onSuccess: data => {
      let message = '';

      if (typeof data === 'string') {
        message = data;
      } else if (typeof data === 'object' && data !== null) {
        message = '[성공 처리 완료]\n\n';
        for (const key in data) {
          message += `${key}: ${data[key]}\n`;
        }
      } else {
        message = '성공 처리되었습니다.';
      }

      alert(message);

      // invalidate refresh
      queryClient.invalidateQueries(['judgeSessions']);
      queryClient.invalidateQueries(['judgeResult', sessionId]);
    },

    onError: err => {
      alert('성공 처리 중 오류 발생:\n' + (err.response?.data?.detail ?? err.message));
    },
  });
};

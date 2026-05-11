// src/hooks/useAdminToggleProblemActive.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleAdminProblemActive } from '@/api/adminProblemsApi';

export const useAdminToggleProblemActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: problemId => toggleAdminProblemActive(problemId),

    onSuccess: () => {
      // 🔄 문제 목록 갱신 (GET /problem/all)
      queryClient.invalidateQueries(['allProblems']);
    },

    onError: err => {
      console.error('🔴 문제 활성/비활성 토글 실패:', err);
    },
  });
};

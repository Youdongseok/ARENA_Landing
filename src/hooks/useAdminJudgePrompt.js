// src/hooks/useAdminJudgePrompt.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJudgePrompt, updateJudgePrompt } from '@/api/adminJudgeApi';

/* =========================================================
   🔹 Judge 프롬프트 조회 훅
   ========================================================= */
export const useJudgePromptQuery = problemId => {
  return useQuery({
    queryKey: ['judgePrompt', problemId],
    queryFn: () => fetchJudgePrompt(problemId),
    enabled: !!problemId, // 문제 ID 있어야만 실행
  });
};

/* =========================================================
   🔹 Judge 프롬프트 수정 훅
   ========================================================= */
export const useJudgePromptMutation = problemId => {
  const queryClient = useQueryClient();

  return useMutation({
    // PUT 요청 실행
    mutationFn: prompt => updateJudgePrompt(problemId, prompt),

    // 성공 시 실행
    onSuccess: () => {
      // 캐시 다시 가져오기
      queryClient.invalidateQueries(['judgePrompt', problemId]);

      // 🔥 성공 알림
      alert('수정되었습니다.');
    },

    // 실패 시 실행
    onError: () => {
      alert('수정에 실패했습니다. 다시 시도해주세요.');
    },
  });
};

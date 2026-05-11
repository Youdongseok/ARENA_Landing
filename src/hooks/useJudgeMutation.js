// useJudgeMutation.js
import { useMutation } from '@tanstack/react-query';
import { submitForJudgement } from '@/api/judgeApi'; // 이름 맞춰서 import

export const useJudgeMutation = () => {
  return useMutation({
    mutationFn: submitForJudgement, // 여기서도 이름 일치
    // onSuccess/onError는 Challenge.jsx에서 처리
  });
};

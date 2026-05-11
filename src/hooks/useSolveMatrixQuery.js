// src/hooks/useSolveMatrixQuery.js
import { useQuery } from '@tanstack/react-query';
import { fetchSolveMatrix } from '@/api/leaderboardApi';

/**
 * 🧩 실시간 Solve Matrix 자동 갱신 훅
 * - 5초 간격으로 solve-matrix만 폴링
 * - head API 제거됨 → head 검사 제거
 */
export const useSolveMatrixQuery = (label = 'title', interval = 5000) => {
  return useQuery({
    queryKey: ['solveMatrix', label],
    queryFn: async () => {
      return await fetchSolveMatrix(label); // 바로 solve-matrix 호출
    },
    refetchInterval: interval, // 5초 간격 업데이트
    refetchOnWindowFocus: true,
    staleTime: 0,
    retry: 1,
  });
};

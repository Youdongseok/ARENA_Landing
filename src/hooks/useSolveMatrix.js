// src/hooks/useSolveMatrix.js
import { useQuery } from '@tanstack/react-query';
import { getSolveMatrix } from '@/api/solveMatrix';

export const useSolveMatrix = () => {
  return useQuery({
    queryKey: ['solveMatrix'],
    queryFn: getSolveMatrix,
    refetchInterval: 5000, // 🔥 실시간 리더보드를 위해 5초마다 폴링
  });
};

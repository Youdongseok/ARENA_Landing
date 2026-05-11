import { useQuery } from '@tanstack/react-query';
import { fetchLeaderboard } from '@/api/leaderboardApi';

/**
 * 🪄 리더보드 데이터 조회 훅
 * - 자동 캐싱, 10초마다 자동 새로고침
 */
export const useLeaderboardQuery = seasonLabel => {
  return useQuery({
    queryKey: ['leaderboard', seasonLabel],
    queryFn: () => fetchLeaderboard({ seasonLabel }),
    refetchInterval: 10000, // 10초마다 새로고침
    staleTime: 5000,
    retry: 1,
  });
};

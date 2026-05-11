// src/hooks/useAdminLeaderboardQuery.js
import { useQuery } from '@tanstack/react-query';
import { fetchAdminLeaderboard } from '@/api/adminLeaderboardApi';

export const useAdminLeaderboardQuery = () => {
  return useQuery({
    queryKey: ['adminLeaderboard'], // teamId 제거
    queryFn: fetchAdminLeaderboard, // 파라미터 제거
    refetchInterval: 5000, // 5초 폴링 유지
  });
};

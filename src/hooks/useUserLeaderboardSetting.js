import { useQuery } from '@tanstack/react-query';
import { fetchUserLeaderboardSetting } from '@/api/leaderboardApi';

/**
 * 🔎 사용자 리더보드 공개 여부 조회 훅
 */
export const useUserLeaderboardSetting = () => {
  return useQuery({
    queryKey: ['user-leaderboard-setting'],
    queryFn: fetchUserLeaderboardSetting,
    refetchInterval: 30000, // 30초마다 갱신
  });
};

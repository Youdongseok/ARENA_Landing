import { useQuery } from '@tanstack/react-query';
import { fetchLeaderboardSeasons } from '@/api/leaderboardApi';

export const useLeaderboardSeasonOptions = () =>
  useQuery({
    queryKey: ['leaderboard-seasons'],
    queryFn: fetchLeaderboardSeasons,
    staleTime: 1000 * 60 * 5,
  });

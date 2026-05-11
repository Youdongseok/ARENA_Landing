// src/hooks/useTeamDashboardQuery.js
import { useQuery } from '@tanstack/react-query';
import { fetchTeamDashboard } from '@/api/dashboardApi';

export const useTeamDashboardQuery = (teamId, seasonLabel = 'all') => {
  return useQuery({
    queryKey: ['teamDashboard', teamId, seasonLabel],
    queryFn: () => fetchTeamDashboard(teamId, { seasonLabel }),
    enabled: !!teamId, // teamId 있을 때만 실행
    staleTime: 1000 * 60 * 5, // 5분 캐싱
  });
};

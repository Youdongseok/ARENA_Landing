// src/hooks/useLeaderboardSetting.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchLeaderboardSetting,
  toggleLeaderboardSetting,
} from '@/api/adminLeaderboardSettingApi';

export const useLeaderboardSetting = () => {
  const queryClient = useQueryClient();

  // ⭐ 현재 설정 조회
  const { data, isLoading, isError } = useQuery({
    queryKey: ['leaderboard-setting'],
    queryFn: fetchLeaderboardSetting,
  });

  // ⭐ 토글 요청
  const { mutate: toggle, isPending } = useMutation({
    mutationFn: toggleLeaderboardSetting,
    onSuccess: () => {
      // 최신 설정 다시 불러오기
      queryClient.invalidateQueries(['leaderboard-setting']);
    },
  });

  return {
    setting: data?.leaderboard_enabled ?? false,
    isLoading,
    isError,
    toggle,
    isPending,
  };
};

// src/hooks/useMatrixSetting.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMatrixSetting, toggleMatrixSetting } from '@/api/matrixSettingApi';

export const useMatrixSetting = () => {
  const queryClient = useQueryClient();

  // ❗ On/Off 조회
  const { data, isLoading, isError } = useQuery({
    queryKey: ['matrix-setting'],
    queryFn: fetchMatrixSetting,
    staleTime: 0,
  });

  // ❗ 토글 Mutation
  const mutation = useMutation({
    mutationFn: toggleMatrixSetting,
    onSuccess: () => {
      queryClient.invalidateQueries(['matrix-setting']);
    },
  });

  return {
    setting: data?.enabled ?? false, // true | false
    isLoading,
    isError,
    isPending: mutation.isPending,
    toggle: mutation.mutate,
  };
};

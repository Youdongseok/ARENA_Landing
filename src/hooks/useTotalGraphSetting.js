// src/hooks/useTotalGraphSetting.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTotalGraphSetting, toggleTotalGraphSetting } from '@/api/totalGraphApi';

export function useTotalGraphSetting() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['totalGraphSetting'],
    queryFn: fetchTotalGraphSetting,
  });

  const { mutate: toggle, isPending } = useMutation({
    mutationFn: toggleTotalGraphSetting,
    onSuccess: () => {
      queryClient.invalidateQueries(['totalGraphSetting']);
    },
  });

  return {
    setting: data?.enabled ?? false,
    isLoading,
    isPending,
    toggle,
  };
}

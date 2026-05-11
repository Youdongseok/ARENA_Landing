// src/hooks/useMatrixPublicSetting.js
import { useQuery } from '@tanstack/react-query';
import { fetchMatrixPublicSetting } from '@/api/matrixPublicApi';

export const useMatrixPublicSetting = () => {
  return useQuery({
    queryKey: ['matrix-public-setting'],
    queryFn: fetchMatrixPublicSetting,
    staleTime: 0,
    refetchInterval: 5000, // 🔥 5초마다 자동 갱신
  });
};

// src/hooks/useAdminProblemsQuery.js
import { useQuery } from '@tanstack/react-query';
import { getAdminProblems } from '@/api/adminProblemsApi';

export const useAdminProblemsQuery = () => {
  return useQuery({
    queryKey: ['adminProblems'],
    queryFn: getAdminProblems,
    staleTime: 1000 * 10, // 옵션: 10초 동안 신선한 데이터로 취급
  });
};

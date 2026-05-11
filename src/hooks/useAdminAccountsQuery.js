import { useQuery } from '@tanstack/react-query';
import { getAdminAccounts } from '@/api/adminAccountsApi';

export const useAdminAccountsQuery = () => {
  return useQuery({
    queryKey: ['adminAccounts'],
    queryFn: getAdminAccounts,
    staleTime: 1000 * 10,
  });
};

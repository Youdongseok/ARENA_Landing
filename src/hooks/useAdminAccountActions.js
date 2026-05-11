import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createAdminAccount,
  updateAdminAccount,
  deleteAdminAccount,
} from '@/api/adminAccountsApi';

export const useAdminAccountActions = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: payload => createAdminAccount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminAccounts']);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateAdminAccount(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminAccounts']);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: id => deleteAdminAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminAccounts']);
    },
  });

  return {
    createAccount: createMutation.mutateAsync,
    updateAccount: updateMutation.mutateAsync,
    deleteAccount: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

import { useMutation } from '@tanstack/react-query';
import { createProblem } from '@/api/adminProblemsApi';

export const useCreateProblem = () => {
  return useMutation({
    mutationFn: createProblem,
  });
};

// src/hooks/useTokenUsage.js
import { useQuery } from '@tanstack/react-query';
import { getTokenUsage } from '@/api/chattoken';

export const useTokenUsage = (teamId, problemId, sessionId, options = {}) => {
  return useQuery({
    queryKey: ['tokenUsage', teamId, problemId, sessionId],
    queryFn: () =>
      getTokenUsage({
        team_id: teamId,
        problem_id: problemId,
        session_id: sessionId,
      }),
    enabled: options.enabled ?? true,
  });
};

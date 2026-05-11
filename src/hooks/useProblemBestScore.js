// src/hooks/useProblemBestScore.js
import { useQuery } from '@tanstack/react-query';
import { fetchProblemBestScore } from '@/api/problemScoreApi';

export const useProblemBestScore = (problemId, teamId) => {
  return useQuery({
    queryKey: ['bestScore', problemId, teamId],
    queryFn: () => fetchProblemBestScore(problemId, teamId),
    enabled: problemId > 0 && teamId > 0,
  });
};

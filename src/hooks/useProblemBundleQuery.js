// src/hooks/useProblemBundleQuery.js

import { useQuery } from '@tanstack/react-query';
import api from '@/api/axiosInstance'; // axiosInstance 임포트 가정

/**
 * 특정 문제 및 팀의 챌린지 번들 정보(문제 설명, API, 세션 목록)를 조회합니다.
 * POST /problem/bundle 엔드포인트를 사용합니다.
 * * @param {number} problemId - 문제 ID (예: 1)
 * @param {number} teamId - 팀 ID
 * @returns {object} React Query 결과 객체
 */
export const useProblemBundleQuery = (problemId, teamId) => {
  // problemId와 teamId가 유효한 값일 때만 쿼리를 실행합니다.
  const isEnabled = problemId > 0 && teamId > 0;

  return useQuery({
    queryKey: ['problemBundle', problemId, teamId],
    queryFn: async () => {
      //   console.log(`[API] /problem/bundle 호출 시작 (Problem: ${problemId}, Team: ${teamId})`);
      const response = await api.post('/problem/bundle', {
        problem_id: problemId,
        team_id: teamId,
      });
      //   console.log(`[API] /problem/bundle 응답 성공`);
      return response.data;
    },
    enabled: isEnabled,
    // 데이터가 자주 변경되지 않으므로 5분 동안 fresh 상태 유지
    staleTime: 1000 * 60 * 5,
  });
};

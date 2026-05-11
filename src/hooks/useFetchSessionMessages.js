import { useQuery } from '@tanstack/react-query';
import api from '@/api/axiosInstance';
import useChatSessionStore from '@/stores/useChatSessionStore';

/**
 * 활성화된 세션의 대화 메시지 목록을 불러오는 훅
 * @param {number} problemId - 현재 문제 ID (쿼리 파라미터)
 * @param {number} teamId - 현재 팀 ID (쿼리 파라미터)
 * @returns {object} React Query 결과 (data: messages, isLoading, error)
 */
export const useFetchSessionMessages = (problemId, teamId) => {
  // ChatSessionStore에서 현재 활성화된 세션 ID를 가져옵니다. (경로 파라미터)
  const { sessionId } = useChatSessionStore();

  // 세션 ID가 유효한지 확인합니다.
  const isSessionActive = problemId && teamId && sessionId;

  return useQuery({
    // 쿼리 키: 세 ID 모두 포함하여, 하나라도 바뀌면 새로 요청
    queryKey: ['sessionMessages', problemId, teamId, sessionId],
    queryFn: async () => {
      if (!isSessionActive) {
        // console.log("⚠️ 활성화된 세션 ID가 없으므로 메시지 로드를 건너뜜.");
        return [];
      }

      // ⭐️⭐️⭐️ API 명세에 맞춰 경로 및 쿼리 파라미터 수정 ⭐️⭐️⭐️
      const API_PATH = `/chat/sessions/${sessionId}/messages`;

      // console.log(`📡 세션 메시지 요청 시작: ${API_PATH}`);

      const response = await api.get(API_PATH, {
        params: {
          team_id: teamId,
          problem_id: problemId,
        },
      });

      // console.log(`✅ 세션 메시지 로드 성공 (세션 ID: ${sessionId})`);
      return response.data; // 대화 메시지 배열 (messages)
    },
    // 활성화된 세션이 없을 때는 쿼리를 실행하지 않습니다.
    enabled: !!isSessionActive,
    staleTime: 5 * 60 * 1000,
  });
};

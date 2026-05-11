import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSession } from '@/api/chatApi';
import { useSessionStore } from '@/stores/useSessionStore';

export function useChatSession(teamId, problemId) {
  const queryClient = useQueryClient();
  const { sessionId, setSessionId, clearSession } = useSessionStore();

  const createSessionMutation = useMutation({
    mutationFn: title => createSession({ teamId, problemId, title }),
    onSuccess: data => {
      const newSessionId = data?.id ?? data;
      if (newSessionId) {
        setSessionId(newSessionId);
        queryClient.invalidateQueries({ queryKey: ['chatMessages', newSessionId] });
      }
    },
  });

  const handleSessionClick = newSessionId => {
    if (newSessionId === sessionId) return;
    setSessionId(newSessionId);
    queryClient.invalidateQueries({ queryKey: ['chatMessages', newSessionId, teamId, problemId] });
  };

  return {
    sessionId,
    setSessionId,
    clearSession,
    createSessionMutation,
    handleSessionClick,
  };
}

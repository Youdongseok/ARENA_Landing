import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSessionMessages, sendMessage } from '@/api/chatApi';

export function useChatMessages(sessionId, teamId, problemId, clearSession, setInputValue) {
  const queryClient = useQueryClient();

  // ✅ 1. 메시지 조회
  const { data: messages = [], isLoading: isMessagesLoading } = useQuery({
    queryKey: ['chatMessages', sessionId, teamId, problemId],
    queryFn: async () => {
      if (!sessionId) return [];
      try {
        const res = await getSessionMessages({ sessionId, teamId, problemId });
        return Array.isArray(res?.messages) ? res.messages : [];
      } catch (error) {
        if (error.response?.status === 404) {
          clearSession();
          queryClient.removeQueries({ queryKey: ['chatMessages'] });
        }
        return [];
      }
    },
    enabled: !!sessionId,
  });

  // ✅ 2. 메시지 전송
  const sendMessageMutation = useMutation({
    mutationFn: content => sendMessage({ sessionId, teamId, problemId, content }),
    onMutate: async content => {
      const trimmed = content.trim();
      if (!trimmed) return;
      const queryKey = ['chatMessages', sessionId, teamId, problemId];

      await queryClient.cancelQueries({ queryKey });
      const previousMessages = queryClient.getQueryData(queryKey);

      const userMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: Date.now(),
      };
      const aiLoadingMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: 'AI가 응답을 생성 중입니다...',
        isTyping: true,
      };

      // ✅ 입력창 초기화
      if (setInputValue) setInputValue('');

      queryClient.setQueryData(queryKey, old => [...(old || []), userMessage, aiLoadingMessage]);

      return { previousMessages, aiLoadingMessageId: aiLoadingMessage.id };
    },
    onSuccess: (res, variables, context) => {
      const aiContent = res.assistant_content || 'AI 응답 없음';
      queryClient.setQueryData(['chatMessages', sessionId, teamId, problemId], old =>
        (old || []).map(msg =>
          msg.id === context.aiLoadingMessageId
            ? { ...msg, content: aiContent, isTyping: false }
            : msg
        )
      );
    },
  });

  return { messages, isMessagesLoading, sendMessageMutation };
}

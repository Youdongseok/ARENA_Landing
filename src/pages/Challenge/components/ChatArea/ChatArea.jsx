// src/features/Challenge/components/ChatArea/ChatArea.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import useModalStore from '@/stores/useModalStore';
import { useChatSession } from '@/hooks/useChatSession';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useSessionStore } from '@/stores/useSessionStore';
import SessionList from './SessionList';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ChatControls from './ChatControls';

export default function ChatArea({
  ArenaIcon,
  SendIcon,
  ResetIcon,
  inputDisabled,
  problemId,
  teamId,
  sessions = [],
}) {
  const { openResetModal, openSubmitModal } = useModalStore();
  const { sessionStatus } = useSessionStore();
  const queryClient = useQueryClient();

  // 세션 훅
  const { sessionId, clearSession, createSessionMutation, handleSessionClick } = useChatSession(
    teamId,
    problemId
  );

  const [inputValue, setInputValue] = useState('');

  const { messages, isMessagesLoading, sendMessageMutation } = useChatMessages(
    sessionId,
    teamId,
    problemId,
    clearSession,
    setInputValue
  );

  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 메시지 전송
  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || sendMessageMutation.isPending) return;

    // ⭐ 세션이 없으면 새로 만들고 메시지 전송
    if (!sessionId) {
      const newSession = await createSessionMutation.mutateAsync('');
      const newSessionId = newSession?.id ?? newSession;

      if (newSessionId) {
        // 문제 다시 불러오기
        queryClient.invalidateQueries(['problemBundle', problemId, teamId]);

        // 첫 메시지 전송
        await sendMessageMutation.mutateAsync(trimmed);

        // 🔥 토큰 사용량 즉시 갱신
        queryClient.invalidateQueries(['tokenUsage']);
      }
    }

    // ⭐ 기존 세션이 있을 때
    else {
      sendMessageMutation.mutate(trimmed, {
        onSuccess: () => {
          // 🔥 토큰 사용량 즉시 갱신
          queryClient.invalidateQueries(['tokenUsage']);
        },
      });
    }
  };

  const displayMessages = Array.isArray(messages) ? messages : [];
  const isAiTyping = displayMessages.some(msg => msg.isTyping);

  // 입력 disabled 조건
  const isChatAreaDisabled =
    inputDisabled ||
    sendMessageMutation.isPending ||
    isAiTyping ||
    createSessionMutation.isPending ||
    sessionStatus === 'success' ||
    sessionStatus === 'fail';

  const isInitialState =
    !sessionId && displayMessages.length === 0 && !createSessionMutation.isPending;

  return (
    <div className="flex flex-col flex-grow h-full">
      <SessionList sessions={sessions} sessionId={sessionId} onSessionClick={handleSessionClick} />

      <div className="flex-1 bg-white shadow-xl rounded-[20px] flex flex-col overflow-hidden h-full">
        <ChatMessages
          messages={displayMessages}
          isLoading={isMessagesLoading}
          isInitialState={isInitialState}
          ArenaIcon={ArenaIcon}
          chatEndRef={chatEndRef}
        />

        <div className="h-[210px] md:h-[237px] p-4 md:p-6 bg-purple-50/20 shadow-[0_-3px_10px_rgba(0,0,0,0.25)] rounded-b-[20px] flex flex-col justify-end gap-3 flex-shrink-0">
          <ChatInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSend={handleSend}
            SendIcon={SendIcon}
            isDisabled={isChatAreaDisabled}
            sessionStatus={sessionStatus}
          />

          <ChatControls
            ResetIcon={ResetIcon}
            openResetModal={openResetModal}
            openSubmitModal={openSubmitModal}
            clearSession={clearSession}
            isDisabled={isChatAreaDisabled}
            sessionId={sessionId}
          />
        </div>
      </div>
    </div>
  );
}

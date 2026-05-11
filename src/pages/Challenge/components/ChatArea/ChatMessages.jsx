import React from 'react';
import ChatBubble from '../ChatBubble';

export default function ChatMessages({
  messages,
  isLoading,
  isInitialState,
  ArenaIcon,
  chatEndRef,
}) {
  if (isInitialState) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <img
          src={ArenaIcon}
          alt="ARENA Logo"
          className="max-w-[246px] max-h-[361px] w-[40vw] h-[40vh] object-contain mb-4"
        />
        <p className="heading-3 font-300 text-[#000000] mt-4 mb-6">
          AI와 대화를 시작하세요. <br /> 아래 입력창에 메시지를 입력해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 relative overflow-hidden">
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <img
          src={ArenaIcon}
          alt="ARENA Logo"
          className="max-w-[246px] max-h-[361px] w-[40vw] h-[40vh] object-contain opacity-30"
        />
      </div>
      <div className="relative z-10 pt-4 h-full overflow-y-auto">
        {isLoading ? (
          <div className="text-center p-4 text-gray-500">메시지를 불러오는 중...</div>
        ) : (
          messages.map(msg => (
            <ChatBubble
              key={msg.id || `${msg.role}-${msg.timestamp}`}
              role={msg.role}
              content={msg.content}
              isTyping={msg.isTyping || false}
            />
          ))
        )}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
}

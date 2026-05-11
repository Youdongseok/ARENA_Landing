import React, { useState, useEffect, useRef } from 'react';

// 💡 로딩 애니메이션 (3개의 점이 bounce)
const TypingIndicator = () => (
  <div className="flex space-x-1 ml-2">
    <div
      className="w-2 h-2 bg-white rounded-full animate-bounce"
      style={{ animationDelay: '0s' }}
    ></div>
    <div
      className="w-2 h-2 bg-white rounded-full animate-bounce"
      style={{ animationDelay: '0.2s' }}
    ></div>
    <div
      className="w-2 h-2 bg-white rounded-full animate-bounce"
      style={{ animationDelay: '0.4s' }}
    ></div>
  </div>
);

export default function ChatBubble({
  role,
  content,
  isTyping = false,
  animateOnMount = false,
  typingDelayMs = 0,
}) {
  const [displayedText, setDisplayedText] = useState(content);
  const [isVisible, setIsVisible] = useState(!animateOnMount || isTyping);
  const prevContentRef = useRef(content);
  const hasAnimatedRef = useRef(false);

  // 🪄 글자 타이핑 애니메이션 (새 메시지일 때만 실행)
  useEffect(() => {
    const shouldAnimateOnMount = animateOnMount && !hasAnimatedRef.current && !isTyping;
    const shouldAnimateOnUpdate = role === 'assistant' && content !== prevContentRef.current && !isTyping;

    if (shouldAnimateOnMount || shouldAnimateOnUpdate) {
      prevContentRef.current = content;
      hasAnimatedRef.current = true;
      setDisplayedText('');
      let i = 0;
      let interval;
      const timeout = setTimeout(() => {
        setIsVisible(true);
        interval = setInterval(() => {
          setDisplayedText(content.slice(0, i));
          i++;
          if (i > content.length) clearInterval(interval);
        }, animateOnMount ? 14 : 1);
      }, typingDelayMs);

      return () => {
        clearTimeout(timeout);
        if (interval) clearInterval(interval);
      };
    } else {
      prevContentRef.current = content;
      setIsVisible(true);
      setDisplayedText(content);
    }
  }, [animateOnMount, content, role, isTyping, typingDelayMs]);

  if (!isVisible) return null;

  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] p-3 rounded-2xl shadow-md ${
          role === 'user'
            ? 'bg-[#FF6289] text-white rounded-tl-2xl rounded-bl-2xl rounded-br-2xl rounded-tr-md'
            : 'bg-[#2D2F39] text-white rounded-tr-2xl rounded-br-2xl rounded-bl-2xl rounded-tl-md'
        }`}
      >
        {isTyping && role === 'assistant' ? (
          <div className="flex items-center">
            <span className="body-large font-300">AI가 응답을 생성 중입니다</span>
            <TypingIndicator />
          </div>
        ) : (
          <p className="body-large font-300 whitespace-pre-wrap">{displayedText}</p>
        )}
      </div>
    </div>
  );
}

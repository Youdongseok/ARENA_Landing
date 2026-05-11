import React from 'react';

export default function ChatInput({
  inputValue,
  setInputValue,
  handleSend,
  SendIcon,
  isDisabled,
  sessionStatus,
  compact = false,
}) {
  // 상태 정규화
  const normalizedStatus = sessionStatus?.toLowerCase();

  // ❗ 전체 성공 여부를 제거 — 현재 세션 상태만 체크
  const isSessionClosed = normalizedStatus === 'success' || normalizedStatus === 'fail';

  if (isSessionClosed) {
    const isSuccess = normalizedStatus === 'success';

    return (
      <div
        className={`w-full bg-white shadow-[0_0_4px_rgba(0,0,0,0.25)] rounded-[20px] flex flex-col items-center justify-center px-4 text-center ${
          compact ? 'h-16' : 'h-[130px] md:h-[153px]'
        }`}
      >
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          {isSuccess ? (
            <>
              이 대화는 이미 <b className="text-green-600">성공</b>하여 더 이상 대화를 이어갈 수
              없습니다.
            </>
          ) : (
            <>
              이 대화는 이미 <b className="text-red-500">실패</b>하여 더 이상 대화를 이어갈 수
              없습니다.
            </>
          )}
        </p>

        {isSuccess ? (
          <p className="text-gray-600 text-xs md:text-sm mt-2">
            하단의 <b>‘문제 다시 풀기’</b> 버튼을 클릭하여 새로 시도할 수 있습니다.
          </p>
        ) : (
          <p className="text-gray-600 text-xs md:text-sm mt-2">
            하단의 <b>‘문제 다시 풀기’</b> 버튼을 클릭하여 새로 시도할 수 있습니다.
          </p>
        )}
      </div>
    );
  }

  // 기본 입력창
  return (
    <div
      className={`w-full bg-white shadow-[0_0_4px_rgba(0,0,0,0.25)] rounded-[20px] flex items-start relative ${
        compact ? 'h-16 p-3' : 'h-[130px] md:h-[153px] p-3 md:p-4'
      }`}
    >
      <textarea
        className={`w-full h-full resize-none focus:outline-none body-large text-[#6B6B6B] pr-12 ${
          compact ? 'overflow-hidden pt-1' : 'overflow-y-auto'
        }`}
        placeholder={
          isDisabled ? '전송 중입니다...' : '프롬프트를 입력하세요 (Shift + Enter로 줄바꿈)'
        }
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        rows={compact ? 1 : undefined}
        disabled={isDisabled}
      />

      <button
        className={`flex-shrink-0 w-10 h-10 ${
          inputValue.trim() ? 'bg-[#FF6289] hover:bg-[#e6597c] cursor-pointer' : 'bg-[#D9DADB]'
        } rounded-full flex justify-center items-center absolute transition-colors duration-200 ${
          compact ? 'right-3 bottom-3' : 'right-4 bottom-4'
        } ${
          isDisabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={!inputValue.trim() || isDisabled}
        onClick={handleSend}
      >
        <img src={SendIcon} alt="Send" className="w-5 h-5" />
      </button>
    </div>
  );
}

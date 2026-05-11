import React from 'react';

export default function ChatControls({
  ResetIcon,
  openResetModal,
  openSubmitModal,
  isDisabled,
  sessionId,
}) {
  return (
    <div className="flex justify-between flex-shrink-0 gap-16">
      {/* 새로운 대화 시작 버튼 — 항상 활성화! */}
      <button
        className={`flex items-center justify-center flex-1 h-[44px] rounded-lg gap-2 transition-colors
          bg-[#D9DADB] hover:bg-[#BFC0C4] cursor-pointer`}
        onClick={() => {
          openResetModal(); // 무조건 새 대화 가능
        }}
      >
        <img src={ResetIcon} alt="Reset" className="w-4 h-4" />
        <span
          className="
            font-700 text-[#515151] leading-[26px]
            text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px]
          "
        >
          새로운 대화 시작
        </span>
      </button>

      {/* 제출하기 버튼 */}
      <button
        className={`flex-1 h-[44px] bg-[#FF6289] rounded-lg flex justify-center items-center transition-opacity ${
          isDisabled || !sessionId
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-[#e6597c] cursor-pointer'
        }`}
        onClick={openSubmitModal}
        disabled={isDisabled || !sessionId}
      >
        <span
          className="
            font-700 text-white leading-[26px]
            text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px]
          "
        >
          제출하기
        </span>
      </button>
    </div>
  );
}

// src/components/modals/DebugModal.jsx (경로 가정)

import React, { useCallback, useState } from 'react';
// 💡 Zustand 스토어 임포트
import useModalStore from '@/stores/useModalStore';

// === 아이콘 import (SVG를 URL/경로로 임포트) ===
// 경로는 프로젝트 구조에 맞게 수정하세요.
import CopySvg from '../../../assets/icons/copy.svg';
import HelpSvg from '../../../assets/icons/question.svg';
import CancelSvg from '../../../assets/icons/cancel.svg';
// ===========================================

// 디버그 정보 (이전과 동일)
const DEBUG_INFO = `
Debug Information:
Username: Unknown
User ID: 244b1780-d8a6-4705-bea4-39dc67feb65e
Session ID: 0e6ab5f6-794b-45ab-9649-28743a8b7ac5
Submission ID: Not Submitted
Challenge: getting_started
Track: tutorial_competition
Model: Unknown
`.trim();

// 닫기 버튼 컴포넌트
const CancelIcon = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute top-[36px] right-[42px] w-[18px] h-[18px] cursor-pointer"
  >
    <img src={CancelSvg} alt="닫기" className="w-full h-full" />
  </div>
);

/**
 * 챌린지 디버그 정보 모달 컴포넌트
 * - Zustand 스토어에서 상태를 직접 구독하여 열림/닫힘을 처리합니다.
 */
// 💡 props (isOpen, onClose) 제거
const DebugModal = () => {
  // --------------------------------------------------------
  // 💡 1. Zustand 스토어에서 상태와 액션 가져오기
  // --------------------------------------------------------
  // 상태 구독: 값이 변경될 때만 컴포넌트 리렌더링
  const isDebugModalOpen = useModalStore(state => state.isDebugModalOpen);
  // 액션 가져오기: 컴포넌트 리렌더링을 유발하지 않음
  const { closeDebugModal } = useModalStore();

  const [isCopied, setIsCopied] = useState(false);

  // '디버그 정보 복사' 버튼 클릭 핸들러
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(DEBUG_INFO);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('디버그 정보 복사에 실패했습니다.');
    }
  }, []);

  // '도움 요청' 버튼 클릭 핸들러
  const handleHelpRequest = useCallback(() => {
    alert('도움 요청 기능을 구현해야 합니다.');
    // closeDebugModal(); // 도움 요청 후 모달을 닫고 싶다면 이 주석을 해제하세요.
  }, []);

  // --------------------------------------------------------
  // 💡 2. 스토어 상태로 조건부 렌더링 (isOpen prop 대체)
  // --------------------------------------------------------
  if (!isDebugModalOpen) return null;

  return (
    // Overlay: z-[1000]로 최상단에 위치
    <div className="fixed inset-0 bg-[rgba(1,1,1,0.6)] flex justify-center items-center z-[1000]">
      <div
        // Modal Container
        className="relative w-[684px] h-[572px] bg-white rounded-[16px] px-[42px] box-border"
      >
        {/* 닫기 버튼: closeDebugModal 액션 연결 */}
        <CancelIcon onClick={closeDebugModal} />

        {/* Header (Help Icon + Title) */}
        <div className="absolute left-[42px] top-[67px] flex items-center gap-[13px]">
          {/* Help Icon: w-11(44px), h-11(44px) */}
          <div className="w-11 h-11 flex justify-center items-center">
            <img src={HelpSvg} alt="도움" className="w-full h-full" />
          </div>

          <h2 className="heading-2 font-700 text-black m-0">챌린지 디버그 정보</h2>
        </div>

        {/* Description */}
        <p
          className="absolute w-[567px] left-[42px] top-[141px] 
            heading-3 font-500
            text-[#6B6B6B] m-0"
        >
          아래 디버그 정보를 복사하고 서버에 지원 요청을 보내주세요.
        </p>

        {/* Debug Information Box */}
        <div
          className="absolute w-[600px] h-[220px] left-[42px] top-[219px] 
            bg-[#F1F1EF] rounded-[16px] p-[14px] pl-[28px] pr-7 overflow-auto"
        >
          <pre className="body-large font-300 text-black whitespace-pre-wrap m-0">{DEBUG_INFO}</pre>
        </div>

        {/* Action Buttons Container */}
        <div className="absolute left-[42px] top-[495px] w-[600px] flex justify-between items-center">
          {/* 디버그 정보 복사 버튼 */}
          <div
            onClick={handleCopy}
            className="flex items-center cursor-pointer gap-[6px] transition-opacity hover:opacity-80"
          >
            {/* Copy Icon: w-6, h-6 */}
            <img src={CopySvg} alt="복사" className="w-6 h-6" />

            <span className="heading-3 font-500 text-[#6B6B6B]">
              {isCopied ? '복사 완료!' : '디버그 정보 복사'}
            </span>
          </div>

          {/* 도움 요청 버튼 */}
          <button
            type="button"
            onClick={handleHelpRequest}
            // Button Styles
            className="flex justify-center items-center w-[201px] h-[46px] 
                bg-[#837BBD] rounded-[16px] px-[30px] py-[12px] gap-2.5 
                heading-3 font-500 text-white 
                cursor-pointer border-none transition-colors hover:bg-indigo-500"
          >
            도움 요청
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebugModal;

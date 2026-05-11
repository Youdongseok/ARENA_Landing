import React, { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import useModalStore from '@/stores/useModalStore';
import { useSessionStore } from '@/stores/useSessionStore';

import CancelSvg from '../../../assets/icons/cancel.svg';
import ArenaSvg from '../../../assets/icons/Arena.svg';
import DangerSvg from '../../../assets/icons/danger.svg';

const CancelIcon = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute top-[28px] right-[28px] w-[18px] h-[18px] cursor-pointer"
  >
    <img src={CancelSvg} alt="닫기" className="w-full h-full" />
  </div>
);

const ResetModal = () => {
  const isResetModalOpen = useModalStore(state => state.isResetModalOpen);
  const { closeResetModal } = useModalStore();
  const { clearSession } = useSessionStore();
  const queryClient = useQueryClient();

  const handleReset = useCallback(() => {
    // ✅ 세션 클리어 및 캐시 초기화
    clearSession();
    queryClient.removeQueries({ queryKey: ['chatMessages'] });
    queryClient.invalidateQueries(['problemBundle']);

    // 모달 닫기
    closeResetModal();
  }, [clearSession, queryClient, closeResetModal]);

  if (!isResetModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(1,1,1,0.6)] flex justify-center items-center z-[1000]">
      <div className="relative w-[403.65px] h-[586.46px] bg-white rounded-[16px] p-[30px] box-border">
        <CancelIcon onClick={closeResetModal} />

        {/* 헤더 */}
        <div className="absolute left-[30px] top-[17px] w-[105px] h-[42px] flex items-center">
          <div className="w-[29px] h-[42px] flex justify-center items-center">
            <img src={ArenaSvg} alt="ARENA 로고" className="w-full h-full" />
          </div>
          <span className="ml-[9px] heading-3 font-700 text-[#FF084A]">ARENA</span>
        </div>

        {/* 아이콘 */}
        <div className="absolute top-[215px] left-1/2 -translate-x-1/2 w-[70px] h-[70px] flex justify-center items-center">
          <img src={DangerSvg} alt="위험 경고" className="w-full h-full" />
        </div>

        {/* 메시지 */}
        <p className="absolute w-[301.76px] left-1/2 -translate-x-1/2 top-[334.91px] text-center heading-3 font-500 text-black m-0">
          현재 입력한 내용과 진행 중인 모든 작업이 즉시 중지되며, 되돌릴 수 없습니다.
        </p>

        {/* 버튼 */}
        <button
          type="button"
          onClick={handleReset}
          className="absolute w-[343.2px] h-[60.45px] left-[30.22px] top-[496.28px]
            flex justify-center items-center gap-[4.88px]
            bg-[#FF4854] rounded-[29.25px] cursor-pointer
            hover:bg-red-600 transition duration-200"
        >
          <span className="heading-3 font-500 text-white">새로운 대화 시작</span>
        </button>
      </div>
    </div>
  );
};

export default ResetModal;

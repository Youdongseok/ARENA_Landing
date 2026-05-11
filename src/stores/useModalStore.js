import { create } from 'zustand';

/**
 * ✅ 안정화된 Zustand 모달 상태 관리 스토어
 * - closeAllModals() 남용 제거
 * - 로딩 → 성공/실패 전환 시 안전한 상태 유지
 */
const useModalStore = create(set => ({
  // --------------------------------------------------------
  // 1️⃣ 상태 정의
  // --------------------------------------------------------
  isDebugModalOpen: false,
  isResetModalOpen: false,
  isSubmitModalOpen: false,
  isLoadingModalOpen: false,
  isFailedModalOpen: false,
  isSuccessModalOpen: false,

  // 제출 결과 데이터
  challengeResults: [],

  // 등록된 콜백 (Reset / Submit)
  resetChatAction: () => {
    console.error('Reset action not yet registered in store.');
  },
  submitAction: () => {
    console.error('Submit action not yet registered in store.');
  },

  // --------------------------------------------------------
  // 2️⃣ 액션 정의
  // --------------------------------------------------------

  // 콜백 등록
  setResetChatAction: action => set({ resetChatAction: action }),
  setSubmitAction: action => set({ submitAction: action }),

  // 챌린지 결과 저장
  setChallengeResults: results => set({ challengeResults: results }),

  // --------------------------------------------------------
  // 3️⃣ 모달 제어 액션
  // --------------------------------------------------------

  /** 모든 모달 닫기 */
  closeAllModals: () =>
    set({
      isDebugModalOpen: false,
      isResetModalOpen: false,
      isSubmitModalOpen: false,
      isLoadingModalOpen: false,
      isFailedModalOpen: false,
      isSuccessModalOpen: false,
    }),

  // 디버그 모달
  openDebugModal: () =>
    set({
      isDebugModalOpen: true,
      isResetModalOpen: false,
      isSubmitModalOpen: false,
      isLoadingModalOpen: false,
      isFailedModalOpen: false,
      isSuccessModalOpen: false,
    }),
  closeDebugModal: () => set({ isDebugModalOpen: false }),

  // 초기화 모달
  openResetModal: () =>
    set({
      isResetModalOpen: true,
      isDebugModalOpen: false,
      isSubmitModalOpen: false,
      isLoadingModalOpen: false,
      isFailedModalOpen: false,
      isSuccessModalOpen: false,
    }),
  closeResetModal: () => set({ isResetModalOpen: false }),

  // 제출 모달
  openSubmitModal: () =>
    set({
      isSubmitModalOpen: true,
      isDebugModalOpen: false,
      isResetModalOpen: false,
      isLoadingModalOpen: false,
      isFailedModalOpen: false,
      isSuccessModalOpen: false,
    }),
  closeSubmitModal: () => set({ isSubmitModalOpen: false }),

  // 로딩 모달
  openLoadingModal: () =>
    set({
      isLoadingModalOpen: true,
      isDebugModalOpen: false,
      isResetModalOpen: false,
      isSubmitModalOpen: false,
      isFailedModalOpen: false,
      isSuccessModalOpen: false,
    }),
  closeLoadingModal: () => set({ isLoadingModalOpen: false }),

  // 실패 모달
  openFailedModal: () =>
    set({
      isFailedModalOpen: true,
      isLoadingModalOpen: false,
      isSubmitModalOpen: false,
      isSuccessModalOpen: false,
    }),
  closeFailedModal: () => set({ isFailedModalOpen: false }),

  // 성공 모달
  openSuccessModal: () =>
    set({
      isSuccessModalOpen: true,
      isLoadingModalOpen: false,
      isSubmitModalOpen: false,
      isFailedModalOpen: false,
    }),
  closeSuccessModal: () => set({ isSuccessModalOpen: false }),
}));

export default useModalStore;

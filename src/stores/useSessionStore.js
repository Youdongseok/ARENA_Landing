import { create } from 'zustand';

export const useSessionStore = create(set => ({
  sessionId: null, // 현재 선택된 세션 ID
  sessionStatus: 'unsubmitted', // ✅ 세션 상태 (success / fail / unsubmitted)

  // 세션 ID 설정
  setSessionId: id => set({ sessionId: id }),

  // 세션 상태 설정
  setSessionStatus: status => set({ sessionStatus: status }),

  // 초기화
  clearSession: () => set({ sessionId: null, sessionStatus: 'unsubmitted' }),
}));

// src/stores/useChatSessionStore.js
import { create } from 'zustand';

const useChatSessionStore = create(set => ({
  sessionId: null,
  isSessionLoading: false,

  setSessionId: id => set({ sessionId: id, isSessionLoading: false }),
  setLoading: loading => set({ isSessionLoading: loading }),
  resetSessionState: () => set({ sessionId: null, isSessionLoading: false }),
}));

export default useChatSessionStore;

// src/AppInitializer.jsx
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { getMe, refreshToken } from '@/api/auth';

export default function AppInitializer({ children }) {
  const { login, logout } = useAuthStore();

  useEffect(() => {
    async function init() {
      try {
        // 1) access_token으로 상태 확인
        const me = await getMe();
        login(me);
      } catch {
        // 2) access_token 만료 → refresh 시도
        try {
          await refreshToken();

          // refresh 성공 → 다시 me 호출
          const me = await getMe();
          login(me);
        } catch {
          // 3) refresh 실패 → 완전 로그아웃
          logout();
        }
      }
    }

    init();
  }, [login, logout]);

  return children;
}

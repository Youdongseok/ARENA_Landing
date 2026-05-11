// src/routes/AdminGuard.jsx
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAdminMe, adminRefreshToken } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';

export default function AdminGuard({ children }) {
  const { adminLoginState, adminLogout, isAdminLoggedIn } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        // 1) access_token으로 admin 상태 확인
        const me = await getAdminMe();
        adminLoginState(me);
      } catch {
        // 2) access_token 만료 → refresh 시도
        try {
          await adminRefreshToken();
          const me = await getAdminMe();
          adminLoginState(me);
        } catch {
          // 3) refresh 실패 → 로그아웃
          adminLogout();
        }
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [adminLoginState, adminLogout]);

  if (loading) return <div>Loading...</div>;
  if (!isAdminLoggedIn) return <Navigate to="/admin/login" replace />;

  return children;
}

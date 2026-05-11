import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getMe } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';

export default function GoogleAuthSuccess() {
  const navigate = useNavigate();
  const loginToStore = useAuthStore(state => state.login);

  useEffect(() => {
    let cancelled = false;

    const syncUser = async () => {
      try {
        const me = await getMe();
        if (cancelled) return;
        loginToStore(me);
        navigate('/dashboard', { replace: true });
      } catch {
        if (!cancelled) {
          navigate('/login?social_error=google_sync_failed', { replace: true });
        }
      }
    };

    syncUser();
    return () => {
      cancelled = true;
    };
  }, [loginToStore, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFBFC] px-6">
      <div className="w-full max-w-[520px] rounded-[24px] border border-[#E7ECF3] bg-white px-8 py-10 text-center shadow-md">
        <p className="text-sm font-semibold tracking-[0.18em] text-[#FF4854]/80">GOOGLE</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0F172A]">
          구글 로그인 확인 중
        </h1>
        <p className="mt-3 text-[15px] text-[#64748B]">
          인증이 끝나면 자동으로 대시보드로 이동합니다.
        </p>
      </div>
    </div>
  );
}

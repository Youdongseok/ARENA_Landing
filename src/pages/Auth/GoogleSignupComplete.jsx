import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { completeGoogleSignup } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';

export default function GoogleSignupComplete() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const loginToStore = useAuthStore(state => state.login);
  const [teamname, setTeamname] = useState('');
  const token = searchParams.get('token') || '';

  const isTokenMissing = useMemo(() => !token, [token]);

  const completeMutation = useMutation({
    mutationFn: completeGoogleSignup,
    onSuccess: data => {
      loginToStore(data);
      navigate('/dashboard', { replace: true });
    },
    onError: error => {
      const message =
        error?.response?.status === 409
          ? '이미 사용 중인 사용자명입니다.'
          : error?.response?.data?.detail || '구글 회원가입을 완료하지 못했습니다.';
      alert(message);
    },
  });

  const handleSubmit = () => {
    if (isTokenMissing) {
      alert('구글 가입 인증 정보가 없습니다. 다시 시도해 주세요.');
      return;
    }
    if (!teamname.trim()) {
      alert('사용자명을 입력해 주세요.');
      return;
    }
    completeMutation.mutate({
      token,
      teamname: teamname.trim(),
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFBFC] px-6">
      <div className="w-full max-w-[620px] rounded-[24px] border border-[#E7ECF3] bg-white px-8 py-10 shadow-md">
        <p className="text-sm font-semibold tracking-[0.18em] text-[#FF4854]/80">GOOGLE SIGNUP</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0F172A]">
          사용자명을 정해 주세요
        </h1>
        <p className="mt-3 text-[15px] text-[#64748B]">
          구글 인증은 완료되었습니다. 서비스에서 사용할 사용자명만 입력하면 가입이 끝납니다.
        </p>

        <div className="mt-10">
          <label htmlFor="google-teamname" className="mb-3 block text-sm font-semibold text-[#475569]">
            사용자명
          </label>
          <input
            id="google-teamname"
            type="text"
            value={teamname}
            onChange={event => setTeamname(event.target.value)}
            placeholder="사용자명"
            className="w-full rounded-[16px] border border-[#D9DADB] px-4 py-4 text-[16px] font-semibold text-[#334155] outline-none transition focus:border-[#FF4854]"
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={completeMutation.isPending || isTokenMissing}
          className={`mt-8 h-[58px] w-full rounded-[16px] text-white heading-3 font-500 transition-colors ${
            completeMutation.isPending || isTokenMissing
              ? 'cursor-not-allowed bg-gray-400'
              : 'bg-[#FF4854] hover:bg-red-600'
          }`}
        >
          {completeMutation.isPending ? '가입 완료 중...' : '구글 회원가입 완료'}
        </button>
      </div>
    </div>
  );
}

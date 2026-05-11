import React, { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const SIGNUP_EMAIL_VERIFICATION_STORAGE_KEY = 'arena_signup_email_verification';

export default function EmailVerificationComplete() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('email_verification_token') || '';
  const email = searchParams.get('verified_email') || '';

  useEffect(() => {
    if (!token || !email) {
      return;
    }

    window.localStorage.setItem(
      SIGNUP_EMAIL_VERIFICATION_STORAGE_KEY,
      JSON.stringify({
        token,
        email,
      })
    );
  }, [email, token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFBFC] px-6">
      <div className="w-full max-w-[620px] rounded-[24px] border border-[#E7ECF3] bg-white px-8 py-10 shadow-md">
        <p className="text-sm font-semibold tracking-[0.18em] text-[#FF4854]/80">EMAIL VERIFIED</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0F172A]">
          이메일 인증이 완료되었습니다
        </h1>
        <p className="mt-3 text-[15px] leading-7 text-[#64748B]">
          원래 열어둔 회원가입 탭이 있다면 자동으로 인증 완료 상태로 바뀝니다.
          <br />
          바로 이어서 회원가입을 진행해 주세요.
        </p>

        {email ? (
          <div className="mt-6 rounded-[18px] border border-[#DDEFE4] bg-[#F5FBF7] px-4 py-4 text-sm text-[#166534]">
            <p className="font-semibold">인증된 이메일</p>
            <p className="mt-1 break-all">{email}</p>
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => navigate('/signup', { replace: true })}
            className="flex h-[56px] w-full items-center justify-center rounded-[16px] bg-[#FF4854] text-[16px] font-semibold text-white transition hover:bg-red-600"
          >
            회원가입 계속하기
          </button>

          <Link
            to="/login"
            className="flex h-[56px] w-full items-center justify-center rounded-[16px] border border-[#E2E8F0] bg-white text-[16px] font-semibold text-[#0F172A] transition hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
          >
            로그인으로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { requestSignupEmailVerification, signup } from '@/api/auth';
import BackButtonIcon from '@/assets/icons/backbtn.svg';
import NoSeeIcon from '@/assets/icons/nosee.svg';
import SeeIcon from '@/assets/icons/see.svg';

const SIGNUP_EMAIL_VERIFICATION_STORAGE_KEY = 'arena_signup_email_verification';

function readStoredSignupVerification() {
  try {
    const raw = window.localStorage.getItem(SIGNUP_EMAIL_VERIFICATION_STORAGE_KEY);
    if (!raw) {
      return { token: '', email: '' };
    }

    const parsed = JSON.parse(raw);
    return {
      token: parsed?.token || '',
      email: parsed?.email || '',
    };
  } catch {
    return { token: '', email: '' };
  }
}

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [verification, setVerification] = useState(() => {
    const urlToken = searchParams.get('email_verification_token') || '';
    const urlEmail = searchParams.get('verified_email') || '';
    if (urlToken && urlEmail) {
      return { token: urlToken, email: urlEmail };
    }
    return readStoredSignupVerification();
  });
  const [email, setEmail] = useState(searchParams.get('verified_email') || verification.email || '');
  const [teamname, setTeamname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const emailVerificationToken = verification.token;
  const verifiedEmail = verification.email;
  const isEmailVerified = useMemo(
    () => !!emailVerificationToken && !!verifiedEmail,
    [emailVerificationToken, verifiedEmail]
  );

  useEffect(() => {
    if (verifiedEmail) {
      setEmail(verifiedEmail);
    }
  }, [verifiedEmail]);

  useEffect(() => {
    const urlToken = searchParams.get('email_verification_token') || '';
    const urlEmail = searchParams.get('verified_email') || '';
    if (!urlToken || !urlEmail) {
      return;
    }

    const nextVerification = { token: urlToken, email: urlEmail };
    window.localStorage.setItem(SIGNUP_EMAIL_VERIFICATION_STORAGE_KEY, JSON.stringify(nextVerification));
    setVerification(nextVerification);
  }, [searchParams]);

  useEffect(() => {
    const handleStorage = event => {
      if (event.key !== SIGNUP_EMAIL_VERIFICATION_STORAGE_KEY) {
        return;
      }

      const nextVerification = readStoredSignupVerification();
      setVerification(nextVerification);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const requestVerificationMutation = useMutation({
    mutationFn: requestSignupEmailVerification,
    onSuccess: () => {
      alert('인증 메일을 보냈습니다. 메일함에서 링크를 확인해 주세요.');
    },
    onError: error => {
      alert(error?.response?.data?.detail || '인증 메일을 보내지 못했습니다. 다시 시도해 주세요.');
    },
  });

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      window.localStorage.removeItem(SIGNUP_EMAIL_VERIFICATION_STORAGE_KEY);
      navigate('/login?signup=success', { replace: true });
    },
    onError: error => {
      alert(error?.response?.data?.detail || '회원가입 중 문제가 발생했습니다. 다시 시도해 주세요.');
    },
  });

  const handleSendVerification = () => {
    if (!email.trim()) {
      alert('이메일을 입력해 주세요.');
      return;
    }
    requestVerificationMutation.mutate({ email: email.trim().toLowerCase() });
  };

  const handleSubmit = () => {
    if (!isEmailVerified) {
      alert('이메일 인증을 먼저 완료해 주세요.');
      return;
    }
    if (!teamname.trim()) {
      alert('사용자명을 입력해 주세요.');
      return;
    }
    if (!password.trim()) {
      alert('비밀번호를 입력해 주세요.');
      return;
    }
    if (!passwordConfirm.trim()) {
      alert('비밀번호 확인을 입력해 주세요.');
      return;
    }
    if (password !== passwordConfirm) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    signupMutation.mutate({
      teamname: teamname.trim(),
      password,
      email_verification_token: emailVerificationToken,
    });
  };

  const inputLabelStyle = 'heading-3 font-500 text-[#6B6B6B] mb-2 md:mb-4';
  const inputFieldStyle =
    'w-full heading-3 font-700 outline-none border-b border-[#D9DADB] focus:border-[#6B6B6B] pb-2 text-[#6B6B6B] bg-transparent placeholder:text-[#D9DADB]';

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="max-w-[675px] w-full bg-white rounded-[16px] shadow-xl flex flex-col min-h-screen md:min-h-0 md:my-10 overflow-hidden">
        <header className="px-8 pt-8 pb-4 border-b border-[#D9DADB] rounded-t-[16px]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="flex h-8 w-8 items-center justify-center cursor-pointer"
              aria-label="로그인 화면으로 돌아가기"
            >
              <img src={BackButtonIcon} alt="" className="h-5 w-5" aria-hidden="true" />
            </button>
            <h1 className="heading-3 font-500 text-black">회원가입</h1>
          </div>
        </header>

        <main className="flex flex-col p-8 md:p-10">
          <h2 className="heading-2 font-500 text-black mt-8 mb-12">
            사용할 정보를
            <br /> 입력해 주세요.
          </h2>

          <div className="flex flex-col space-y-6">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-[#0F172A]">이메일 인증 후 가입할 수 있어요</h3>
              <p className="mt-3 text-[15px] leading-7 text-[#64748B]">
                입력한 이메일로 인증 링크를 보내드리고,
                <br />
                인증이 완료되면 그 이메일이 로그인용 아이디가 됩니다.
              </p>
            </div>

            <div className="flex flex-col">
              <label htmlFor="signup-email-input" className={inputLabelStyle}>
                이메일
              </label>
              <div className="flex items-end gap-3">
                <input
                  id="signup-email-input"
                  type="email"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  readOnly={isEmailVerified}
                  placeholder="이메일"
                  className={`${inputFieldStyle} ${isEmailVerified ? 'cursor-not-allowed text-[#94A3B8]' : ''}`}
                />
                <button
                  type="button"
                  onClick={handleSendVerification}
                  disabled={requestVerificationMutation.isPending || isEmailVerified}
                  className={`h-[44px] shrink-0 rounded-[14px] px-4 text-sm font-semibold transition ${
                    requestVerificationMutation.isPending || isEmailVerified
                      ? 'cursor-not-allowed bg-[#E2E8F0] text-[#94A3B8]'
                      : 'bg-[#FF4854] text-white hover:bg-red-600'
                  }`}
                >
                  {isEmailVerified ? '인증 완료' : requestVerificationMutation.isPending ? '전송 중...' : '인증 메일 보내기'}
                </button>
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="signup-name-input" className={inputLabelStyle}>
                사용자명
              </label>
              <input
                id="signup-name-input"
                type="text"
                className={inputFieldStyle}
                placeholder="사용자명"
                value={teamname}
                onChange={event => setTeamname(event.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="signup-password-input" className={inputLabelStyle}>
                비밀번호
              </label>
              <div className="relative">
                <input
                  id="signup-password-input"
                  type={showPassword ? 'text' : 'password'}
                  className={`${inputFieldStyle} pr-12`}
                  placeholder="비밀번호"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-0 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center cursor-pointer"
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                >
                  <img
                    src={showPassword ? NoSeeIcon : SeeIcon}
                    alt=""
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="signup-password-confirm-input" className={inputLabelStyle}>
                비밀번호 확인
              </label>
              <div className="relative">
                <input
                  id="signup-password-confirm-input"
                  type={showPasswordConfirm ? 'text' : 'password'}
                  className={`${inputFieldStyle} pr-12`}
                  placeholder="비밀번호 확인"
                  value={passwordConfirm}
                  onChange={event => setPasswordConfirm(event.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(prev => !prev)}
                  className="absolute right-0 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center cursor-pointer"
                  aria-label={showPasswordConfirm ? '비밀번호 확인 숨기기' : '비밀번호 확인 보기'}
                >
                  <img
                    src={showPasswordConfirm ? NoSeeIcon : SeeIcon}
                    alt=""
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        </main>

        <footer className="px-8 pt-4 pb-8 mt-4">
          <p className="mb-5 text-center text-sm text-[#6B6B6B]">
            이미 계정이 있나요?{' '}
            <Link to="/login" className="font-600 text-[#FF4854] hover:underline">
              로그인
            </Link>
          </p>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={signupMutation.isPending}
            className={`w-full h-[58px] rounded-[16px] text-white heading-3 font-500 transition-colors cursor-pointer ${
              signupMutation.isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FF4854] hover:bg-red-600'
            }`}
          >
            {signupMutation.isPending ? '회원가입 중...' : '회원가입'}
          </button>
        </footer>
      </div>
    </div>
  );
}

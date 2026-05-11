// src/pages/Login/Login.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { getGoogleAuthStartUrl, login } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';
import SeeIcon from '@/assets/icons/see.svg';
import NoSeeIcon from '@/assets/icons/nosee.svg';
import GoogleColorIcon from '@/assets/icons/google-color.svg';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const loginToStore = useAuthStore(state => state.login);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    login_id: '',
    password: '',
  });

  //  formData 변경 핸들러
  const handleChange = e => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id === 'id-input' ? 'login_id' : 'password']: value,
    }));
  };

  //  로그인 요청
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: data => {
      loginToStore(data); //스토어에 저장
      navigate('/dashboard');
    },
    onError: () => {
      const errorMessage = '로그인 실패: 이메일/비밀번호를 확인해주세요.';
      alert(errorMessage);
    },
  });

  //  로그인 제출
  const handleSubmit = useCallback(() => {
    if (!formData.login_id || !formData.password) {
      alert('이메일과 비밀번호를 입력해 주세요.');
      return;
    }
    loginMutation.mutate(formData);
  }, [formData, loginMutation]);

  //  전역 엔터키 이벤트 등록 (어디에서든 엔터 누르면 로그인)
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSubmit]);

  useEffect(() => {
    const socialError = searchParams.get('social_error');
    if (!socialError) return;
    if (socialError === 'google_account_not_found') {
      alert('연결된 구글 계정이 없습니다. 플랫폼 회원가입을 먼저 진행해 주세요.');
      return;
    }
    alert('구글 로그인 처리 중 문제가 발생했습니다. 다시 시도해 주세요.');
  }, [searchParams]);

  useEffect(() => {
    if (searchParams.get('signup') === 'success') {
      alert('회원가입이 완료되었습니다. 로그인해 주세요.');
    }
  }, [searchParams]);

  const isPending = loginMutation.isPending;

  const inputLabelStyle = 'heading-3 font-500 text-[#6B6B6B] mb-2 md:mb-4';
  const inputFieldStyle =
    'w-full heading-3 font-700 outline-none border-b border-[#D9DADB] focus:border-[#6B6B6B] pb-2 text-[#6B6B6B] bg-transparent placeholder:text-[#D9DADB]';

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div
        className="max-w-[675px] w-full bg-white rounded-[16px] shadow-xl flex flex-col 
                  min-h-screen md:min-h-0 md:my-10 overflow-hidden"
      >
        {/* Header */}
        <header className="px-8 pt-8 pb-4 border-b border-[#D9DADB] rounded-t-[16px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="heading-3 font-500 text-black">로그인</h1>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex flex-col p-8 md:p-10">
          <h2 className="heading-2 font-500 text-black mt-8 mb-12">
            로그인 정보를
            <br /> 입력해 주세요.
          </h2>

          <form className="flex flex-col space-y-6" onSubmit={e => e.preventDefault()}>
            {/* 이메일 */}
            <div className="flex flex-col">
              <label htmlFor="id-input" className={inputLabelStyle}>
                이메일
              </label>
              <input
                id="id-input"
                type="email"
                className={inputFieldStyle}
                placeholder="이메일"
                value={formData.login_id}
                onChange={handleChange}
              />
            </div>

            {/* 비밀번호 */}
            <div className="flex flex-col">
              <label htmlFor="pw-input" className={inputLabelStyle}>
                비밀번호
              </label>
              <div className="relative">
                <input
                  id="pw-input"
                  type={showPassword ? 'text' : 'password'}
                  className={`${inputFieldStyle} pr-12`}
                  placeholder="비밀번호"
                  value={formData.password}
                  onChange={handleChange}
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
          </form>
        </main>

        {/* Footer */}
        <footer className="px-8 pt-4 pb-8 mt-8">
          <button
            type="button"
            onClick={() => {
              window.location.href = getGoogleAuthStartUrl('login');
            }}
            className="mb-5 flex h-[58px] w-full items-center justify-center gap-3 rounded-[16px] border border-[#E2E8F0] bg-white text-[16px] font-600 text-[#0F172A] transition hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
          >
            <img src={GoogleColorIcon} alt="" className="h-[18px] w-[18px]" aria-hidden="true" />
            Google 로그인
          </button>

          <p className="mb-5 text-center text-sm text-[#6B6B6B]">
            아직 계정이 없나요?{' '}
            <Link to="/signup" className="font-600 text-[#FF4854] hover:underline">
              회원가입
            </Link>
          </p>

          <button
            onClick={handleSubmit}
            disabled={isPending}
            className={`w-full h-[58px] rounded-[16px] text-white heading-3 font-500 transition-colors cursor-pointer
              ${isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FF4854] hover:bg-red-600'}`}
          >
            {isPending ? '로그인 중...' : '로그인'}
          </button>
        </footer>
      </div>
    </div>
  );
}

// src/pages/admin/AdminLogin.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackBtn from '@/assets/icons/backbtn.svg';
import { useMutation } from '@tanstack/react-query';
import { adminLogin } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';

export default function AdminLogin() {
  const navigate = useNavigate();

  // ⭐ 관리자 상태 저장 함수 (store)
  const setAdminLoggedIn = useAuthStore(state => state.adminLoginState);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = e => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id === 'id-input' ? 'username' : 'password']: value,
    }));
  };

  const mutation = useMutation({
    mutationFn: adminLogin,
    onSuccess: () => {
      // ⭐ Zustand에 관리자 로그인 상태 저장
      setAdminLoggedIn({ username: formData.username });

      navigate('/admin/leaderboard');
    },
    onError: () => {
      alert('로그인 실패: 관리자 계정을 확인하세요.');
    },
  });

  const handleSubmit = () => {
    if (!formData.username || !formData.password) {
      alert('아이디와 비밀번호를 입력하세요.');
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="max-w-[675px] w-full bg-white rounded-[16px] shadow-xl flex flex-col">
        {/* Header */}
        <header className="px-8 pt-8 pb-4 border-b border-[#D9DADB] rounded-t-[16px]">
          <div className="flex items-center">
            <img
              src={BackBtn}
              alt="back"
              className="w-[10px] h-[18px] cursor-pointer"
              onClick={() => navigate(-1)}
            />
            <h1 className="heading-3 font-500 text-black ml-4">관리자 로그인</h1>
          </div>
        </header>

        {/* Main */}
        <main className="flex flex-col p-8 md:p-10">
          <h2 className="heading-2 font-500 text-black mt-8 mb-12">
            로그인 정보를
            <br /> 입력해 주세요.
          </h2>

          <div className="flex flex-col space-y-6">
            <div className="flex flex-col">
              <label htmlFor="id-input" className="heading-3 font-500 text-[#6B6B6B] mb-2">
                관리자 아이디
              </label>
              <input
                id="id-input"
                type="text"
                className="border-b border-[#D9DADB] pb-2"
                value={formData.username}
                onChange={handleChange}
                placeholder="아이디"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="pw-input" className="heading-3 font-500 text-[#6B6B6B] mb-2">
                관리자 비밀번호
              </label>
              <input
                id="pw-input"
                type="password"
                className="border-b border-[#D9DADB] pb-2"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호"
              />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-8 pt-4 pb-8">
          <button
            onClick={handleSubmit}
            className="w-full h-[58px] bg-[#FF4854] text-white rounded-[16px]"
          >
            관리자 로그인
          </button>
        </footer>
      </div>
    </div>
  );
}

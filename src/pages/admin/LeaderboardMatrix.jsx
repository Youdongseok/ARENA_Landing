// src/pages/Leaderboard/LeaderboardMatrix.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProblemStatusMatrix from './ProblemStatusMatrix';
import AdminProblemToggleList from './AdminProblemToggleList';

const LeaderboardMatrix = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#F8FAFC] p-6 gap-[40px] pb-40">
      {/* 매트릭스 */}
      <div className="w-full max-w-[1600px] flex flex-col items-start gap-4">
        <div className="w-full rounded-[24px] border border-[#E7ECF3] bg-white px-8 py-7 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold tracking-[0.18em] text-[#FF4854]/80">ADMIN MATRIX</p>
          <h1 className="mt-2 heading-1 font-700 text-[#0F172A]">사용자별 문제풀이 현황</h1>
          <p className="mt-2 text-[15px] text-[#64748B]">
            각 사용자 계정이 어떤 문제를 해결했는지 한눈에 볼 수 있습니다.
          </p>
        </div>
        <ProblemStatusMatrix />
      </div>
      <div className="w-full max-w-[1600px]">
        <AdminProblemToggleList />
      </div>
      {/* 🔙 돌아가기 버튼 */}
      <div className="w-full flex justify-center">
        <button
          onClick={() => navigate('/admin/leaderboard')}
          className="rounded-lg bg-[#FF4854] px-5 py-2 text-white heading-3 font-500 hover:bg-[#e13a47]"
        >
          ← 순위 차트로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default LeaderboardMatrix;

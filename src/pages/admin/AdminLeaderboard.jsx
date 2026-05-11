// src/pages/Leaderboard/Leaderboard.jsx

import React from 'react';
import PointChart from './PointChart';
import AdminLeaderboardTable from './AdminLeaderboardTable';
import AdminLeaderboardToggle from './AdminLeaderboardToggle';
import AdminMatrixToggle from './AdminMatrixToggle';
import AdminTotalGraphToggle from './AdminTotalGraphToggle';

const Leaderboard = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center p-6 gap-[40px] pb-40">
      {/* 🔥 양옆 2컬럼 레이아웃 */}
      <div
        className="
          w-full
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-10
        "
      >
        {/* 왼쪽: 점수 차트 */}
        <div className="flex flex-col items-start gap-4">
          <h1 className="heading-1 font-700 mb-5 text-[#FF4854]">사용자별 점수 차트</h1>
          <PointChart />
        </div>

        {/* 오른쪽: 순위 현황 */}
        <div className="flex flex-col items-start gap-4 w-full">
          {/* 토글 스위치*/}
          {/* ⬅ 타이틀 + 토글 한줄 정렬 (정확한 vertical-align 맞춤) */}
          <div className="flex items-center gap-4">
            <h1 className="heading-1 font-700 text-[#FF4854] whitespace-nowrap">사용자별 순위 현황</h1>
          </div>

          <AdminLeaderboardTable />
        </div>
      </div>

      {/* 페이지 스위치 버튼
      <button
        onClick={() => navigate('/admin/matrix')}
        className="px-5 py-2 bg-[#FF4854] hover:bg-[#e13a47] text-white heading-3 font-500 rounded-lg"
      >
        문제풀이 매트릭스 보기
      </button> */}
      <div className="flex gap-x-10">
        <AdminLeaderboardToggle />
        <AdminMatrixToggle />
        <AdminTotalGraphToggle />
      </div>
    </div>
  );
};

export default Leaderboard;

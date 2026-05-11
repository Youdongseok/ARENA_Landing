// src/pages/Leaderboard/AdminLeaderboardToggle.jsx
import React from 'react';
import { useLeaderboardSetting } from '@/hooks/useLeaderboardSetting';

export default function AdminLeaderboardToggle() {
  const { setting, isLoading, isPending, toggle } = useLeaderboardSetting();

  if (isLoading) {
    return <div className="px-5 py-3 bg-gray-300 rounded-lg text-white">설정 불러오는 중...</div>;
  }

  return (
    <div className="flex items-center gap-4">
      {/* 설명 텍스트 */}
      <span className="text-[#030102] text-[20px] font-bold whitespace-nowrap">
        리더보드 공개 설정
      </span>

      {/* Toggle Switch */}
      <div
        onClick={() => !isPending && toggle()}
        className={`relative w-[60px] h-[32px] rounded-full cursor-pointer transition-all flex items-center
          ${setting ? 'bg-[#e13a47]' : 'bg-gray-300'}
          ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'}
        `}
      >
        <div
          className={`absolute w-[26px] h-[26px] bg-white rounded-full shadow-md transition-all
            ${setting ? 'translate-x-[30px]' : 'translate-x-[4px]'}
          `}
        ></div>
      </div>

      {/* 상태 텍스트 */}
      <p className="text-[14px] text-[#616161] whitespace-nowrap">
        {isPending ? '변경 중...' : setting ? '공개됨' : '비공개'}
      </p>
    </div>
  );
}

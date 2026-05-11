// src/pages/Leaderboard/AdminMatrixToggle.jsx
import React from 'react';
import { useMatrixSetting } from '@/hooks/useMatrixSetting';

export default function AdminMatrixToggle() {
  const { setting, isLoading, isPending, toggle } = useMatrixSetting();

  if (isLoading) {
    return <div className="px-5 py-3 bg-gray-300 rounded-lg text-white">설정 불러오는 중...</div>;
  }

  return (
    <div className="flex items-center gap-4">
      {/* 설명 텍스트 */}
      <span className="text-[#030102] text-[20px] font-bold whitespace-nowrap">
        공용 매트릭스 공개 설정
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

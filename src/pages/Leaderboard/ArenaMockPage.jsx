import React, { useState } from 'react';
import LeaderboardTable from './components/LeaderboardTable';
import MyPerformanceCard from './components/MyPerformanceCard';
import { ALL_FILTER_OPTION } from '@/constants/problemMeta';

export default function Leaderboard() {
  const [seasonLabel, setSeasonLabel] = useState(ALL_FILTER_OPTION.value);

  return (
    <div className="w-full h-full flex flex-col items-center p-6 gap-8">
      <div className="w-full max-w-[1240px] flex flex-col items-start mx-auto">
        <div className="w-full rounded-[24px] border border-[#E7ECF3] bg-white px-8 py-7 shadow-md">
          <p className="text-sm font-semibold tracking-[0.18em] text-[#FF4854]/80">LEADERBOARD</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0F172A]">
            실시간 통합 랭크보드
          </h1>
          <p className="mt-2 text-[15px] text-[#64748B]">
            현재 사용자 순위와 점수 현황을 한눈에 확인할 수 있습니다.
          </p>
        </div>
      </div>

      <MyPerformanceCard seasonLabel={seasonLabel} onSeasonChange={setSeasonLabel} />
      <LeaderboardTable seasonLabel={seasonLabel} />
    </div>
  );
}

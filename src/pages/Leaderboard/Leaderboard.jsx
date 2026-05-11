// src/pages/Leaderboard/Leaderboard.jsx
import React, { useState } from 'react';
import LeaderboardTable from './components/LeaderboardTable';
import MyPerformanceCard from './components/MyPerformanceCard';
import { ALL_FILTER_OPTION } from '@/constants/problemMeta';

export default function Leaderboardago() {
  const [seasonLabel, setSeasonLabel] = useState(ALL_FILTER_OPTION.value);

  return (
    <div className="flex h-full w-full flex-col items-center gap-8 p-6">
      <div className="w-full max-w-[1240px]">
        <section className="rounded-[24px] border border-[#E7ECF3] bg-white px-8 py-7 shadow-md">
          <p className="text-sm font-semibold tracking-[0.18em] text-[#FF4854]/80">LEADERBOARD</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0F172A]">
            사용자 순위 현황
          </h1>
          <p className="mt-2 text-[15px] text-[#64748B]">
            현재 점수와 해결 현황을 한 화면에서 확인할 수 있습니다.
          </p>
        </section>
        <div className="mt-8">
          <MyPerformanceCard seasonLabel={seasonLabel} />
        </div>
        <LeaderboardTable seasonLabel={seasonLabel} onSeasonChange={setSeasonLabel} />
      </div>
    </div>
  );
}

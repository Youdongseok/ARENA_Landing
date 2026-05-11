import React, { useEffect, useMemo, useRef, useState } from 'react';

import downButtonIcon from '@/assets/icons/downbtn.svg';
import { useAuthStore } from '@/stores/authStore';
import { useLeaderboardSeasonOptions } from '@/hooks/useLeaderboardSeasonOptions';
import { useTeamDashboardQuery } from '@/hooks/useTeamDashboardQuery';
import { useLeaderboardQuery } from '@/hooks/useLeaderboardQuery';
import { getMyLeaderboardStats } from '@/pages/Leaderboard/utils/leaderboardUtils';
import { ALL_FILTER_OPTION } from '@/constants/problemMeta';

function StatCard({ label, value, accentClass = 'text-[#0F172A]' }) {
  return (
    <div className="rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4">
      <p className="text-sm font-medium text-[#64748B]">{label}</p>
      <p className={`mt-2 text-3xl font-semibold tracking-tight ${accentClass}`}>{value}</p>
    </div>
  );
}

export default function MyPerformanceCard({
  seasonLabel = ALL_FILTER_OPTION.value,
  onSeasonChange = () => {},
}) {
  const teamInfo = useAuthStore(state => state.teamInfo);
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const seasonSelectRef = useRef(null);
  const teamId = teamInfo?.id || teamInfo?.team_id;
  const myTeamName = teamInfo?.teamname;
  const [isSeasonSelectOpen, setIsSeasonSelectOpen] = useState(false);
  const { data: seasonOptionsData = [] } = useLeaderboardSeasonOptions();

  const { data: dashboardData, isLoading: isDashboardLoading } = useTeamDashboardQuery(
    teamId,
    seasonLabel
  );
  const { data: leaderboardData, isLoading: isLeaderboardLoading } = useLeaderboardQuery(seasonLabel);

  if (!isLoggedIn || !teamId) return null;

  const solvedCount = dashboardData?.solved_count ?? 0;
  const totalScore = dashboardData?.total_score ?? 0;
  const { rank, topPercent } = getMyLeaderboardStats({
    rows: leaderboardData,
    teamId,
    teamName: myTeamName,
  });
  const selectedSeasonMeta = seasonOptionsData.find(option => option.label === seasonLabel);
  const myRankLabel = rank ? `${rank}위` : '-';
  const topPercentLabel = topPercent ? `상위 ${topPercent}%` : '-';
  const scoreLabel =
    seasonLabel === ALL_FILTER_OPTION.value ? '획득 점수' : '시즌 점수';
  const solvedLabel =
    seasonLabel === ALL_FILTER_OPTION.value ? '해결한 문제' : '시즌 해결 문제';
  const seasonOptions = useMemo(
    () => [
      ALL_FILTER_OPTION,
      ...seasonOptionsData.map(option => ({ value: option.label, label: option.label })),
    ],
    [seasonOptionsData]
  );
  const selectedSeasonOption =
    seasonOptions.find(option => option.value === seasonLabel) ?? ALL_FILTER_OPTION;

  const isLoading = isDashboardLoading || isLeaderboardLoading;

  useEffect(() => {
    if (!isSeasonSelectOpen) return undefined;

    const handlePointerDown = event => {
      if (!seasonSelectRef.current?.contains(event.target)) {
        setIsSeasonSelectOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isSeasonSelectOpen]);

  return (
    <section className="w-full max-w-[1240px]">
      <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-8 shadow-md">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-[#FF4854]/80">MY STATUS</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0F172A]">
            {myTeamName || '내 사용자'} 님 성과 요약
          </h2>
          <p className="mt-2 text-[15px] text-[#64748B]">
            대시보드 핵심 지표를 리더보드에서 바로 확인할 수 있습니다.
          </p>
          {seasonLabel !== ALL_FILTER_OPTION.value && selectedSeasonMeta?.has_results === false ? (
            <p className="mt-3 text-sm font-medium text-[#94A3B8]">
              이 시즌에는 아직 집계된 성공 기록이 없습니다.
            </p>
          ) : null}
        </div>

        <div className="mt-6 w-full max-w-[340px]">
          <label className="mb-1 block text-sm font-semibold text-[#64748B]">시즌 선택</label>
          <div ref={seasonSelectRef} className="relative">
            <button
              type="button"
              onClick={() => setIsSeasonSelectOpen(open => !open)}
              className="flex h-12 w-full items-center rounded-2xl border border-[#E7D7D9] bg-white px-4 pr-11 text-left text-[15px] text-[#201A1B] outline-none transition hover:border-[#E3C7CB]"
            >
              <span className="truncate">{selectedSeasonOption.label}</span>
            </button>

            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
              <img
                src={downButtonIcon}
                alt=""
                className={`h-4 w-4 opacity-70 transition-transform duration-200 ${
                  isSeasonSelectOpen ? 'rotate-180' : ''
                }`}
              />
            </div>

            {isSeasonSelectOpen && (
              <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-20 overflow-hidden rounded-[20px] border border-[#E7D7D9] bg-white shadow-[0_24px_50px_rgba(15,23,42,0.12)]">
                <div className="max-h-72 overflow-y-auto py-2">
                  {seasonOptions.map(option => {
                    const isSelected = option.value === seasonLabel;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          onSeasonChange(option.value);
                          setIsSeasonSelectOpen(false);
                        }}
                        className={`flex w-full items-center justify-between border-l-[3px] px-4 py-3 text-left text-sm transition ${
                          isSelected
                            ? 'border-[#FF4854] bg-[#FFF1F2] pl-[13px] font-semibold text-[#C2414F]'
                            : 'border-transparent text-[#3B3134] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        <span className="truncate">{option.label}</span>
                        {isSelected && (
                          <span className="rounded-full bg-[#FF4854] px-2.5 py-1 text-xs font-semibold text-white">
                            선택됨
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="순위"
            value={isLoading ? '...' : myRankLabel}
            accentClass="text-[#FF4854]"
          />
          <StatCard
            label="상위 %"
            value={isLoading ? '...' : topPercentLabel}
            accentClass="text-[#F97316]"
          />
          <StatCard
            label={scoreLabel}
            value={isLoading ? '...' : totalScore}
            accentClass="text-[#0EA5E9]"
          />
          <StatCard
            label={solvedLabel}
            value={isLoading ? '...' : solvedCount}
            accentClass="text-[#0F172A]"
          />
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import medalGold from '@/assets/icons/medal_gold.svg';
import medalSilver from '@/assets/icons/medal_silver.svg';
import medalBronze from '@/assets/icons/medal_bronze.svg';
import Skeleton from '@/components/Skeleton/Skeleton';
import Avatar from '@/components/Avatar/Avatar';

import { useAuthStore } from '@/stores/authStore';
import { useLeaderboardQuery } from '@/hooks/useLeaderboardQuery';
import { useLeaderboardSeasonOptions } from '@/hooks/useLeaderboardSeasonOptions';
import { useUserLeaderboardSetting } from '@/hooks/useUserLeaderboardSetting';
import { getScopedLeaderboardRows } from '@/pages/Leaderboard/utils/leaderboardUtils';
import { ALL_FILTER_OPTION } from '@/constants/problemMeta';

// 메달 매핑
const MEDAL_ICON_MAP = { 1: medalGold, 2: medalSilver, 3: medalBronze };
const TOP_LEADERBOARD_LIMIT = 10;

// 열 너비
const COL_WIDTHS = {
  rank: 'w-[11%]',
  profile: 'w-[14%]',
  team: 'w-[22%]',
  score: 'w-[26%]',
  solved: 'flex-1',
};

/* ============================================================== */
/* Skeleton Loader */
/* ============================================================== */
const LeaderboardTableSkeleton = ({ rows = TOP_LEADERBOARD_LIMIT }) => (
    <div className="relative w-full overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white shadow-md">
      <div className="flex h-[79px] items-center border-b border-[#FFE1E4] text-[18px] font-700 text-[#FF4854]">
        <div className={`${COL_WIDTHS.rank} text-center`}>순위</div>
        <div className={`${COL_WIDTHS.profile} text-center`}>프로필 사진</div>
        <div className={`${COL_WIDTHS.team} text-center`}>사용자명</div>
        <div className={`${COL_WIDTHS.score} text-center`}>획득 점수</div>
        <div className={`${COL_WIDTHS.solved} text-center`}>해결 문제</div>
      </div>

    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className="flex h-[79px] items-center border-b border-[#EEF2F6] px-3"
      >
        <div className={`${COL_WIDTHS.rank} flex justify-center`}>
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
        <div className={`${COL_WIDTHS.profile} flex justify-center`}>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <div className={`${COL_WIDTHS.team} flex justify-center`}>
          <Skeleton className="h-6 w-3/4" />
        </div>
        <div className={`${COL_WIDTHS.score} flex justify-center`}>
          <Skeleton className="h-6 w-2/3" />
        </div>
        <div className={`${COL_WIDTHS.solved} flex justify-center`}>
          <Skeleton className="h-6 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

/* ============================================================== */
/* LeaderboardTable 본체 */
/* ============================================================== */
export default function LeaderboardTable({
  seasonLabel = ALL_FILTER_OPTION.value,
}) {
  const myTeamName = useAuthStore(s => s.teamInfo?.teamname);

  const { data: settingData, isLoading: settingLoading } = useUserLeaderboardSetting();
  const leaderboardEnabled = settingData?.leaderboard_enabled ?? false;
  const { data: seasonOptionsData = [] } = useLeaderboardSeasonOptions();

  const { data, isLoading, error } = useLeaderboardQuery(seasonLabel);

  if (settingLoading) return <div className="text-[#64748B]">리더보드 설정 확인 중...</div>;

  if (!leaderboardEnabled) {
    return (
      <section className="w-full max-w-[1240px]">
        <div className="rounded-[24px] border border-[#E2E8F0] bg-white px-8 py-14 text-center shadow-md">
          <p className="text-[22px] font-bold text-[#94A3B8]">공용 리더보드가 현재 비공개 상태입니다.</p>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="w-full max-w-[1240px]">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-[#FF4854]/80">RANK BOARD</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0F172A]">
              전체 사용자 순위
            </h2>
          </div>
        </div>
        <div className="w-full overflow-x-auto pb-2">
          <LeaderboardTableSkeleton />
        </div>
      </section>
    );
  }
  if (error) {
    return (
      <section className="w-full max-w-[1240px]">
        <div className="rounded-[24px] border border-[#FECACA] bg-white px-8 py-14 text-center shadow-md">
          <p className="font-medium text-red-400">데이터 불러오기 실패</p>
        </div>
      </section>
    );
  }

  /* ===========================================
     "클래스" 사용자 우선 정책은 유지하되,
     매칭이 없으면 전체 사용자를 노출
  ============================================ */
  const rows = getScopedLeaderboardRows(data);
  const topRows = rows.slice(0, TOP_LEADERBOARD_LIMIT);
  const selectedSeasonMeta = seasonOptionsData.find(option => option.label === seasonLabel);
  const hasNoSeasonResults = seasonLabel !== ALL_FILTER_OPTION.value && rows.length === 0;

  return (
    <section className="w-full max-w-[1240px]">
      <div className="mb-4">
        <p className="text-sm font-semibold tracking-[0.18em] text-[#FF4854]/80">RANK BOARD</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0F172A]">상위 10위</h2>
        <p className="mt-1 text-[15px] text-[#64748B]">
          리더보드에서는 상위 10명만 노출하고, 내 순위는 상단 카드에서 따로 확인할 수 있습니다.
        </p>
      </div>

      <div className="w-full overflow-x-auto pb-2">
        <div className="relative min-w-[980px] w-full overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white shadow-md">
          {/* Header */}
          <div className="flex h-[79px] items-center border-b border-[#FFE1E4] text-[18px] font-700 text-[#FF4854]">
            <div className={`${COL_WIDTHS.rank} text-center`}>순위</div>
            <div className={`${COL_WIDTHS.profile} text-center`}>프로필 사진</div>
            <div className={`${COL_WIDTHS.team} text-center`}>사용자명</div>
            <div className={`${COL_WIDTHS.score} text-center`}>획득 점수</div>
            <div className={`${COL_WIDTHS.solved} text-center`}>해결 문제</div>
          </div>

          {/* Body */}
          {hasNoSeasonResults ? (
            <div className="px-8 py-14 text-center">
              <p className="text-lg font-semibold text-[#0F172A]">
                선택한 시즌에는 아직 집계된 리더보드 기록이 없습니다.
              </p>
              <p className="mt-2 text-sm text-[#64748B]">
                {selectedSeasonMeta?.has_results === false
                  ? '해당 시즌에는 성공 기록이 아직 없습니다.'
                  : '다른 시즌이나 전체 보기를 선택해 보세요.'}
              </p>
            </div>
          ) : topRows.map((row, idx) => {
            const isMe = row.teamname === myTeamName;

            return (
              <div
                key={idx}
                className={`
                  flex items-center h-[79px]
                  border-b border-[#EEF2F6]
                  text-[18px] font-700
                  ${
                    isMe
                      ? 'bg-[#FFF5E1] text-[#010101]'
                      : 'bg-transparent text-[#010101]'
                  }
                `}
              >
                <div className={`${COL_WIDTHS.rank} flex items-center justify-center`}>
                  {row.displayedRank <= 3 ? (
                    <img src={MEDAL_ICON_MAP[row.displayedRank]} className="w-[45px] h-[45px]" />
                  ) : (
                    <span>{row.displayedRank}</span>
                  )}
                </div>

                <div className={`${COL_WIDTHS.profile} flex items-center justify-center px-3`}>
                  <Avatar
                    src={row.profile_image_url}
                    name={row.teamname}
                    size={36}
                    className="flex-shrink-0"
                  />
                </div>
                <div className={`${COL_WIDTHS.team} truncate px-3 text-center`}>{row.teamname}</div>
                <div className={`${COL_WIDTHS.score} text-center`}>{row.score}</div>
                <div className={`${COL_WIDTHS.solved} text-center`}>{row.solved_count}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Flame,
  Trophy,
  Target,
} from 'lucide-react';

import api from '@/api/axiosInstance';
import PointIcon from '@/assets/icons/Point.svg';
import WhiteLogoIcon from '@/assets/icons/white-logo.svg';
import Avatar from '@/components/Avatar/Avatar';
import { aiSubMenu } from '@/components/Sidebar/data/sidebarData';
import { useAuthStore } from '@/stores/authStore';
import { useTeamDashboardQuery } from '@/hooks/useTeamDashboardQuery';
import { useLeaderboardQuery } from '@/hooks/useLeaderboardQuery';

function buildMonthlySolvedSeries(baseDate, solvedProblems = []) {
  const today = new Date();
  const currentYear = baseDate.getFullYear();
  const currentMonth = baseDate.getMonth();
  const isCurrentMonth =
    today.getFullYear() === currentYear && today.getMonth() === currentMonth;
  const todayDate = today.getDate();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const days = Array.from({ length: daysInMonth }, (_, index) => ({
    key: `${currentYear}-${currentMonth + 1}-${index + 1}`,
    label: `${index + 1}`,
    dayNumber: index + 1,
    count: 0,
    isToday: isCurrentMonth && index + 1 === todayDate,
    isFuture: isCurrentMonth && index + 1 > todayDate,
  }));

  solvedProblems.forEach(problem => {
    if (!problem.solved_at) return;
    const solvedDate = new Date(problem.solved_at);
    if (solvedDate.getFullYear() !== currentYear || solvedDate.getMonth() !== currentMonth) return;
    const target = days[solvedDate.getDate() - 1];
    if (target) target.count += 1;
  });

  const maxCount = Math.max(...days.map(item => item.count), 0);

  return {
    days,
    maxCount,
  };
}

function formatSessionStatus(status) {
  switch ((status ?? '').toLowerCase()) {
    case 'success':
      return '성공';
    case 'fail':
      return '실패';
    case 'unsubmitted':
      return '미제출';
    default:
      return '-';
  }
}

function getSessionStatusMetaClass(status) {
  switch ((status ?? '').toLowerCase()) {
    case 'success':
      return 'text-[#16A34A]';
    case 'fail':
      return 'text-[#DC2626]';
    case 'unsubmitted':
      return 'text-[#94A3B8]';
    default:
      return 'text-[#A18488]';
  }
}

function ActivityRow({
  icon: Icon,
  iconSrc,
  title,
  subtitle,
  meta,
  color = 'bg-[#FF4854]',
  metaClassName = 'text-[#A18488]',
}) {
  return (
    <div className="flex items-center gap-3 rounded-[22px] px-1 py-2">
      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${color} text-white`}>
        {iconSrc ? <img src={iconSrc} alt="" className="h-5 w-5" /> : <Icon size={20} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[17px] font-700 text-[#241B1D]">{title}</p>
        <p className="truncate text-sm text-[#8B6F73]">{subtitle}</p>
      </div>
      <span className={`text-sm font-600 ${metaClassName}`}>{meta}</span>
    </div>
  );
}

function GoalCard({
  title,
  valueText,
  progress,
  footer,
  icon: Icon,
  iconSrc,
  accent = 'violet',
  onClick,
  className = '',
}) {
  const accents = {
    violet: {
      badge: 'bg-[#17B26A]',
      bar: 'from-[#17B26A] to-[#4AD991]',
      pill: 'bg-[#ECFDF3] text-[#15803D]',
    },
    mint: {
      badge: 'bg-[#FF4854]',
      bar: 'from-[#FF4854] to-[#FF7B84]',
      pill: 'bg-[#FFF1F2] text-[#E11D48]',
    },
    coral: {
      badge: 'bg-[#FF4854]',
      bar: 'from-[#FF4854] to-[#FF7B84]',
      pill: 'bg-[#FFF1F2] text-[#E11D48]',
    },
    arena: {
      badge: 'bg-[#201A1B]',
      bar: 'from-[#201A1B] to-[#413A3C]',
      pill: 'bg-[#F3F4F6] text-[#201A1B]',
    },
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[24px] border border-[#E7ECF3] bg-white p-6 text-left shadow-md transition hover:-translate-y-1 hover:border-[#D7DFEA] ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-[18px] ${accents[accent].badge} text-white`}>
          {iconSrc ? <img src={iconSrc} alt="" className="h-7 w-7 object-contain" /> : <Icon size={24} />}
        </div>
        <span className="text-2xl leading-none text-[#D1B8BC]">...</span>
      </div>

      <h3 className="mt-5 truncate text-[18px] font-700 text-[#241B1D]">{title}</h3>
      <p className="mt-1 text-sm text-[#8A6E73]">{valueText}</p>

      <div className="mt-6">
        <div className="flex items-center justify-between text-sm font-600 text-[#7A6166]">
          <span>진행률</span>
          <span>{progress}%</span>
        </div>
        <div className="mt-3 h-2.5 rounded-full bg-[#F5EDEF]">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${accents[accent].bar}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <span className="whitespace-pre-line text-sm font-600 text-[#6A5358]">{footer}</span>
        <span className={`rounded-full px-3 py-1 text-sm font-700 ${accents[accent].pill}`}>
          바로가기
        </span>
      </div>
    </button>
  );
}

function DashboardSkeleton() {
  return (
    <div className="w-full">
      <div className="mx-auto max-w-[1240px] rounded-[24px] border border-[#F3D6D8] bg-[linear-gradient(180deg,#FFF7F8_0%,#FFF2F3_100%)] p-6 shadow-[0_24px_60px_rgba(255,72,84,0.12)]">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_300px]">
          <div className="h-[420px] animate-pulse rounded-[24px] border border-[#F6D8DB] bg-[linear-gradient(135deg,#FFF3F4_0%,#FFE8EB_100%)]" />
          <div className="h-[420px] animate-pulse rounded-[24px] border border-[#F6D8DB] bg-[linear-gradient(135deg,#FFF3F4_0%,#FFE8EB_100%)]" />
          <div className="h-[280px] animate-pulse rounded-[24px] border border-[#F6D8DB] bg-[linear-gradient(135deg,#FFF3F4_0%,#FFE8EB_100%)] xl:col-span-2" />
        </div>
      </div>
    </div>
  );
}

const Dashboard = () => {
  const navigate = useNavigate();
  const seasonRailRef = useRef(null);
  const chartRailRef = useRef(null);
  const chartDragRef = useRef({
    isDragging: false,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });
  const [selectedDayKey, setSelectedDayKey] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const teamInfo = useAuthStore(state => state.teamInfo);
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const teamId = teamInfo?.id || teamInfo?.team_id;
  const teamName = teamInfo?.teamname ?? 'Team';
  const displayName = teamInfo?.teamname || teamInfo?.username || '로그인 필요';
  const displaySubtitle = '사용자';

  const { data, isLoading, isError } = useTeamDashboardQuery(teamId);
  const { data: leaderboardData = [] } = useLeaderboardQuery();
  const { data: allProblems = [] } = useQuery({
    queryKey: ['dashboardSeasonProblems'],
    queryFn: async () => {
      const response = await api.get('/problem/all');
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  const derived = useMemo(() => {
    const problems = data?.problems ?? [];
    const totalProblems = problems.length;
    const solvedProblems = problems.filter(problem => problem.solved);
    const solvedCount = data?.solved_count ?? solvedProblems.length;
    const totalScore = data?.total_score ?? 0;
    const recentAttempt = data?.recent_attempt ?? null;
    const activeProblems = problems.filter(problem => problem.is_active);
    const activeSolved = activeProblems.filter(problem => problem.solved).length;
    const openProblems = activeProblems.filter(problem => !problem.solved);
    const inactiveProblems = problems.filter(problem => !problem.is_active);
    const progress = totalProblems ? Math.round((solvedCount / totalProblems) * 100) : 0;
    const activeProgress = activeProblems.length
      ? Math.round((activeSolved / activeProblems.length) * 100)
      : 0;

    const sortedRows = [...leaderboardData].sort((a, b) => {
      if ((b.score ?? 0) !== (a.score ?? 0)) return (b.score ?? 0) - (a.score ?? 0);
      return new Date(a.last_solved_at ?? 0) - new Date(b.last_solved_at ?? 0);
    });

    const rankIndex = sortedRows.findIndex(
      row => row.teamname === teamName || row.team_id === teamId
    );
    const myRank = rankIndex >= 0 ? rankIndex + 1 : null;

    return {
      problems,
      totalProblems,
      solvedProblems,
      solvedCount,
      totalScore,
      recentAttempt,
      activeProblems,
      openProblems,
      inactiveProblems,
      progress,
      activeProgress,
      myRank,
    };
  }, [data, leaderboardData, teamId, teamName]);

  const monthlySolved = useMemo(
    () => buildMonthlySolvedSeries(selectedMonth, derived.solvedProblems),
    [derived.solvedProblems, selectedMonth]
  );
  const currentMonthLabel = `${selectedMonth.getMonth() + 1}월 해결 기록`;

  const seasonCards = useMemo(() => {
    const seasonCounts = allProblems.reduce((acc, problem) => {
      const label = problem.season_label;
      if (!label) return acc;
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {});

    const challengeCards = aiSubMenu.map((season, index) => {
      const seasonProblems = allProblems.filter(problem => problem.season_label === season.label);
      const problemCount = seasonProblems.length || seasonCounts[season.label] || 0;
      const solvedInSeason = seasonProblems.filter(problem =>
        derived.solvedProblems.some(solved => solved.title === problem.title)
      ).length;
      const isCurrent = index === 0;
      const usesArenaLogo =
        season.label === '2025 LLM SAFETY CHALLENGE 예선' ||
        season.label === '2025 LLM SAFETY CHALLENGE 본선';
      const isArenaSeason = season.label === 'ARENA 시즌 1';

      return {
        title: season.label,
        valueText:
          problemCount > 0
            ? `${solvedInSeason} / ${problemCount} 문제 해결`
            : '공개된 문제가 아직 없습니다',
        progress: problemCount > 0 ? Math.round((solvedInSeason / problemCount) * 100) : 0,
        footer:
          problemCount > 0
            ? solvedInSeason > 0
              ? `${problemCount - solvedInSeason}개 남음`
              : `공개 문제 ${problemCount}개`
            : '',
        icon: usesArenaLogo ? undefined : isCurrent ? Target : Trophy,
        iconSrc: usesArenaLogo ? WhiteLogoIcon : undefined,
        accent: isArenaSeason ? 'arena' : isCurrent ? 'mint' : 'coral',
        onClick: () => navigate(season.path),
      };
    });

    return [
      {
        title: '튜토리얼',
        valueText: '입문 트랙으로 흐름 익히기',
        progress: 100,
        footer: '처음 사용자도 부담 없이\n시작할 수 있습니다',
        icon: BookOpen,
        accent: 'violet',
        onClick: () => navigate('/tutorial'),
      },
      ...challengeCards,
    ];
  }, [allProblems, derived.solvedProblems, navigate]);

  useEffect(() => {
    const rail = chartRailRef.current;
    if (!rail) return;

    const todayIndex = monthlySolved.days.findIndex(day => day.isToday);
    const focusIndex =
      todayIndex >= 0 ? todayIndex : Math.max(0, Math.floor(monthlySolved.days.length / 2) - 1);

    const itemWidth = 54;
    const gap = 12;
    const targetCenter = focusIndex * (itemWidth + gap) + itemWidth / 2;
    const nextScrollLeft = Math.max(0, targetCenter - rail.clientWidth / 2);

    rail.scrollTo({
      left: nextScrollLeft,
      behavior: 'auto',
    });
  }, [monthlySolved.days]);

  if (!isLoggedIn) {
    return (
      <div className="flex h-full items-center justify-center text-2xl text-gray-500">
        로그인 후 이용 가능합니다.
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center text-xl text-red-500">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full px-6 py-6">
        <div className="mt-8">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  const scrollSeasonCards = direction => {
    if (!seasonRailRef.current) return;
    const cardWidth = 320;
    seasonRailRef.current.scrollBy({
      left: direction === 'left' ? -cardWidth : cardWidth,
      behavior: 'smooth',
    });
  };

  const moveMonth = delta => {
    setSelectedMonth(current => new Date(current.getFullYear(), current.getMonth() + delta, 1));
    setSelectedDayKey(null);
  };

  const handleChartPointerDown = event => {
    const rail = chartRailRef.current;
    if (!rail) return;

    chartDragRef.current = {
      isDragging: true,
      startX: event.clientX,
      startScrollLeft: rail.scrollLeft,
      moved: false,
    };

    rail.setPointerCapture?.(event.pointerId);
  };

  const handleChartPointerMove = event => {
    const rail = chartRailRef.current;
    const drag = chartDragRef.current;
    if (!rail || !drag.isDragging) return;

    const deltaX = event.clientX - drag.startX;
    if (Math.abs(deltaX) > 4) {
      chartDragRef.current.moved = true;
    }
    rail.scrollLeft = drag.startScrollLeft - deltaX;
  };

  const handleChartPointerEnd = event => {
    const rail = chartRailRef.current;
    if (rail) {
      rail.releasePointerCapture?.(event.pointerId);
    }
    chartDragRef.current.isDragging = false;
  };

  return (
    <div className="w-full px-4 py-6 md:px-6">
      <div className="mx-auto max-w-[1240px] space-y-8">
        <section className="rounded-[24px] border border-[#E7ECF3] bg-white px-8 py-7 shadow-md">
          <p className="text-sm font-semibold tracking-[0.18em] text-[#FF4854]/80">DASHBOARD</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0F172A]">진행 현황 요약</h1>
          <p className="mt-2 text-[15px] text-[#64748B]">
            현재 점수, 해결한 문제, 다음 목표를 빠르게 확인해보세요.
          </p>
        </section>

        <section>
          <div className="space-y-6">
            <div className="grid items-stretch gap-6 xl:grid-cols-[minmax(0,1.55fr)_300px]">
              <section className="overflow-hidden rounded-[24px] border border-[#E7ECF3] bg-white p-3 text-[#241B1D] shadow-md md:p-4">
                <div>
                  <div className="relative min-h-[420px] overflow-hidden rounded-[22px] bg-[radial-gradient(circle_at_100%_100%,rgba(255,164,170,0.18),transparent_28%),radial-gradient(circle_at_0%_100%,rgba(255,72,84,0.12),transparent_30%),linear-gradient(180deg,#FFFFFF_0%,#FFF8F8_100%)] px-6 pb-6 pt-6">
                    <div className="pointer-events-none absolute -bottom-10 left-10 h-40 w-40 rounded-full bg-[#FFE6E9]/75 blur-2xl" />
                    <div className="pointer-events-none absolute -right-8 bottom-0 h-32 w-40 rounded-full bg-[#FFD8DD]/80 blur-2xl" />

                    <div className="relative flex items-center justify-between">
                      <div>
                        <p className="text-lg font-700 tracking-tight text-[#201A1B]">
                          {currentMonthLabel}
                        </p>
                        <p className="mt-1 text-sm text-[#64748B]">1일부터 말일까지 드래그해서 볼 수 있어요.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => moveMonth(-1)}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E7D7D9] bg-white text-[#8C7277] transition hover:border-[#FF4854] hover:text-[#FF4854]"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveMonth(1)}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E7D7D9] bg-white text-[#8C7277] transition hover:border-[#FF4854] hover:text-[#FF4854]"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>

                    <div
                      ref={chartRailRef}
                      onPointerDown={handleChartPointerDown}
                      onPointerMove={handleChartPointerMove}
                      onPointerUp={handleChartPointerEnd}
                      onPointerCancel={handleChartPointerEnd}
                      onPointerLeave={handleChartPointerEnd}
                      className="relative mt-10 cursor-grab overflow-x-auto pb-2 pt-20 [-ms-overflow-style:none] [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
                    >
                      <div className="flex min-w-max items-end gap-3 pr-4">
                      {monthlySolved.days.map(item => {
                        const maxCount = monthlySolved.maxCount || 1;
                        const height =
                          item.count > 0
                            ? Math.max(40, (item.count / maxCount) * 230)
                            : 20;
                        const isSolvedDay = item.count > 0;
                        const isSelected = selectedDayKey === item.key;
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => {
                              if (chartDragRef.current.moved) {
                                chartDragRef.current.moved = false;
                                return;
                              }
                              setSelectedDayKey(current => (current === item.key ? null : item.key));
                            }}
                            className="group flex w-[54px] flex-shrink-0 flex-col items-center text-center"
                          >
                            <div className="relative flex h-[288px] w-full items-end justify-center">
                              <div
                                className={`pointer-events-none absolute top-0 h-[40px] rounded-[14px] bg-[#201A1B] px-3 py-2 text-center text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)] transition ${
                                  isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
                                }`}
                              >
                                <p className="whitespace-nowrap text-[15px] font-700 leading-none">
                                  {item.count === 0 ? '0개' : `${item.count}개`}
                                </p>
                              </div>

                              <div
                                className={`w-full rounded-[16px] transition-all ${
                                  item.isToday
                                    ? 'bg-[linear-gradient(180deg,#FF7079_0%,#FF4854_100%)] shadow-[0_16px_28px_rgba(255,72,84,0.24)]'
                                    : isSolvedDay
                                      ? 'bg-[linear-gradient(180deg,#FF9AA2_0%,#FF6673_100%)] shadow-[0_12px_24px_rgba(255,102,115,0.20)] group-hover:brightness-[1.03]'
                                    : item.isFuture
                                      ? 'bg-[#F8F1F2]'
                                      : 'bg-[#F1E8E9] group-hover:bg-[#F6D8DB]'
                                } ${isSelected ? 'ring-2 ring-[#FFD4D8] ring-offset-2 ring-offset-white' : ''}`}
                                style={{ height }}
                              />
                            </div>

                            <span className={`mt-3 text-[12px] font-600 ${item.isToday ? 'text-[#FF4854]' : 'text-[#A58D92]'}`}>
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="flex h-full flex-col rounded-[24px] border border-[#E7ECF3] bg-white p-6 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0EA5E9] text-white">
                    <Activity size={20} />
                  </div>
                  <div>
                    <h2 className="text-[18px] font-700 text-[#241B1D]">현황 요약</h2>
                    <p className="text-sm text-[#91797D]">핵심 현황 요약</p>
                  </div>
                </div>

                <div className="mt-5 flex-1 space-y-1">
                  <ActivityRow
                    icon={Trophy}
                    title="리더보드 순위"
                    subtitle="현재 집계 기준"
                    meta={derived.myRank ? `${derived.myRank}위` : '-'}
                    color="bg-[#14B37D]"
                  />
                  <ActivityRow
                    icon={Target}
                    title="해결한 문제"
                    subtitle="완료한 챌린지"
                    meta={`${derived.solvedCount}개`}
                    color="bg-[#FF4854]"
                  />
                  <ActivityRow
                    iconSrc={PointIcon}
                    title="총점"
                    subtitle="현재 누적 점수"
                    meta={`${derived.totalScore}점`}
                    color="bg-[#201A1B]"
                  />
                  <ActivityRow
                    icon={BookOpen}
                    title="진행 중 문제"
                    subtitle="바로 이어서 도전 가능"
                    meta={`${derived.openProblems.length}개`}
                    color="bg-[#7C3AED]"
                  />
                  <ActivityRow
                    icon={Flame}
                    title="최근 시도"
                    subtitle={derived.recentAttempt?.title ?? '아직 시도한 문제가 없어요'}
                    meta={formatSessionStatus(derived.recentAttempt?.status)}
                    color="bg-[#FF7B54]"
                    metaClassName={getSessionStatusMetaClass(derived.recentAttempt?.status)}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/mypage')}
                  className="mt-4 w-full rounded-[20px] border border-[#E7ECF3] bg-[#FCFDFE] px-4 py-4 text-left transition hover:border-[#FF4854] hover:bg-[#FFF8F8]"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={teamInfo?.profile_image_url}
                      name={displayName}
                      size={40}
                      className="flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-700 text-[#201A1B]">{displayName}</p>
                      <p className="truncate text-xs font-medium text-[#8A6E73]">{displaySubtitle}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-[#E7ECF3] pt-3 text-sm font-600 text-[#64748B]">
                    <span>마이페이지로 이동</span>
                    <ChevronRight size={16} />
                  </div>
                </button>
              </section>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold tracking-[0.18em] text-[#FF4854]/80">SEASON</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#241B1D]">
                    시즌 둘러보기
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => scrollSeasonCards('left')}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E7D7D9] bg-white text-[#8C7277] transition hover:border-[#FF4854] hover:text-[#FF4854]"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollSeasonCards('right')}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E7D7D9] bg-white text-[#8C7277] transition hover:border-[#FF4854] hover:text-[#FF4854]"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div
                ref={seasonRailRef}
                className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                <div className="flex snap-x snap-mandatory gap-5">
                {seasonCards.map(card => (
                  <GoalCard
                    key={card.title}
                    {...card}
                    className="w-[280px] min-w-[280px] snap-start sm:w-[300px] sm:min-w-[300px]"
                  />
                ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

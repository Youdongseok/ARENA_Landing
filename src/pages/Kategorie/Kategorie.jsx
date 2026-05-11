import React, { useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// ⭐ axiosInstance
import api from '@/api/axiosInstance';
import { useAuthStore } from '@/stores/authStore';
import { useTeamDashboardQuery } from '@/hooks/useTeamDashboardQuery';

// 컴포넌트
import ProblemCard from '../../components/ProblemCard/ProblemCard.jsx';

// API 경로
const API_PATH = '/problem/all';

// 스켈레톤 개수
const SKELETON_COUNT = 9;

const ChallengeSection = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const teamInfo = useAuthStore(state => state.teamInfo);
  const teamId = teamInfo?.id || teamInfo?.team_id;
  const currentCategory = searchParams.get('category');
  const currentSeasonLabel = searchParams.get('seasonLabel');
  const currentKeyword = (searchParams.get('keyword') || '').trim();
  const { data: dashboardData } = useTeamDashboardQuery(teamId);

  // 🔥 React Query 기반 API 호출 + 폴링
  const {
    data: challenges = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['problems'],
    queryFn: async () => {
      const res = await api.get(API_PATH);
      return res.data.map(problem => ({
        ...problem,
        id: problem.id,
        score: problem.score,
      }));
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  // --- 데이터 필터링 ---
  const baseChallenges = useMemo(() => {
    if (isLoading || isError) return [];

    if (currentSeasonLabel) {
      return challenges.filter(challenge => challenge.season_label === currentSeasonLabel);
    }

    if (currentCategory) {
      return challenges.filter(challenge => challenge.category === currentCategory);
    }
    return challenges;
  }, [
    currentSeasonLabel,
    currentCategory,
    challenges,
    isLoading,
    isError,
  ]);

  const categorySummary = useMemo(() => {
    if (isLoading || isError) return [];

    return [...new Set(baseChallenges.map(challenge => challenge.category).filter(Boolean))];
  }, [baseChallenges, isLoading, isError]);

  const processedChallenges = useMemo(() => {
    if (isLoading || isError) return [];

    return baseChallenges.filter(challenge => {
      const matchesCategory = !currentCategory || challenge.category === currentCategory;
      const matchesKeyword =
        !currentKeyword ||
        challenge.title?.toLowerCase().includes(currentKeyword.toLowerCase());

      return matchesCategory && matchesKeyword;
    });
  }, [baseChallenges, currentCategory, currentKeyword, isLoading, isError]);

  const solvedTitles = useMemo(() => {
    return new Set(
      (dashboardData?.problems ?? [])
        .filter(problem => problem.solved)
        .map(problem => problem.title)
    );
  }, [dashboardData]);

  const handleCategoryFilter = useCallback(
    category => {
      const nextParams = new URLSearchParams(searchParams);

      if (!category) {
        nextParams.delete('category');
      } else {
        nextParams.set('category', category);
      }

      setSearchParams(nextParams);
    },
    [searchParams, setSearchParams]
  );

  const handleKeywordChange = useCallback(
    event => {
      const keyword = event.target.value;
      const nextParams = new URLSearchParams(searchParams);

      if (!keyword.trim()) {
        nextParams.delete('keyword');
      } else {
        nextParams.set('keyword', keyword);
      }

      setSearchParams(nextParams);
    },
    [searchParams, setSearchParams]
  );

  // --- Solve 버튼 ---
  const handleSolveProblem = useCallback(
    problemId => {
      navigate(`/challenge/${problemId}`);
    },
    [navigate]
  );

  const titleText = currentSeasonLabel
    ? `${currentSeasonLabel} 문제 목록`
    : currentCategory
      ? `${currentCategory} 챌린지 목록`
      : '전체 챌린지 목록';

  const eyebrowText = currentSeasonLabel
    ? 'CHALLENGE TRACK'
    : currentCategory
      ? 'CATEGORY'
      : 'CHALLENGES';

  const descriptionText = currentSeasonLabel
    ? '현재 시즌에 포함된 문제를 살펴보고 원하는 카테고리부터 바로 도전할 수 있습니다.'
    : currentCategory
      ? `${currentCategory} 카테고리 문제를 한곳에서 보고 바로 풀기 시작할 수 있습니다.`
      : '전체 문제를 둘러보면서 원하는 카테고리와 주제를 골라 도전할 수 있습니다.';

  const summaryCountText = currentCategory
    ? `총 ${baseChallenges.length}문제 중 ${currentCategory} ${processedChallenges.length}문제`
    : `총 ${baseChallenges.length}문제`;

  return (
    <div className="w-full min-h-screen flex flex-col items-center p-6 gap-8">
      <section className="w-full max-w-[1240px] rounded-[24px] border border-[#E7ECF3] bg-white px-8 py-7 shadow-md">
        <p className="text-sm font-semibold tracking-[0.18em] text-[#FF4854]/80">{eyebrowText}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0F172A]">{titleText}</h1>
        <p className="mt-2 text-[15px] text-[#64748B]">{descriptionText}</p>
      </section>

      {!isLoading && !isError && currentSeasonLabel && (
        <section className="mx-auto w-full max-w-[1240px] rounded-[24px] border border-[#E7ECF3] bg-white px-6 py-5 shadow-md">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <p className="text-sm font-700 tracking-[0.18em] text-[#FF7B84] uppercase">Challenge Summary</p>
                <h2 className="text-[26px] font-700 text-[#201A1B]">
                  {summaryCountText}
                </h2>
                <p className="text-[15px] leading-6 text-[#6B5E61]">
                  카테고리를 눌러 원하는 문제만 골라볼 수 있어요.
                </p>
              </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleCategoryFilter(null)}
                className={`cursor-pointer rounded-full border px-4 py-2 text-[15px] font-600 transition-colors ${
                  !currentCategory
                    ? 'border-[#FF4854] bg-[#FF4854] text-white hover:bg-[#f03b47]'
                    : 'border-transparent bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#475569]'
                }`}
              >
                전체
              </button>
              {categorySummary.map(category => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryFilter(category)}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-[15px] font-600 transition-colors ${
                    currentCategory === category
                      ? 'border-[#FF4854] bg-[#FF4854] text-white hover:bg-[#f03b47]'
                      : 'border-transparent bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#475569]'
                  }`}
                >
                  {category}
                </button>
              ))}
              {categorySummary.length === 0 && (
                <span
                  className="rounded-full border border-[#EFE7E8] bg-[#FAF7F7] px-3 py-1.5 text-sm font-500 text-[#8B7D80]"
                >
                  카테고리 정보 없음
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#64748B]">문제 이름 검색</label>
              <input
                value={currentKeyword}
                onChange={handleKeywordChange}
                placeholder="문제 이름을 입력하세요"
                className="h-12 rounded-2xl border border-[#E7D7D9] bg-white px-4 text-[15px] text-[#201A1B] outline-none transition focus:border-[#FF4854]"
              />
            </div>
          </div>
        </section>
      )}

      {/* 챌린지 카드 리스트 */}
      <div className="w-full p-4 flex justify-center">
        <div
          className="
            grid
            grid-cols-[repeat(auto-fit,minmax(339px,1fr))]
            gap-3
            justify-items-center
            max-w-[1240px]
            w-full
          "
        >
          {isLoading ? (
            [...Array(SKELETON_COUNT)].map((_, index) => (
              <ProblemCard key={index} isLoading={true} />
            ))
          ) : isError ? (
            <p className="text-lg text-red-600 col-span-full">오류: {error?.message}</p>
          ) : processedChallenges.length === 0 ? (
            <p className="text-lg text-gray-500 col-span-full">
              {currentSeasonLabel
                ? `${currentSeasonLabel}에 해당하는 문제가 없습니다.`
                : currentCategory
                  ? `${currentCategory}에 해당하는 문제가 없습니다.`
                  : '등록된 문제가 없습니다.'}
            </p>
          ) : (
            processedChallenges.map(challenge => (
              <ProblemCard
                key={challenge.id}
                challenge={challenge}
                onSolveClick={() => handleSolveProblem(challenge.id)}
                isSolved={solvedTitles.has(challenge.title)}
                isLoading={false}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeSection;

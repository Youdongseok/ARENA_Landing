import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, Camera, Check, Gauge, Sparkles, Star, Trophy } from 'lucide-react';

import Avatar from '@/components/Avatar/Avatar';
import api from '@/api/axiosInstance';
import { deleteMyAccount, updateMyTeamname, uploadMyProfileImage } from '@/api/auth';
import downButtonIcon from '@/assets/icons/downbtn.svg';
import {
  ALL_FILTER_OPTION,
  getSeasonLabelOptionsFromProblems,
  matchesSeasonLabelFilter,
} from '@/constants/problemMeta';
import { useAuthStore } from '@/stores/authStore';
import { useLeaderboardQuery } from '@/hooks/useLeaderboardQuery';
import { useTeamDashboardQuery } from '@/hooks/useTeamDashboardQuery';
import PointIcon from '@/assets/icons/Point.svg';


function formatSolvedAt(value) {
  if (!value) return '기록 없음';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '기록 없음';
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatShortDate(value) {
  if (!value) return '기록 없음';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '기록 없음';
  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  });
}

export default function MyPage() {
  const navigate = useNavigate();
  const seasonSelectRef = useRef(null);
  const teamInfo = useAuthStore(state => state.teamInfo);
  const setLoggedOut = useAuthStore(state => state.setLoggedOut);
  const updateTeamInfo = useAuthStore(state => state.updateTeamInfo);
  const teamId = teamInfo?.id || teamInfo?.team_id;
  const userName = teamInfo?.teamname || teamInfo?.username || teamInfo?.login_id || '사용자';
  const loginId = teamInfo?.login_id || '-';
  const roleLabel = teamInfo?.role === 'admin' ? '관리자 계정' : '사용자 계정';
  const profileImageUrl = teamInfo?.profile_image_url;

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userName);
  const [isSavingName, setIsSavingName] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [nameError, setNameError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [seasonLabelFilter, setSeasonLabelFilter] = useState('all');
  const [isSeasonSelectOpen, setIsSeasonSelectOpen] = useState(false);
  const [historyKeyword, setHistoryKeyword] = useState('');

  const { data, isLoading, isError } = useTeamDashboardQuery(teamId);
  const { data: leaderboardData = [] } = useLeaderboardQuery();
  const { data: allProblems = [] } = useQuery({
    queryKey: ['problems'],
    queryFn: async () => {
      const response = await api.get('/problem/all');
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const solvedCount = data?.solved_count ?? 0;
  const totalScore = data?.total_score ?? 0;

  const solvedHistory = [...(data?.problems ?? [])]
    .filter(problem => problem.solved)
    .sort((a, b) => {
      const timeA = a?.solved_at ? new Date(a.solved_at).getTime() : 0;
      const timeB = b?.solved_at ? new Date(b.solved_at).getTime() : 0;
      return timeB - timeA;
    });

  const problemMetaByTitle = useMemo(
    () => new Map(allProblems.map(problem => [problem.title, problem])),
    [allProblems]
  );

  const solvedHistoryWithMeta = useMemo(
    () =>
      solvedHistory.map(problem => ({
        ...problem,
        season_label: problemMetaByTitle.get(problem.title)?.season_label ?? null,
      })),
    [problemMetaByTitle, solvedHistory]
  );

  const seasonOptions = useMemo(
    () => [ALL_FILTER_OPTION, ...getSeasonLabelOptionsFromProblems(solvedHistoryWithMeta)],
    [solvedHistoryWithMeta]
  );

  const filteredSolvedHistory = useMemo(() => {
    const keyword = historyKeyword.trim().toLowerCase();
    return solvedHistoryWithMeta.filter(problem => {
      const matchesSeason = matchesSeasonLabelFilter(problem, seasonLabelFilter);
      const matchesKeyword = !keyword || problem.title?.toLowerCase().includes(keyword);
      return matchesSeason && matchesKeyword;
    });
  }, [historyKeyword, seasonLabelFilter, solvedHistoryWithMeta]);

  const activeProblems = (data?.problems ?? []).filter(problem => problem.is_active);
  const totalActiveProblemCount = activeProblems.length;

  const solvedRate = totalActiveProblemCount
    ? Math.round((solvedCount / totalActiveProblemCount) * 100)
    : 0;

  const seasonProblemCount = allProblems.filter(problem =>
    matchesSeasonLabelFilter(problem, seasonLabelFilter)
  ).length;

  const seasonSolvedHistory = solvedHistoryWithMeta.filter(problem =>
    matchesSeasonLabelFilter(problem, seasonLabelFilter)
  );

  const seasonTotalScore = seasonSolvedHistory.reduce(
    (sum, problem) => sum + (problem.best_score ?? 0),
    0
  );

  const bestEfficiencyProblem =
    [...seasonSolvedHistory]
      .filter(problem => Number.isFinite(problem.success_tokens))
      .sort(
        (a, b) =>
          (a.success_tokens ?? Number.MAX_SAFE_INTEGER) -
          (b.success_tokens ?? Number.MAX_SAFE_INTEGER)
      )[0] ?? null;

  const sortedRows = [...leaderboardData].sort((a, b) => {
    if ((b.score ?? 0) !== (a.score ?? 0)) return (b.score ?? 0) - (a.score ?? 0);
    return new Date(a.last_solved_at ?? 0) - new Date(b.last_solved_at ?? 0);
  });

  const rankIndex = sortedRows.findIndex(
    row => row.teamname === userName || row.team_id === teamId
  );

  const myRank = rankIndex >= 0 ? rankIndex + 1 : null;

  const selectedSeasonOption =
    seasonOptions.find(option => option.value === seasonLabelFilter) ?? ALL_FILTER_OPTION;

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

  useEffect(() => {
    setNameInput(userName);
  }, [userName]);

  const handleProfileImageChange = async event => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      setIsUploadingImage(true);
      setUploadError('');
      const updated = await uploadMyProfileImage(file);
      updateTeamInfo(updated);
    } catch (error) {
      setUploadError(error?.response?.data?.detail || '프로필 사진 업로드에 실패했습니다.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      '정말로 계정을 삭제할까요?\n삭제 후에는 프로필, 해결 기록, 제출 기록을 복구할 수 없습니다.'
    );
    if (!confirmed) return;

    try {
      setIsDeletingAccount(true);
      setDeleteError('');
      await deleteMyAccount();
      setLoggedOut();
      navigate('/login', { replace: true });
    } catch (error) {
      setDeleteError(error?.response?.data?.detail || '계정 삭제에 실패했습니다.');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleSubmitName = async event => {
    event.preventDefault();
    const trimmedName = nameInput.trim();

    if (!trimmedName) {
      setNameError('이름을 입력해 주세요.');
      return;
    }

    try {
      setIsSavingName(true);
      setNameError('');
      const updated = await updateMyTeamname({ teamname: trimmedName });
      updateTeamInfo(updated);
      setIsEditingName(false);
    } catch (error) {
      setNameError(error?.response?.data?.detail || '이름 수정에 실패했습니다.');
    } finally {
      setIsSavingName(false);
    }
  };

  return (
    <div className="w-full px-4 py-6 md:px-6">
      <div className="mx-auto max-w-[1240px] space-y-8">
        <section className="rounded-[24px] border border-[#E7ECF3] bg-white px-8 py-7 shadow-md">
          <p className="text-sm font-semibold tracking-[0.18em] text-[#FF4854]/80">MY PAGE</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0F172A]">내 정보</h1>
          <p className="mt-2 text-[15px] text-[#64748B]">
            프로필 정보와 최근 활동, 해결 기록을 한눈에 확인할 수 있습니다.
          </p>
        </section>

        <div className="space-y-8">
          <section className="rounded-[32px] border border-[#EEE7EB] bg-white p-8 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
            <div className="text-start">
              <p className="text-sm font-semibold tracking-[0.18em] text-[#FF4854]/80">PROFILE</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0F172A]">계정 정보</h1>
              <p className="mt-2 text-[15px] text-[#64748B]">
                프로필 사진과 기본 계정 정보를 이곳에서 간단하게 관리할 수 있습니다.
              </p>
            </div>

            <div className="mx-auto mt-10 grid gap-10 md:grid-cols-2 md:items-center">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full border-4 border-[#F4EAED] bg-white p-1 shadow-[0_16px_30px_rgba(15,23,42,0.08)]">
                  <Avatar src={profileImageUrl} name={userName} size={160} />
                </div>

                <label className="mx-auto mt-6 inline-flex min-w-[180px] cursor-pointer items-center justify-center gap-2 rounded-full bg-[#FF5E70] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#f44a5e]">
                  <Camera size={16} />
                  {isUploadingImage ? '업로드 중...' : '사진 변경'}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleProfileImageChange}
                    disabled={isUploadingImage}
                  />
                </label>

                <p className="mt-3 text-xs leading-5 text-[#9B7B86]">
                  JPG, PNG, WEBP 파일만 업로드할 수 있고 최대 3MB까지 지원됩니다.
                </p>

                {uploadError && (
                  <p className="mt-3 text-sm font-medium text-[#DC2626]">{uploadError}</p>
                )}
              </div>

              <div className="space-y-6 text-center md:text-left">
                <div>
                  <p className="text-xs font-semibold tracking-[0.16em] text-[#A58D92] uppercase">
                    이름
                  </p>

                  {isEditingName ? (
                    <form onSubmit={handleSubmitName} className="mt-3 space-y-3">
                      <input
                        value={nameInput}
                        onChange={event => setNameInput(event.target.value)}
                        placeholder="이름을 입력하세요"
                        className="h-12 w-full rounded-2xl border border-[#E7D7D9] bg-white px-4 text-[16px] font-medium text-[#201A1B] outline-none transition focus:border-[#FF4854]"
                        disabled={isSavingName}
                      />

                      <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                        <button
                          type="submit"
                          disabled={isSavingName}
                          className="rounded-full bg-[#FF5E70] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#f44a5e] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isSavingName ? '저장 중...' : '이름 저장'}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingName(false);
                            setNameInput(userName);
                            setNameError('');
                          }}
                          disabled={isSavingName}
                          className="rounded-full border border-[#E7D7D9] bg-white px-5 py-2.5 text-sm font-semibold text-[#6B5E61] transition hover:bg-[#FFF8F9] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          취소
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="mt-2 flex flex-col items-center gap-3 md:items-start">
  <p className="text-[34px] font-semibold tracking-tight text-[#1F1A23]">
    {userName}
  </p>

  <button
    type="button"
    onClick={() => {
      setIsEditingName(true);
      setNameInput(userName);
      setNameError('');
    }}
    className="cursor-pointer rounded-full border border-[#E7D7D9] bg-white px-4 py-2 text-sm font-semibold text-[#6B5E61] transition hover:bg-[#FFF8F9]"
  >
    이름 변경
  </button>
</div>
                  )}

                  {nameError && (
                    <p className="mt-3 text-sm font-medium text-[#DC2626]">{nameError}</p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold tracking-[0.16em] text-[#A58D92] uppercase">
                    아이디
                  </p>
                  <p className="mt-2 text-[24px] font-semibold tracking-tight text-[#1F1A23] break-all">
                    {loginId}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold tracking-[0.16em] text-[#A58D92] uppercase">
                    역할
                  </p>
                  <p className="mt-2 text-[24px] font-semibold tracking-tight text-[#1F1A23]">
                    {roleLabel}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="history-panel" className="space-y-6 p-1">
            <div className="rounded-[24px] border border-[#E7ECF3] bg-white px-6 py-5 shadow-md">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm font-700 tracking-[0.18em] text-[#FF7B84] uppercase">
                    Challenge Summary
                  </p>
                  <h2 className="text-[26px] font-700 text-[#201A1B]">
                    {seasonLabelFilter === 'all'
                      ? `총 ${solvedHistory.length}문제`
                      : `총 ${solvedHistory.length}문제 중 ${seasonLabelFilter} ${filteredSolvedHistory.length}문제`}
                  </h2>
                  <p className="text-[15px] leading-6 text-[#6B5E61]">
                    해결한 문제 기록을 한곳에서 빠르게 확인할 수 있어요.
                  </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#64748B]">시즌 선택</label>
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
                              const isSelected = option.value === seasonLabelFilter;

                              return (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => {
                                    setSeasonLabelFilter(option.value);
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

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#64748B]">문제 이름 검색</label>
                    <input
                      value={historyKeyword}
                      onChange={event => setHistoryKeyword(event.target.value)}
                      placeholder="문제 이름을 입력하세요"
                      className="h-12 rounded-2xl border border-[#E7D7D9] bg-white px-4 text-[15px] text-[#201A1B] outline-none transition focus:border-[#FF4854]"
                    />
                  </div>
                </div>
              </div>

              {!!historyKeyword.trim() && (
                <div className="mt-4 rounded-2xl bg-[#FFF6F7] px-4 py-3 text-sm font-600 text-[#D43C4D]">
                  현재 필터: "{historyKeyword.trim()}" ({filteredSolvedHistory.length}문제)
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <article className="rounded-[24px] border border-[#EEE7EB] bg-white px-5 py-5 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ECFDF3] text-[#14B37D]">
                  <Trophy size={18} />
                </div>
                <p className="mt-4 text-sm font-medium text-[#9B7B86]">리더보드 순위</p>
                <p className="mt-2 text-2xl font-semibold text-[#1F1A23]">
                  {isLoading ? '...' : myRank ? `${myRank}위` : '-'}
                </p>
                <p className="mt-2 text-sm text-[#8A6E73]">현재 집계 기준 순위</p>
              </article>

              <article className="rounded-[24px] border border-[#EEE7EB] bg-white px-5 py-5 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF1F2] text-[#FF4854]">
                  <Sparkles size={18} />
                </div>
                <p className="mt-4 text-sm font-medium text-[#9B7B86]">선택 시즌 해결 수</p>
                <p className="mt-2 text-2xl font-semibold text-[#1F1A23]">
                  {seasonLabelFilter === 'all'
                    ? `${solvedHistory.length} / ${totalActiveProblemCount}`
                    : `${seasonSolvedHistory.length} / ${seasonProblemCount || 0}`}
                </p>
                <p className="mt-2 text-sm text-[#8A6E73]">
                  {seasonLabelFilter === 'all' ? '전체 활성 문제 기준' : '선택한 시즌 기준'}
                </p>
              </article>

              <article className="rounded-[24px] border border-[#EEE7EB] bg-white px-5 py-5 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ECFDF3] text-[#16A34A]">
                  <Gauge size={18} />
                </div>
                <p className="mt-4 text-sm font-medium text-[#9B7B86]">해결률</p>
                <p className="mt-2 text-2xl font-semibold text-[#1F1A23]">
                  {seasonLabelFilter === 'all'
                    ? `${solvedRate}%`
                    : `${
                        seasonProblemCount
                          ? Math.round(
                              (seasonSolvedHistory.length / seasonProblemCount) * 100
                            )
                          : 0
                      }%`}
                </p>
                <p className="mt-2 text-sm text-[#8A6E73]">
                  {seasonLabelFilter === 'all'
                    ? `${solvedCount}개 해결`
                    : `${seasonSolvedHistory.length}개 해결`}
                </p>
              </article>

             <article className="rounded-[24px] border border-[#EEE7EB] bg-white px-5 py-5 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#201A1B]">
    <img src={PointIcon} alt="point" className="h-5 w-5" />
  </div>

  <p className="mt-4 text-sm font-medium text-[#9B7B86]">선택한 시즌 총점</p>

  <p className="mt-2 truncate text-xl font-semibold text-[#1F1A23]">
    {seasonTotalScore}점
  </p>

  <p className="mt-2 text-sm text-[#8A6E73]">
    해결한 문제 최고 점수 합산
  </p>
</article>

              <article className="rounded-[24px] border border-[#EEE7EB] bg-white px-5 py-5 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F8FBFF] text-[#3B82F6]">
                  <Star size={18} />
                </div>
                <p className="mt-4 text-sm font-medium text-[#9B7B86]">최고 효율 해결</p>
                <p className="mt-2 truncate text-xl font-semibold text-[#1F1A23]">
                  {bestEfficiencyProblem?.title ?? '아직 기록 없음'}
                </p>
                <p className="mt-2 text-sm text-[#8A6E73]">
                  {bestEfficiencyProblem
                    ? `${bestEfficiencyProblem.success_tokens ?? 0} 토큰 · ${formatShortDate(
                        bestEfficiencyProblem.solved_at
                      )}`
                    : '아직 기록 없음'}
                </p>
              </article>
            </div>

            <div>
              {isError ? (
                <div className="rounded-[20px] border border-[#F1E8EB] bg-white px-5 py-4 text-sm text-red-400">
                  데이터를 불러오는 중 오류가 발생했습니다.
                </div>
              ) : isLoading ? (
                <div className="rounded-[20px] border border-[#F1E8EB] bg-white px-5 py-4 text-sm text-[#94A3B8]">
                  불러오는 중...
                </div>
              ) : filteredSolvedHistory.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredSolvedHistory.map(problem => (
                    <article
                      key={`${problem.title}-${problem.solved_at ?? 'solved'}`}
                      className="rounded-[24px] border border-[#EEE7EB] bg-white px-5 py-5 shadow-[0_18px_42px_rgba(15,23,42,0.05)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold leading-7 text-[#1F1A23]">
                            {problem.title}
                          </h3>
                        </div>
                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#ECFDF3] text-[#16A34A]">
                          <Check size={18} />
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-[#9B7B86]">
                        해결 시각: {formatSolvedAt(problem.solved_at)}
                      </p>
                      <div className="mt-4 inline-flex rounded-full bg-[#F8FBFF] px-3 py-1.5 text-sm font-medium text-[#3B82F6]">
                        사용 토큰: {problem.success_tokens ?? 0}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-[20px] border border-[#F1E8EB] bg-white px-5 py-4 text-sm text-[#94A3B8]">
                  {historyKeyword.trim()
                    ? '검색 조건에 맞는 해결 기록이 없어요.'
                    : '아직 해결한 문제가 없습니다.'}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[32px] border border-[#EEE7EB] bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold tracking-[0.18em] text-[#E4768C]">
                  DANGER ZONE
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[#282431]">계정 삭제</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#9B7B86]">
                  계정을 삭제하면 프로필 이미지, 해결 기록, 제출 기록이 함께 삭제되며 복구할
                  수 없습니다.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                className="rounded-full border border-[#F6BCC6] bg-[#FFF5F5] px-5 py-3 text-sm font-semibold text-[#DC2626] transition hover:bg-[#FEEDEE] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeletingAccount ? '계정 삭제 중...' : '계정 삭제'}
              </button>
            </div>

            {deleteError && <p className="mt-4 text-sm font-medium text-[#DC2626]">{deleteError}</p>}
          </section>
        </div>
      </div>
    </div>
  );
}

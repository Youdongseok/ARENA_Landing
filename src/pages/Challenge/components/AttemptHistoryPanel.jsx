// src/features/Challenge/components/AttemptHistoryPanel.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import AttemptHistoryCard, { AttemptHistoryCardSkeleton } from './AttemptHistoryCard';
import PointInfoCard from './PointInfoCard';
import useModalStore from '@/stores/useModalStore';
import { useSessionStore } from '@/stores/useSessionStore';
import TokenInfoCard from './TokenInfoCard';

const SKELETON_CARD_COUNT = 4;

const FILTER_OPTIONS = [
  { key: 'ALL', label: '전체' },
  { key: 'SUCCESS', label: '성공' },
  { key: 'FAILED', label: '실패' },
  { key: 'NOT_SUBMITTED', label: '미제출' },
];

export default function AttemptHistoryPanel({
  PurpleDownIcon,
  isLoading,
  sessions = [],
  problemId,
  teamId,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(FILTER_OPTIONS[0]);
  const dropdownRef = useRef(null);

  useModalStore();
  const { sessionId: currentActiveSessionId, setSessionId, setSessionStatus } = useSessionStore();

  const totalAttempts = sessions.length;

  const filteredAttempts = sessions
    .map((session, index) => {
      const status = session.status?.toLowerCase() || 'unsubmitted';
      let filterKey, isSubmitted, isSuccess, promptSummary;

      switch (status) {
        case 'success':
          filterKey = 'SUCCESS';
          isSubmitted = true;
          isSuccess = true;
          promptSummary = session.title || '성공한 시도';
          break;
        case 'fail':
        case 'failed':
          filterKey = 'FAILED';
          isSubmitted = true;
          isSuccess = false;
          promptSummary =
            session.judge_reason?.split('\n')[0]?.slice(0, 50) || session.title || '실패한 시도';
          break;
        default:
          filterKey = 'NOT_SUBMITTED';
          isSubmitted = false;
          isSuccess = false;
          promptSummary =
            session.judge_reason?.split('\n')[0]?.slice(0, 50) || session.title || '새로운 대화';
      }

      return {
        id: session.id,
        status,
        title: session.title,
        attemptNumber: totalAttempts - index,
        isSubmitted,
        isSuccess,
        promptSummary,
        isActive: session.id === currentActiveSessionId,
        filterKey,
      };
    })
    .filter(attempt => {
      if (selectedFilter.key === 'ALL') return true;
      return attempt.filterKey === selectedFilter.key;
    });

  const toggleDropdown = useCallback(() => setIsDropdownOpen(prev => !prev), []);
  const handleFilterSelect = useCallback(filter => {
    setSelectedFilter(filter);
    setIsDropdownOpen(false);
  }, []);

  const handleCardClick = useCallback(
    (clickedSessionId, clickedStatus) => {
      if (!problemId || !teamId) return;

      if (clickedSessionId !== currentActiveSessionId) {
        setSessionId(clickedSessionId);
        setSessionStatus(clickedStatus);
      }
    },
    [currentActiveSessionId, setSessionId, setSessionStatus, problemId, teamId]
  );

  useEffect(() => {
    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col flex-shrink-0 w-[240px] lg:w-[295px] h-full">
      {/* 포인트 카드 */}
      <div className="flex-shrink-0 w-full mb-4">
        <PointInfoCard isLoading={isLoading} />
      </div>

      {/* ⭐ 토큰 카드 */}
      <div className="flex-shrink-0 w-full mb-4">
        <TokenInfoCard problemId={problemId} teamId={teamId} />
      </div>

      {/* 시도 기록 */}
      <div className="flex flex-col shadow-xl rounded-[20px] overflow-hidden flex-1 bg-[rgba(235,232,254,0.1)] h-full">
        <div className="w-full h-[70px] p-3 md:p-4 shadow-sm bg-white rounded-t-[20px] flex items-center justify-between">
          <span className="heading-2 font-500 text-[#837BBD]">최근 시도 ({sessions.length})</span>
        </div>

        <div className="p-3 md:p-4 flex justify-end relative" ref={dropdownRef}>
          <div
            className="flex items-center justify-between w-[126px] h-[39px] px-4 py-[10px] bg-white shadow rounded-[10px] cursor-pointer"
            onClick={toggleDropdown}
          >
            <span className="body-large font-700 text-[#837BBD]">{selectedFilter.label}</span>
            <img
              src={PurpleDownIcon}
              alt="Dropdown"
              className={`w-3 h-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </div>

          {isDropdownOpen && (
            <div className="absolute top-[60px] right-[16px] w-[126px] bg-white shadow-lg rounded-[10px] border border-[#EBE8FE] z-10">
              {FILTER_OPTIONS.map(option => (
                <div
                  key={option.key}
                  className={`px-4 py-[10px] body-large font-700 text-[#837BBD] cursor-pointer hover:bg-[#F5F4FF] ${
                    option.key === selectedFilter.key ? 'bg-[#EBE8FE] font-bold' : ''
                  }`}
                  onClick={() => handleFilterSelect(option)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col items-center overflow-y-auto px-4 py-1 gap-4">
          {isLoading ? (
            [...Array(SKELETON_CARD_COUNT)].map((_, i) => <AttemptHistoryCardSkeleton key={i} />)
          ) : filteredAttempts.length > 0 ? (
            filteredAttempts.map(attempt => (
              <AttemptHistoryCard
                key={attempt.id}
                attemptNumber={attempt.attemptNumber}
                isSubmitted={attempt.isSubmitted}
                isSuccess={attempt.isSuccess}
                promptSummary={attempt.promptSummary}
                isActive={attempt.isActive}
                onClick={() => handleCardClick(attempt.id, attempt.status)}
              />
            ))
          ) : (
            <div className="flex flex-1 justify-center items-center text-center">
              <p className="body-large font-500 text-[#000000]">
                {selectedFilter.key === 'ALL'
                  ? '아직 시도 기록이 없습니다.'
                  : `${selectedFilter.label} 기록이 없습니다.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

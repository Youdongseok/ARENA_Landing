// src/features/Challenge/components/PointInfoCard.jsx

import React from 'react';
import Skeleton from '../../../components/Skeleton/Skeleton';
import PointSvg from '../../../assets/icons/Point.svg';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useProblemBundle } from '@/hooks/useProblemBundle';
import { useProblemBestScore } from '@/hooks/useProblemBestScore'; // ⭐ 추가

const COLOR_BLACK = '#000000';

const PointInfoCardSkeleton = () => (
  <div
    className="w-full h-[80px] flex justify-start items-center p-4 flex-shrink-0 
               bg-white rounded-[20px] shadow-lg animate-pulse"
    style={{ boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.25)' }}
  >
    <div
      className="w-[49px] h-[49px] flex justify-center items-center rounded-[10px] flex-shrink-0"
      style={{ background: COLOR_BLACK }}
    >
      <img src={PointSvg} alt="Point Icon" className="w-[28px] h-[28px]" />
    </div>
    <div className="flex flex-row ml-4 items-center flex-1 justify-between">
      <span className="heading-3 font-500 text-black">점수</span>
      <Skeleton className="h-8 w-20 rounded" />
    </div>
  </div>
);

export default function PointInfoCard() {
  const { problemId } = useParams();
  const currentProblemId = parseInt(problemId, 10);
  const teamId = useAuthStore(state => state.teamInfo?.id) || undefined;

  // 문제 기본 점수
  const { data: problemData, isLoading: isProblemLoading } = useProblemBundle(
    currentProblemId,
    teamId
  );

  // ⭐ 최고 점수(best_score)
  const { data: bestScoreData, isLoading: isBestLoading } = useProblemBestScore(
    currentProblemId,
    teamId
  );

  const score = problemData?.problem?.score ?? 0;
  const bestScore = bestScoreData?.best_score ?? 0; // ⭐ 0 또는 실제 점수

  if (isProblemLoading || isBestLoading) return <PointInfoCardSkeleton />;

  return (
    <div
      className="w-full h-[80px] flex justify-start items-center p-4 flex-shrink-0 
                 bg-white rounded-[20px] shadow-lg"
      style={{ boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.25)' }}
    >
      <div
        className="w-[49px] h-[49px] flex justify-center items-center rounded-[10px] flex-shrink-0"
        style={{ background: COLOR_BLACK }}
      >
        <img src={PointSvg} alt="Point Icon" className="w-[28px] h-[28px]" />
      </div>

      <div className="flex flex-row ml-4 items-center flex-1 justify-between">
        <span className="heading-3 font-500 text-black">점수</span>

        <div className="flex items-baseline">
          {/* 최고 점수 */}
          <span className="heading-2 font-700 text-gray-600">{bestScore}</span>

          {/* / 구분 */}
          <span className="heading-2 font-500 text-black mx-2">/</span>

          {/* 문제 점수 */}
          <span className="heading-2 font-700 text-black">{score}</span>
        </div>
      </div>
    </div>
  );
}

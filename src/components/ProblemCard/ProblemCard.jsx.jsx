import React, { useState } from 'react';
import counselImage from '../../assets/images/counsel.png';
import medicalImage from '../../assets/images/medical.png';
import financeImage from '../../assets/images/finance.png';
import codingImage from '../../assets/images/coding.png';
import generalImage from '../../assets/images/general.png';
import lawImage from '../../assets/images/qjqfbf.png';
import militaryImage from '../../assets/images/rnstk.png';
import socialImage from '../../assets/images/tkghl.png';

import SolveProblemButton from '../Button/SolveProblemButton';
import CategoryTag from '../Tag/CategoryTag';
import Skeleton from '../Skeleton/Skeleton'; // Skeleton 컴포넌트 import

// 🖼️ 카테고리별 이미지 매핑
const getCategoryImage = category => {
  switch (category) {
    case '상담':
      return counselImage;
    case '의료':
      return medicalImage;
    case '금융':
      return financeImage;
    case '코딩':
      return codingImage;
    case '법률':
      return lawImage;
    case '군사':
      return militaryImage;
    case '사회':
      return socialImage;
    case '일반':
      return generalImage;
    case '락피킹':
      return generalImage;
    default:
      return generalImage;
  }
};

// ====================================================
// ProblemCardSkeleton 컴포넌트
// ====================================================
const ProblemCardSkeleton = () => {
  const cardClasses = `w-[339px] bg-white shadow-xl rounded-xl flex flex-col overflow-hidden relative`;
  const imageContainerClasses = `relative w-full h-[198px] overflow-hidden`;
  const contentClasses = `p-6 flex flex-col gap-2.5`;
  const tagsContainerClasses = `flex space-x-1.5 items-start`;

  return (
    <div className={cardClasses.trim()}>
      {/* 이미지 영역 스켈레톤 */}
      <div className={imageContainerClasses.trim()}>
        <Skeleton className="w-full h-full" />
      </div>

      {/* 내용 영역 스켈레톤 */}
      <div className={contentClasses.trim()}>
        <div className={tagsContainerClasses.trim()}>
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-11/12" />
        </div>
        <Skeleton className="h-10 w-full mt-2 rounded-lg" />
      </div>
    </div>
  );
};

// ====================================================
// ProblemCard 본체
// ====================================================
const ProblemCard = ({ challenge, onSolveClick, isLoading = false, isSolved = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (isLoading) {
    return <ProblemCardSkeleton />;
  }

  // ✅ score 필드 사용
  const { title, category, sub_description, goal, score } = challenge;

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const currentImageSrc = getCategoryImage(category);

  const cardClasses = `w-[339px] bg-white shadow-xl rounded-xl flex flex-col overflow-hidden relative`;
  const imageContainerClasses = `relative w-full h-[198px] overflow-hidden`;
  const imageClasses = `w-full h-full object-cover transition-transform duration-300 ease-in-out ${
    isHovered ? 'scale-220' : 'scale-200'
  }`;
  const contentClasses = `p-6 flex flex-col gap-2.5`;
  const tagsContainerClasses = `flex space-x-1.5 items-start`;
  const titleClasses = `heading-3 font-500 line-clamp-2`;
  const overlayClasses = `absolute inset-0 flex flex-col justify-start p-6 text-white pointer-events-none transition-opacity duration-300 bg-black/40`;
  const textBlock1Classes = `body-medium font-300 text-gray-200`;
  const textBlock2Classes = `body-medium font-700 text-red-500 mt-2`;

  return (
    <div
      className={cardClasses.trim()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 🖼️ 이미지 영역 */}
      <div className={imageContainerClasses.trim()}>
        <img
          src={currentImageSrc}
          alt={`문제 ${title}의 ${category} 이미지`}
          className={imageClasses.trim()}
        />

        {isHovered && (
          <div className={overlayClasses}>
            <p className={textBlock1Classes}>{sub_description}</p>
            <p className={textBlock2Classes}>{goal}</p>
          </div>
        )}
      </div>

      {/* 📝 내용 영역 */}
      <div className={contentClasses.trim()}>
        <div className={tagsContainerClasses.trim()}>
          <CategoryTag>{category}</CategoryTag>
          {/* ✅ 점수 표시 */}
          <p className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-semibold">
            점수: {score}점
          </p>
          {isSolved && (
            <p className="px-3 py-1 rounded-full bg-[#ECFDF3] text-[#16A34A] text-sm font-semibold">
              해결 완료
            </p>
          )}
        </div>

        <h3 className={titleClasses.trim()}>{title}</h3>
        <SolveProblemButton onClick={onSolveClick}>
          {isSolved ? '다시 도전' : '도전하기'}
        </SolveProblemButton>
      </div>
    </div>
  );
};

export default ProblemCard;

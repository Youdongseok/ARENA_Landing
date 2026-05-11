// src/components/TeamInfoSection/TeamInfoCard.jsx

import React from 'react';
import AiModelIconSvg from '@/assets/icons/blue-ai-model.svg';
import PointIconSvg from '@/assets/icons/Point.svg';
import Skeleton from '@/components/Skeleton/Skeleton';

// 💡 TeamInfoCardSkeleton: 값(value)만 스켈레톤 처리
const TeamInfoCardSkeleton = ({ cardStyle, iconType = 'coin', title = '획득한 포인트' }) => {
  const cardWidth = '500px';
  const cardHeight = '150px';
  const iconWrapperSize = '84px';
  const IconComponentSrc = iconType === 'coin' ? PointIconSvg : AiModelIconSvg;

  return (
    <div
      className="rounded-[20px] drop-shadow-md p-[33px] flex items-center gap-[30px]"
      style={{
        width: cardWidth,
        height: cardHeight,
        background: 'rgba(255, 255, 255, 0.8)',
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.25)',
        ...cardStyle,
      }}
    >
      {/* 1. 아이콘 (고정) */}
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-[10px]"
        style={{
          width: iconWrapperSize,
          height: iconWrapperSize,
          background: '#000000',
        }}
      >
        <img src={IconComponentSrc} alt={`${iconType} icon`} width={58} height={58} />
      </div>

      {/* 2. 텍스트 컨테이너 */}
      <div className="flex-1 flex items-center justify-between">
        {/* 제목 (고정) */}
        <span className="heading-1 font-500 text-[#000000]">{title}</span>

        {/* 값만 스켈레톤 */}
        <Skeleton className="h-[52px] w-20" />
      </div>
    </div>
  );
};

const TeamInfoCard = ({
  title = '획득한 포인트',
  value,
  iconType = 'coin',
  valueColor = '#FFD600',
  cardStyle,
  isLoading = false,
}) => {
  if (isLoading) {
    return <TeamInfoCardSkeleton cardStyle={cardStyle} iconType={iconType} title={title} />;
  }

  const cardWidth = '500px';
  const cardHeight = '150px';
  const iconWrapperSize = '84px';
  const iconBackground = '#000000';
  const IconComponentSrc = iconType === 'coin' ? PointIconSvg : AiModelIconSvg;

  return (
    <div
      className="rounded-[20px] drop-shadow-md p-[33px] flex items-center gap-[30px]"
      style={{
        width: cardWidth,
        height: cardHeight,
        background: 'rgba(255, 255, 255, 0.8)',
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.25)',
        ...cardStyle,
      }}
    >
      {/* 1. 아이콘 */}
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-[10px]"
        style={{
          width: iconWrapperSize,
          height: iconWrapperSize,
          background: iconBackground,
        }}
      >
        <img src={IconComponentSrc} alt={`${iconType} icon`} width={58} height={58} />
      </div>

      {/* 2. 텍스트 컨테이너 */}
      <div className="flex-1 flex items-center justify-between">
        {/* 제목 */}
        <span className="heading-1 font-500 text-[#000000]">{title}</span>

        {/* 값 */}
        <span className="heading-1 font-700 text-right" style={{ color: valueColor }}>
          {value}
        </span>
      </div>
    </div>
  );
};

export default TeamInfoCard;

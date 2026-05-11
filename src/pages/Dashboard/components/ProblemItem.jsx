import React from 'react';
import LockIconSvg from '@/assets/icons/Lock.svg';
import Skeleton from '@/components/Skeleton/Skeleton';

// === UI 상수 정의 ===
const BaseTextStyle = 'body-medium font-500 truncate';
const ItemWidth = '238px';
const ItemHeight = '52px';

// === 상태별 색상 정의 ===
const STATUS_COLORS = {
  SUCCESS: '#00B654',
  UNSUBMITTED: '#FFBA57',
  LOCKED_BACKGROUND: 'rgba(53, 53, 53, 0.4)',
  LOCKED_BORDER: '#353535',
};

// 💡 ProblemItemSkeleton
const ProblemItemSkeleton = () => (
  <div
    className="rounded-[20px] p-[16px_12px] flex items-center justify-between"
    style={{
      width: ItemWidth,
      height: ItemHeight,
      backgroundColor: '#FFFFFF',
      border: '1px solid #DEDEDE',
    }}
  >
    <Skeleton className="w-full h-full" />
  </div>
);

const ProblemItem = ({ problem, isLoading = false }) => {
  if (isLoading) return <ProblemItemSkeleton />;

  const { id, title, status } = problem;

  // ✅ SUCCESS (피그마 스타일 — 영역 반전)
  if (status === 'SUCCESS') {
    const color = STATUS_COLORS.SUCCESS;

    return (
      <div
        className="flex items-center justify-between rounded-[20px] overflow-hidden"
        style={{
          width: ItemWidth,
          height: ItemHeight,
          border: `1px solid ${color}`,
          backgroundColor: color, // ✅ 전체 배경 먼저 초록으로
        }}
      >
        {/* 왼쪽 영역: 초록 배경, 흰 글자 */}
        <div
          className="flex items-center justify-start px-[16px]"
          style={{
            flex: 1,
            color: 'white',
            fontWeight: 500,
            fontSize: '14px',
            backgroundColor: color,
            borderRadius: '18px 0 0 18px',
          }}
        >
          #{id}&nbsp;{title}
        </div>

        {/* 오른쪽 영역: 흰 배경, 초록 글자 */}
        <div
          className="flex items-center justify-center font-bold text-[14px]"
          style={{
            width: '70px',
            height: '100%',
            backgroundColor: '#FFFFFF',
            color,
            borderRadius: '0 18px 18px 0',
          }}
        >
          성공
        </div>
      </div>
    );
  }

  // ✅ UNSUBMITTED
  if (status === 'UNSUBMITTED') {
    const color = STATUS_COLORS.UNSUBMITTED;
    return (
      <div
        className="flex items-center justify-center rounded-[20px]"
        style={{
          width: ItemWidth,
          height: ItemHeight,
          backgroundColor: '#FFF',
          border: `1px solid ${color}`,
          color,
          fontWeight: 500,
          fontSize: '14px',
        }}
      >
        #{id}&nbsp;{title}
      </div>
    );
  }

  // ✅ LOCKED
  if (status === 'LOCKED') {
    return (
      <div
        className="flex items-center justify-center rounded-[20px] border cursor-not-allowed"
        style={{
          width: ItemWidth,
          height: ItemHeight,
          backgroundColor: STATUS_COLORS.LOCKED_BACKGROUND,
          borderColor: STATUS_COLORS.LOCKED_BORDER,
          color: 'rgba(255,255,255,0.6)',
          fontSize: '14px',
        }}
      >
        #{id}&nbsp;{title}
        <img src={LockIconSvg} alt="잠금 아이콘" className="w-[20px] h-[20px] ml-2 opacity-70" />
      </div>
    );
  }

  // 예외
  return (
    <div
      className="flex items-center justify-center rounded-[20px] bg-red-500 text-white"
      style={{ width: ItemWidth, height: ItemHeight }}
    >
      #{id} {title} (상태 오류)
    </div>
  );
};

export default ProblemItem;

import React from 'react';

/**
 * 난이도 텍스트에 따라 Tailwind 색상 클래스를 결정하는 유틸리티 함수입니다.
 * Tailwind의 기본 색상 팔레트와 디자인의 HEX 코드를 매핑합니다.
 *
 * @param {string} level - 난이도 텍스트 ('상', '중', '하')
 * @returns {string} Tailwind CSS text-color 및 border-color 클래스 문자열
 */
const getDifficultyColors = level => {
  switch (level) {
    case '고급':
      // 💡 수정: #FF2D55 (빨강)에 가까운 Tailwind Red 계열
      return 'text-red-500 border-red-500';
    case '중급':
      // 💡 수정: #00C8B3 (청록)에 가까운 Tailwind Teal 계열
      return 'text-teal-500 border-teal-500';
    case '초급':
      // 💡 수정: #FFCC00 (노랑)에 가까운 Tailwind Amber/Yellow 계열
      return 'text-amber-400 border-amber-400';
    default:
      // 기본값 또는 예외 처리
      return 'text-gray-500 border-gray-500';
  }
};

/**
 * 난이도 표시를 위한 공통 태그 컴포넌트입니다. (좁은 패딩 Variant B)
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - 태그에 표시될 난이도 텍스트 ('상', '중', '하' 등)
 * @returns {JSX.Element} 난이도 태그 엘리먼트
 */
const DifficultyTag = ({ children }) => {
  const levelText = String(children);
  const colorClasses = getDifficultyColors(levelText);

  // 공통 기본 스타일 (높이 31px, 배경 흰색, 둥근 모서리, 폰트, 좁은 패딩)
  const baseClasses = `
    flex items-center justify-center 
    h-[31px] 
    bg-white 
    rounded-full 
    border 
    p-2               
    body-small
  `;

  // 최종 클래스 조합
  const classes = `${baseClasses} ${colorClasses}`;

  return <div className={classes.trim()}>{children}</div>;
};

export default DifficultyTag;

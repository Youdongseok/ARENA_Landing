import React from 'react';

/**
 * 카테고리 텍스트에 따라 Tailwind 색상 클래스를 결정하는 유틸리티 함수입니다.
 *
 * @param {string} category - 카테고리 텍스트 (예: '문법', '어휘', '독해')
 * @returns {string} Tailwind CSS text-color 및 border-color 클래스 문자열
 */
const getCategoryColors = category => {
  switch (category) {
    case '상담':
      return 'text-rose-500 border-rose-300';
    case '의료':
      return 'text-sky-600 border-sky-300';
    case '금융':
      return 'text-emerald-600 border-emerald-300';
    case '코딩':
      return 'text-indigo-600 border-indigo-300';
    case '법률':
      return 'text-yellow-400 border-yellow-400';
    case '군사':
      return 'text-green-500 border-green-500';
    case '사회':
      return 'text-pink-400 border-pink-400';
    case '일반':
      return 'text-fuchsia-600 border-fuchsia-600';
    case '락피킹':
      return 'text-slate-600 border-slate-300';
    default:
      return 'text-fuchsia-600 border-fuchsia-600';
  }
};

/**
 * 카테고리/유형 표시를 위한 공통 태그 컴포넌트입니다. (좁은 패딩 Variant B)
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - 태그에 표시될 카테고리 텍스트 (예: '문법', '어휘')
 * @returns {JSX.Element} 카테고리 태그 엘리먼트
 */
const CategoryTag = ({ children }) => {
  const categoryText = String(children);
  const colorClasses = getCategoryColors(categoryText);

  // 공통 기본 스타일 (높이 31px, 배경 흰색, 둥근 모서리, 폰트, 좁은 패딩: p-2)
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

export default CategoryTag;

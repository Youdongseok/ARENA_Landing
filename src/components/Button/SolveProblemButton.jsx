import React from 'react';

/**
 * 문제풀기, 시작 등 주요 액션에 사용되는 CTA 버튼 컴포넌트입니다.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - 버튼 내부에 표시될 내용 (기본: '문제풀기')
 * @param {function} props.onClick - 버튼 클릭 시 실행될 함수
 * @param {string} props.className - 추가적으로 적용할 Tailwind 클래스
 * @returns {JSX.Element} CTA 버튼 엘리먼트
 */
const SolveProblemButton = ({ children = '문제풀기', onClick, className = '' }) => {
  // Figma 디자인에 기반한 기본 Tailwind 클래스
  const baseClasses = `
    flex items-center justify-center 
    w-full                 // 부모 컴포넌트의 가로 전체 너비를 사용 (align-self: stretch와 유사)
    h-[35px]               // 높이 35px 고정
    bg-[#FF4854]/80        // 배경색: #FF4854 (빨강)에 80% 투명도 적용
    rounded-md             // border-radius: 5px
    px-[60px] py-[6px]     // 패딩: 좌우 60px, 상하 6px
    text-white 
    body-medium font-500
    transition duration-150 ease-in-out // 자연스러운 호버 효과 추가
    hover:bg-[#FF4854]     // 호버 시 투명도 제거 (더 진하게)
    active:scale-[0.98]    // 클릭 시 약간 축소
    cursor-pointer
  `;

  return (
    <button
      type="button"
      onClick={onClick}
      // 기본 클래스와 외부에서 전달된 추가 클래스를 결합
      className={`${baseClasses} ${className}`.trim()}
    >
      {children}
    </button>
  );
};

export default SolveProblemButton;

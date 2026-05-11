// src/features/Challenge/components/ChallengeInfoPanel.jsx
import React, { useState, useRef, useEffect } from 'react';
import ApiInfoPanel from './ApiInfoPanel';
import Skeleton from '../../../components/Skeleton/Skeleton';

const ChallengeInfoPanelSkeleton = ({ TABS, handleTabClick }) => (
  <div className="flex flex-col flex-shrink-0 w-[295px] h-full animate-pulse">
    <div className="bg-white shadow-xl rounded-[20px] overflow-hidden flex flex-col h-full">
      <div className="flex flex-col p-4 h-[110px] shadow-sm bg-white rounded-t-[20px] flex-shrink-0">
        <Skeleton className="h-6 w-3/4 rounded mb-3" />
        <Skeleton className="h-4 w-full rounded mb-3" />
        <Skeleton className="h-4 w-full rounded mb-3" />
      </div>
      <div className="w-full flex-shrink-0 flex flex-col bg-white border-t border-gray-200 flex-grow">
        <div className="flex justify-center p-4 gap-2 border-b border-gray-200 flex-shrink-0">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={e => handleTabClick(e, tab.id)}
              className={`py-2 px-2 body-large font-500 rounded-lg transition-colors duration-200 cursor-pointer
                text-gray-500 border border-gray-300 bg-gray-50 hover:bg-gray-100 whitespace-nowrap`}
            >
              {tab.title}
            </button>
          ))}
        </div>
        <div className="p-4 flex-grow flex flex-col space-y-4">
          <Skeleton className="h-4 w-1/2 rounded mb-4" />
          <Skeleton className="h-1/2 w-full rounded mb-4" />
          <ApiInfoPanel isLoading={true} />
        </div>
      </div>
    </div>
  </div>
);

export default function ChallengeInfoPanel({
  TABS,
  activeTab,
  activeTabContent,
  handleTabClick,
  CHALLENGE_HEADER_INFO,
  isLoading,

  // ⭐ 추가된 props (problem_api 정보)
  problemApiUrl,
  problemApiMethod,
  problemApiHeaderName,
  problemApiKey,
  problemCode,
}) {
  const [width, setWidth] = useState(310);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = e => {
      if (!isResizing) return;
      const min = 295;
      const max = 500;
      const rect = panelRef.current.getBoundingClientRect();
      const newWidth = Math.min(Math.max(e.clientX - rect.left, min), max);
      setWidth(newWidth);
    };
    const stopResize = () => setIsResizing(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', stopResize);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopResize);
    };
  }, [isResizing]);

  const gap = Math.min((width - 295) / 50 + 0.25, 2);
  const padding = Math.min((width - 295) / 100 + 0.75, 1.5);
  const lineHeight = Math.min((width - 295) / 200 + 1.6, 1.9);

  if (isLoading) {
    return (
      <div ref={panelRef} style={{ width }} className="relative">
        <ChallengeInfoPanelSkeleton TABS={TABS} handleTabClick={handleTabClick} />
        <div
          onMouseDown={() => setIsResizing(true)}
          className={`absolute right-0 top-0 w-[10px] h-full cursor-ew-resize bg-gray-400 transition-colors rounded-r-[16px] flex items-center justify-center`}
        >
          <div className="flex flex-col items-center justify-center gap-[5px]">
            <span className="w-[2px] h-[8px] bg-white rounded-full" />
            <span className="w-[2px] h-[8px] bg-white rounded-full" />
            <span className="w-[2px] h-[8px] bg-white rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={panelRef}
      style={{ width, transition: isResizing ? 'none' : 'width 0.2s ease' }}
      className="relative flex flex-col flex-shrink-0 h-full"
    >
      <div
        className="bg-white shadow-xl rounded-l-[20px]
 overflow-hidden flex flex-col h-full"
      >
        {/* 문제 헤더 */}
        <div
          className="flex flex-col h-[110px] shadow-sm bg-white rounded-t-[20px] flex-shrink-0"
          style={{ padding: `${padding * 1.25}rem` }}
        >
          <span className="heading-2 font-500 text-[#34C759] mb-2">
            {CHALLENGE_HEADER_INFO?.title}
          </span>
          <span className="body-large font-500 text-[#010101]">
            {CHALLENGE_HEADER_INFO?.subtitle}
          </span>
        </div>

        {/* 탭 영역 */}
        <div className="w-full flex-shrink-0 flex flex-col bg-white border-t border-gray-200 flex-grow">
          <div
            className="flex justify-center border-b border-gray-200 flex-shrink-0"
            style={{
              gap: `${gap}rem`,
              padding: `${padding}rem ${padding * 1.2}rem`,
              transition: 'all 0.2s ease',
            }}
          >
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={e => handleTabClick(e, tab.id)}
                className={`py-2 px-2.5 body-large font-500 rounded-lg transition-colors duration-200 cursor-pointer
${tab.titleColor}
${
  activeTab === tab.id
    ? `border border-2 ${tab.borderColor} ${tab.bgColor} shadow-md`
    : 'text-gray-500 border border-gray-300 bg-gray-50 hover:bg-gray-100'
} 
whitespace-nowrap flex-shrink-0`}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {/* 탭 콘텐츠 */}
          {activeTabContent && (
            <div
              className={`border-b-4 ${activeTabContent.borderColor} flex-grow flex flex-col h-full ${activeTabContent.bgColor}`}
              style={{
                ...(activeTabContent.bgColor ? { backgroundColor: activeTabContent.bgColor } : {}),
                padding: `${padding * 1.25}rem`,
                transition: 'all 0.2s ease',
              }}
            >
              <div className="flex flex-col flex-grow overflow-y-auto justify-between">
                <div className="flex flex-col flex-shrink-0">
                  <span className={`heading-3 font-500 ${activeTabContent.titleColor} block mb-1`}>
                    {activeTabContent.title}
                  </span>

                  <p
                    className="body-large font-500 text-[#4C4C4C] whitespace-pre-wrap"
                    style={{ lineHeight }}
                  >
                    {activeTabContent.content}
                  </p>
                </div>

                {/* ⭐ API 패널 — 문제 설명 탭에서 표시 */}
                {activeTab === 'description' && problemApiUrl && (
                  <ApiInfoPanel
                    isLoading={false}
                    apiUrl={problemApiUrl}
                    method={problemApiMethod}
                    headerName={problemApiHeaderName}
                    apiKey={problemApiKey}
                    problemCode={problemCode}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 리사이즈 핸들 */}
      <div
        onMouseDown={() => setIsResizing(true)}
        className={`absolute right-0 top-0 w-[14px] h-full cursor-ew-resize 
    ${isResizing ? 'bg-gray-500' : 'bg-gray-400 hover:bg-gray-500'}
    transition-colors rounded-r-[16px] flex items-center justify-center
    translate-x-[10px]`}
      >
        <div className="flex flex-col items-center justify-center gap-[5px]">
          <span className="w-[2px] h-[8px] bg-white rounded-full" />
          <span className="w-[2px] h-[8px] bg-white rounded-full" />
          <span className="w-[2px] h-[8px] bg-white rounded-full" />
        </div>
      </div>
    </div>
  );
}

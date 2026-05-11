import React from 'react';

const tabs = ['사용자 점수 차트', '통합 랭크보드'];

export default function LeaderboardTabs({ activeTab, onChange }) {
  return (
    <div className="flex justify-center mb-10">
      <div
        className="
          flex px-3 py-2 gap-3
          rounded-full 
          bg-white
          border border-[#E2E8F0]
          shadow-[0_12px_30px_rgba(15,23,42,0.08)]
        "
      >
        {tabs.map(tab => {
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              onClick={() => onChange(tab)}
              className={`
                px-6 py-2 rounded-full text-sm font-semibold 
                transition-all duration-200 cursor-pointer
                ${
                  isActive
                    ? `
                      bg-[#FF4854]
                      text-white 
                      shadow-[0_10px_18px_rgba(255,72,84,0.28)]
                      border border-[#FF4854]
                    `
                    : `
                      text-[#475569]
                      border border-transparent
                      hover:bg-[#FFF1F2]
                      hover:text-[#FF4854]
                    `
                }
              `}
              style={{
                fontFamily: 'Black Han Sans',
                letterSpacing: '0.5px',
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}

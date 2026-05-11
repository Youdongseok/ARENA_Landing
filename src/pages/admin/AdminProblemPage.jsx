import React, { useState } from 'react';
import AdminProblemToggleList from './AdminProblemToggleList';
import AdminProblemCreatePage from './AdminProblemCreatePage';
import AdminProblemManagementPage from './AdminProblemManagementPage';

const TABS = ['문제 활성/비활성', '문제 생성', '문제 수정/삭제'];

export default function AdminProblemPage() {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <div className="w-full max-w-6xl mx-auto pt-10">
      {/*  탭 UI  */}
      <div className="flex gap-4 mb-10 justify-center ">
        {TABS.map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-6 py-3 rounded-xl font-bold text-base transition-all duration-200
                border  cursor-pointer
                ${
                  isActive
                    ? 'bg-[#FF4854] text-white border-[#FF4854] shadow-[0_0_15px_rgba(255,72,84,0.8)] scale-[1.05]'
                    : 'bg-[#1A0B15]/60 text-gray-300 border-gray-600 hover:bg-[#2a0f1f]'
                }
              `}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/*  탭 내용  */}
      {activeTab === '문제 활성/비활성' && <AdminProblemToggleList />}
      {activeTab === '문제 생성' && <AdminProblemCreatePage />}
      {activeTab === '문제 수정/삭제' && <AdminProblemManagementPage />}
    </div>
  );
}

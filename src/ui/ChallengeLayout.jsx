// src/layouts/ChallengeLayout.jsx

import React from 'react'; // useEffect, { useEffect } 제거
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
// import { useSidebarStore } from '../stores/useSidebarStore'; // setIsCollapsed를 사용하지 않으므로 제거

export default function ChallengeLayout() {
  // const setIsCollapsed = useSidebarStore(state => state.setIsCollapsed); // 제거

  // useEffect(() => { // useEffect 블록 전체 제거
  //  setIsCollapsed(true);
  // }, [setIsCollapsed]);

  return (
    <div className="min-h-screen w-full bg-[#F2F4F6]">
      <Sidebar />
      {/* 사이드바가 닫히거나 열려도 이 padding 값은 Sidebar 컴포넌트 내부에서 제어되는 것이 일반적입니다. 
          여기서는 사이드바가 닫혔을 때 padding이 120px 대신 40px 정도로 줄어드는 조정이 필요할 수 있습니다. 
          (현재 로직은 유지하되, 나중에 사이드바의 isCollapsed 상태에 따라 조정 필요) */}

      <div className="pl-[120px]">
        <main className="p-6 h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

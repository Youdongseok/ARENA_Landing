// src/layouts/DefaultLayout.jsx

import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import { useSidebarStore } from '../stores/useSidebarStore';

export default function DefaultLayout() {
  const isCollapsed = useSidebarStore(state => state.isCollapsed);

  const mainContentMargin = isCollapsed ? 'ml-[80px]' : 'ml-[256px]';

  return (
    <div className="min-h-screen w-full bg-[#F2F4F6] overflow-x-hidden">
      {/* ★ 가로 스크롤 방지: overflow-x-hidden 추가 */}

      <Sidebar />

      <div className={`transition-all duration-300 ${mainContentMargin}`}>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

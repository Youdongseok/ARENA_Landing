// src/components/Sidebar/Sidebar.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSidebarStore } from '../../stores/useSidebarStore';
import { useAuthStore } from '@/stores/authStore';

import SidebarHeader from './components/SidebarHeader';
import SidebarSection from './components/SidebarSection';
import BottomLinkItem from './components/BottomLinkItem';
import SidebarProfile from './components/SidebarProfile';

import { mainNavigationData, bottomLinksData } from './data/sidebarData';

export default function Sidebar({ isChallengeLayout = false, isOpen = true }) {
  const navigate = useNavigate();
  const { isCollapsed, toggleCollapsed, activeItem, isAIDropdownOpen, setActiveItemByPath } =
    useSidebarStore();

  const location = useLocation();
  useEffect(() => {
    setActiveItemByPath(location.pathname, location.search);
  }, [location.pathname, location.search, setActiveItemByPath]);

  const [isHelpHovered, setIsHelpHovered] = useState(false);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  // ⭐ 팀 + 관리자 모두 확인
  const { teamInfo, isLoggedIn, adminInfo, isAdminLoggedIn } = useAuthStore();

  // ⭐ 기본값
  let displayName = '로그인 필요';
  let displaySubtitle = '사용자';
  const isAnyLoggedIn = isLoggedIn || isAdminLoggedIn;

  // ⭐ 유저 로그인 시
  if (isLoggedIn) {
    // teamname 없으면 username 사용!
    displayName = teamInfo?.teamname || teamInfo?.username;
    displaySubtitle = '사용자';
  }

  // ⭐ 관리자 로그인 시
  if (isAdminLoggedIn) {
    displayName = adminInfo?.username;
    displaySubtitle = '관리자';
  }

  const mainNavigation = mainNavigationData(isAIDropdownOpen);

  const bottomLinks = bottomLinksData(
    isHelpHovered,
    setIsHelpHovered,
    isLogoutHovered,
    setIsLogoutHovered,
    isAnyLoggedIn
  );

  return (
    <aside
      className={`
        flex-shrink-0 bg-white fixed top-0 z-50
        ${isCollapsed ? 'w-20' : 'w-[256px]'}
        transition-all duration-300 ease-in-out
        ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        border-r border-white/10 shadow-xl h-full
      `}
    >
      <div className={`flex flex-col gap-6 h-full ${isCollapsed ? 'p-2' : 'p-6'}`}>
        <SidebarHeader
          isChallengeLayout={isChallengeLayout}
          isCollapsed={isCollapsed}
          setIsCollapsed={toggleCollapsed}
        />

        <SidebarSection
          title="메뉴"
          items={mainNavigation}
          activeItem={activeItem}
          isCollapsed={isCollapsed}
        />

        <div className="flex-grow" />

        <nav className={`flex flex-col gap-2 ${isCollapsed ? 'items-center' : 'w-[208px]'}`}>
          {bottomLinks.map((item, idx) => (
            <BottomLinkItem key={idx} item={item} isCollapsed={isCollapsed} />
          ))}
        </nav>

        <SidebarProfile
          isCollapsed={isCollapsed}
          name={displayName}
          subtitle={displaySubtitle}
          profileImageUrl={teamInfo?.profile_image_url}
          isActive={location.pathname === '/mypage'}
          onClick={() => navigate('/mypage')}
        />
      </div>
    </aside>
  );
}

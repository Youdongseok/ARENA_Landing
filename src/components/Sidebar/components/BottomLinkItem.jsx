// src/components/Sidebar/components/BottomLinkItem.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export default function BottomLinkItem({ item, isCollapsed }) {
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);
  const adminLogout = useAuthStore(state => state.adminLogout);
  const isAdminLoggedIn = useAuthStore(state => state.isAdminLoggedIn);

  const handleClick = async e => {
    if (item.label === '로그아웃') {
      e.preventDefault();

      if (isAdminLoggedIn) {
        await adminLogout();
        navigate('/admin/login');
        return;
      }

      await logout();
      navigate('/login');
      return;
    }
  };

  return (
    <Link
      to={item.path}
      onClick={handleClick}
      className={`flex items-center w-full ${item.heightClass} rounded-[8px] transition-colors cursor-pointer hover:bg-gray-100
        ${isCollapsed ? 'justify-center px-0 gap-0' : 'px-3 gap-3'}
      `}
      onMouseEnter={() => item.setHovered(true)}
      onMouseLeave={() => item.setHovered(false)}
    >
      <img
        src={item.icon}
        alt={item.label}
        className={`${item.iconSize} flex-shrink-0`}
        style={
          !item.isHovered && item.label !== '계정 로그인'
            ? { opacity: 0.5 }
            : item.label === '계정 로그인' && !item.isHovered
              ? { opacity: 0.8 }
              : {}
        }
      />

      {!isCollapsed && (
        <span className={item.isHovered ? item.hoverTextClass : item.textClass}>{item.label}</span>
      )}
    </Link>
  );
}

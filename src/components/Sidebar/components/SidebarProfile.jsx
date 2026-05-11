// src/components/Sidebar/components/SidebarProfile.jsx

import React from 'react';
import { ChevronRight } from 'lucide-react';
import Avatar from '@/components/Avatar/Avatar';

export default function SidebarProfile({
  isCollapsed,
  name,
  subtitle,
  profileImageUrl,
  onClick,
  isActive = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative transition-all duration-200 cursor-pointer ${
        isCollapsed
          ? `flex h-[56px] w-[56px] items-center justify-center rounded-[18px] ${
              isActive
                ? 'bg-[#FF4854]'
                : 'bg-transparent hover:bg-gray-100'
            }`
          : `flex w-full items-center gap-3 rounded-[8px] px-3 py-3 text-left ${
              isActive
                ? 'bg-[#FF4854]'
                : 'bg-transparent hover:bg-gray-100'
            }`
      }`}
    >
      <div className="relative flex-shrink-0">
        <Avatar
          src={profileImageUrl}
          name={name}
          size={isCollapsed ? 30 : 36}
          className="ring-2 ring-white"
          textClassName="font-semibold"
        />
        <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#86EFAC]" />
      </div>

      {!isCollapsed && (
        <div className="min-w-0 flex-1">
          <span
            className={`block truncate text-[16px] font-700 tracking-[-0.02em] ${
              isActive ? 'text-white/80' : 'text-[#201A1B]'
            }`}
          >
            {name || '로그인 필요'}
          </span>
          <span
            className={`mt-0.5 block truncate text-[11px] font-medium ${
              isActive ? 'text-white/70' : 'text-[#8A6E73]'
            }`}
          >
            {subtitle || '사용자'}
          </span>
        </div>
      )}

      {!isCollapsed && (
        <ChevronRight size={18} className={isActive ? 'text-white/80' : 'text-[#C8A8AE]'} />
      )}
    </button>
  );
}

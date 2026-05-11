import React from 'react';

export default function SidebarSectionTitle({ title, isCollapsed }) {
  // 💡 isCollapsed prop 추가

  // 💡 [핵심] isCollapsed일 때 컴포넌트 전체를 렌더링하지 않음
  if (isCollapsed) return null;

  return (
    <div className="px-3">
      <span className="body-medium font-500 text-[#0F172A]/50 uppercase">{title}</span>
    </div>
  );
}

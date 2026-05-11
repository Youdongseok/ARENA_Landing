import React from 'react';
import SidebarSectionTitle from './SidebarSectionTitle';
import NavLinkItem from './NavLinkItem';

export default function SidebarSection({
  title,
  items,
  activeItem,
  handleItemClick, // prop은 사용하지 않지만 전달을 위해 유지
  handleSubMenuClick, // prop은 사용하지 않지만 전달을 위해 유지
  isCollapsed, // 💡 isCollapsed prop 추가
}) {
  return (
    <nav className={`flex flex-col gap-2 ${isCollapsed ? 'w-full' : 'w-[208px]'}`}>
      {/* 💡 isCollapsed 상태 전달 */}
      <SidebarSectionTitle title={title} isCollapsed={isCollapsed} />
      {items.map((item, idx) => (
        <NavLinkItem
          key={idx}
          item={item}
          activeItem={activeItem}
          handleItemClick={handleItemClick}
          handleSubMenuClick={handleSubMenuClick}
          isCollapsed={isCollapsed} // 💡 상태 전달
        />
      ))}
    </nav>
  );
}

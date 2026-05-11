import React, { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSidebarStore } from '../../../stores/useSidebarStore';

// 아이콘 (경로 유지)
import DropdownIcon from '@/assets/icons/downbtn.svg';
import DropdownIconWhite from '@/assets/icons/white-downbtn.svg';

const primaryTextColor = 'text-[#0F172A]';

/**
 * 단일 네비게이션 링크 항목 컴포넌트 (Link 기반 + 필터링 기능)
 */
export default function NavLinkItem({ item, isCollapsed }) {
  const navigate = useNavigate();
  useLocation();
  const containerRef = useRef(null);

  const { activeItem, handleItemClick, handleSubMenuClick, closeAllDropdowns } = useSidebarStore(); // 1. 활성화 상태 계산

  const isLabelActive = activeItem === item.label;
  const isSubMenuActive = item.subMenu ? item.subMenu.some(sub => sub.label === activeItem) : false;
  const isActive = isLabelActive || isSubMenuActive; // 2. 시각적 활성화 상태 계산

  const isDropdownOpen = item.isDropdown && item.isOpen;
  const isVisualActive = isActive;
  const defaultTextColor = isVisualActive ? 'text-white/80' : primaryTextColor + '/50';
  const currentIcon = isVisualActive && item.activeIcon ? item.activeIcon : item.icon;
  const currentChevronIcon = isVisualActive ? DropdownIconWhite : DropdownIcon; // 3. 렌더링 컴포넌트 및 props 설정

  const isNavigational = !!item.path;
  const Component = isNavigational ? Link : 'div';
  const props = isNavigational
    ? {
        to: item.path,
        onClick: () => handleItemClick(item.label, item.isDropdown),
      }
    : {
        onClick: item.onClick || (() => handleItemClick(item.label, item.isDropdown)),
        role: 'button',
      };

  const isChallenge = item.label === '챌린지';
  const SubComponent = isChallenge ? 'a' : Link; // 하위 메뉴 클릭 핸들러

  useEffect(() => {
    if (!(isChallenge && isCollapsed && isDropdownOpen)) return undefined;

    const handleOutsideClick = event => {
      if (!containerRef.current?.contains(event.target)) {
        closeAllDropdowns();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [closeAllDropdowns, isChallenge, isCollapsed, isDropdownOpen]);

  const handleChallengeSubMenuClick = (subItem, parentLabel) => {
    const subLabel = subItem.label;
    handleSubMenuClick(subLabel, parentLabel);

    if (subItem.path) {
      navigate(subItem.path);
      return;
    }

    const categoryName = subLabel;
    navigate(`/category?category=${categoryName}`);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${isDropdownOpen && !isCollapsed ? 'flex flex-col gap-3' : ''}`}
    >
      {/* 메인 메뉴 링크 */}
      <Component
        {...props}
        className={`flex items-center w-full h-[44px] rounded-[8px] transition-colors cursor-pointer
    ${isActive ? 'bg-[#FF4854]' : 'hover:bg-gray-100'} 
        
        {/* 💡 [수정됨] isCollapsed 상태에 따라 padding과 gap을 명확히 분리하여, 
           * 펼쳐진 상태에서 px-3과 gap-3이 확실히 적용되도록 함 */}
        ${
          isCollapsed
            ? 'justify-center px-0 gap-0' // 접혔을 때: 중앙 정렬, 여백/간격 없음
            : 'px-3 gap-3' // 펼쳤을 때: 기존 여백/간격 적용
        }
   `}
      >
        <div
          className={`flex items-center w-full gap-3
            ${item.hasChevron && !isCollapsed ? 'justify-between' : ''} 
            ${isCollapsed ? 'justify-center' : ''} 
        `}
        >
          {/* 아이콘: 크기 고정을 위한 flex-shrink-0 유지 */}
          <img src={currentIcon} alt={item.label} className="w-[20px] h-[20px] flex-shrink-0" />
          {/* 텍스트: isCollapsed가 아닐 때만 표시 */}
          {!isCollapsed && (
            <span className={`body-large font-500 flex-grow ${defaultTextColor}`}>
              {item.label}
            </span>
          )}
          {/* Chevron: isCollapsed가 아닐 때만 표시 */}
          {item.hasChevron && !isCollapsed && (
            <img
              src={currentChevronIcon}
              alt="Dropdown Toggle"
              className={`w-[16px] h-[16px] transition-transform duration-200 
     ${isDropdownOpen ? 'rotate-180' : 'rotate-0'} 
    `}
            />
          )}
        </div>
      </Component>
      {/* 서브 메뉴 (isCollapsed가 아닐 때만 렌더링) */}
      {isDropdownOpen && !isCollapsed && (
        <div className="flex flex-col gap-[8px] w-full">
          {item.subMenu.map((sub, subIdx) => {
            const isSubActive = activeItem === sub.label;

            const onClickHandler = isChallenge
              ? () => handleChallengeSubMenuClick(sub, item.label)
              : () => handleSubMenuClick(sub.label, item.label);

            const subProps = isChallenge ? { role: 'button' } : { to: sub.path };

            return (
              <SubComponent
                key={subIdx}
                onClick={onClickHandler}
                {...subProps}
                className={`flex items-center ml-7 min-h-[56px] w-[180px] rounded-[8px] pl-[20px] pr-3 py-3 transition-colors cursor-pointer
      ${isSubActive ? 'bg-[#FF4854]' : 'hover:bg-gray-100'}
     `}
              >
                <span
                  className={`body-large font-500 leading-[1.35] whitespace-normal break-keep
      ${isSubActive ? 'text-white/80' : `${primaryTextColor}/50`}`}
                >
                  {sub.label}
                </span>
              </SubComponent>
            );
          })}
        </div>
      )}

      {isDropdownOpen && isCollapsed && (
        <div className="absolute left-[72px] top-0 z-[80] min-w-[270px] rounded-[16px] bg-white p-3 shadow-[0_20px_40px_rgba(15,23,42,0.16)]">
          <div className="mb-2 px-2 text-[11px] font-700 tracking-[0.18em] text-[#FF7B84] uppercase">
            {item.label}
          </div>
          <div className="flex flex-col gap-2">
            {item.subMenu.map((sub, subIdx) => {
              const isSubActive = activeItem === sub.label;

              const onClickHandler = isChallenge
                ? () => handleChallengeSubMenuClick(sub, item.label)
                : () => handleSubMenuClick(sub.label, item.label);

              const subProps = isChallenge ? { role: 'button' } : { to: sub.path };

              return (
                <SubComponent
                  key={subIdx}
                  onClick={onClickHandler}
                  {...subProps}
                  className={`flex min-h-[56px] items-center rounded-[8px] px-4 py-3 transition-colors cursor-pointer
                    ${isSubActive ? 'bg-[#FF4854]' : 'hover:bg-gray-100'}`}
                >
                  <span
                    className={`body-large font-500 leading-[1.35] whitespace-normal break-keep
                      ${isSubActive ? 'text-white/80' : `${primaryTextColor}/50`}`}
                  >
                    {sub.label}
                  </span>
                </SubComponent>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

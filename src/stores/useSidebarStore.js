// /src/stores/useSidebarStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 챌린지의 하위 메뉴 목록 (활성화 상태 결정에 사용)
const CHALLENGE_SUB_MENUS = [
  'ARENA 시즌 1',
  '2025 LLM SAFETY CHALLENGE 예선',
  '2025 LLM SAFETY CHALLENGE 본선',
];

// 경로, 쿼리 파라미터, 그리고 마지막 선택된 카테고리로부터 활성 레이블을 결정하는 헬퍼 함수
const getActiveLabelByPath = (pathname, search, lastSelectedCategory) => {
  const getQueryParam = (search, param) => {
    if (!search) return null;
    try {
      const params = new URLSearchParams(search);
      return params.get(param);
    } catch {
      return null;
    }
  };

  if (pathname.startsWith('/challenge/')) {
    return lastSelectedCategory || '챌린지';
  }

  if (pathname === '/category' && search) {
    const seasonLabel = getQueryParam(search, 'seasonLabel');
    if (seasonLabel && CHALLENGE_SUB_MENUS.includes(seasonLabel)) {
      return seasonLabel;
    }

    const category = getQueryParam(search, 'category');
    if (category && CHALLENGE_SUB_MENUS.includes(category)) {
      return category;
    }
  }

  if (pathname === '/category') {
    return lastSelectedCategory || '';
  }

  if (pathname === '/arena-season-1') {
    return 'ARENA 시즌 1';
  }

  const PATH_TO_LABEL_MAP = {
    '/dashboard': '대시보드',
    '/mypage': '마이페이지',
    '/leaderboard': '리더보드',
    '/tutorial': '튜토리얼',
  };
  if (PATH_TO_LABEL_MAP[pathname]) {
    return PATH_TO_LABEL_MAP[pathname];
  }

  return '대시보드';
};

// create 함수를 persist로 감싸서 로컬 스토리지에 상태를 영구 저장합니다.
export const useSidebarStore = create(
  persist(
    (set, get) => ({
      // --------------------
      // 1. 상태 (State)
      // --------------------
      lastSelectedChallengeCategory: null,
      isCollapsed: false,

      activeItem: '대시보드',
      isAIDropdownOpen: false,
      isSettingsDropdownOpen: false, // --------------------
      // 2. 액션 (Actions)
      // --------------------
      toggleCollapsed: () => set(state => ({ isCollapsed: !state.isCollapsed })),

      setActiveItemByPath: (pathname, search = '') => {
        // 💡 [추가] 현재 드롭다운 상태를 가져옵니다.
        const { lastSelectedChallengeCategory, isAIDropdownOpen: currentDropdownState } = get();
        const label = getActiveLabelByPath(pathname, search, lastSelectedChallengeCategory);
        const isChallengeSubMenu = CHALLENGE_SUB_MENUS.includes(label);
        const isChallengeMain = label === '챌린지';

        const isChallengeDetailPage = pathname.startsWith('/challenge/');

        if (isChallengeDetailPage) {
          set({
            activeItem: label,
            isCollapsed: true,
            isAIDropdownOpen: false,
            isSettingsDropdownOpen: false,
          });
          return;
        }

        if (isChallengeMain || isChallengeSubMenu) {
          // 챌린지 관련 경로에서는 활성 상태만 맞추고, 드롭다운 열림 여부는 현재 상태를 유지합니다.
          const shouldOpenAIDropdown = currentDropdownState;

          set({
            activeItem: label,
            isAIDropdownOpen: shouldOpenAIDropdown,
            isSettingsDropdownOpen: false,
          });
        } else if (label === '설정') {
          set({
            activeItem: label,
            isSettingsDropdownOpen: true,
            isAIDropdownOpen: false,
          });
        } else {
          set({
            activeItem: label,
            isAIDropdownOpen: false,
            isSettingsDropdownOpen: false,
          });
        }
      },

      handleItemClick: label => {
        // 💡 [핵심 수정] 드롭다운 메뉴가 아닐 때만 activeItem을 변경합니다.
        if (label !== '챌린지' && label !== '설정') {
          set({ activeItem: label });
        }
        if (label === '챌린지') {
          set(prev => ({
            isSettingsDropdownOpen: false,
            isAIDropdownOpen: !prev.isAIDropdownOpen, // 드롭다운 토글만 수행
            lastSelectedChallengeCategory: null,
          }));
        } else if (label === '설정') {
          set(prev => ({
            isAIDropdownOpen: false,
            isSettingsDropdownOpen: !prev.isSettingsDropdownOpen,
          }));
        } else {
          set({ isAIDropdownOpen: false, isSettingsDropdownOpen: false });
        }
      },

      handleSubMenuClick: (subLabel, parentLabel) => {
        set({ activeItem: subLabel });

        if (parentLabel === '챌린지') {
          set({
            isAIDropdownOpen: true,
            isSettingsDropdownOpen: false,
            lastSelectedChallengeCategory: subLabel,
          });
        } else if (parentLabel === '설정') {
          set({ isSettingsDropdownOpen: true, isAIDropdownOpen: false });
        }
      },

      closeAllDropdowns: () => {
        set({
          isAIDropdownOpen: false,
          isSettingsDropdownOpen: false,
        });
      },
    }),
    {
      name: 'sidebar-storage',
    }
  )
);

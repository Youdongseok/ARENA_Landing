// src/stores/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { logoutApi, adminLogoutApi } from '@/api/auth';

export const useAuthStore = create(
  persist(
    set => ({
      //---------------------------------------------------
      // ⭐ 일반 유저(팀)
      //---------------------------------------------------
      teamInfo: null,
      isLoggedIn: false,

      login: team =>
        set({
          teamInfo: {
            ...team,
            // ⭐ 서버가 teamname을 안 줄 경우 username을 teamname처럼 사용
            teamname: team.teamname || team.username || team.login_id,
          },
          isLoggedIn: true,
        }),

      updateTeamInfo: updates =>
        set(state => ({
          teamInfo: state.teamInfo
            ? {
                ...state.teamInfo,
                ...updates,
                teamname: updates.teamname || updates.username || state.teamInfo.teamname,
              }
            : state.teamInfo,
        })),

      logout: async () => {
        try {
          await logoutApi();
        } catch {
          // ignore logout API errors and clear client state
        }
        set({ teamInfo: null, isLoggedIn: false });
      },

      //---------------------------------------------------
      // ⭐ 관리자
      //---------------------------------------------------
      adminInfo: null,
      isAdminLoggedIn: false,

      adminLoginState: admin =>
        set({
          adminInfo: admin,
          isAdminLoggedIn: true,
        }),

      adminLogout: async () => {
        try {
          await adminLogoutApi();
        } catch {
          // ignore logout API errors and clear client state
        }
        set({ adminInfo: null, isAdminLoggedIn: false });
      },

      //---------------------------------------------------
      // ⭐ 공통 초기화
      //---------------------------------------------------
      setLoggedOut: () =>
        set({
          teamInfo: null,
          isLoggedIn: false,
          adminInfo: null,
          isAdminLoggedIn: false,
        }),
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);

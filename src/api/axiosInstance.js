// src/api/axiosInstance.js
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 120000,
});

let isRefreshing = false;
let pendingRequests = [];

api.interceptors.response.use(
  res => res,
  async error => {
    const status = error.response?.status;
    const originalRequest = error.config;
    const url = originalRequest?.url || '';

    // ✅ 401 아니면 패스
    if (status !== 401) return Promise.reject(error);

    // ✅ auth 자체 요청은 refresh 대상에서 제외 (무한루프 방지)
    const isAuthRequest =
      url.includes('/auth/login') ||
      url.includes('/auth/refresh') ||
      url.includes('/auth/me') || // 있으면 포함
      url.includes('/auth/admin-login') ||
      url.includes('/auth/admin-refresh') ||
      url.includes('/auth/admin-me');

    if (isAuthRequest) return Promise.reject(error);

    // ✅ 원요청 재시도 플래그 (중복 재시도 방지)
    if (originalRequest._retry) return Promise.reject(error);
    originalRequest._retry = true;

    const { setLoggedOut } = useAuthStore.getState();

    // ✅ refresh 진행 중이면 큐에 대기
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({ resolve, reject });
      }).then(() => api(originalRequest));
    }

    isRefreshing = true;

    try {
      const isAdminPath = window.location.pathname.startsWith('/admin');
      await api.post(isAdminPath ? '/auth/admin-refresh' : '/auth/refresh');
      pendingRequests.forEach(p => p.resolve());
      pendingRequests = [];
      return api(originalRequest);
    } catch (refreshError) {
      pendingRequests.forEach(p => p.reject(refreshError));
      pendingRequests = [];

      const isAdminPath = window.location.pathname.startsWith('/admin');

      setLoggedOut();

      // 어드민 경로면 어드민 로그인으로, 아니면 일반 로그인으로
      if (isAdminPath) {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login';
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;

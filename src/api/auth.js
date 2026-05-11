// src/api/auth.js
import api from './axiosInstance';

/** ---------------------------
 * 일반 로그인
 * --------------------------- */
export const login = async credentials => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};

export const signup = async payload => {
  const res = await api.post('/auth/signup', payload);
  return res.data;
};

export const requestSignupEmailVerification = async payload => {
  const res = await api.post('/auth/signup/request-email-verification', payload);
  return res.data;
};

export const getGoogleAuthStartUrl = mode => {
  const base = import.meta.env.VITE_API_BASE_URL || window.location.origin;
  return `${base}/auth/google/start?mode=${mode}`;
};

export const completeGoogleSignup = async payload => {
  const res = await api.post('/auth/google/complete', payload);
  return res.data;
};

export const logoutApi = () => api.post('/auth/logout').then(res => res.data);

/** 현재 로그인된 유저 확인 */
export const getMe = () => api.get('/auth/me').then(res => res.data);
export const updateMyTeamname = payload => api.patch('/auth/me/teamname', payload).then(res => res.data);
export const uploadMyProfileImage = file => {
  const formData = new FormData();
  formData.append('file', file);
  return api
    .post('/auth/me/profile-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(res => res.data);
};

export const deleteMyAccount = () => api.delete('/auth/me').then(res => res.data);

/** access_token 재발급 */
export const refreshToken = () => api.post('/auth/refresh').then(res => res.data);

/** ---------------------------
 * 관리자 인증
 * --------------------------- */
export const adminLogin = payload => api.post('/auth/admin-login', payload).then(res => res.data);

export const adminLogoutApi = () => api.post('/auth/admin-logout').then(res => res.data);

/** 현재 관리자 로그인 상태 조회 */
export const getAdminMe = () => api.get('/auth/admin-me').then(res => res.data);

/** 관리자 토큰 재발급 */
export const adminRefreshToken = () => api.post('/auth/admin-refresh').then(res => res.data);

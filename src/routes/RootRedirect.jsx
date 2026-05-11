// src/routes/RootRedirect.jsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export default function RootRedirect() {
  const { isLoggedIn } = useAuthStore();

  return isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
}

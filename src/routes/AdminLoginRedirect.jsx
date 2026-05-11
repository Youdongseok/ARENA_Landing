// src/routes/AdminLoginRedirect.jsx
import { Navigate } from 'react-router-dom';

export default function AdminLoginRedirect({ children }) {
  const hasAdminToken = document.cookie.includes('admin_token=');

  if (hasAdminToken) {
    return <Navigate to="/admin/leaderboard" replace />;
  }

  return children;
}

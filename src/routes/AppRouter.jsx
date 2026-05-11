import { Routes, Route, Navigate } from 'react-router-dom';

import LoginRedirect from './LoginRedirect';
import ProtectedRoute from './ProtectedRoute';
import AdminGuard from './AdminGuard';

// Layouts
import DefaultLayout from '../ui/DefaultLayout';
import ChallengeLayout from '../ui/ChallengeLayout';
import AdminLayout from '../ui/AdminLayout';

// Pages
import Login from '../pages/Login/Login';
import Signup from '../pages/Signup/Signup';
import GoogleAuthSuccess from '../pages/Auth/GoogleAuthSuccess';
import GoogleSignupComplete from '../pages/Auth/GoogleSignupComplete';
import EmailVerificationComplete from '../pages/Auth/EmailVerificationComplete';
import AdminLogin from '../pages/admin/AdminLogin';
import Dashboard from '../pages/Dashboard/Dashboard';
import MyPage from '../pages/MyPage/MyPage';
// import Leaderboard from '../pages/Leaderboard/Leaderboard';
import Tutorial from '../pages/Tutorial/Tutorial';
import Kategorie from '../pages/Kategorie/Kategorie';
import ArenaSeasonOne from '../pages/Season/ArenaSeasonOne';
import Challenge from '../pages/Challenge/ui/Challenge';
import ChatTestPage from '../pages/ChatTestPage';
import AdminLeaderboard from '../pages/admin/AdminLeaderboard';
import LeaderboardMatrix from '../pages/admin/LeaderboardMatrix';
import NotFound from '../pages/NotFound/NotFound';
import ProblemStatusMatrix from '../pages/admin/ProblemStatusMatrix';
import AdminProblemToggleList from '../pages/admin/AdminProblemToggleList';
import LandingPage from '../pages/LandingPage/LandingPage';

import Leaderboard from '../pages/Leaderboard/ArenaMockPage';
import AdminProblemPage from '../pages/admin/AdminProblemPage';
import AdminConversationMockPage from '../pages/admin/AdminConversationMockPage';
import FourZeroThree from '../pages/NotFound/FourZeroThree'; // ⭐ 403 추가
import AdminJudgePromptEditor from '../pages/admin/AdminJudgePromptEditor';
import AdminAccountManagementPage from '../pages/admin/AdminAccountManagementPage';

export default function AppRouter() {
  return (
    <Routes>
      {/* "/" → 항상 랜딩 페이지 */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<Navigate to="/admin/leaderboard" replace />} />

      {/* 로그인 페이지 */}
      <Route
        path="/login"
        element={
          <LoginRedirect>
            <Login />
          </LoginRedirect>
        }
      />

      <Route
        path="/signup"
        element={
          <LoginRedirect>
            <Signup />
          </LoginRedirect>
        }
      />

      <Route
        path="/auth/google/success"
        element={
          <LoginRedirect>
            <GoogleAuthSuccess />
          </LoginRedirect>
        }
      />

      <Route
        path="/signup/google/complete"
        element={
          <LoginRedirect>
            <GoogleSignupComplete />
          </LoginRedirect>
        }
      />

      <Route
        path="/signup/verified"
        element={
          <LoginRedirect>
            <EmailVerificationComplete />
          </LoginRedirect>
        }
      />

      {/* 테스트 페이지(보호 X) */}
      <Route path="/test" element={<ChatTestPage />} />

      {/* 관리자 로그인 */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ---------------------------
          🔥 Admin Layout (공통 UI)
         --------------------------- */}
      <Route
        path="/admin"
        element={
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        }
      >
        <Route path="leaderboard" element={<AdminLeaderboard />} />
        <Route path="matrix" element={<ProblemStatusMatrix />} />
        <Route path="problems" element={<AdminProblemPage />} />
        <Route path="accounts" element={<AdminAccountManagementPage />} />
        <Route path="users" element={<AdminConversationMockPage />} />
        <Route path="judge" element={<AdminJudgePromptEditor />} />
      </Route>

      {/* ---------------------------  
          🔥 DefaultLayout 보호 구역
         --------------------------- */}
      <Route
        element={
          <ProtectedRoute>
            <DefaultLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/arena-season-1" element={<ArenaSeasonOne />} />
        <Route path="/category" element={<Kategorie />} />
      </Route>

      {/* ---------------------------
          🔥 Challenge 보호 Layout
         --------------------------- */}
      <Route
        element={
          <ProtectedRoute>
            <ChallengeLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/challenge/:problemId" element={<Challenge />} />
      </Route>
      {/* ⭐ 추가된 403 페이지 */}
      <Route path="/403" element={<FourZeroThree />} />
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

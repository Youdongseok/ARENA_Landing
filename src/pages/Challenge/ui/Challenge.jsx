import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// React Query 훅
import { useProblemBundleQuery } from '@/hooks/useProblemBundleQuery';

// Zustand 스토어
import useModalStore from '@/stores/useModalStore';
import { useAuthStore } from '@/stores/authStore';
import { useSessionStore } from '@/stores/useSessionStore';

// 데이터
import { TABS } from '../data/challengeData';

// Assets
import ArenaIcon from '@/assets/icons/Arena.svg';
import SendIcon from '@/assets/icons/sendBtn.svg';
import ResetIcon from '@/assets/icons/reset.svg';
import PurpleDownIcon from '@/assets/icons/purple-downbtn.svg';

// Components
import ChallengeInfoPanel from '../components/ChallengeInfoPanel';
import ChatArea from '../components/ChatArea/ChatArea';
import AttemptHistoryPanel from '../components/AttemptHistoryPanel';
import LoadingModal from '../../../components/Loading/LoadingModal';
import DebugModal from '../ChallengeModal/DebugModal';
import ResetModal from '../ChallengeModal/ResetModal';
import SubmitModal from '../ChallengeModal/SubmitMoadl';
import FailedModal from '../ChallengeModal/FailedModal';
import SuccessModal from '../ChallengeModal/SuccesModal';

export default function Challenge() {
  const navigate = useNavigate(); // ⭐ 403 라우팅용
  const { problemId } = useParams();
  const currentProblemId = parseInt(problemId, 10) || undefined;

  const currentTeamId = useAuthStore(state => state.teamInfo?.id) || undefined;

  // ----------------------------------------------------------------------
  // Zustand Stores
  // ----------------------------------------------------------------------
  const {
    isDebugModalOpen,
    isResetModalOpen,
    isSubmitModalOpen,
    isLoadingModalOpen,
    isFailedModalOpen,
    isSuccessModalOpen,
    setResetChatAction,
    closeLoadingModal,
  } = useModalStore();
  useSessionStore();

  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [progress, setProgress] = useState(0); // 로딩 진행률

  // ----------------------------------------------------------------------
  // API Hooks
  // ----------------------------------------------------------------------
  const {
    data: problemBundleData,
    isLoading: isProblemBundleLoading,
    isError: isProblemError,
    error: problemError,
  } = useProblemBundleQuery(currentProblemId, currentTeamId);

  // ⭐ 403 Forbidden 감지 → /403 페이지로 이동
  // ⭐ 403 또는 404 감지 → 페이지 이동
  useEffect(() => {
    if (isProblemError) {
      const status = problemError?.response?.status;

      if (status === 403) {
        navigate('/403', { replace: true });
      }

      if (status === 404) {
        navigate('/404', { replace: true });
      }
    }
  }, [isProblemError, problemError, navigate]);

  // ⭐ API 상세 정보 준비
  const apiInfo = problemBundleData?.problem_api || {};

  // ----------------------------------------------------------------------
  // 문제 데이터 가공
  // ----------------------------------------------------------------------
  const { CHALLENGE_HEADER_INFO, activeTabContent, PROBLEM_API_URL, SESSIONS_LIST } =
    useMemo(() => {
      if (!problemBundleData) {
        return {
          CHALLENGE_HEADER_INFO: {
            title: '문제 로딩 중',
            subtitle: '정보를 불러오는 중입니다.',
            score: 0,
          },
          activeTabContent: null,
          PROBLEM_API_URL: null,
          SESSIONS_LIST: [],
        };
      }

      const problem = problemBundleData.problem;
      const sessions = problemBundleData.sessions || [];

      const headerInfo = {
        title: problem.title,
        subtitle: problem.sub_title,
        score: problem.score,
      };

      const tabContents = {
        description: { title: '챌린지 개요', content: problem.description },
        goal: { title: '도전 목표', content: problem.goal },
        success: { title: '성공 조건', content: problem.success_criteria },
        failure: { title: '실패 조건', content: problem.failure_criteria },
      };

      const design = TABS.find(tab => tab.id === activeTab);
      const tabContent = tabContents[activeTab];

      return {
        CHALLENGE_HEADER_INFO: headerInfo,
        activeTabContent: { ...design, ...tabContent },
        PROBLEM_API_URL: problemBundleData.problem_api?.url || null,
        SESSIONS_LIST: sessions,
      };
    }, [problemBundleData, activeTab]);

  // 전체 문제 중 성공 세션 존재 여부 (ChatArea에서 상태 표현용)
  const handleTabClick = (e, tabId) => {
    e.preventDefault();
    setActiveTab(tabId);
  };

  const handleResetChat = () => {};

  useEffect(() => {
    setResetChatAction(handleResetChat);
  }, [setResetChatAction]);

  const isPanelLoading = isProblemBundleLoading;
  const isInputDisabled = isProblemBundleLoading;

  // ----------------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------------
  return (
    <div className="flex w-full h-full gap-4 md:gap-6">
      {/* 왼쪽: 문제 정보 패널 */}
      <ChallengeInfoPanel
        TABS={TABS}
        activeTab={activeTab}
        activeTabContent={activeTabContent}
        handleTabClick={handleTabClick}
        CHALLENGE_HEADER_INFO={CHALLENGE_HEADER_INFO}
        isLoading={isPanelLoading}
        problemCode={problemBundleData?.problem?.problem_code}
        problemApiUrl={apiInfo?.url}
        problemApiMethod={apiInfo?.method}
        problemApiHeaderName={apiInfo?.header_name}
        problemApiKey={apiInfo?.api_key}
      />

      {/* 중앙: 챗 */}
      <ChatArea
        ArenaIcon={ArenaIcon}
        SendIcon={SendIcon}
        ResetIcon={ResetIcon}
        inputDisabled={isInputDisabled}
        problemId={currentProblemId}
        teamId={currentTeamId}
      />

      {/* 오른쪽: 히스토리 */}
      <AttemptHistoryPanel
        PurpleDownIcon={PurpleDownIcon}
        isLoading={isPanelLoading}
        sessions={SESSIONS_LIST}
        problemId={currentProblemId}
        teamId={currentTeamId}
      />

      {/* 모달 */}
      {isDebugModalOpen && <DebugModal />}
      {isResetModalOpen && <ResetModal />}
      {isSubmitModalOpen && <SubmitModal setProgress={setProgress} />}
      {isLoadingModalOpen && (
        <LoadingModal isOpen={isLoadingModalOpen} progress={progress} onClose={closeLoadingModal} />
      )}
      {isFailedModalOpen && <FailedModal />}
      {isSuccessModalOpen && <SuccessModal />}
    </div>
  );
}

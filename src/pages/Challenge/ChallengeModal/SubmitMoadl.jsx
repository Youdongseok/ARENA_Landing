// src/features/challenge/ChallengeModals/SubmitModal.jsx
import React, { useCallback, useState } from 'react';
import useModalStore from '@/stores/useModalStore';
import { useSessionStore } from '@/stores/useSessionStore';
import api from '@/api/axiosInstance';
import { successPanelsData, failedPanelsData } from '../data/challengeModalData';
import CancelSvg from '@/assets/icons/cancel.svg';
import ArenaSvg from '@/assets/icons/Arena.svg';
import toast from 'react-hot-toast'; // ✅ 토스트 추가

const CancelIcon = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute top-[30px] right-[30px] w-[18px] h-[18px] cursor-pointer z-[5000]"
  >
    <img src={CancelSvg} alt="닫기" className="w-full h-full" />
  </div>
);

const SubmitModal = ({ setProgress }) => {
  const [cooldown, setCooldown] = useState(0);
  const isSubmitModalOpen = useModalStore(state => state.isSubmitModalOpen);
  const {
    closeSubmitModal,
    openLoadingModal,
    closeLoadingModal,
    openSuccessModal,
    openFailedModal,
    setChallengeResults,
  } = useModalStore();
  const { sessionId } = useSessionStore();

  // ✅ 제출 로직
  const submitForJudgement = useCallback(async () => {
    if (!sessionId) {
      toast.error('❌ 제출할 세션 정보가 없습니다.');
      return closeSubmitModal();
    }

    if (cooldown > 0) {
      toast(`⏳ ${cooldown}초 후에 다시 시도해주세요.`, {
        icon: '⏳',
        style: { background: '#333', color: '#fff' },
      });
      return;
    }

    try {
      closeSubmitModal();
      openLoadingModal();
      setProgress(0);

      let fake = 0;
      const interval = setInterval(() => {
        fake += 0.02;
        setProgress(Math.min(fake, 0.95));
      }, 100);

      const endpoint = `/judge/sessions/${sessionId}/submit`;
      const res = await api.post(endpoint, {});

      clearInterval(interval);
      setProgress(1);

      const resultData = res.data;
      closeLoadingModal();
      // console.group('%c🔍 JUDGE 결과 전체 확인', 'color:#FF4848; font-size:14px;');
      // console.log('📦 resultData:', resultData);
      // console.log('📊 개별 모델 결과:', resultData.results);
      // resultData.results?.forEach((r, i) => {
      //   console.log(`%c[${i + 1}번 모델 결과]`, 'color:#00A8FF; font-weight:bold; font-size:12px;');
      //   console.log('모델명(model):', r.model);
      //   console.log('판정(verdict):', r.verdict);
      //   console.log('출력(output):', r.output);
      // });
      // console.groupEnd();

      const results = (resultData.results || []).map((vote, index) => {
        const rawVerdict = (vote.verdict || '').toUpperCase();

        // verdict 정규화
        let normalizedVerdict = 'failed';
        if (rawVerdict === 'PASSED') normalizedVerdict = 'success';
        else if (rawVerdict === 'REVIEW') normalizedVerdict = 'review';

        const isSuccess = normalizedVerdict === 'success';

        const baseData = isSuccess
          ? successPanelsData[index % successPanelsData.length]
          : failedPanelsData[index % failedPanelsData.length];

        return {
          status: normalizedVerdict, // ★ success / failed / review 로 통일
          data: {
            ...baseData,
            title: baseData.animalName,
            modelName: vote.model,
            description: vote.output || baseData.description,
          },
        };
      });

      setChallengeResults(results);

      if (resultData.status === 'success') openSuccessModal();
      else openFailedModal();
    } catch (err) {
      console.error('❌ 제출 실패', err);
      setProgress(0);
      closeLoadingModal();

      // ✅ 429 (Too Many Requests) 처리
      if (err.response?.status === 429) {
        const retryAfter = err.response?.data?.detail?.retry_after_sec || 15;
        const message = err.response?.data?.detail?.message;

        toast.error(`${message}\n(${retryAfter}초 후 재시도 가능)`, {
          icon: '🚫',
          duration: 7000,
          style: {
            background: '#222',
            color: '#fff',
            whiteSpace: 'pre-line', // ✅ 줄바꿈 적용
          },
        });

        setCooldown(retryAfter);
        const countdown = setInterval(() => {
          setCooldown(prev => {
            if (prev <= 1) {
              clearInterval(countdown);
              toast.success('✅ 다시 제출할 수 있습니다!');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return;
      }

      openFailedModal();
      toast.error(`❌ 제출 실패: ${err.message}`);
    }
  }, [
    sessionId,
    cooldown,
    closeSubmitModal,
    openLoadingModal,
    closeLoadingModal,
    openSuccessModal,
    openFailedModal,
    setChallengeResults,
    setProgress,
  ]);

  if (!isSubmitModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(1,1,1,0.6)] flex justify-center items-center z-[9999]">
      <div className="relative w-[403.65px] h-[586.46px] bg-white rounded-[16px] box-border">
        <CancelIcon onClick={closeSubmitModal} />

        {/* 로고 */}
        <div className="absolute left-[30px] top-[17px] w-[105px] h-[42px] flex items-center">
          <div className="w-[29px] h-[42px] flex justify-center items-center">
            <img src={ArenaSvg} alt="ARENA 로고" className="w-full h-full" />
          </div>
          <span className="ml-[9px] heading-3 font-700 text-[#FF084A]">ARENA</span>
        </div>

        {/* 중앙 아이콘 */}
        <div className="absolute top-[105px] left-1/2 -translate-x-1/2 w-[148px] h-[218px] flex justify-center items-center">
          <img src={ArenaSvg} alt="제출 아이콘" className="w-full h-full opacity-30" />
        </div>

        {/* 안내문 */}
        <div className="absolute w-[340px] left-[31px] top-[340px] text-center body-large font-500 text-black m-0 whitespace-pre-wrap">
          <p>제출하면 세 개의 JUDGE AI 모델의 판단 결과를 제공합니다.</p>
          <p>대화 내용은 저장되어 챌린지 화면 우측에서 확인하실 수 있습니다.</p>
          <p>제출 요청 시 해당 계정이 다음 제출까지 약 30초의 대기시간이 부여됩니다.</p>
        </div>

        {/* 제출 버튼 */}
        <button
          type="button"
          onClick={submitForJudgement}
          className={`absolute w-[343.2px] h-[60.45px] left-[30.22px] top-[496.28px]
            flex justify-center items-center 
            rounded-[29.25px] cursor-pointer transition duration-200
            ${cooldown > 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#FF6289] hover:bg-pink-600'}`}
          disabled={!sessionId || cooldown > 0}
        >
          <span className="heading-3 font-700 text-white">
            {cooldown > 0 ? `재시도 ${cooldown}s` : '제출하기'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default SubmitModal;

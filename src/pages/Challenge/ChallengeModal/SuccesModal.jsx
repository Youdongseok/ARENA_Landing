// src/features/challenge/ChallengeModals/SuccessModal.jsx

import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import useModalStore from '@/stores/useModalStore';
import { useSessionStore } from '@/stores/useSessionStore';
import ArenaGreen from '@/assets/icons/arenagreen.svg';
import confetti from 'canvas-confetti';

const SUCCESS_COLOR_PRIMARY = '#04B07B';

export default function SuccessModal({
  isOpen: controlledIsOpen,
  onClose,
  previewMode = false,
  previewTitle,
  embeddedPreview = false,
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearSession = useSessionStore(state => state.clearSession);
  const storeIsSuccessModalOpen = useModalStore(state => state.isSuccessModalOpen);
  const { closeSuccessModal, resetChatAction } = useModalStore();
  const isSuccessModalOpen = previewMode ? controlledIsOpen : storeIsSuccessModalOpen;
  const handleClose = previewMode ? onClose : closeSuccessModal;

  // 🎉 모달 열릴 때 confetti 실행 (모달 위 canvas 생성)
  useEffect(() => {
    if (!isSuccessModalOpen || (previewMode && embeddedPreview)) return;

    // 1) 모달 위에서 confetti 터지게 canvas 생성
    const canvas = document.createElement('canvas');
    canvas.id = 'success-confetti-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = 2000; // ★ 모달보다 위에서 confetti 터짐

    document.body.appendChild(canvas);

    // 2) confetti 인스턴스 생성
    const myConfetti = confetti.create(canvas, { resize: true });

    // 3) 짧고 화려하게 터지는 애니메이션
    const duration = 5000;
    const end = Date.now() + duration;

    (function frame() {
      myConfetti({
        particleCount: 10,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: ['#04B07B', '#ffffff', '#00D4A6'],
      });

      myConfetti({
        particleCount: 10,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: ['#04B07B', '#ffffff', '#00D4A6'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // 4) confetti 끝나면 canvas 자동 삭제
    setTimeout(() => {
      canvas.remove();
    }, duration + 300);

    return () => {
      canvas.remove();
    };
  }, [isSuccessModalOpen]);

  useEffect(() => {
    if (!isSuccessModalOpen || !handleClose) return;

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSuccessModalOpen, handleClose]);

  const handleRestart = useCallback(() => {
    if (previewMode) {
      onClose?.();
      return;
    }
    closeSuccessModal();
    resetChatAction();
    clearSession();
    queryClient.invalidateQueries(['problemBundle']);
  }, [previewMode, onClose, closeSuccessModal, resetChatAction, clearSession, queryClient]);

  const handleContinue = useCallback(() => {
    if (previewMode) {
      onClose?.();
      return;
    }
    closeSuccessModal();
    clearSession();
    queryClient.invalidateQueries(['problemBundle']);
    navigate('/category');
  }, [previewMode, onClose, closeSuccessModal, clearSession, queryClient, navigate]);

  if (!isSuccessModalOpen) return null;

  return (
    <div
      className={
        previewMode && embeddedPreview
          ? 'relative flex h-full w-full items-center justify-center overflow-hidden bg-transparent'
          : 'fixed inset-0 z-[1000] flex items-center justify-center bg-black/60'
      }
      onClick={previewMode && !embeddedPreview ? handleClose : undefined}
    >
      <div
        className={
          previewMode && embeddedPreview
            ? 'relative w-[1040px] overflow-hidden rounded-[22px] bg-transparent shadow-none'
            : previewMode
            ? 'relative w-[1040px] overflow-hidden rounded-[22px] border border-white/12 bg-black/35 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur'
            : 'w-[990px] bg-[#FAFAFA] rounded-[30px] flex flex-col items-center shadow-lg py-10'
        }
        onClick={event => event.stopPropagation()}
      >
        {previewMode && !embeddedPreview ? (
          <button
            type="button"
            aria-label="닫기"
            onClick={handleClose}
            className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-black/45 text-white/80 transition hover:bg-black/65 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}
        <div
          className={
            previewMode && embeddedPreview
              ? 'mx-auto flex w-[860px] flex-col items-center rounded-[24px] bg-[#FAFAFA] py-10 shadow-lg'
              : previewMode
              ? 'mx-auto my-[45px] flex w-[950px] flex-col items-center rounded-[24px] bg-[#FAFAFA] py-10 shadow-lg'
              : 'flex w-full flex-col items-center'
          }
        >
          <div
            className={`w-full bg-white rounded-[20px] flex flex-col items-center justify-center shadow-lg border-2 px-8 py-7 gap-3 ${
              previewMode && embeddedPreview ? 'max-w-[760px]' : 'max-w-[840px]'
            }`}
            style={{ borderColor: SUCCESS_COLOR_PRIMARY }}
          >
            <h2 className="heading-1 font-700" style={{ color: SUCCESS_COLOR_PRIMARY }}>
              챌린지 성공!
            </h2>

            <img src={ArenaGreen} alt="성공 아이콘" className="w-[210px] h-[210px]" />

            <p className="text-[17px] font-500 text-[#444] text-center leading-relaxed">
              3개의 Judge AI 중 2개 이상이 성공으로 판단했습니다.
              <br />
              다음 문제에도 도전해보세요!
            </p>
          </div>

          <div className={`mt-10 flex w-full justify-between ${previewMode && embeddedPreview ? 'max-w-[760px]' : 'max-w-[840px]'}`}>
            <button
              type="button"
              onClick={handleRestart}
              className="flex h-[56px] w-[48%] items-center justify-center rounded-[18px] bg-[#D9DADB] transition-colors hover:bg-[#BFC0C4]"
            >
              <span className="heading-2 font-500 text-[#515151]">
                {previewMode ? '닫기' : '챌린지 화면으로 돌아가기'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleContinue}
              className="w-[48%] h-[56px] rounded-[18px] flex items-center justify-center 
                         text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: SUCCESS_COLOR_PRIMARY }}
            >
              <span className="heading-2 font-500">
                {previewMode ? '계속 둘러보기' : '다른 문제 풀기'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

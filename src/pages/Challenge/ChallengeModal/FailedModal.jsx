import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import useModalStore from '@/stores/useModalStore';
import { useSessionStore } from '@/stores/useSessionStore';
import { SuccessSummaryPanel, FailedSummaryPanel } from './SummaryPanels';

export default function FailedModal({
  isOpen: controlledIsOpen,
  onClose,
  previewMode = false,
  previewResults,
  previewTitle,
  embeddedPreview = false,
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const storeIsFailedModalOpen = useModalStore(state => state.isFailedModalOpen);
  const storeChallengeResults = useModalStore(state => state.challengeResults);
  const { closeFailedModal, resetChatAction } = useModalStore();
  const clearSession = useSessionStore(state => state.clearSession);
  const isFailedModalOpen = previewMode ? controlledIsOpen : storeIsFailedModalOpen;
  const challengeResults = previewMode ? previewResults || [] : storeChallengeResults;
  const handleClose = previewMode ? onClose : closeFailedModal;

  useEffect(() => {
    if (!isFailedModalOpen || !handleClose) return;

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFailedModalOpen, handleClose]);

  // 💡 문제 다시 풀기
  const handleRestart = useCallback(() => {
    if (previewMode) {
      onClose?.();
      return;
    }
    closeFailedModal();
    resetChatAction();
    clearSession();
    queryClient.invalidateQueries(['problemBundle']);
  }, [previewMode, onClose, closeFailedModal, resetChatAction, clearSession, queryClient]);

  // 💡 다른 문제 풀기
  const handleContinue = useCallback(() => {
    if (previewMode) {
      onClose?.();
      return;
    }
    closeFailedModal();
    clearSession();
    queryClient.invalidateQueries(['problemBundle']);
    navigate('/category');
  }, [previewMode, onClose, closeFailedModal, clearSession, queryClient, navigate]);

  if (!isFailedModalOpen) return null;

  const sortedPanels = [
    ...challengeResults.filter(result => result.status !== 'success'),
    ...challengeResults.filter(result => result.status === 'success'),
  ];

  return (
    <div
      className={
        previewMode && embeddedPreview
          ? 'relative flex h-full w-full items-center justify-center overflow-hidden bg-transparent'
          : 'fixed inset-0 z-[1000] flex items-center justify-center bg-[rgba(1,1,1,0.6)]'
      }
      onClick={previewMode && !embeddedPreview ? handleClose : undefined}
    >
      <motion.div
        className={
          previewMode && embeddedPreview
            ? 'relative w-[1040px] overflow-hidden rounded-[22px] bg-transparent shadow-none'
            : previewMode
            ? 'relative w-[1040px] overflow-hidden rounded-[22px] border border-white/12 bg-black/35 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur'
            : 'w-[990px] h-[680px] bg-[#FAFAFA] rounded-[30px] flex flex-col items-center shadow-lg'
        }
        initial={{ opacity: 0, scale: 0.97, boxShadow: '0 18px 60px rgba(0,0,0,0.55)' }}
        animate={{
          opacity: 1,
          scale: 1,
          boxShadow: [
            '0 18px 60px rgba(0,0,0,0.55)',
            '0 0 0 1px rgba(255,95,122,0.22), 0 22px 80px rgba(255,77,109,0.24)',
            '0 0 0 1px rgba(255,95,122,0.18), 0 18px 72px rgba(255,77,109,0.18)',
            '0 18px 60px rgba(0,0,0,0.55)',
          ],
        }}
        transition={{
          opacity: { duration: 0.18, ease: 'easeOut' },
          scale: { duration: 0.22, ease: 'easeOut' },
          boxShadow: { duration: 1.35, times: [0, 0.22, 0.62, 1], ease: 'easeOut' },
        }}
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
        {!previewMode ? <div className="h-[30px]" /> : null}

        <div
          className={
            previewMode && embeddedPreview
              ? 'mx-auto flex h-[620px] w-[920px] flex-col items-center overflow-hidden rounded-[24px] bg-[#FAFAFA] px-7 pt-7 pb-6 shadow-lg'
              : previewMode
              ? 'mx-auto my-[45px] flex h-[600px] w-[950px] flex-col items-center overflow-hidden rounded-[24px] bg-[#FAFAFA] shadow-lg'
              : 'flex h-full w-full flex-col items-center'
          }
        >
          <div
            className={
              previewMode && embeddedPreview
                ? 'flex w-full max-w-[760px] flex-1 flex-col items-center gap-3'
                : previewMode
                ? 'flex w-[840px] flex-1 flex-col gap-3 overflow-y-auto px-1 pt-6'
                : 'flex w-[877px] flex-col gap-4'
            }
          >
            {sortedPanels.map((result, index) => {
              const data = result.data;
              const verdict = (result.status || '').toUpperCase();

              const Component =
                verdict === 'SUCCESS' || verdict === 'PASSED'
                  ? SuccessSummaryPanel
                  : FailedSummaryPanel;

              return (
                <Component
                  key={index}
                  imageSrc={data.imageSrc}
                  animalName={data.animalName}
                  description={data.description}
                  imageStyle={data.imageStyle}
                  isFirstPanel={data.isFirstPanel}
                  title={data.title}
                  verdict={verdict}
                  previewMode={previewMode}
                />
              );
            })}
          </div>

          <div
            className={
              previewMode && embeddedPreview
                ? 'mt-6 mb-6 flex w-full max-w-[760px] justify-between'
                : 'mt-6 mb-6 flex w-[840px] justify-between'
            }
          >
            <button
              type="button"
              onClick={handleRestart}
              className={previewMode && embeddedPreview ? 'h-[56px] w-[385px] rounded-[18px] bg-[#D9DADB] hover:bg-[#BFC0C4]' : 'h-[56px] w-[390px] rounded-[18px] bg-[#D9DADB] hover:bg-[#BFC0C4]'}
            >
              <span className="heading-2 font-500 text-[#515151]">
                {previewMode ? '닫기' : '문제 다시 풀기'}
              </span>
            </button>
            <button
              type="button"
              onClick={handleContinue}
              className={previewMode && embeddedPreview ? 'h-[56px] w-[385px] rounded-[18px] bg-[#FF6289] hover:bg-[#e6597c]' : 'h-[56px] w-[390px] rounded-[18px] bg-[#FF6289] hover:bg-[#e6597c]'}
            >
              <span className="heading-2 font-500 text-white">
                {previewMode ? '계속 둘러보기' : '다른 문제 풀기'}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

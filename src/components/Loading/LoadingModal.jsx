import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import ArenaJudgeLoader from './ArenaJudgeLoader';

export default function LoadingModal({ isOpen, onClose, previewMode = false, previewTitle }) {
  useEffect(() => {
    if (!isOpen || !onClose) return;

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(244,240,233,0.78)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          onClick={previewMode ? onClose : undefined}
        >
          <motion.div
            className={
              previewMode
                ? 'relative w-[1040px] overflow-hidden rounded-[22px] border border-[#e7e1d9] bg-[rgba(255,255,255,0.76)] shadow-[0_18px_60px_rgba(34,24,18,0.14)] backdrop-blur'
                : 'relative'
            }
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            onClick={event => event.stopPropagation()}
          >
            {previewMode ? (
              <button
                type="button"
                aria-label="닫기"
                onClick={onClose}
                className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e7e1d9] bg-[#faf8f4] text-[#57534e] transition hover:bg-white hover:text-[#171717]"
              >
                <X className="h-5 w-5" />
              </button>
            ) : null}
            {previewMode && previewTitle ? (
              <div className="flex items-center justify-between border-b border-[#ece6df] bg-[rgba(250,248,244,0.84)] px-4 py-2.5">
                <div className="flex gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#ffb9bf]" />
                  <span className="h-2 w-2 rounded-full bg-[#e7e1d9]" />
                  <span className="h-2 w-2 rounded-full bg-[#ddd6cf]" />
                </div>
                <h2 className="text-xs text-[#78716c]">{previewTitle}</h2>
              </div>
            ) : null}

            <ArenaJudgeLoader className={previewMode ? 'mx-auto my-[45px]' : ''} />

            {previewMode && previewTitle ? (
              <div className="border-t border-[#ece6df] bg-[rgba(250,248,244,0.84)] px-4 py-2 text-xs text-[#78716c]">
                Judge model preview
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';

import applicationAi01 from '@/assets/application/ai01.png';
import applicationAi02 from '@/assets/application/ai02.png';
import applicationAi03 from '@/assets/application/ai03.png';
import applicationAi04 from '@/assets/application/ai04.png';
import applicationAi05 from '@/assets/application/ai05.png';
import challenge2025Ci01 from '@/assets/2025 LLM CHALLENGE/ci01.jpeg';
import challenge2025Ci02 from '@/assets/2025 LLM CHALLENGE/ci02.jpeg';
import challenge2025Ci03 from '@/assets/2025 LLM CHALLENGE/ci03.jpeg';
import challenge2025Ci04 from '@/assets/2025 LLM CHALLENGE/ci04.jpeg';
import challenge2025Ci05 from '@/assets/2025 LLM CHALLENGE/ci05.jpeg';
import challenge2025Ci06 from '@/assets/2025 LLM CHALLENGE/ci06.jpeg';
import challenge2025Ci07 from '@/assets/2025 LLM CHALLENGE/ci07.jpeg';
import challenge2025Ci08 from '@/assets/2025 LLM CHALLENGE/ci08.jpeg';
import arenaComingSoon from '@/assets/2026 LLM CHALLENGE/comingsoon.png';

import { Container, GradientCard, SectionTitle, SECTION_TITLE_REVEAL } from './LandingPage.primitives';

export default function TestimonialsSection() {
  const archiveItems = [
    {
      key: 'hub',
      title: '대회 참가 안내 보기',
      description: (
        <>
          LLM Safety Challenge에 참여해보세요.
          <br />
          참여 신청, 일정, 공지를 한곳에서 확인할 수 있습니다.
        </>
      ),
      image: applicationAi01,
      photos: [applicationAi01, applicationAi02, applicationAi03, applicationAi04, applicationAi05],
      ctaLabel: '참가 안내 열기',
    },
    {
      key: '2025',
      title: '2025 대회 기록 보기',
      description: (
        <>
          2025년에 진행된 대회의 현장과 운영 흐름을 살펴보세요.
          <br />
          대회에 함께해주신 모든 참가자분들께 감사드립니다.
        </>
      ),
      image: challenge2025Ci03,
      photos: [
        challenge2025Ci01,
        challenge2025Ci02,
        challenge2025Ci03,
        challenge2025Ci04,
        challenge2025Ci05,
        challenge2025Ci06,
        challenge2025Ci07,
        challenge2025Ci08,
      ],
      ctaLabel: '지난 대회 보기',
    },
    {
      key: '2026',
      title: '2026 대회 준비 중',
      description: '앞으로 열릴 2026 대회에도 많은 관심과 기대 부탁드립니다.',
      image: arenaComingSoon,
      photos: [arenaComingSoon],
      ctaLabel: '신청 링크 준비중',
    },
  ];

  const [selectedArchiveItem, setSelectedArchiveItem] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (!previewImage && !selectedArchiveItem) return undefined;

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        if (previewImage) {
          setPreviewImage(null);
          return;
        }

        setSelectedArchiveItem(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewImage, selectedArchiveItem]);

  return (
    <section id="history" className="relative py-16 sm:py-20">
      <Container>
        <div className="flex flex-col gap-10">
          <motion.div {...SECTION_TITLE_REVEAL}>
            <SectionTitle
              eyebrow="History"
              title="ARENA 대회에 참여해보세요"
              desc={
                <>
                  ARENA는 주기적인 대회를 통해 참가자들과 함께 AI 안전성의 미래를 만들어 갑니다.
                  <br />
                  지난 대회 기록과 참가 안내, 그리고 앞으로 열릴 챌린지까지 한눈에 확인해보세요.
                </>
              }
            />
          </motion.div>

          <motion.div
            className="mx-auto grid w-full max-w-[1380px] gap-5 md:grid-cols-2 xl:grid-cols-3"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.22 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {archiveItems.map(item => (
              <div key={item.key}>
                <GradientCard
                  className="h-full rounded-[28px] border-[#ece7e1] p-4 shadow-[0_18px_40px_rgba(34,24,18,0.06)] sm:p-5"
                  hoverGlow={false}
                >
                  <div className="flex h-full flex-col">
                    <div className="relative min-h-[20rem] overflow-hidden rounded-[22px] bg-[#050608]">
                      <button
                        type="button"
                        onClick={() => setSelectedArchiveItem(item)}
                        className="group absolute inset-0 cursor-pointer overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4854] focus-visible:ring-offset-2"
                        aria-label={`${item.title} 갤러리 열기`}
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                        />

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/10" />
                      </button>
                    </div>

                    <div className="pb-2 pt-5">
                      <div className="text-[1.65rem] font-semibold tracking-tight text-[#171717] sm:text-[1.85rem]">
                        {item.title}
                      </div>
                    </div>

                    <div className="mt-auto pt-4">
                      <button
                        type="button"
                        onClick={() => setSelectedArchiveItem(item)}
                        className="group inline-flex w-full cursor-pointer items-center justify-center rounded-[999px] bg-[#050608] px-5 py-4 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(5,6,8,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#FF4854] focus:outline-none focus-visible:-translate-y-0.5 focus-visible:bg-[#FF4854] focus-visible:ring-2 focus-visible:ring-[#FF4854] focus-visible:ring-offset-2"
                      >
                        {item.ctaLabel}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </GradientCard>
              </div>
            ))}
          </motion.div>
        </div>
      </Container>

      {selectedArchiveItem ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
          onClick={() => setSelectedArchiveItem(null)}
        >
          <div
            className="no-scrollbar relative max-h-[90vh] w-full max-w-[1380px] overflow-y-auto rounded-3xl border border-[#e7e1d9] bg-[rgba(255,255,255,0.94)] p-5 sm:p-6"
            onClick={event => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedArchiveItem(null)}
              className="absolute right-5 top-5 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-[#050608] text-white shadow-[0_10px_24px_rgba(5,6,8,0.22)] transition hover:bg-[#FF4854]"
              aria-label="갤러리 닫기"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-5">
              <div className="text-2xl font-semibold tracking-tight text-[#171717]">
                {selectedArchiveItem.title}
              </div>
              <p className="mt-2 text-sm leading-7 text-[#57534e] sm:text-base">
                {selectedArchiveItem.description}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {selectedArchiveItem.photos.map((photo, index) => (
                <button
                  key={`${selectedArchiveItem.key}-gallery-${index}`}
                  type="button"
                  onClick={() => setPreviewImage(photo)}
                  className="cursor-pointer overflow-hidden rounded-2xl border border-[#e7e1d9] bg-[#faf8f4] text-left transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <img
                    src={photo}
                    alt={`${selectedArchiveItem.title} 이미지 ${index + 1}`}
                    className="aspect-[4/3] h-full w-full object-cover transition hover:opacity-95"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {previewImage ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-6 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative flex h-[94vh] w-[96vw] items-center justify-center overflow-hidden rounded-3xl border border-[#e7e1d9] bg-[rgba(255,255,255,0.94)] p-3 sm:p-4"
            onClick={event => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-[#050608] text-white shadow-[0_10px_24px_rgba(5,6,8,0.22)] transition hover:bg-[#FF4854]"
              aria-label="이미지 닫기"
            >
              <X className="h-5 w-5" />
            </button>

            <img
              src={previewImage}
              alt="확대 이미지"
              className="max-h-full w-auto max-w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import NeuroHeroBackground from './NeuroHeroBackground';

import {
  cn,
  Container,
  SectionTitle,
  SECTION_COPY_REVEAL,
  SECTION_TITLE_REVEAL,
} from './LandingPage.primitives';

export default function ShowcaseSection() {
  const timelineItems = useMemo(
    () => [
      {
        title: '2025. 10. 30',
        label: 'ARENA 베타',
        desc: '아레나 베타 오픈 및 대회 사전 안내 공개',
        startDate: '2025-10-30',
        endDate: '2025-10-30',
        side: 'right',
      },
      {
        title: '2025. 11. 6. ~ 10.',
        label: '대회 접수',
        desc: 'ARENA 대회 참가 접수 기간',
        startDate: '2025-11-06',
        endDate: '2025-11-10',
        side: 'left',
      },
      {
        title: '2025. 11. 21',
        label: '예선',
        desc: '예선 진행 및 통과자 선발',
        startDate: '2025-11-21',
        endDate: '2025-11-21',
        side: 'left',
      },
      {
        title: '2025. 12. 3',
        label: '본 대회',
        desc: '본선 진행 및 최종 결과 집계',
        startDate: '2025-12-03',
        endDate: '2025-12-03',
        side: 'left',
      },
      {
        title: '2026. 3. 4',
        label: 'Agent Arena 베타',
        desc: 'Agent Arena 베타 운영 및 테스트 진행',
        startDate: '2026-03-01',
        endDate: '2026-03-30',
        side: 'right',
      },
      {
        title: '2026. 3. 31',
        label: '아레나 시즌 1',
        desc: '아레나 시즌 1 시작',
        startDate: '2026-03-31',
        endDate: '2026-03-31',
        side: 'right',
      },
      {
        title: '2026. 6. 31',
        label: '아레나 대회',
        desc: '아레나 시연 및 대회',
        startDate: '2026-06-31',
        endDate: '2026-06-31',
        side: 'left',
      },
    ],
    []
  );

  const timelineWithStatus = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return timelineItems.map((item, index) => {
      const start = new Date(`${item.startDate}T00:00:00`);
      const end = new Date(`${item.endDate}T23:59:59`);
      let status = 'upcoming';

      if (end < today) {
        status = 'done';
      } else if (start <= today && end >= today) {
        status = 'current';
      }

      return { ...item, index, status };
    });
  }, [timelineItems]);

  const defaultActiveIndex = useMemo(() => {
    const currentIndex = timelineWithStatus.findIndex(item => item.status === 'current');

    if (currentIndex >= 0) {
      return currentIndex;
    }

    const lastDoneIndex = timelineWithStatus.reduce((latest, item, index) => {
      if (item.status === 'done') {
        return index;
      }

      return latest;
    }, -1);

    if (lastDoneIndex >= 0) {
      return lastDoneIndex;
    }

    return 0;
  }, [timelineWithStatus]);

  const statusMeta = {
    done: {
      dotClassName:
        'h-4 w-4 border-[#ff9aa3] bg-[#ff4854] shadow-[0_0_0_4px_rgba(255,212,216,0.45)]',
    },
    current: {
      dotClassName:
        'h-8 w-8 border-[#ffb9bf] bg-[#ff4854] shadow-[0_0_0_6px_rgba(255,212,216,0.45),0_0_0_12px_rgba(255,232,235,0.5),0_0_26px_rgba(255,72,84,0.16)] sm:h-10 sm:w-10',
    },
    upcoming: {
      dotClassName:
        'h-4 w-4 border-[#ffb9bf] bg-white shadow-[0_0_0_4px_rgba(255,232,235,0.65)]',
    },
  };

  return (
    <section id="showcase" className="relative py-16 sm:py-20">
      <div id="how" className="absolute -top-24" aria-hidden="true" />

      <Container>
        <div className="flex flex-col gap-10">
          <motion.div className="max-w-3xl space-y-4" {...SECTION_TITLE_REVEAL}>
            <SectionTitle
              eyebrow="Season Flow"
              title="어떻게 운영되고 진행되나요?"
              desc={
                <>
                  ARENA는 시즌과 대회 두 가지 방식으로 운영되며, 시즌 공지부터 접수, 예선, 본선까지
                  이어지는 흐름 안에서 참가자 경험이 설계됩니다.
                </>
              }
            />
          </motion.div>

          <motion.div
            className="max-w-3xl text-sm leading-7 text-[#57534e] sm:text-base"
            {...SECTION_COPY_REVEAL}
          >
            시즌은 일정 주기로 새롭게 운영되며 새로운 문제가 출제되고, 대회는 참가자들이 LLM Safety
            공격 성과를 겨루는 방식으로 진행됩니다. 아래 타임라인에서 전체 운영 흐름을 한눈에 볼 수
            있습니다.
          </motion.div>

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,#090b11_0%,#050608_100%)] p-6 sm:p-8 lg:p-10">
            <div className="absolute inset-0 " aria-hidden="true">
              <NeuroHeroBackground randomStart />
            </div>

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,72,84,0.14),transparent_24%),radial-gradient(circle_at_78%_22%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_50%_78%,rgba(255,72,84,0.1),transparent_24%)]" />

            <div
              className="relative overflow-hidden rounded-[26px] border border-black/8 bg-white shadow-[0_24px_60px_rgba(37,56,138,0.24)] sm:rounded-[30px]"
              style={{ '--timeline-axis-mobile': '78px', '--timeline-axis-desktop': '50%' }}
            >
              <div className="absolute inset-0 bg-white" />

              <div className="relative overflow-hidden px-8 pb-9 pt-6 sm:px-12 sm:pb-12 sm:pt-8 lg:px-16 lg:pb-14 lg:pt-8">
                <div className="relative grid gap-3">
                  <div className="relative grid gap-0">
                    {timelineWithStatus.map((item, idx) => {
                      const isActive = idx === defaultActiveIndex;
                      const meta = isActive ? statusMeta.current : statusMeta[item.status];
                      const isLeftAligned = item.side === 'left';
                      const isFirstItem = idx === 0;
                      const isLastItem = idx === timelineWithStatus.length - 1;
                      const isPassedSegment = idx < defaultActiveIndex;

                      return (
                        <motion.div
                          key={`${item.label}-${item.title}`}
                          initial={{ opacity: 0, y: 14 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '-80px' }}
                          transition={{ duration: 0.42, ease: 'easeOut', delay: idx * 0.05 }}
                          className="relative min-h-[104px] py-5 text-left sm:min-h-[120px] sm:py-6 lg:grid lg:grid-cols-[1fr_112px_1fr] lg:items-center"
                        >
                          {!isFirstItem ? (
                            <div
                              className={cn(
                                'pointer-events-none absolute left-[var(--timeline-axis-mobile)] top-0 w-[2px] -translate-x-1/2 bg-[#ddd6cf] sm:left-[var(--timeline-axis-desktop)]',
                                isActive
                                  ? 'bottom-[calc(50%+16px)] sm:bottom-[calc(50%+20px)]'
                                  : 'bottom-[calc(50%+8px)]',
                                idx <= defaultActiveIndex && 'bg-[#ff6b75]'
                              )}
                            />
                          ) : null}

                          {!isLastItem ? (
                            <div
                              className={cn(
                                'pointer-events-none absolute left-[var(--timeline-axis-mobile)] bottom-0 w-[2px] -translate-x-1/2 bg-[#ddd6cf] sm:left-[var(--timeline-axis-desktop)]',
                                isActive
                                  ? 'top-[calc(50%+16px)] sm:top-[calc(50%+20px)]'
                                  : 'top-[calc(50%+8px)]',
                                isPassedSegment && 'bg-[#ff6b75]'
                              )}
                            />
                          ) : null}

                          <div
                            className={cn(
                              'pointer-events-none absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform-gpu rounded-full border',
                              'left-[var(--timeline-axis-mobile)] sm:left-[var(--timeline-axis-desktop)]',
                              meta.dotClassName
                            )}
                          />

                          <div
                            className={cn(
                              'rounded-[22px] pl-[126px] text-left transition sm:pl-[154px]',
                              'lg:pl-0 lg:pr-0',
                              isLeftAligned
                                ? 'lg:col-start-1 lg:pr-14 lg:text-right'
                                : 'lg:col-start-3 lg:pl-14 lg:text-left'
                            )}
                          >
                            <div
                              className={cn(
                                'mt-2 font-bold tracking-[-0.02em]',
                                isActive
                                  ? 'text-xl text-[#111827] sm:text-[22px]'
                                  : 'text-lg text-[#171717]'
                              )}
                            >
                              {item.label}
                            </div>

                            <div
                              className={cn(
                                'mt-2 flex flex-wrap items-center gap-2',
                                isLeftAligned && 'lg:justify-end'
                              )}
                            >
                              <div
                                className={cn(
                                  'text-sm sm:text-[15px]',
                                  isActive ? 'font-semibold text-[#FF4854]' : 'text-[#78716c]',
                                  isLeftAligned && 'lg:order-1'
                                )}
                              >
                                {item.title}
                              </div>
                            </div>

                            <p
                              className={cn(
                                'mt-2 leading-7',
                                isActive
                                  ? 'text-base font-medium text-[#44403c]'
                                  : 'text-[15px] text-[#57534e] sm:text-base'
                              )}
                            >
                              {item.desc}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
import { useMemo } from 'react';
import { motion } from 'framer-motion';

import { cn, Container, GradientCard, SectionTitle, SECTION_TITLE_REVEAL } from './LandingPage.primitives';

export default function HowItWorksSection() {
  const timelineItems = useMemo(
    () => [
      {
        n: 'THU',
        title: '2025. 10. 30',
        label: 'ARENA 베타',
        desc: '아레나 베타 오픈 및 대회 사전 안내 공개',
        startDate: '2025-10-30',
        endDate: '2025-10-30',
      },
      {
        n: 'THU-MON',
        title: '2025. 11. 6.(목) ~ 10.(월)',
        label: '대회 접수',
        desc: 'ARENA 대회 참가 접수 기간',
        startDate: '2025-11-06',
        endDate: '2025-11-10',
      },
      {
        n: 'FRI',
        title: '2025. 11. 21',
        label: '예선',
        desc: '예선 진행 및 통과자 선발',
        startDate: '2025-11-21',
        endDate: '2025-11-21',
      },
      {
        n: 'WED',
        title: '2025. 12. 3',
        label: '본 대회',
        desc: '본선 진행 및 최종 결과 집계',
        startDate: '2025-12-03',
        endDate: '2025-12-03',
      },
      {
        n: 'MAR',
        title: '2026. 3. 4',
        label: 'Agent Arena 베타',
        desc: 'Agent Arena 베타 운영 및 테스트 진행',
        startDate: '2026-03-01',
        endDate: '2026-03-30',
      },
      {
        n: 'THU',
        title: '2026. 3. 31',
        label: '아레나 시즌 1',
        desc: '아레나 시즌 1 시작',
        startDate: '2026-03-31',
        endDate: '2026-03-31',
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
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const nearestItem = timelineWithStatus.reduce((closest, item) => {
      const start = new Date(`${item.startDate}T00:00:00`).getTime();
      const distance = Math.abs(start - today);

      if (!closest || distance < closest.distance) {
        return { index: item.index, distance };
      }

      return closest;
    }, null);

    return nearestItem?.index ?? 0;
  }, [timelineWithStatus]);

  const statusMeta = {
    done: {
      dotClassName: 'h-4 w-4 border-[#e7e1d9] bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.55)]',
    },
    current: {
      dotClassName:
        'h-4 w-4 border-[#ffb9bf] bg-[#ff4854] shadow-[0_0_0_6px_rgba(255,212,216,0.45),0_0_18px_rgba(255,72,84,0.16)]',
    },
    upcoming: {
      dotClassName:
        'h-4 w-4 border-[#e7e1d9] bg-[#fff7f5] shadow-[0_0_0_6px_rgba(255,246,242,0.7)]',
    },
  };
  const activeDotClassName =
    'h-8 w-8 border-[#ffb9bf] bg-[#ff4854] shadow-[0_0_0_6px_rgba(255,212,216,0.45),0_0_0_12px_rgba(255,232,235,0.5),0_0_26px_rgba(255,72,84,0.16)] sm:h-10 sm:w-10';
  const leftAlignedLabels = new Set(['대회 접수', '예선', '본 대회']);

  return (
    <section id="how" className="relative py-16 sm:py-20">
      <Container>
        <div className="flex flex-col gap-10">
          <motion.div
            className="max-w-3xl space-y-4"
            {...SECTION_TITLE_REVEAL}
          >
            <SectionTitle
              eyebrow="Season Schedule"
              title="어떻게 진행되나요?"
              desc="시즌 공지부터 접수, 예선, 본선까지 이어지는 전체 진행 흐름을 한눈에 살펴보세요."
            />
          </motion.div>

          <GradientCard className="overflow-hidden p-0" hoverGlow={false}>
            <div
              className="relative overflow-hidden rounded-[26px] bg-[linear-gradient(180deg,#fffdf9_0%,#f7f2ea_32%,#f2ede5_100%)] sm:rounded-[30px]"
              style={{ '--timeline-axis-mobile': '78px', '--timeline-axis-desktop': '50%' }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(255,255,255,0.18)_26%,rgba(255,240,235,0.22)_58%,rgba(244,238,229,0.66)_100%)]" />
              <div className="pointer-events-none absolute left-[var(--timeline-axis-mobile)] top-[14%] h-[170px] w-[170px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.92),rgba(255,221,224,0.34)_42%,rgba(255,220,240,0)_74%)] blur-[10px] sm:left-[var(--timeline-axis-desktop)] sm:h-[210px] sm:w-[210px]" />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent via-[#fff5f2]/36 to-[#f2ede5]/92" />
              <div className="relative overflow-hidden px-6 pb-6 pt-8 sm:px-8 sm:pb-8 sm:pt-10">
                <div className="relative mt-10 grid gap-2 sm:mt-12">
                  <div className="relative grid gap-0">
                    {timelineWithStatus.map((item, idx) => {
                      const meta = statusMeta[item.status];
                      const isActive = idx === defaultActiveIndex;
                      const isLeftAligned = leftAlignedLabels.has(item.label);
                      const isFirstItem = idx === 0;
                      const isLastItem = idx === timelineWithStatus.length - 1;
                      const topLineEndClass = isActive
                        ? 'bottom-[calc(50%+16px)] sm:bottom-[calc(50%+20px)]'
                        : 'bottom-[calc(50%+8px)]';
                      const bottomLineStartClass = isActive
                        ? 'top-[calc(50%+16px)] sm:top-[calc(50%+20px)]'
                        : 'top-[calc(50%+8px)]';

                      return (
                        <motion.div
                          key={`${item.label}-${item.title}`}
                          initial={{ opacity: 0, y: 14 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '-80px' }}
                          transition={{ duration: 0.42, ease: 'easeOut', delay: idx * 0.05 }}
                          className="relative min-h-[88px] py-4 text-left sm:min-h-[104px] lg:grid lg:grid-cols-[1fr_96px_1fr] lg:items-center"
                        >
                          {!isFirstItem ? (
                            <div
                              className={cn(
                                'pointer-events-none absolute left-[var(--timeline-axis-mobile)] top-0 w-[2px] -translate-x-1/2 bg-[#ddd6cf] sm:left-[var(--timeline-axis-desktop)]',
                                topLineEndClass,
                                isActive && 'bg-[#ffb9bf]'
                              )}
                            />
                          ) : null}
                          {!isLastItem ? (
                            <div
                              className={cn(
                                'pointer-events-none absolute left-[var(--timeline-axis-mobile)] bottom-0 w-[2px] -translate-x-1/2 bg-[#ddd6cf] sm:left-[var(--timeline-axis-desktop)]',
                                bottomLineStartClass,
                                isActive && 'bg-[#ffb9bf]'
                              )}
                            />
                          ) : null}
                          <div
                            className={cn(
                              'pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transform-gpu rounded-full border',
                              'left-[var(--timeline-axis-mobile)] sm:left-[var(--timeline-axis-desktop)]',
                              isActive ? activeDotClassName : meta.dotClassName
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
                            <div className="mt-2 text-base font-semibold tracking-[-0.01em] text-[#171717]">
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
                                  'text-[11px] font-semibold uppercase tracking-[0.24em] text-[#b4535c]',
                                  isLeftAligned && 'lg:order-2'
                                )}
                              >
                                {item.n}
                              </div>
                              <div
                                className={cn(
                                  'text-xs text-[#78716c] sm:text-sm',
                                  isLeftAligned && 'lg:order-1'
                                )}
                              >
                                {item.title}
                              </div>
                            </div>
                            <p className="mt-1 text-sm leading-6 text-[#57534e] sm:text-[15px]">
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
          </GradientCard>
        </div>
      </Container>
    </section>
  );
}

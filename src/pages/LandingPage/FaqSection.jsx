import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

import { cn, SectionTitle, SECTION_TITLE_REVEAL } from './LandingPage.primitives';

const FAQ_ITEMS = [
  {
    q: '누가 ARENA에 참여할 수 있나요?',
    a: 'AI 안전성에 관심 있는 누구나 참여할 수 있습니다. 연구자, 개발자, 학생 등 다양한 참가자가 ARENA 대회에 참여할 수 있습니다.',
  },
  {
    q: 'ARENA에서는 무엇을 하나요?',
    a: '참가자는 AI 모델과 상호작용하며 LLM Safety 대회에 참여합니다. 이를 통해 모델의 취약점을 탐색하고 안전성을 검증하는 경험을 할 수 있습니다.',
  },
  {
    q: '결과는 어떻게 평가되나요?',
    a: 'ARENA는 3개의 Judge Model을 활용해 자동 평가를 수행합니다. 사용자와 AI 모델 간의 대화를 분석하여 공격 성공 여부와 안전성 문제를 판단합니다.',
  },
  {
    q: 'ARENA는 왜 Red Teaming을 사용하나요?',
    a: 'Red Teaming은 AI 모델의 취약점을 다양한 공격 시나리오로 점검하는 방식입니다. ARENA는 이를 통해 모델의 안전성과 대응 능력을 검증합니다.',
  },
  {
    q: '시즌과 대회의 차이는 무엇인가요?',
    a: '시즌은 일정 주기로 새롭게 운영되며, 시즌이 바뀔 때마다 새로운 문제가 출제됩니다. 대회는 참가자들이 성과를 겨루는 방식으로 진행됩니다.',
  },
  {
    q: '참가 비용이 있나요?',
    a: 'ARENA 대회는 기본적으로 무료로 참여할 수 있습니다. 일부 대회는 별도의 규칙이나 참가 방식이 있을 수 있습니다.',
  },
  {
    q: '참가 결과는 어디에서 확인할 수 있나요?',
    a: '참가 결과와 평가 기록은 플랫폼에서 확인할 수 있습니다. 각 대회의 성과와 진행 상황도 함께 확인할 수 있습니다.',
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState(0);

  return (
    <div className="mx-auto flex w-full  flex-col gap-9">
      <motion.div {...SECTION_TITLE_REVEAL}>
        <SectionTitle
          eyebrow="FAQ"
          title="자주 묻는 질문"
          desc={
            <>
              ARENA 참여와 운영 방식에 대해
              <br />
              자주 묻는 질문을 정리했습니다.
            </>
          }
        />
      </motion.div>

      <div className="overflow-hidden border-y border-[#e7e1d9] bg-white">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = open === index;

          return (
            <div key={item.q} className="border-b border-[#e7e1d9] last:border-b-0">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : index)}
                className="group flex w-full cursor-pointer items-center justify-between gap-4 bg-white px-5 py-5 text-left transition hover:bg-[#fff7f7] sm:px-6"
              >
                <span
                  className={cn(
                    'text-[15px] font-bold tracking-[-0.02em] transition sm:text-base',
                    isOpen ? 'text-[#FF4854]' : 'text-[#30343b] group-hover:text-[#FF4854]'
                  )}
                >
                  Q. {item.q}
                </span>

                <ChevronDown
                  className={cn(
                    'h-5 w-5 shrink-0 transition duration-300',
                    isOpen
                      ? 'rotate-180 text-[#FF4854]'
                      : 'text-[#b8b8b8] group-hover:text-[#FF4854]'
                  )}
                />
              </button>

              {isOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="border-t border-[#f0ece7] bg-[#fafafa] px-5 py-6 sm:px-6"
                >
                  <p className="text-[15px] leading-8 text-[#6b6f76] sm:text-base">{item.a}</p>
                </motion.div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
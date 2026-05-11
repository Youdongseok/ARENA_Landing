import { motion } from 'framer-motion';

import ArenaJudgeLoader from '@/components/Loading/ArenaJudgeLoader';
import FailedModal from '@/pages/Challenge/ChallengeModal/FailedModal';
import SuccessModal from '@/pages/Challenge/ChallengeModal/SuccesModal';
import { failedPanelsData, successPanelsData } from '@/pages/Challenge/data/challengeModalData';
import NeuroHeroBackground from './NeuroHeroBackground';
import {
  Container,
  SectionTitle,
  SECTION_COPY_REVEAL,
  SECTION_TITLE_REVEAL,
} from './LandingPage.primitives';

function PreviewFrame({ title, footer, children, className = '' }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,#090b11_0%,#050608_100%)] p-4 sm:p-5 ${className}`}
    >
      <div className="absolute inset-0 " aria-hidden="true">
        <NeuroHeroBackground randomStart/>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,72,84,0.14),transparent_24%),radial-gradient(circle_at_78%_22%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_50%_78%,rgba(255,72,84,0.1),transparent_24%)]" />
      <div className="relative min-h-[36rem]">
        <div className="absolute inset-4 overflow-hidden rounded-3xl border border-black/8 bg-white shadow-[0_24px_60px_rgba(37,56,138,0.24)] sm:inset-6">
          <div className="h-full bg-white">{children}</div>
        </div>
      </div>
    </div>
  );
}

function ModalPreviewFrame({ children, className = '', innerHeightClassName = 'min-h-[28rem]' }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,#090b11_0%,#050608_100%)] p-1 sm:p-2 ${className}`}
    >
      <div className="absolute inset-0 " aria-hidden="true">
        <NeuroHeroBackground randomStart />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,72,84,0.14),transparent_24%),radial-gradient(circle_at_78%_22%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_50%_78%,rgba(255,72,84,0.1),transparent_24%)]" />

      <div className={`relative flex items-center justify-center ${innerHeightClassName}`}>
        {children}
      </div>
    </div>
  );
}

function AutoJudgePreview() {
  return (
    <PreviewFrame>
      <div className="flex h-full items-center justify-center">
        <ArenaJudgeLoader
          className="h-full w-full rounded-[1.5rem] shadow-none"
          frameClassName="rounded-[1.5rem]"
          compact
        />
      </div>
    </PreviewFrame>
  );
}

function FailedJudgeModelPreview() {
  const previewResults = failedPanelsData.map(data => ({
    status: 'failed',
    data: {
      ...data,
      title: data.animalName,
    },
  }));

  return (
    <ModalPreviewFrame className="sm:-mx-2 lg:-mx-6" innerHeightClassName="min-h-[30.5rem]">
      <div className="flex h-full w-full items-center justify-center overflow-visible">
       <div className="relative h-[320px] w-[600px] sm:h-[380px] sm:w-[740px]">
  <div className="absolute left-1/2 top-1/2 origin-center -translate-x-1/2 -translate-y-1/2 scale-[0.54] sm:scale-[0.64]">
    <div className="overflow-hidden rounded-[24px] [clip-path:inset(0_56px_0_56px_round_24px)]">
      <FailedModal
        isOpen
        onClose={() => {}}
        previewMode
        previewTitle="Failed Modal"
        previewResults={previewResults}
        embeddedPreview
      />
    </div>
  </div>
</div>
      </div>
    </ModalPreviewFrame>
  );
}

function SuccessJudgeModelPreview() {
  return (
    <ModalPreviewFrame>
      <div className="flex h-full w-full items-center justify-center">
        <div className="relative h-[296px] w-[466px] sm:h-[359px] sm:w-[551px]">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 origin-center scale-[0.54] sm:scale-[0.64]">
            <SuccessModal
              isOpen
              onClose={() => {}}
              previewMode
              previewTitle={successPanelsData[0]?.title}
              embeddedPreview
            />
          </div>
        </div>
      </div>
    </ModalPreviewFrame>
  );
}

export default function JudgeStackOnlySection() {
  return (
    <>
      <section id="judge" className="relative bg-white py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-center lg:gap-14">
            <motion.div {...SECTION_COPY_REVEAL}>
              <AutoJudgePreview />
            </motion.div>
            <div className="flex flex-col gap-6 lg:pl-6">
              <motion.div className="max-w-xl space-y-4" {...SECTION_TITLE_REVEAL}>
                <SectionTitle
                  eyebrow="Auto Judge"
                  title="어떻게 평가하나요?"
                  desc={
                    <>
                      ARENA는 사용자가 남긴 대화 전체를 Auto Judge 단계에서 먼저 수집하고 정리합니다.
                      <br />
                      필요한 로그를 모아 3개의 Judge Model이 동시에 읽을 수 있는 평가 상태로 넘겨 줍니다.
                    </>
                  }
                />
              </motion.div>
              <motion.div className="max-w-lg text-sm leading-7 text-[#57534e] sm:text-base" {...SECTION_COPY_REVEAL}>
                단순히 결과만 보여주는 대신, 실제로 분석이 진행 중인 로딩 경험까지 포함해 하나의 심사
                흐름처럼 체감할 수 있도록 구성했습니다.
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      <section className="relative bg-white py-16 sm:py-20">
        <Container>
          <div className="flex flex-col gap-12">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center lg:gap-14">
              <div className="flex flex-col gap-6 lg:pr-6">
                <motion.div className="max-w-xl space-y-4" {...SECTION_TITLE_REVEAL}>
                  <SectionTitle
                    eyebrow="Judge Model"
                    title="Judge Model이란?"
                    desc={
                      <>
                        Judge Model은 대화 내용을 바탕으로 공격 성공 여부, 정책 위반 가능성, 안전 대응
                        여부를 분석하는 평가용 AI입니다.
                        <br />
                        결과는 실패 모달과 성공 모달 형태로 다시 보여 줘서 판단 과정을 직관적으로 이해할 수
                        있게 만듭니다.
                      </>
                    }
                  />
                </motion.div>
                <motion.div className="max-w-lg text-sm leading-7 text-[#57534e] sm:text-base" {...SECTION_COPY_REVEAL}>
                  실패 판정은 어떤 기준으로 막혔는지, 어떤 응답이 정책상 허용되지 않는지를 화면 안에서
                  바로 읽을 수 있도록 구성했습니다.
                </motion.div>
              </div>
              <motion.div {...SECTION_COPY_REVEAL}>
                <FailedJudgeModelPreview />
              </motion.div>
            </div>

            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-center lg:gap-14">
              <motion.div {...SECTION_COPY_REVEAL}>
                <SuccessJudgeModelPreview />
              </motion.div>
              <div className="flex flex-col gap-6 lg:pl-6">
                <motion.div className="max-w-xl space-y-4" {...SECTION_TITLE_REVEAL}>
                  <SectionTitle
                    eyebrow="Success Path"
                    title="성공 판정은 어떻게 보이나요?"
                    desc={
                      <>
                        성공 결과는 단순한 점수 표기가 아니라, Judge Model 다수결에 따른 최종 판정으로
                        사용자에게 전달됩니다.
                        <br />
                        성공 상태에서는 다음 액션까지 자연스럽게 이어지는 흐름을 함께 보여 줍니다.
                      </>
                    }
                  />
                </motion.div>
                <motion.div className="max-w-lg text-sm leading-7 text-[#57534e] sm:text-base" {...SECTION_COPY_REVEAL}>
                  사용자는 단순히 성공 여부만 보는 것이 아니라, 어떤 기준을 통과했는지와 다음 행동까지
                  한 번에 이해하게 됩니다.
                </motion.div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

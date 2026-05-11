import { motion } from 'framer-motion';

import LazyVisual from './LazyVisual';
import {
  AgenticCommerceVisual,
  Container,
  SectionTitle,
  SECTION_COPY_REVEAL,
  SECTION_TITLE_REVEAL,
} from './LandingPage.primitives';

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-16 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-center lg:gap-14">
          <div className="flex flex-col gap-7 lg:pr-8">
            <motion.div className="max-w-xl space-y-4" {...SECTION_TITLE_REVEAL}>
              <SectionTitle
                eyebrow="RED Teaming"
                title="RED Teaming이란?"
                desc={
                  <>
                    LLM Red Teaming은 다양한 공격 프롬프트와 시나리오를 통해 AI 모델의 취약점을 탐색하는
                    과정입니다.
                    <br />
                    ARENA에서는 AI 모델과 대화를 통해 이러한 검증 과정을 직접 수행할 수 있습니다.
                  </>
                }
              />
            </motion.div>

            <motion.div
              className="max-w-lg text-sm leading-7 text-[#57534e] sm:text-base"
              {...SECTION_COPY_REVEAL}
            >
            </motion.div>

            <motion.div
              className="grid gap-3 sm:grid-cols-2"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: 0.12 }}
            >
              
              
            </motion.div>
          </div>

          <div className="w-full">
            <LazyVisual minHeight={620}>
              <AgenticCommerceVisual />
            </LazyVisual>
          </div>
        </div>
      </Container>
    </section>
  );
}

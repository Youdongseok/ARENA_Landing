import { motion } from 'framer-motion';

import AgentArenaPromoSection from './AgentArenaPromoSection';
import FaqSection from './FaqSection';
import { Container, SECTION_COPY_REVEAL } from './LandingPage.primitives';

export default function FaqCompositeSection() {
  return (
    <section id="faq" className="relative py-16 sm:py-20">
      <Container>
        <motion.div className="flex flex-col gap-24 sm:gap-28" {...SECTION_COPY_REVEAL}>
           {/* <AgentArenaPromoSection /> */}
          <FaqSection />
        </motion.div>
      </Container>
    </section>
  );
}

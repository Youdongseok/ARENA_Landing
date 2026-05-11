import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';

import { JUDGE_SHOTS, SPONSOR_LOGOS } from './LandingPage.constants';
import { LogoMarquee } from './LandingPage.primitives';
import Hero from './HeroSection';
import NavbarSection from './NavbarSection';

const Features = lazy(() => import('./FeaturesSection'));
const JudgeStackOnlySection = lazy(() => import('./JudgeStackOnlySection'));
const Showcase = lazy(() => import('./ShowcaseSection'));
const Testimonials = lazy(() => import('./TestimonialsSection'));
const FAQ = lazy(() => import('./FaqCompositeSection'));
const Footer = lazy(() => import('./FooterSection'));

function LazySectionMount({ children, minHeight = 600, margin = '-10% 0px' }) {
  const ref = useRef(null);
  const shouldRender = useInView(ref, {
    once: true,
    margin,
  });

  return (
    <div ref={ref} style={{ minHeight }}>
      {shouldRender ? children : <div aria-hidden="true" style={{ minHeight }} />}
    </div>
  );
}

export default function LandingPage() {
  const [showFloatingNav, setShowFloatingNav] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('landing-scroll-hidden');
    document.body.classList.add('landing-scroll-hidden');

    return () => {
      document.documentElement.classList.remove('landing-scroll-hidden');
      document.body.classList.remove('landing-scroll-hidden');
    };
  }, []);

  const handleHeroVisibilityChange = useCallback(isVisible => {
    setShowFloatingNav(!isVisible);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#171717]">
      <AnimatePresence>
        {showFloatingNav ? (
          <motion.div
            className="fixed inset-x-0 top-0 z-[70]"
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <NavbarSection className="shadow-[0_10px_34px_rgba(23,23,23,0.08)]" />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Hero onVisibilityChange={handleHeroVisibilityChange} />
      {/* <div className="bg-[#050608] px-0 pt-10 pb-8 text-white sm:pt-10 sm:pb-10">
        <div className="mx-auto flex max-w-[1280px] items-center gap-5 px-5 sm:gap-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#ff8f98] to-[#3a3a3f]" />
          <div className="shrink-0 text-center text-base font-semibold tracking-[-0.01em] text-white/88 sm:text-lg">
            우리는 이런 기업과 함께합니다.
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#ff8f98] to-[#3a3a3f]" />
        </div>
        <LogoMarquee
          items={SPONSOR_LOGOS}
          className="mt-6"
          itemWidth={220}
          edgeFadeClassName="from-[#050608]"
        />
      </div> */}
      <section className="bg-white px-5 py-14 text-center sm:py-20">
  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#ff4854]">
    AI Red Teaming Evaluation Next-gen AI
  </p>
  <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.04em] text-[#171717] sm:text-5xl">
    차세대 AI 레드팀 평가 플랫폼
  </h2>
</section>
      <Suspense fallback={<div aria-hidden="true" style={{ minHeight: 880 }} />}>
        <Features />
      </Suspense>
      <LazySectionMount minHeight={980} margin="-12% 0px">
        <Suspense fallback={<div aria-hidden="true" style={{ minHeight: 980 }} />}>
          <JudgeStackOnlySection shots={JUDGE_SHOTS} />
        </Suspense>
      </LazySectionMount>
      <Suspense fallback={<div aria-hidden="true" style={{ minHeight: 880 }} />}>
        <Showcase />
      </Suspense>
      <LazySectionMount minHeight={720} margin="12% 0px">
        <Suspense fallback={<div aria-hidden="true" style={{ minHeight: 720 }} />}>
          <Testimonials />
        </Suspense>
      </LazySectionMount>
      <Suspense fallback={<div aria-hidden="true" style={{ minHeight: 920 }} />}>
        <FAQ />
      </Suspense>
      <Suspense fallback={<div aria-hidden="true" style={{ minHeight: 280 }} />}>
        <Footer />
      </Suspense>
    </div>
  );
}

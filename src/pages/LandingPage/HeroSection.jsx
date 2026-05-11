import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Container } from './LandingPage.primitives';
import ArenaOpeningHeroArt from './ArenaOpeningHeroArt';
import NeuroHeroBackground from './NeuroHeroBackground';

export default function HeroSection({ onVisibilityChange }) {
  const heroRef = useRef(null);
  const [showShaderBackground, setShowShaderBackground] = useState(false);

  const isHeroInView = useInView(heroRef, {
    margin: '-15% 0px -55% 0px',
  });

  useEffect(() => {
    onVisibilityChange?.(isHeroInView);
  }, [isHeroInView, onVisibilityChange]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setShowShaderBackground(true);
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-black"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: showShaderBackground ? 1 : 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        aria-hidden="true"
      >
        {showShaderBackground ? <NeuroHeroBackground /> : null}
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,72,84,0.06),transparent_30%)]" />

      <Container className="relative w-full py-20 sm:py-24 lg:py-26">
        <div className="grid items-center gap-12">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex flex-col items-center gap-10 text-center"
          >
            <div className="flex flex-col items-center text-center">
              <ArenaOpeningHeroArt />

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 1.2 }}
                className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center sm:mt-5 sm:gap-x-6"
              >
                <span className="text-[0.72rem] font-medium uppercase tracking-[0.32em] text-white sm:text-[0.8rem]">
                  <span className="mr-1 text-[1.15rem] font-semibold tracking-[0.18em] text-[#ff4854] sm:text-[1.24rem]">
                    A
                  </span>
                  I
                </span>

                <span className="text-[0.72rem] font-medium uppercase tracking-[0.32em] text-white sm:text-[0.8rem]">
                  <span className="mr-1 text-[1.15rem] font-semibold tracking-[0.18em] text-[#ff4854] sm:text-[1.24rem]">
                    R
                  </span>
                  ed Teaming
                </span>

                <span className="text-[0.72rem] font-medium uppercase tracking-[0.32em] text-white sm:text-[0.8rem]">
                  <span className="mr-1 text-[1.15rem] font-semibold tracking-[0.18em] text-[#ff4854] sm:text-[1.24rem]">
                    E
                  </span>
                  valuation
                </span>

                <span className="text-[0.72rem] font-medium uppercase tracking-[0.32em] text-white sm:text-[0.8rem]">
                  <span className="mr-1 text-[1.15rem] font-semibold tracking-[0.18em] text-[#ff4854] sm:text-[1.24rem]">
                    N
                  </span>
                  ext-gen
                </span>

                <span className="text-[0.72rem] font-medium uppercase tracking-[0.32em] text-white sm:text-[0.8rem]">
                  <span className="mr-1 text-[1.15rem] font-semibold tracking-[0.18em] text-[#ff4854] sm:text-[1.24rem]">
                    A
                  </span>
                  I
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 1.35 }}
                className="mt-6 flex flex-col items-center sm:mt-7 sm:flex-row sm:justify-center lg:mt-8"
              >
                <Link
  to="/dashboard"
  className="group relative z-[1] inline-flex min-w-[280px] items-center justify-center overflow-hidden rounded-2xl bg-[#1d1d1d] px-7 py-4 text-base font-bold leading-[26px] text-[#747474] no-underline shadow-[0_4px_12px_rgba(0,0,0,0.18),0_1px_2px_rgba(0,0,0,0.16),inset_0_1px_1px_rgba(255,255,255,0.05)] transition duration-300 hover:scale-[1.04] hover:bg-[#ff4854] hover:text-white hover:shadow-[0_0_90px_rgba(255,72,84,0.36),0_4px_12px_rgba(0,0,0,0.18),0_1px_2px_rgba(0,0,0,0.16),inset_0_1px_1px_rgba(255,255,255,0.32)] active:scale-[1.02]"
>
  <span
    aria-hidden="true"
    className="absolute inset-0 rounded-2xl border border-white/10"
  />

  <svg
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 h-full w-full rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
    viewBox="0 0 280 58"
    preserveAspectRatio="none"
  >
    <rect
      x="1"
      y="1"
      width="278"
      height="56"
      rx="16"
      fill="none"
      stroke="rgba(255,255,255,0.9)"
      strokeWidth="1"
      strokeDasharray="36 244"
      pathLength="280"
      className="[animation:arena-border-line_1.8s_linear_infinite]"
    />
    <rect
      x="1"
      y="1"
      width="278"
      height="56"
      rx="16"
      fill="none"
      stroke="rgba(255,255,255,0.45)"
      strokeWidth="2"
      strokeDasharray="36 244"
      pathLength="280"
      filter="blur(3px)"
      className="[animation:arena-border-line_1.8s_linear_infinite]"
    />
  </svg>

  <span
    aria-hidden="true"
    className="absolute bottom-[-10px] left-[20%] right-[20%] z-[2] h-5 rounded-full bg-[#ff8f98] opacity-0 blur-[12.5px] transition duration-300 group-hover:opacity-100"
  />

  <span className="relative z-[1]">지금 바로 Red Teaming에 도전하세요</span>

  <style>
    {`
      @keyframes arena-border-line {
        from {
          stroke-dashoffset: 280;
        }
        to {
          stroke-dashoffset: 0;
        }
      }
    `}
  </style>
</Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
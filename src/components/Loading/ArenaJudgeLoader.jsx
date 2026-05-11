import { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export default function ArenaJudgeLoader({
  className = '',
  frameClassName = '',
  fullscreen = false,
  compact = false,
}) {
  const circleRadius = compact ? 178 : 258;
  const circumference = 2 * Math.PI * circleRadius;
  const containerSize = compact ? 428 : 620;
  const center = containerSize / 2;

  const smoothProgress = useSpring(0, {
    stiffness: 80,
    damping: 20,
    mass: 0.3,
  });

  const dashOffset = useTransform(smoothProgress, p => circumference * (1 - p));
  const displayPercent = useTransform(smoothProgress, p => `${Math.floor(p * 100)}%`);

  useEffect(() => {
    smoothProgress.set(0);
    let progress = 0;
    const target = 0.95;
    const interval = window.setInterval(() => {
      progress += 0.005;
      smoothProgress.set(Math.min(progress, target));
      if (progress >= target) window.clearInterval(interval);
    }, 30);

    return () => window.clearInterval(interval);
  }, [smoothProgress]);

  return (
    <div
        className={[
          'relative flex flex-col items-center justify-center overflow-hidden rounded-[24px] bg-white text-white shadow-2xl',
          fullscreen ? 'h-[100svh] w-full rounded-none bg-white' : 'h-[600px] w-[950px]',
          className,
        ]
        .filter(Boolean)
        .join(' ')}
    >
      {fullscreen ? (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,72,84,0.08),transparent_32%)]" />
      ) : null}

      <div
        className={[
          'relative flex h-full w-full items-center justify-center overflow-hidden',
          frameClassName,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div
          className={`relative flex items-center justify-center ${
            compact ? 'h-[428px] w-[428px]' : 'h-full w-full'
          }`}
        >
          <svg
            className="absolute"
            width={containerSize}
            height={containerSize}
            viewBox={`0 0 ${containerSize} ${containerSize}`}
            fill="none"
            style={{ transform: 'rotate(-90deg)', zIndex: 1 }}
          >
            <circle cx={center} cy={center} r={circleRadius} stroke="#FFD5D5" strokeWidth="2" />
            <motion.circle
              cx={center}
              cy={center}
              r={circleRadius}
              stroke="#FF4854"
              strokeOpacity="0.85"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              style={{ strokeDashoffset: dashOffset }}
            />
          </svg>

          <div className="relative z-[2] flex flex-col items-center justify-center text-center">
            <motion.h1
              className={`font-[Orbitron] tracking-[0.25em] ${compact ? 'text-4xl sm:text-[2.5rem]' : 'text-5xl'}`}
              style={{
                color: '#FF4854',
                textShadow: '0 0 20px #FF4854',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              ARENA
            </motion.h1>

            <motion.div
              key="looped-fullname"
              className={`tracking-wide text-[#6B6B6B] ${compact ? 'mt-7 text-[11px] sm:text-xs' : 'mt-16 text-xs md:text-sm'}`}
            >
              {[
                {
                  text: (
                    <>
                      <span className="text-[#FF4854]">A</span>I{' '}
                    </>
                  ),
                  delay: 0.2,
                },
                {
                  text: (
                    <>
                      <span className="text-[#FF4854]">R</span>ed Teaming{' '}
                    </>
                  ),
                  delay: 0.4,
                },
                {
                  text: (
                    <>
                      <span className="text-[#FF4854]">E</span>valuation{' '}
                    </>
                  ),
                  delay: 0.6,
                },
                {
                  text: (
                    <>
                      <span className="text-[#FF4854]">N</span>ext-gen{' '}
                    </>
                  ),
                  delay: 0.8,
                },
                {
                  text: (
                    <>
                      <span className="text-[#FF4854]">A</span>I
                    </>
                  ),
                  delay: 1,
                },
              ].map(({ text, delay }, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{
                    delay,
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                    ease: 'easeInOut',
                  }}
                >
                  {text}
                </motion.span>
              ))}
            </motion.div>

            {compact ? (
              <motion.div className="mt-5 text-[11px] font-light tracking-wider text-[#6B6B6B] sm:text-xs">
                {displayPercent}
              </motion.div>
            ) : null}
          </div>
        </div>

        {!compact ? (
          <motion.div
            className="absolute bottom-24 text-xs font-light tracking-wider text-[#6B6B6B]"
            style={{ zIndex: 10 }}
          >
            {displayPercent}
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}

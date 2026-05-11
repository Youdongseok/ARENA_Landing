import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function AgentArenaPromoSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="mx-auto w-full max-w-[1380px] overflow-hidden rounded-[30px] border border-[#3b2d78]/55 bg-[linear-gradient(180deg,#0f0c24_0%,#0b0a1d_100%)] "
    >
      <div className="relative overflow-hidden px-6 py-7 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(132,72,255,0.22),transparent_22%),radial-gradient(circle_at_50%_55%,rgba(36,98,255,0.18),transparent_28%),radial-gradient(circle_at_50%_50%,rgba(189,61,255,0.14),transparent_42%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        <div className="relative flex min-h-[460px] flex-col justify-between sm:min-h-[520px]">
          <div className="relative flex min-h-[250px] items-center justify-center overflow-hidden sm:min-h-[300px]">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7c3cff]/18 blur-[90px]" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2483ff]/16 blur-[80px]" />

            <div className="relative h-[220px] w-full max-w-[560px] sm:h-[260px]">
              <div className="absolute left-1/2 top-[76%] h-[108px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-[30px] border border-[#355dc6]/28 bg-transparent shadow-[0_0_0_1px_rgba(73,121,255,0.08)]" />
              <div className="absolute left-1/2 top-[68%] h-[108px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-[32px] border border-[#835cff]/22 bg-[rgba(14,16,36,0.32)]" />

              <div className="absolute left-1/2 top-[52%] h-[132px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-[34px] border border-[#77dfff]/38 bg-[linear-gradient(135deg,rgba(97,67,255,0.34),rgba(181,66,255,0.18)_45%,rgba(38,136,255,0.24)_100%)] shadow-[0_18px_56px_rgba(51,91,255,0.24)] backdrop-blur-sm">
                <div className="absolute inset-0 rounded-[34px] bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.12),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]" />
                <div className="absolute left-5 top-4 flex gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/24" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/18" />
                </div>
                <div className="absolute inset-x-9 top-[42px] space-y-3">
                  <div className="h-4 rounded-full bg-white/10" />
                  <div className="h-4 w-[72%] rounded-full bg-white/8" />
                  <div className="h-4 w-[48%] rounded-full bg-white/7" />
                </div>
                <div className="absolute left-1/2 top-1/2 flex h-8 w-[160px] -translate-x-1/2 -translate-y-1/2 items-center justify-center text-[13px] font-semibold uppercase tracking-[0.18em] text-white drop-shadow-[0_0_12px_rgba(111,238,255,0.32)]">
                  Agent Workflow
                </div>
              </div>

              <div className="absolute left-[10%] top-[28%] h-[58px] w-[58px] rounded-[18px] border border-white/14 bg-[linear-gradient(180deg,rgba(86,111,255,0.88),rgba(94,53,255,0.56))] shadow-[0_14px_28px_rgba(48,78,255,0.3)]">
                <div className="flex h-full items-center justify-center text-[18px] font-semibold text-white/90">
                  AI
                </div>
              </div>

              <div className="absolute left-[66%] top-[24%] h-[42px] w-[42px] rounded-[14px] border border-white/12 bg-[linear-gradient(180deg,rgba(83,118,255,0.76),rgba(76,56,212,0.48))] shadow-[0_10px_20px_rgba(50,76,255,0.24)]">
                <div className="flex h-full items-center justify-center text-[11px] font-semibold text-white/80">
                  ✦
                </div>
              </div>

              <div className="absolute left-[76%] top-[52%] h-[60px] w-[76px] rounded-[22px] border border-[#f0a7ff]/20 bg-[linear-gradient(180deg,rgba(210,113,255,0.44),rgba(115,52,167,0.22))] shadow-[0_14px_26px_rgba(185,88,255,0.22)]">
                <div className="flex h-full items-center justify-center">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-white/85 drop-shadow-[0_0_8px_rgba(255,255,255,0.28)]"
                    fill="none"
                  >
                    <circle cx="11" cy="11" r="5.5" stroke="currentColor" strokeWidth="1.8" />
                    <path
                      d="M15.2 15.2L19 19"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="absolute left-[42%] top-[70%] h-[34px] w-[62px] rounded-[14px] border border-[#8acbff]/24 bg-[linear-gradient(180deg,rgba(76,133,255,0.52),rgba(36,70,154,0.24))] shadow-[0_10px_18px_rgba(47,106,255,0.18)]">
                <div className="flex h-full items-center justify-center text-[12px] text-white/75">◔</div>
              </div>

              <div className="pointer-events-none absolute left-[22%] top-[35%] h-[2px] w-[152px] rotate-[11deg] bg-gradient-to-r from-transparent via-[#c26cff]/58 to-transparent" />
              <div className="pointer-events-none absolute left-[58%] top-[35%] h-[2px] w-[128px] rotate-[34deg] bg-gradient-to-r from-transparent via-[#8ddcff]/55 to-transparent" />
              <div className="pointer-events-none absolute left-[56%] top-[61%] h-[2px] w-[118px] rotate-[-11deg] bg-gradient-to-r from-transparent via-[#c778ff]/48 to-transparent" />

              <div className="pointer-events-none absolute left-[16%] top-[20%] h-1.5 w-1.5 rounded-full bg-white/70 shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
              <div className="pointer-events-none absolute left-[24%] top-[24%] h-1 w-1 rounded-full bg-white/50 shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
              <div className="pointer-events-none absolute left-[70%] top-[18%] h-1.5 w-1.5 rounded-full bg-white/70 shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
              <div className="pointer-events-none absolute left-[80%] top-[30%] h-1 w-1 rounded-full bg-white/60 shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
              <div className="pointer-events-none absolute left-[74%] top-[40%] h-1 w-1 rounded-full bg-white/55 shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
            </div>
          </div>

          <div className="relative mt-4 mx-auto flex max-w-[560px] flex-col items-center text-center">
            <p className="m-0 text-sm font-semibold uppercase tracking-[0.2em] text-white/45">
              Another Challenge
            </p>
            <h3 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              또 하나의 도전 Agent - Arena
            </h3>
            <p className="mt-6 text-sm leading-7 text-white/68 sm:text-base">
              이제 ARENA는 사람의 Red Teaming을 넘어,
              <br />
              사용자 에이전트가 스스로 도전하고 평가받는 Agent - Arena로 확장됩니다.
            </p>
            <a
              href="http://54.116.112.9"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[#8f7dff]/35 bg-[linear-gradient(135deg,rgba(106,79,255,0.28),rgba(43,124,255,0.2))] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(66,92,255,0.18),inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-[#a99dff]/55 hover:bg-[linear-gradient(135deg,rgba(121,92,255,0.38),rgba(56,138,255,0.28))] hover:shadow-[0_16px_34px_rgba(76,102,255,0.28),inset_0_1px_0_rgba(255,255,255,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9da4ff]"
            >
              Agent - Arena 보기
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

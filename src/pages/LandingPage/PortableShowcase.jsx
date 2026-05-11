import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const lerp = (start, end, t) => start + (end - start) * t;
const smoothstep = (t) => t * t * (3 - 2 * t);
const START_PROGRESS_OFFSET = 0.25;
const CONVERGENCE_SCROLL_RATIO = 0.82;
const DEFAULT_SERVICE_CARDS = [
  {
    title: "Workflow Optimization",
    description:
      "We automate your workflow by connecting your favorite applications, boosting efficiency and enhancing productivity.",
    visual: "ring"
  },
  {
    title: "Business consulting",
    description:
      "We develop advanced chatbots that are reactive, understand nuances, and are capable of solving extremely complex queries.",
    visual: "triangle"
  },
  {
    title: "Chatbot development",
    description:
      "Using our expertise, we dive deep into your organization and consult you on how AI-driven automations could enhance your operations.",
    visual: "diamond"
  }
];

const DEFAULT_NAV_ITEMS = ["Home", "Services", "Work", "Plans", "Team", "Contact"];

const DEFAULT_COPY = {
  brand: "OPTIMIND",
  progressLabel: "02 / 005",
  sectionTitle: ["DISCOVER", "OUR SERVICES"],
  sectionDescription: "We deliver complete AI automation services under one roof.",
  footerCount: "0",
  footerLabel: "Share",
  bottomHeadline: "니들의 @@가 모여서 하나가 된다",
  ctaLabel: "지금 바로 Red Teaming 에 도전하세요"
};

function spherePoint(index, total) {
  const u = (index + 0.5) / total;
  const phi = Math.acos(1 - 2 * u);
  const theta = Math.PI * (1 + Math.sqrt(5)) * (index + 0.5);

  return {
    x: Math.cos(theta) * Math.sin(phi),
    y: Math.cos(phi),
    z: Math.sin(theta) * Math.sin(phi)
  };
}

function createSeededRng(seed) {
  let t = seed >>> 0;

  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export default function PortableShowcase({
  className = "",
  navItems = DEFAULT_NAV_ITEMS,
  serviceCards = DEFAULT_SERVICE_CARDS,
  copy = DEFAULT_COPY
}) {
  const [heroProgress, setHeroProgress] = useState(START_PROGRESS_OFFSET);
  const [isActive, setIsActive] = useState(false);
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '20% 0px 20% 0px',
        threshold: 0.01,
      }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section || !isActive) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;
    const scrollElement = document.scrollingElement || document.documentElement;

    const state = {
      width: 0,
      height: 0,
      dpr: 1,
      progress: 0
    };

    const particles = [];
    let animationId = 0;
    let progressFrame = 0;

    function buildParticles() {
      particles.length = 0;
      const rng = createSeededRng(20260314);
      const count = 2600;
      const scatterRange = Math.max(state.width, state.height) * 1.45;

      for (let i = 0; i < count; i += 1) {
        let { x: sx, y: sy, z: sz } = spherePoint(i, count);
        const isRing = rng() < 0.42;

        if (isRing) {
          const angle = rng() * Math.PI * 2;
          const ringScale = 1.18 + rng() * 0.5;
          sx = Math.cos(angle) * ringScale;
          sy = (rng() - 0.5) * 0.16;
          sz = Math.sin(angle) * ringScale;
        }

        particles.push({
          scatterX: (rng() - 0.5) * scatterRange * 2,
          scatterY: (rng() - 0.5) * scatterRange * 1.5,
          scatterZ: (rng() - 0.5) * scatterRange * 1.3,
          sx,
          sy,
          sz,
          phaseX: rng() * Math.PI * 2,
          phaseY: rng() * Math.PI * 2,
          speed: 0.45 + rng() * 1.25,
          size: (0.5 + rng() * 1.5) * (isRing ? 1.2 : 1),
          glow: rng(),
          tint: rng()
        });
      }
    }

    function updateScrollProgress() {
      const scrollTop = scrollElement.scrollTop;
      const start = section.getBoundingClientRect().top + scrollTop;
      const distance = Math.max(section.offsetHeight - window.innerHeight, 1);
      const scrolled = scrollTop - start;
      const activeDistance = Math.max(distance * CONVERGENCE_SCROLL_RATIO, 1);
      const raw = clamp(scrolled / activeDistance, 0, 1);
      const nextProgress = START_PROGRESS_OFFSET + raw * (1 - START_PROGRESS_OFFSET);
      state.progress = nextProgress;
      setHeroProgress((prev) => (Math.abs(prev - nextProgress) > 0.002 ? nextProgress : prev));
    }

    function trackProgress() {
      updateScrollProgress();
      progressFrame = window.requestAnimationFrame(trackProgress);
    }

    function resize() {
      state.width = window.innerWidth;
      state.height = window.innerHeight;
      state.dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(state.width * state.dpr);
      canvas.height = Math.floor(state.height * state.dpr);
      canvas.style.width = `${state.width}px`;
      canvas.style.height = `${state.height}px`;
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

      buildParticles();
      updateScrollProgress();
    }

    function draw(time) {
      const t = smoothstep(state.progress);
      const dynamic = 1 - t;
      const cx = state.width * 0.5;
      const cy = state.height * 0.5;
      const radius = Math.min(state.width, state.height) * (0.24 + t * 0.06);
      const drift = 24 * dynamic * dynamic + 1.4;
      const rotY = time * (0.0002 * dynamic + 0.00003) + 0.42 * t;
      const rotX = Math.sin(time * 0.00014) * (0.22 * dynamic + 0.02) + 0.05 * t;

      ctx.fillStyle = "rgba(3, 2, 6, 0.24)";
      ctx.fillRect(0, 0, state.width, state.height);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      for (const particle of particles) {
        const noiseX =
          Math.sin(time * 0.0013 * particle.speed + particle.phaseX) * drift;
        const noiseY =
          Math.cos(time * 0.0012 * particle.speed + particle.phaseY) * drift * 0.75;
        const noiseZ =
          Math.sin(time * 0.0011 * particle.speed + particle.phaseY) * drift;

        let x = particle.scatterX * (1 - t) + particle.sx * radius * t + noiseX;
        let y = particle.scatterY * (1 - t) + particle.sy * radius * t + noiseY;
        let z = particle.scatterZ * (1 - t) + particle.sz * radius * t + noiseZ;

        const cosY = Math.cos(rotY + particle.tint * 0.7);
        const sinY = Math.sin(rotY + particle.tint * 0.7);
        const xr = x * cosY - z * sinY;
        let zr = x * sinY + z * cosY;

        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const yr = y * cosX - zr * sinX;
        zr = y * sinX + zr * cosX;

        x = xr;
        y = yr;

        const camera = 850;
        const depth = camera / (camera - zr);
        if (depth < 0.15 || depth > 6) continue;

        const px = cx + x * depth;
        const py = cy + y * depth;
        if (px < -40 || px > state.width + 40 || py < -40 || py > state.height + 40) {
          continue;
        }

        const alpha =
          (0.08 + particle.glow * 0.74) * (0.44 + t * 0.75) * Math.min(depth, 1.8);
        const size = particle.size * depth * (0.55 + t * 0.45);
        const green = 182 + Math.floor(45 * particle.tint);
        const blue = 116 + Math.floor(26 * particle.tint);

        ctx.fillStyle = `rgba(255, ${green}, ${blue}, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }

      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.35);
      glow.addColorStop(0, `rgba(255, 235, 180, ${0.18 * t})`);
      glow.addColorStop(0.48, `rgba(255, 202, 130, ${0.06 * t})`);
      glow.addColorStop(1, "rgba(255, 175, 95, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      animationId = window.requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    animationId = window.requestAnimationFrame(draw);
    progressFrame = window.requestAnimationFrame(trackProgress);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.cancelAnimationFrame(progressFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateScrollProgress);
    };
  }, [isActive]);

  return (
    <main
      className={[
        "min-h-screen overflow-x-clip bg-[radial-gradient(1300px_700px_at_10%_-10%,rgba(180,120,40,0.14),transparent_60%),radial-gradient(1200px_700px_at_95%_110%,rgba(130,85,25,0.1),transparent_55%),#050507] text-[#f5f2ea]",
        className
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <section ref={sectionRef} className="relative h-[250vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.68)_100%)]" />
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
          <p className="mb-6 text-lg font-medium tracking-wide text-amber-100/82 sm:text-2xl">
          </p>
          <Link
            to="/dashboard"
            className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-amber-200/24 bg-amber-100/90 px-8 py-3 text-base font-semibold text-black shadow-[0_10px_22px_rgba(255,214,153,0.12)] transition duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-amber-100/50 hover:bg-amber-50 hover:shadow-[0_14px_28px_rgba(255,214,153,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
          >
            <span>{copy.ctaLabel || "참가 신청"}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </main>
  );
}

import NeuroHeroBackground from './NeuroHeroBackground';

export const cn = (...xs) => xs.filter(Boolean).join(' ');

export const SECTION_TITLE_REVEAL = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.35 },
  transition: { duration: 0.45, ease: 'easeOut' },
};

export const SECTION_COPY_REVEAL = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.35 },
  transition: { duration: 0.42, ease: 'easeOut', delay: 0.08 },
};

export function Container({ children, className }) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[1380px] px-5 sm:px-6 lg:px-8 xl:px-10',
        className
      )}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ eyebrow, title, desc, align = 'left' }) {
  const alignClass =
    align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start';

  return (
    <div className={cn('flex w-full flex-col gap-3', alignClass)}>
      {eyebrow ? (
        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#ff4854]">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="text-balance text-2xl font-semibold tracking-tight text-[#171717] sm:text-3xl">
        {title}
      </h2>
      {desc ? (
        <p className="text-pretty text-sm leading-6 text-[#57534e] sm:text-base">{desc}</p>
      ) : null}
    </div>
  );
}

export function GradientCard({ children, className, hoverGlow = true }) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-[#ece7e1] bg-white p-6 shadow-[0_18px_40px_rgba(34,24,18,0.05)]',
        className
      )}
    >
      <div
        className={cn(
          'pointer-events-none absolute -inset-20 blur-3xl transition-opacity duration-500',
          hoverGlow ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'
        )}
        style={{
          background:
            'radial-gradient(circle at 30% 20%, rgba(255,72,84,0.16), rgba(255,199,204,0.12) 40%, rgba(0,0,0,0) 70%)',
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

export function ShaderCard({
  children,
  className,
  innerClassName,
  minHeightClassName = 'min-h-[36rem]',
  outerPaddingClassName = 'p-4 sm:p-5',
  innerInsetClassName = 'inset-4 sm:inset-6',
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,#090b11_0%,#050608_100%)]',
        outerPaddingClassName,
        className
      )}
    >
      <div className="absolute inset-0 " aria-hidden="true">
        <NeuroHeroBackground randomStart />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,72,84,0.14),transparent_24%),radial-gradient(circle_at_78%_22%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_50%_78%,rgba(255,72,84,0.1),transparent_24%)]" />
      <div className={cn('relative', minHeightClassName)}>
        <div
          className={cn(
            'absolute overflow-hidden rounded-3xl border border-black/8 bg-white shadow-[0_24px_60px_rgba(37,56,138,0.24)]',
            innerInsetClassName,
            innerClassName
          )}
        >
          <div className="h-full bg-white">{children}</div>
        </div>
      </div>
    </div>
  );
}

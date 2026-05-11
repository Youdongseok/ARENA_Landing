import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { ARENA_LOGO, ARENA_TEXT, BRAND } from './LandingPage.constants';
import { Container } from './LandingPage.primitives';

export default function NavbarSection({ className = '' }) {
  const items = useMemo(
    () => [
      { label: 'RED Teaming', href: '#features' },
      { label: 'Judge Model', href: '#judge' },
      { label: '운영 방식', href: '#showcase' },
      { label: '대회', href: '#history' },
      { label: 'FAQ', href: '#faq' },
    ],
    []
  );

  return (
    <div
      className={`border-b border-[#ece7e1] bg-[rgba(255,255,255,0.88)] backdrop-blur supports-[backdrop-filter]:bg-[rgba(255,255,255,0.78)] ${className}`}
    >
      <Container className="flex h-16 items-center justify-between">
        <a href="#" className="inline-flex items-center gap-2">
          <img src={ARENA_LOGO} alt={BRAND} className="h-9 w-9" />
          <img src={ARENA_TEXT} alt={BRAND} className="h-[18px] w-auto" />
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {items.map(item => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-[#57534e] transition hover:text-[#171717]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
  to="/dashboard"
  className="group inline-flex items-center gap-2 rounded-xl border border-[#ece7e1] bg-white px-4 py-2 text-sm font-medium text-[#171717] shadow-[0_8px_20px_rgba(34,24,18,0.05)] transition duration-300 hover:-translate-y-0.5 hover:border-[#FF4854] hover:bg-[#FF4854] hover:text-white hover:shadow-[0_12px_28px_rgba(239,68,68,0.18)] focus:outline-none focus-visible:-translate-y-0.5 focus-visible:border-[#FF4854] focus-visible:bg-[#FF4854] focus-visible:text-white focus-visible:ring-2 focus-visible:ring-[#FF4854] focus-visible:ring-offset-2"
>
  ARENA 시작하기
  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1" />
</Link>
        </div>
      </Container>
    </div>
  );
}
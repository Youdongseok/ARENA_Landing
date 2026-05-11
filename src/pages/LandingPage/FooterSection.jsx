import c2LabLogo from '@/assets/images/C2Lab_logo.png';

import { Container } from './LandingPage.primitives';

export default function FooterSection() {
  return (
    <footer className="relative mt-10 overflow-hidden border-t border-white/10 bg-[#08090b] pb-10 pt-16 text-white sm:mt-14 sm:pb-12 sm:pt-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e2442f]/55 to-transparent"
      />
      <Container className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-5">
          <img src={c2LabLogo} alt="C2LAB" className="h-auto w-[180px] sm:w-[210px]" />

          <div className="space-y-1.5 text-[15px] leading-7 text-white">
            <div className="text-[17px] font-semibold">주식회사 씨투랩</div>
            <div>대표이사 정미심</div>
            <div>서울 구로구 디지털로31길 20 에이스테크노타워5차 3층 310호 (08380)</div>
            <div className="flex flex-wrap items-center gap-x-3">
              <span>
                이메일 <span className="text-[#ff7a66]">info@aictl.kr</span>
              </span>
              <span>|</span>
              <span>전화번호 070-4249-7022</span>
              <span>|</span>
              <span>FAX 02-2247-7001</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-white/80 sm:text-right">© 2026 C2LAB. All rights reserved.</div>
      </Container>
    </footer>
  );
}

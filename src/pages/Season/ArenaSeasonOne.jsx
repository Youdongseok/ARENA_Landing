import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ArenaSeasonOne() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-8 p-6">
      <section className="w-full max-w-[1240px] rounded-[24px] border border-[#E7ECF3] bg-white px-8 py-7 shadow-md">
        <p className="text-sm font-semibold tracking-[0.18em] text-[#FF4854]/80">ARENA SEASON</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0F172A]">
          ARENA 시즌 1
        </h1>
        <p className="mt-2 text-[15px] text-[#64748B]">
          새로운 시즌이 열릴 예정입니다. 문제 공개 전까지 시즌 안내와 준비 상태를 확인할 수
          있습니다.
        </p>
      </section>

      <section className="mx-auto w-full max-w-[1240px] rounded-[24px] border border-[#E7ECF3] bg-white px-6 py-5 shadow-md">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-700 uppercase tracking-[0.18em] text-[#FF7B84]">
              Challenge Summary
            </p>
            <h2 className="text-[26px] font-700 text-[#201A1B]">총 0문제</h2>
            <p className="text-[15px] leading-6 text-[#6B5E61]">
              아직 공개된 문제가 없고, 시즌이 열리면 이곳에서 바로 문제를 확인할 수 있어요.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-[#F6C8CD] bg-[#FFF6F7] px-3 py-1.5 text-sm font-600 text-[#D43C4D]">
              준비 중
            </span>
            <span className="rounded-full border border-[#EFE7E8] bg-[#FAF7F7] px-3 py-1.5 text-sm font-500 text-[#8B7D80]">
              공개 문제 없음
            </span>
          </div>
        </div>
      </section>

      <section className="w-full max-w-[1240px] rounded-[24px] border border-[#E7ECF3] bg-white px-8 py-10 shadow-md">
        <div className="rounded-[20px] border border-[#E7ECF3] bg-white p-8 text-center">
          <h2 className="text-[30px] font-semibold tracking-tight text-[#201A1B]">
            아직 공개된 문제가 없습니다
          </h2>
          <p className="mx-auto mt-3 max-w-[520px] text-[15px] leading-7 text-[#6B5E61]">
            ARENA 시즌 1 문제는 추후 순차적으로 추가될 예정입니다. 그 전까지는 튜토리얼이나 다른
            시즌 챌린지를 먼저 둘러볼 수 있어요.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/tutorial')}
              className="rounded-full bg-[#FF4854] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#f03b47]"
            >
              튜토리얼 보러가기
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="rounded-full border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FAFC]"
            >
              대시보드로 이동
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// src/pages/Leaderboard/components/UnifiedRankBoard.jsx

import React from 'react';
import { oxGradientMap } from '@/styles/oxGradientMap';
import { useSolveMatrix } from '@/hooks/useSolveMatrix';
import { useMatrixPublicSetting } from '@/hooks/useMatrixPublicSetting';

const stateMap = {
  true: 'success',
  false: 'pending',
};

export default function UnifiedRankBoard() {
  // 🔥 1) 공개 여부 조회
  const {
    data: publicSetting,
    isLoading: isSettingLoading,
    isError: isSettingError,
  } = useMatrixPublicSetting();

  // 🔥 2) Solve Matrix 조회
  const { data, isLoading, isError } = useSolveMatrix();

  // ============================
  //  A. 공개 여부 체크
  // ============================
  if (isSettingLoading) {
    return (
      <section className="w-full max-w-[1240px]">
        <div className="rounded-[24px] border border-[#E2E8F0] bg-white px-8 py-14 text-center shadow-md">
          <p className="text-[20px] text-[#64748B]">리더보드 활성화 여부 확인 중...</p>
        </div>
      </section>
    );
  }

  if (isSettingError || !publicSetting) {
    return (
      <section className="w-full max-w-[1240px]">
        <div className="rounded-[24px] border border-[#FECACA] bg-white px-8 py-14 text-center shadow-md">
          <p className="text-[20px] text-red-400">공개 여부 확인 실패</p>
        </div>
      </section>
    );
  }

  if (!publicSetting.enabled) {
    return (
      <section className="w-full max-w-[1240px]">
        <div className="rounded-[24px] border border-[#E2E8F0] bg-white px-8 py-14 text-center shadow-md">
          <p className="text-[22px] font-semibold text-[#94A3B8]">
            공용 리더보드가 현재 비공개 상태입니다.
          </p>
        </div>
      </section>
    );
  }

  // ============================
  //  B. 매트릭스 데이터 로딩
  // ============================
  if (isLoading) {
    return (
      <section className="w-full max-w-[1240px]">
        <div className="rounded-[24px] border border-[#E2E8F0] bg-white px-8 py-14 text-center shadow-md">
          <p className="text-[20px] text-[#64748B]">통합 랭크보드를 불러오는 중...</p>
        </div>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className="w-full max-w-[1240px]">
        <div className="rounded-[24px] border border-[#FECACA] bg-white px-8 py-14 text-center shadow-md">
          <p className="text-[20px] text-red-400">리더보드를 불러오지 못했습니다.</p>
        </div>
      </section>
    );
  }

  // ============================
  //  C. 정상 데이터 출력
  // ============================
  const { teams, problems, matrix } = data;

  const PROBLEM_COUNT = problems.length;
  const teamNames = teams.map(t => t.name);

  const results = matrix.map(row => row.map(state => stateMap[state] || 'pending'));

  return (
    <section className="w-full max-w-[1240px]">
      <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-8 shadow-md">
        <div className="mb-6">
          <p className="text-sm font-semibold tracking-[0.18em] text-[#FF4854]/80">SOLVE MATRIX</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0F172A]">
            통합 랭크보드
          </h2>
          <p className="mt-2 text-[15px] text-[#64748B]">
            문제별 해결 현황을 사용자 기준으로 빠르게 확인할 수 있습니다.
          </p>
        </div>

        <div className="overflow-x-auto pb-2">
          <div
            className="
              min-w-[980px]
              rounded-[24px]
              border border-[#E2E8F0]
              bg-[#FCFDFE]
              p-6
            "
          >
            <div
              className="grid gap-[6px]"
              style={{
                gridTemplateColumns: `180px repeat(${PROBLEM_COUNT}, minmax(28px, 1fr))`,
              }}
            >
              <div
                className="
                  text-[#FF4854] font-bold text-[18px]
                  flex items-center justify-center
                  bg-[#FFF5F5] border border-[#FED7D7]
                  rounded-[14px] h-[50px]
                "
              >
                문제번호
              </div>

              {problems.map((p, idx) => (
                <div
                  key={p.id}
                  className="
                    text-[#B45309] text-[14px] font-semibold
                    flex items-center justify-center
                    bg-white rounded-[10px] h-[50px]
                    border border-[#EDEFF3]
                  "
                >
                  {String(idx + 1).padStart(2, '0')}
                </div>
              ))}

              <div
                className="
                  text-[#FF4854] font-bold text-[18px]
                  flex items-center justify-center
                  bg-[#FFF5F5] border border-[#FED7D7]
                  rounded-[14px] h-[50px]
                "
              >
                배점
              </div>

              {problems.map(p => (
                <div
                  key={p.id}
                  className="
                    text-[#334155] text-[14px] font-semibold
                    flex items-center justify-center
                    bg-white rounded-[10px] h-[50px]
                    border border-[#EDEFF3]
                  "
                >
                  {p.score}
                </div>
              ))}

              {teamNames.map((team, tIdx) => (
                <React.Fragment key={`team-row-${tIdx}`}>
                  <div
                    className="
                      text-[#0F172A] text-[16px] font-semibold
                      h-[44px] flex items-center justify-center
                      bg-white border border-[#E2E8F0] rounded-[12px]
                    "
                  >
                    {team}
                  </div>

                  {results[tIdx].map((state, pIdx) => (
                    <div key={`dot-${tIdx}-${pIdx}`} className="flex items-center justify-center">
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          ...(oxGradientMap[state] || oxGradientMap.pending),
                          boxShadow: '0 4px 10px rgba(15,23,42,0.14)',
                        }}
                      />
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

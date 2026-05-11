import React from 'react';
import Skeleton from '../../components/Skeleton/Skeleton';
import { useSolveMatrixQuery } from '@/hooks/useSolveMatrixQuery';
import { oxGradientMap } from '@/styles/oxGradientMap';

const stateMap = {
  true: 'success',
  false: 'pending',
};

// 🔹 Skeleton
const ProblemStatusMatrixSkeleton = ({ rows = 12 }) => {
  return (
    <div className="w-full flex justify-center py-10">
      <div className="board-scale-wrapper">
        <div className="min-w-[1400px] max-w-[2000px] mx-auto rounded-[28px] border border-[#E7ECF3] bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <Skeleton className="mb-[6px] h-[50px] w-full bg-[#FDE2E4]" />
          <Skeleton className="mb-[6px] h-[50px] w-full bg-[#FFF1F2]" />
          {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} className="mb-[6px] h-[44px] w-full bg-[#F8FAFC]" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function ProblemStatusMatrix() {
  const { data, isLoading, error } = useSolveMatrixQuery('title');

  if (isLoading) return <ProblemStatusMatrixSkeleton />;
  if (error)
    return (
      <div className="text-red-400 text-center py-10 text-[20px]">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  //console.log('📌 Solve Matrix API data:', data);

  const { teams, problems, matrix } = data;

  const PROBLEM_COUNT = problems.length;
  const teamNames = teams.map(t => t.name);

  const results = matrix.map(row =>
    row.map(state => stateMap[String(state)] || state || 'pending')
  );

  return (
    <div className="w-full flex justify-center py-10 px-10 overflow-x-auto">
      <div className="board-scale-wrapper">
        <div
          className="
            min-w-[1400px] max-w-[2000px]
            mx-auto rounded-[28px] border border-[#E7ECF3]
            bg-white p-8
            shadow-[0_18px_60px_rgba(15,23,42,0.08)]
          "
        >
          <div
            className="grid gap-[6px]"
            style={{
              gridTemplateColumns: `200px repeat(${PROBLEM_COUNT}, minmax(28px, 1fr))`,
            }}
          >
            {/* 문제번호 */}
            <div
              className="
                h-[50px] rounded-[14px]
                flex items-center justify-center
                border border-[#F9D2D7] bg-[#FFF5F5]
                text-[20px] font-extrabold text-[#FF4854]
              "
            >
              문제번호
            </div>

            {problems.map((p, idx) => (
              <div
                key={p.id}
                className="
                  flex h-[50px] items-center justify-center rounded-[10px]
                  border border-[#F1F5F9] bg-[#F8FAFC]
                  text-[16px] font-bold text-[#475569]
                "
              >
                {String(idx + 1).padStart(2, '0')}
              </div>
            ))}

            <div
              className="
                min-h-[60px] rounded-[14px]
                flex items-center justify-center
                border border-[#F9D2D7] bg-[#FFF5F5]
                text-[20px] font-extrabold text-[#FF4854]
              "
            >
              문제 이름
            </div>

            {problems.map(p => (
              <div
                key={p.id}
                className="
                  flex items-center justify-center text-center
                  min-h-[60px] rounded-[10px]
                  border border-[#E7ECF3] bg-white px-2 py-2
                  whitespace-normal break-words
                  text-[14px] font-semibold text-[#334155]
                "
              >
                {p.title}
              </div>
            ))}

            {/* 팀 / 문제 dot */}
            {teamNames.map((team, tIdx) => {
              // 🔥 solved_count 백엔드 값 사용
              const solvedCount = teams[tIdx]?.solved_count ?? 0;

              return (
                <React.Fragment key={`team-row-${tIdx}`}>
                  <div
                    className="
                      h-[44px] flex items-center justify-between
                      rounded-[12px] border border-[#E7ECF3]
                      bg-[#F8FAFC] px-3
                      text-[17px] font-bold text-[#0F172A]
                    "
                  >
                    <span className="truncate">{team}</span>

                    {/* solved_count 표시 */}
                    <span className="rounded-full border border-[#BBF7D0] bg-[#F0FDF4] px-2 py-0.5 text-sm font-semibold text-[#16A34A]">
                      {solvedCount}
                    </span>
                  </div>

                  {results[tIdx].map((state, pIdx) => (
                    <div key={`dot-${tIdx}-${pIdx}`} className="flex justify-center items-center">
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          ...(oxGradientMap[state] || oxGradientMap.pending),
                        }}
                      />
                    </div>
                  ))}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

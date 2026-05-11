import React from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { useUserScoreSeriesTotal } from '@/hooks/useUserScoreSeriesTotal';

// 🎨 Y축 TickBox — 레드 테마
const YAxisTickBox = ({ x, y, payload }) => {
  if (payload.value === undefined || payload.value === null) return null;

  return (
    <foreignObject x={x - 150} y={y - 16} width={130} height={32}>
      <div
        style={{
          width: '120px',
          height: '32px',
          background: '#FFF1F2',
          border: '1px solid #FDA4AF',
          borderRadius: '7px',
          boxShadow: '0px 6px 16px rgba(15,23,42,0.06)',
          color: '#FF4854',
          fontFamily: 'Black Han Sans',
          fontWeight: 900,
          fontSize: '18px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {payload.value}
      </div>
    </foreignObject>
  );
};

export default function TotalLeaderboard() {
  const { data, enabled, isLoading, error } = useUserScoreSeriesTotal(10000);

  // ⭐ 404 → 비공개 상태 메시지 출력
  if (error?.response?.status === 404) {
    return (
      <section className="w-full max-w-[1240px]">
        <div className="rounded-[24px] border border-[#E2E8F0] bg-white px-8 py-14 text-center shadow-md">
          <p className="text-[22px] font-semibold text-[#94A3B8]">
            토탈 점수 차트는 현재 비공개 상태입니다.
          </p>
        </div>
      </section>
    );
  }

  // ❌ 기타 에러
  if (error) {
    return (
      <section className="w-full max-w-[1240px]">
        <div className="rounded-[24px] border border-[#FECACA] bg-white px-8 py-14 text-center shadow-md">
          <p className="text-xl font-medium text-red-400">데이터 로드 실패</p>
        </div>
      </section>
    );
  }

  // 공개 OFF
  if (enabled === false) {
    return (
      <section className="w-full max-w-[1240px]">
        <div className="rounded-[24px] border border-[#E2E8F0] bg-white px-8 py-14 text-center shadow-md">
          <p className="text-[22px] font-semibold text-[#94A3B8]">
            토탈 점수 차트는 현재 비공개 상태입니다.
          </p>
        </div>
      </section>
    );
  }

  // 로딩
  if (isLoading || !data || data.length === 0) {
    return (
      <section className="w-full max-w-[1240px]">
        <div className="rounded-[24px] border border-[#E2E8F0] bg-white px-8 py-14 text-center shadow-md">
          <p className="text-xl text-[#64748B]">점수 변화 차트를 불러오는 중...</p>
        </div>
      </section>
    );
  }

  // 팀 목록 추출 — 가장 최근 데이터 기준
  const last = data[data.length - 1];

  const allTeamNames = Object.keys(last).filter(key => key !== 'time');

  // 기존 "클래스" 팀 우선 정책은 유지하되, 매칭이 없으면 전체 팀을 표시
  const classTeamNames = allTeamNames.filter(team => team.startsWith('클래스'));
  const teamNames = classTeamNames.length > 0 ? classTeamNames : allTeamNames;

  // 최대값 계산
  const maxScore = Math.max(...data.flatMap(row => teamNames.map(team => Number(row[team]) || 0)));

  const yMax = Math.ceil((maxScore + 100) / 100) * 100;
  const yTicks = [];
  for (let v = yMax; v >= 0; v -= 100) yTicks.push(v);

  const formatFullTime = iso => new Date(iso).toLocaleString();

  // 색상 팔레트
  const colors = [
    '#FF0000', // 1 - Red
    '#FF7F00', // 2 - Orange
    '#FFFF00', // 3 - Yellow
    '#7FFF00', // 4 - Yellow-Green
    '#a76030ff', // 5 - Green
    '#00FF7F', // 6 - Spring Green
    '#00FFFF', // 7 - Cyan
    '#007FFF', // 8 - Azure
    '#0000FF', // 9 - Blue
    '#7F00FF', // 10 - Violet
    '#FF00FF', // 11 - Magenta
    '#FF007F', // 12 - Rose
    '#A52A2A', // 13 - Brown
    '#ac9200ff', // 14 - Gold
    '#757574ff', // 15 - Turquoise
    '#008080', // 16 - Teal
    '#800080', // 17 - Purple
    '#ffffff', // 18 - Crimson
    '#116291ff', // 19 - Dark Turquoise
    '#556B2F', // 20 - Olive Green
    '#8B4513', // 21 - Saddle Brown
  ];

  return (
    <section className="w-full max-w-[1240px]">
      <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-8 shadow-md">
        <div className="mb-6">
          <p className="text-sm font-semibold tracking-[0.18em] text-[#FF4854]/80">SCORE FLOW</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0F172A]">
            사용자 점수 변화 차트
          </h2>
          <p className="mt-2 text-[15px] text-[#64748B]">
            시간 흐름에 따라 점수가 어떻게 변했는지 한 번에 확인할 수 있습니다.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {teamNames.map((team, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-full border border-[#E2E8F0] bg-[#FCFDFE] px-4 py-2"
            >
              <div
                className="h-[8px] w-[56px] rounded-full"
                style={{ background: colors[i % colors.length] }}
              />
              <span className="text-sm font-medium text-[#0F172A]">{team}</span>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[920px]">
            <div className="h-[460px] rounded-[24px] border border-[#E2E8F0] bg-[#FCFDFE] p-5">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left: 160 }}>
                <CartesianGrid stroke="#CBD5E1" strokeOpacity={0.75} />
                <XAxis dataKey="time" tick={false} axisLine={false} />
                <YAxis
                  domain={[0, yMax]}
                  ticks={yTicks}
                  axisLine={false}
                  tickLine={false}
                  tick={<YAxisTickBox />}
                />

                <Tooltip
                  labelFormatter={formatFullTime}
                  contentStyle={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    color: '#0F172A',
                    boxShadow: '0 12px 28px rgba(15,23,42,0.12)',
                  }}
                />

                {teamNames.map((team, i) => (
                  <Line
                    key={team}
                    dataKey={team}
                    stroke={colors[i % colors.length]}
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

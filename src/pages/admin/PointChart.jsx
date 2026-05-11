import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useScoreSeriesQuery } from '@/hooks/useScoreSeriesQuery';
import Skeleton from '../../components/Skeleton/Skeleton';

const PointChartSkeleton = () => (
  <div className="w-full max-w-[1027px] h-[595px] p-6 bg-white/80 shadow-lg rounded-[10px] flex flex-col">
    <div className="flex-1 p-4 border border-gray-300 rounded-md flex items-center justify-center">
      <Skeleton className="w-full h-full" />
    </div>
    <div className="flex justify-between mt-4">
      {Array.from({ length: 10 }).map((_, idx) => (
        <Skeleton key={idx} className="h-3 w-8" />
      ))}
    </div>
  </div>
);

const PointChart = () => {
  const { data, isLoading, error } = useScoreSeriesQuery(5000); // 5초 폴링

  if (isLoading || !data || data.length === 0) return <PointChartSkeleton />;
  if (error) return <div className="text-red-500">데이터 로드 실패</div>;

  // 마지막 데이터 기준 팀 추출
  const latest = data[data.length - 1];
  const teamNames = Object.keys(latest).filter(k => k !== 'time');

  // ⭐ 0점 팀도 모두 보여줌
  const visibleTeams = teamNames;

  // 새로운 색상 팔레트
  const colors = [
    '#FF3B30',
    '#FF9500',
    '#FFCC00',
    '#4CD964',
    '#34C759',
    '#5AC8FA',
    '#007AFF',
    '#5856D6',
    '#AF52DE',
    '#FF2D55',
    '#FF6B6B',
    '#8E8E93',
  ];

  return (
    <div className="w-full max-w-[1027px] h-[595px] rounded-[10px] z-20 p-6 bg-white/80 shadow-lg">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[0, 'dataMax + 20']} />
          <Tooltip />
          <Legend />

          {visibleTeams.map((team, idx) => (
            <Line
              key={team}
              type="monotone"
              dataKey={team}
              stroke={colors[idx % colors.length]}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PointChart;

import React from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAdminToggleProblemActive } from '@/hooks/useAdminToggleProblemActive';
import { getAdminProblems } from '@/api/adminProblemsApi';
import ToggleSwitch from './ToggleSwitch';
import {
  ALL_FILTER_OPTION,
  getProblemMetaLabel,
  getSeasonLabelOptionsFromProblems,
  matchesSeasonLabelFilter,
} from '@/constants/problemMeta';

const AdminProblemToggleList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['adminProblems'],
    queryFn: getAdminProblems,
  });

  const toggleMutation = useAdminToggleProblemActive();
  const [seasonLabelFilter, setSeasonLabelFilter] = useState('all');
  const [keyword, setKeyword] = useState('');

  const handleFilterChange = e => {
    setSeasonLabelFilter(e.target.value);
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (!data) return <div>문제를 불러올 수 없습니다.</div>;

  const seasonOptions = [ALL_FILTER_OPTION, ...getSeasonLabelOptionsFromProblems(data)];
  const filteredProblems = data.filter(problem => {
    const matchesSeason = matchesSeasonLabelFilter(problem, seasonLabelFilter);
    const matchesKeyword =
      !keyword.trim() || problem.title?.toLowerCase().includes(keyword.trim().toLowerCase());

    return matchesSeason && matchesKeyword;
  });

  return (
    <div className="w-full flex flex-col gap-6 mt-10">
      <h1 className="heading-1 font-700 text-[#FF4854]">문제 활성/비활성 관리</h1>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <FilterSelect
            label="시즌 종류"
            name="seasonLabel"
            value={seasonLabelFilter}
            options={seasonOptions}
            onChange={handleFilterChange}
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#64748B]">문제 이름 검색</label>
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="문제 이름을 입력하세요"
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-[#0F172A] outline-none"
            />
          </div>
        </div>
      </div>

      {/*  3개씩 가로 배치되는 grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {filteredProblems.map(p => (
          <div
            key={p.id}
            className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col gap-2"
          >
            {/* 첫 줄: 제목 + 토글 */}
            <div className="flex items-center justify-between">
              <span className="heading-3 font-700">{p.title}</span>

              <ToggleSwitch enabled={p.is_active} onToggle={() => toggleMutation.mutate(p.id)} />
            </div>

            {/* 둘째 줄 */}
            <div className="body-small font-600 text-[#FF4854] pl-1">{getProblemMetaLabel(p)}</div>
            <div className="body-large font-500 text-gray-500 pl-1">
              ID: {p.id} · 상태: {p.is_active ? '활성화됨' : '비활성화됨'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProblemToggleList;

function FilterSelect({ label, name, value, options, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-[#64748B]">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-[#0F172A] outline-none"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

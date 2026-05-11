// src/pages/AdminProblems/AdminProblemManagementPage.jsx
import React, { useState } from 'react';
import { useAdminProblemsQuery } from '@/hooks/useAdminProblemsQuery';
import { useAdminToggleProblemActive } from '@/hooks/useAdminToggleProblemActive';
import ProblemEditModal from './ProblemEditModal';
import {
  ALL_FILTER_OPTION,
  getProblemMetaLabel,
  getSeasonLabelOptionsFromProblems,
  matchesSeasonLabelFilter,
} from '@/constants/problemMeta';

export default function AdminProblemManagementPage() {
  const { data, isLoading } = useAdminProblemsQuery();
  const toggle = useAdminToggleProblemActive();

  const [editingProblem, setEditingProblem] = useState(null);
  const [seasonLabelFilter, setSeasonLabelFilter] = useState('all');
  const [keyword, setKeyword] = useState('');

  const handleFilterChange = e => {
    setSeasonLabelFilter(e.target.value);
  };

  if (isLoading) return <div className="text-white">로딩 중...</div>;

  const seasonOptions = [ALL_FILTER_OPTION, ...getSeasonLabelOptionsFromProblems(data ?? [])];
  const filteredProblems = (data ?? []).filter(problem => {
    const matchesSeason = matchesSeasonLabelFilter(problem, seasonLabelFilter);
    const matchesKeyword =
      !keyword.trim() || problem.title?.toLowerCase().includes(keyword.trim().toLowerCase());

    return matchesSeason && matchesKeyword;
  });

  return (
    <div className="p-10 text-white max-w-[1200px] mx-auto">
      <h1 className="text-4xl font-bold text-[#FF4854] mb-8">문제 관리</h1>

      <div className="mb-8 rounded-xl border border-[#FF4854]/30 bg-[#0B021C]/60 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <FilterSelect
            label="시즌 종류"
            name="seasonLabel"
            value={seasonLabelFilter}
            options={seasonOptions}
            onChange={handleFilterChange}
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#FFB8BF]">문제 이름 검색</label>
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="문제 이름을 입력하세요"
              className="rounded-lg border border-[#FF4854]/30 bg-[#1A0B15]/70 px-4 py-2 text-white outline-none"
            />
          </div>
        </div>
      </div>

      {/* 문제 카드 리스트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
        {filteredProblems.map(p => (
          <div
            key={p.id}
            className="p-5 bg-[#0B021C]/70 border border-[#FF4854]/40 rounded-xl shadow-lg"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold">{p.title}</h2>

              <button
                onClick={() => toggle.mutate(p.id)}
                className={`px-3 py-1 text-sm rounded-lg  cursor-pointer ${
                  p.is_active ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                {p.is_active ? '활성' : '비활성'}
              </button>
            </div>

            <p className="mb-2 text-xs font-semibold tracking-[0.12em] text-[#FFB8BF]">
              {getProblemMetaLabel(p)}
            </p>
            <p className="text-gray-400 text-sm mb-4">{p.description?.slice(0, 80)}...</p>

            <button
              onClick={() => setEditingProblem(p)}
              className="w-full py-2 rounded-lg bg-[#FF4854] hover:bg-[#e13a47] transition cursor-pointer"
            >
              수정 / 삭제
            </button>
          </div>
        ))}
      </div>

      {editingProblem && (
        <ProblemEditModal problem={editingProblem} onClose={() => setEditingProblem(null)} />
      )}
    </div>
  );
}

function FilterSelect({ label, name, value, options, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-[#FFB8BF]">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="rounded-lg border border-[#FF4854]/30 bg-[#1A0B15]/70 px-4 py-2 text-white outline-none"
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

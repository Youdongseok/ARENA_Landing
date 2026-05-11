import React, { useState } from 'react';
import { useCreateProblem } from '@/hooks/useCreateProblem';
import { DEFAULT_SEASON_LABEL_OPTIONS } from '@/constants/problemMeta';

export default function AdminProblemCreatePage() {
  const { mutateAsync: createProblem, isPending } = useCreateProblem();

  const [form, setForm] = useState({
    competition_id: 1,
    season_id: 2025,
    stage_id: 2,
    season_label: '',
    title: '',
    category: '',
    problem_code: '',
    score: 0,
    sub_title: '',
    description: '',
    sub_description: '',
    goal: '',
    success_criteria: '',
    failure_criteria: '',
    is_active: false,
    model_name: '',
    system_prompt: '',
    temperature: 0,
    chat_endpoint_id: 0,
  });

  const handleChange = e => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await createProblem(form);
      alert('문제가 성공적으로 생성되었습니다!');
    } catch (err) {
      alert('문제 생성 실패');
      console.error(err);
    }
  };

  return (
    <div className="p-10 w-full flex justify-center">
      <div
        className="
          w-full max-w-4xl 
          bg-[#0B021C]/70 p-10 
          rounded-[20px] 
          border border-[#FF4854]/40 
          shadow-[0_0_30px_rgba(255,72,84,0.4)] 
          text-white
        "
      >
        <h1 className="text-3xl font-bold mb-8 text-[#FF4854]">문제 생성</h1>

        {/* ────────────────────── */}
        {/* 기본 정보 */}
        {/* ────────────────────── */}
        <Section title="기본 정보">
          <Input
            label="시즌 종류"
            name="season_label"
            value={form.season_label}
            onChange={handleChange}
            helperText={`예: ${DEFAULT_SEASON_LABEL_OPTIONS.join(', ')}`}
          />
          <Input label="문제 제목" name="title" value={form.title} onChange={handleChange} />
          <Input label="카테고리" name="category" value={form.category} onChange={handleChange} />
          <Input
            label="문제 코드"
            name="problem_code"
            value={form.problem_code}
            onChange={handleChange}
          />
          <Input
            label="배점"
            name="score"
            type="number"
            value={form.score}
            onChange={handleChange}
          />
          <Input label="부 제목" name="sub_title" value={form.sub_title} onChange={handleChange} />
        </Section>

        {/* ────────────────────── */}
        {/* 문제 설명 */}
        {/* ────────────────────── */}
        <Section title="문제 설명">
          <TextArea
            label="문제 설명"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
          <TextArea
            label="부 설명"
            name="sub_description"
            value={form.sub_description}
            onChange={handleChange}
          />
        </Section>

        {/* ────────────────────── */}
        {/* 목표 및 기준 */}
        {/* ────────────────────── */}
        <Section title="목표 및 기준">
          <TextArea label="목표" name="goal" value={form.goal} onChange={handleChange} />
          <TextArea
            label="성공 기준"
            name="success_criteria"
            value={form.success_criteria}
            onChange={handleChange}
          />
          <TextArea
            label="실패 기준"
            name="failure_criteria"
            value={form.failure_criteria}
            onChange={handleChange}
          />
        </Section>

        {/* ────────────────────── */}
        {/* 모델 설정 */}
        {/* ────────────────────── */}
        <Section title="모델 설정">
          <Input label="모델명" name="model_name" value={form.model_name} onChange={handleChange} />
          <Input
            label="Temperature"
            type="number"
            name="temperature"
            value={form.temperature}
            onChange={handleChange}
          />
          <Input
            label="Chat Endpoint ID"
            type="number"
            name="chat_endpoint_id"
            value={form.chat_endpoint_id}
            onChange={handleChange}
          />
          <TextArea
            label="시스템 프롬프트"
            name="system_prompt"
            value={form.system_prompt}
            onChange={handleChange}
            className="h-32"
          />
        </Section>

        {/* ────────────────────── */}
        {/* 제출 버튼 */}
        {/* ────────────────────── */}
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="mt-8 w-full py-4 bg-[#FF4854] rounded-[12px] text-2xl font-bold hover:bg-[#ff6075] transition"
        >
          {isPending ? '생성 중...' : '문제 생성하기'}
        </button>
      </div>
    </div>
  );
}

/* -----------------------------------
   재사용 섹션 / Input / TextArea
------------------------------------ */

function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4 text-[#FF4854]">{title}</h2>
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  );
}

function Input({ label, name, value, onChange, type = 'text', helperText = '' }) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="
          bg-[#1A0B15]/60 
          border border-[#FF4854]/30 
          rounded-lg px-4 py-2 
          focus:border-[#FF4854] 
          outline-none transition
        "
      />
      {helperText ? <span className="mt-2 text-xs text-white/50">{helperText}</span> : null}
    </div>
  );
}

function TextArea({ label, name, value, onChange, className = '' }) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold mb-1">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className={`
          bg-[#1A0B15]/60 
          border border-[#FF4854]/30 
          rounded-lg px-4 py-3 
          focus:border-[#FF4854] 
          outline-none transition 
          ${className}
        `}
      ></textarea>
    </div>
  );
}

// src/pages/AdminProblems/ProblemEditModal.jsx
import React, { useState } from 'react';
import { useAdminProblemActions } from '@/hooks/useAdminProblemActions';
import { DEFAULT_SEASON_LABEL_OPTIONS } from '@/constants/problemMeta';

export default function ProblemEditModal({ problem, onClose }) {
  const { updateProblem, deleteProblem, isUpdating, isDeleting } = useAdminProblemActions();

  const [form, setForm] = useState(problem);

  const handleChange = e => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleUpdate = async () => {
    await updateProblem({ id: problem.id, payload: form });
    alert('문제가 수정되었습니다!');
    onClose();
  };

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    await deleteProblem(problem.id);
    alert('문제가 삭제되었습니다!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="w-[700px] max-h-[90vh] overflow-y-auto bg-[#0B021C] text-white p-8 rounded-xl border border-[#FF4854] shadow-xl">
        <h2 className="text-2xl font-bold text-[#FF4854] mb-6">문제 수정 / 삭제</h2>

        {/*  기본 정보  */}
        <SectionTitle title="기본 정보" />

        <Input
          label="시즌 종류"
          name="season_label"
          value={form.season_label ?? ''}
          onChange={handleChange}
          helperText={`예: ${DEFAULT_SEASON_LABEL_OPTIONS.join(', ')}`}
        />

        <Input label="문제 제목" name="title" value={form.title} onChange={handleChange} />
        <Input label="부 제목" name="sub_title" value={form.sub_title} onChange={handleChange} />
        <Input label="카테고리" name="category" value={form.category} onChange={handleChange} />
        <Input
          label="문제 코드"
          name="problem_code"
          value={form.problem_code}
          onChange={handleChange}
        />

        <Input type="number" label="배점" name="score" value={form.score} onChange={handleChange} />

        {/*  설명 정보  */}
        <SectionTitle title="설명" />

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

        {/*  목표 및 기준  */}
        <SectionTitle title="목표 및 기준" />

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

        {/*  모델 설정  */}
        <SectionTitle title="모델 설정" />

        <Input label="모델명" name="model_name" value={form.model_name} onChange={handleChange} />
        <Input
          label="Temperature"
          type="number"
          name="temperature"
          value={form.temperature}
          onChange={handleChange}
        />

        <TextArea
          label="시스템 프롬프트"
          name="system_prompt"
          value={form.system_prompt}
          onChange={handleChange}
          className="h-32"
        />

        <Input
          label="Chat Endpoint ID"
          type="number"
          name="chat_endpoint_id"
          value={form.chat_endpoint_id}
          onChange={handleChange}
        />

        {/* is_active 토글 */}
        <div className="mt-4 mb-6">
          <label className="font-semibold mr-3">활성 여부</label>
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={() => setForm(prev => ({ ...prev, is_active: !prev.is_active }))}
          />
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-between gap-3 mt-8">
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="flex-1 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition text-lg font-bold cursor-pointer"
          >
            {isUpdating ? '저장 중...' : '수정하기'}
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition text-lg font-bold cursor-pointer"
          >
            {isDeleting ? '삭제 중...' : '삭제하기'}
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-gray-500 hover:bg-gray-700 rounded-lg cursor-pointer"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

/*  공용 UI 컴포넌트  */

function SectionTitle({ title }) {
  return <h3 className="text-xl font-bold text-[#FF4854] mt-6 mb-3">{title}</h3>;
}

function Input({ label, name, value, onChange, type = 'text', helperText = '' }) {
  return (
    <div className="flex flex-col mb-4">
      <label className="font-semibold mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="
          bg-[#1A0B15]/60 border border-[#FF4854]/30 rounded-lg 
          px-4 py-2 focus:border-[#FF4854] outline-none transition
        "
      />
      {helperText ? <span className="mt-2 text-xs text-white/50">{helperText}</span> : null}
    </div>
  );
}

function TextArea({ label, name, value, onChange, className = '' }) {
  return (
    <div className="flex flex-col mb-4">
      <label className="font-semibold mb-1">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className={`
          bg-[#1A0B15]/60 border border-[#FF4854]/30 rounded-lg 
          px-4 py-3 focus:border-[#FF4854] outline-none transition 
          ${className}
        `}
      />
    </div>
  );
}

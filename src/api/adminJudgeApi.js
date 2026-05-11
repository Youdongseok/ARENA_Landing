// src/api/adminJudgeApi.js
import api from './axiosInstance';

// Judge 프롬프트 조회
export const fetchJudgePrompt = async problemId => {
  const res = await api.get(`/admin/judgements/${problemId}`);
  return res.data;
};

// Judge 프롬프트 수정
export const updateJudgePrompt = async (problemId, prompt) => {
  const res = await api.put(`/admin/judgements/${problemId}`, {
    judge_system_prompt: prompt,
  });
  return res.data;
};

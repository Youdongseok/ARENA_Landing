// src/api/solveMatrix.js
import api from './axiosInstance';

export const getSolveMatrix = async () => {
  const res = await api.get('/common/solve-matrix');
  return res.data;
};

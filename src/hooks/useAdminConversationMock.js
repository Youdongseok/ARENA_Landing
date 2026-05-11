// src/hooks/useAdminConversationMock.js
import { useState } from 'react';

export function useMockAdminData() {
  const [users] = useState([
    { id: 1, username: 'Team Alpha' },
    { id: 2, username: 'Team Bravo' },
    { id: 3, username: 'Team Charlie' },
  ]);

  const [problems] = useState([
    { id: 101, userId: 1, title: 'SQL Injection' },
    { id: 102, userId: 1, title: 'XSS Challenge' },
    { id: 201, userId: 2, title: 'Reverse Engineering' },
    { id: 202, userId: 2, title: 'Buffer Overflow' },
    { id: 301, userId: 3, title: 'Secure Coding' },
  ]);

  // ⭐ 판정은 message가 아니라 session이 가짐!
  const [sessions, setSessions] = useState([
    { id: 1, problemId: 101, judge: 'pending' },
    { id: 2, problemId: 101, judge: 'success' },
    { id: 3, problemId: 102, judge: 'fail' },
    { id: 4, problemId: 201, judge: 'pending' },
    { id: 5, problemId: 202, judge: 'pending' },
  ]);

  const [messages] = useState([
    { id: 1, sessionId: 1, role: 'user', content: 'SQL 인젝션은 WHERE 구문을 바꾸는건가요?' },
    { id: 2, sessionId: 1, role: 'assistant', content: '쿼리 구조를 먼저 이해해보세요.' },
    { id: 3, sessionId: 1, role: 'user', content: '힌트 좀 주세요!' },
    { id: 4, sessionId: 1, role: 'assistant', content: '분석 툴을 사용해보세요.' },
  ]);

  const getProblems = userId => problems.filter(p => p.userId === userId);
  const getSessions = problemId => sessions.filter(s => s.problemId === problemId);
  const getMessages = sessionId => messages.filter(m => m.sessionId === sessionId);

  // ⭐ 세션 전체 판정 업데이트
  const updateSessionJudge = (sessionId, newStatus) => {
    setSessions(prev => prev.map(s => (s.id === sessionId ? { ...s, judge: newStatus } : s)));
  };

  return {
    users,
    getProblems,
    getSessions,
    getMessages,
    updateSessionJudge,
  };
}

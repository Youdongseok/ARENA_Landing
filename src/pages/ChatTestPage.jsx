import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createSession, getSessionMessages, sendMessage } from '@/api/chatApi';

export default function ChatTestPage() {
  const [teamId] = useState(1);
  const [problemId] = useState(1);
  const [sessionTitle, setSessionTitle] = useState('테스트 세션');
  const [sessionId, setSessionId] = useState(null);
  const [message, setMessage] = useState('');

  // 1️⃣ 세션 생성
  const createSessionMutation = useMutation({
    mutationFn: () => createSession({ teamId, problemId, title: sessionTitle }),
  });

  // 2️⃣ 세션 메시지 조회
  const messagesQuery = useQuery({
    queryKey: ['sessionMessages', sessionId],
    queryFn: () => getSessionMessages({ sessionId, teamId, problemId }),
    enabled: !!sessionId,
    refetchOnWindowFocus: false,
  });

  // 3️⃣ 메시지 전송
  const sendMessageMutation = useMutation({
    mutationFn: () => sendMessage({ sessionId, teamId, problemId, content: message }),
  });

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Chat API 테스트 페이지</h1>

      {/* 세션 생성 */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="세션 제목"
          value={sessionTitle}
          onChange={e => setSessionTitle(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={() =>
            createSessionMutation.mutate(undefined, {
              onSuccess: data => setSessionId(data.id),
              onError: err => console.error('세션 생성 실패', err),
            })
          }
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          세션 생성
        </button>
        {sessionId && <p className="mt-2">현재 세션 ID: {sessionId}</p>}
      </div>

      {/* 메시지 전송 */}
      {sessionId && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="보낼 메시지"
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="border p-2 mr-2"
          />
          <button
            onClick={() =>
              sendMessageMutation.mutate(undefined, {
                onSuccess: () => {
                  setMessage('');
                  messagesQuery.refetch();
                },
                onError: err => console.error('메시지 전송 실패', err),
              })
            }
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            전송
          </button>
        </div>
      )}

      {/* 메시지 조회 */}
      {sessionId && (
        <div>
          <h2 className="font-semibold mb-2">메시지 목록</h2>
          <button
            onClick={() => messagesQuery.refetch()}
            className="bg-gray-300 px-3 py-1 rounded mb-2"
          >
            새로고침
          </button>
          <div className="border p-2 h-64 overflow-auto">
            {messagesQuery.data ? (
              <pre>{JSON.stringify(messagesQuery.data, null, 2)}</pre>
            ) : (
              <p>메시지 없음</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

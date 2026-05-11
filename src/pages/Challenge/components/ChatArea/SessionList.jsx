import React from 'react';

function SessionCard({ session, isActive, onClick }) {
  return (
    <div
      onClick={() => onClick(session.id)}
      className={`p-3 rounded-lg cursor-pointer border ${
        isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
      } mb-2`}
    >
      <p className="font-bold">{session.title}</p>
      <p className="text-sm text-gray-500">{new Date(session.created_at).toLocaleString()}</p>
    </div>
  );
}

export default function SessionList({ sessions = [], sessionId, onSessionClick }) {
  if (!Array.isArray(sessions) || sessions.length === 0) return null;

  return (
    <div className="p-4 flex flex-col max-h-[200px] overflow-y-auto">
      {sessions.map(s => (
        <SessionCard
          key={s.id}
          session={s}
          isActive={s.id === sessionId}
          onClick={onSessionClick}
        />
      ))}
    </div>
  );
}

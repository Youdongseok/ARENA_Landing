// src/components/TeamInfoSection/TeamInfoSection.jsx
import React from 'react';
import TeamInfoCard from './TeamInfoCard';

export default function TeamInfoSection({ isLoading = false, solvedCount = 0, totalScore = 0 }) {
  return (
    <div className="flex justify-center w-full max-w-[1240px] mx-auto">
      <TeamInfoCard
        title="해결한 챌린지"
        value={solvedCount}
        iconType="ai"
        valueColor="#0EA5E9"
        cardStyle={{ marginRight: '40px' }}
        isLoading={isLoading}
      />
      <TeamInfoCard
        title="획득 점수"
        value={totalScore}
        iconType="coin"
        valueColor="#FF93AC"
        isLoading={isLoading}
      />
    </div>
  );
}

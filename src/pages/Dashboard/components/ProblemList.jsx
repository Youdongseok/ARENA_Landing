// src/components/ProblemList/ProblemList.jsx
import React from 'react';
import ProblemItem from './ProblemItem';

export default function ProblemList({ isLoading = false, problems = [] }) {
  const SKELETON_COUNT = 20;
  const itemsToRender = isLoading ? [...Array(SKELETON_COUNT)] : problems;

  return (
    <div
      className="rounded-[10px] overflow-hidden mx-auto"
      style={{
        maxWidth: '1060px',
        backgroundColor: 'rgba(255,255,255,0.8)',
        boxShadow: '0 4px 4px rgba(0,0,0,0.25)',
      }}
    >
      <div
        className="flex flex-wrap justify-center"
        style={{
          padding: '29px 23px',
          columnGap: '15px',
          rowGap: '10px',
        }}
      >
        {itemsToRender.map((problem, index) => (
          <ProblemItem
            key={isLoading ? `skeleton-${index}` : problem.title}
            problem={
              isLoading
                ? {}
                : {
                    id: index + 1,
                    title: problem.title,
                    status: problem.solved ? 'SUCCESS' : 'UNSUBMITTED',
                    result: problem.solved ? 'SOLVED!' : '',
                  }
            }
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
}

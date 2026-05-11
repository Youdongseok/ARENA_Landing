export const DEFAULT_SEASON_LABEL_OPTIONS = [
  '2025 LLM SAFETY CHALLENGE 예선',
  '2025 LLM SAFETY CHALLENGE 본선',
  'ARENA 시즌 1',
];

export const ALL_FILTER_OPTION = { value: 'all', label: '전체' };

export function getSeasonLabelOptionsFromProblems(problems = []) {
  const labels = new Set(DEFAULT_SEASON_LABEL_OPTIONS);

  problems.forEach(problem => {
    if (problem?.season_label) {
      labels.add(problem.season_label);
    }
  });

  return Array.from(labels).map(label => ({ value: label, label }));
}

export function matchesSeasonLabelFilter(problem, seasonLabel) {
  return seasonLabel === 'all' || (problem?.season_label ?? '') === seasonLabel;
}

export function getProblemMetaLabel(problem) {
  if (problem?.season_label) return problem.season_label;
  return '시즌 미지정';
}

// src/data/leaderboardData.js (업데이트됨: 팀 이름이 알파벳으로 변경)

/**
 * 리더보드 순위표 데이터 (10개 팀: TEAM A ~ TEAM J)
 * 랭크와 현재 점수는 유지하되, 팀 이름과 관련된 키가 모두 알파벳으로 변경됩니다.
 */
export const LEADERBOARD_DATA = [
  { rank: 1, team: 'TEAM A', score: 320, solved: 27, color: '#FFBA57', isTop3: true },
  { rank: 2, team: 'TEAM B', score: 300, solved: 25, color: '#9E9E9E', isTop3: true },
  { rank: 3, team: 'TEAM C', score: 295, solved: 25, color: '#CE7430', isTop3: true },
  { rank: 4, team: 'TEAM D', score: 280, solved: 26, color: '#010101', isTop3: false },
  { rank: 5, team: 'TEAM E', score: 270, solved: 20, color: '#010101', isTop3: false },
  { rank: 6, team: 'TEAM F', score: 265, solved: 17, color: '#010101', isTop3: false },
  { rank: 7, team: 'TEAM G', score: 250, solved: 15, color: '#010101', isTop3: false },
  { rank: 8, team: 'TEAM H', score: 240, solved: 14, color: '#010101', isTop3: false },
  { rank: 9, team: 'TEAM I', score: 230, solved: 12, color: '#010101', isTop3: false },
  { rank: 10, team: 'TEAM J', score: 220, solved: 10, color: '#010101', isTop3: false },
];

/**
 * 시간대별 10개 팀의 점수 변화 시계열 데이터
 * 키가 TEAM_1, TEAM_2 대신 TEAM_A, TEAM_B 등으로 변경됩니다.
 */
export const CHART_TIME_SERIES_DATA = [
  {
    time: '00:00',
    TEAM_A: 0,
    TEAM_B: 0,
    TEAM_C: 0,
    TEAM_D: 0,
    TEAM_E: 0,
    TEAM_F: 0,
    TEAM_G: 0,
    TEAM_H: 0,
    TEAM_I: 0,
    TEAM_J: 0,
  },
  {
    time: '01:00',
    TEAM_A: 50,
    TEAM_B: 30,
    TEAM_C: 40,
    TEAM_D: 20,
    TEAM_E: 10,
    TEAM_F: 15,
    TEAM_G: 5,
    TEAM_H: 25,
    TEAM_I: 18,
    TEAM_J: 12,
  },
  {
    time: '02:00',
    TEAM_A: 150,
    TEAM_B: 120,
    TEAM_C: 110,
    TEAM_D: 80,
    TEAM_E: 60,
    TEAM_F: 70,
    TEAM_G: 40,
    TEAM_H: 90,
    TEAM_I: 55,
    TEAM_J: 30,
  },
  {
    time: '03:00',
    TEAM_A: 250,
    TEAM_B: 210,
    TEAM_C: 200,
    TEAM_D: 180,
    TEAM_E: 170,
    TEAM_F: 150,
    TEAM_G: 120,
    TEAM_H: 190,
    TEAM_I: 140,
    TEAM_J: 100,
  },
  {
    time: '04:00',
    TEAM_A: 320,
    TEAM_B: 300,
    TEAM_C: 295,
    TEAM_D: 280,
    TEAM_E: 270,
    TEAM_F: 265,
    TEAM_G: 250,
    TEAM_H: 240,
    TEAM_I: 230,
    TEAM_J: 220,
  },
];

/**
 * 차트의 선 색상 매핑
 * 키가 TEAM_1, TEAM_2 대신 TEAM_A, TEAM_B 등으로 변경됩니다.
 */
export const TEAM_COLORS = {
  TEAM_A: '#FFBA57', // Gold
  TEAM_B: '#9E9E9E', // Silver
  TEAM_C: '#CE7430', // Bronze
  TEAM_D: '#4CAF50', // Green
  TEAM_E: '#2196F3', // Blue
  TEAM_F: '#FF9800', // Orange
  TEAM_G: '#9C27B0', // Purple
  TEAM_H: '#00BCD4', // Cyan
  TEAM_I: '#E91E63', // Pink
  TEAM_J: '#607D8B', // Gray-blue
};

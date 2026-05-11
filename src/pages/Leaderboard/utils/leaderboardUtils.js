const compareLeaderboardRows = (a, b) => {
  if (b.score !== a.score) return b.score - a.score;
  return new Date(a.last_solved_at) - new Date(b.last_solved_at);
};

export const getScopedLeaderboardRows = rows => {
  const allRows = Array.isArray(rows) ? rows : [];
  const classRows = allRows.filter(row => row.teamname?.startsWith('클래스'));
  const sourceRows = classRows.length > 0 ? classRows : allRows;

  return [...sourceRows]
    .sort(compareLeaderboardRows)
    .map((row, index) => ({
      ...row,
      displayedRank: index + 1,
    }));
};

export const getMyLeaderboardStats = ({ rows, teamId, teamName }) => {
  const scopedRows = getScopedLeaderboardRows(rows);
  const myIndex = scopedRows.findIndex(
    row => row.teamname === teamName || String(row.team_id) === String(teamId)
  );

  if (myIndex < 0) {
    return {
      rank: null,
      total: scopedRows.length,
      topPercent: null,
    };
  }

  const rank = myIndex + 1;
  const total = scopedRows.length;
  const topPercent = total > 0 ? Math.max(1, Math.ceil((rank / total) * 100)) : null;

  return {
    rank,
    total,
    topPercent,
  };
};

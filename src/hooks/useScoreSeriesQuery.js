// src/hooks/useScoreSeriesQuery.js
import { useEffect, useState } from 'react';
import { fetchScoreSeriesTotal } from '@/api/leaderboardApi';

export function useScoreSeriesQuery(interval = 5000) {
  const [seriesData, setSeriesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ⭐ 대회 시작 (KST)
  const START = '2025-12-03T09:00:00+09:00';
  // ⭐ 대회 종료 (KST 17:30)
  const END = '2025-12-03T17:30:00+09:00';

  const load = async () => {
    try {
      const res = await fetchScoreSeriesTotal({
        start: START,
        end: END, // ⭐ 추가!
      });

      const sorted = res.sort((a, b) => new Date(a.time) - new Date(b.time));

      setSeriesData(sorted);
      setIsLoading(false);
    } catch (err) {
      console.error('score-series load error:', err);
      setError(err);
    }
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, interval);
    return () => clearInterval(timer);
  }, [interval]);

  return { data: seriesData, isLoading, error };
}

import { useEffect, useState } from 'react';
import { fetchUserScoreSeriesTotal, fetchUserTotalGraphSetting } from '@/api/userTotalGraphApi';

export function useUserScoreSeriesTotal(interval = 10000) {
  const [seriesData, setSeriesData] = useState([]);
  const [enabled, setEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ⭐ KST 대회 시작 09:00
  const START = '2025-12-10T11:30:00+09:00';
  // ⭐ 대회 종료 17:30
  // const END = "2025-12-03T17:30:00+09:00";

  const load = async () => {
    try {
      const setting = await fetchUserTotalGraphSetting();
      setEnabled(setting.enabled);

      if (!setting.enabled) {
        setSeriesData([]);
        setIsLoading(false);
        return;
      }

      let res = await fetchUserScoreSeriesTotal({
        start: START,
        // end: END,
      });

      res = res.sort((a, b) => new Date(a.time) - new Date(b.time));

      setSeriesData(res);
      setIsLoading(false);
    } catch (err) {
      console.error('user score-series error:', err);
      setError(err);
    }
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, interval);
    return () => clearInterval(timer);
  }, [interval]);

  return { data: seriesData, enabled, isLoading, error };
}

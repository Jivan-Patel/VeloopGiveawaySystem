import { useState, useEffect, useCallback, useMemo } from 'react';
import giveawayApi from '../services/giveawayApi';
import { GIVEAWAY_STATUS } from '../config/giveawayStatus';

/**
 * Custom hook to load and manage active giveaways, campaign stats, and server time.
 */
export function useGiveaways() {
  const [giveaways, setGiveaways] = useState([]);
  const [stats, setStats] = useState(null);
  const [serverTime, setServerTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGiveaways = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await giveawayApi.getCurrentGiveaways();
      if (res.data) {
        setGiveaways(res.data.giveaways || []);
        setStats(res.data.stats || null);
        setServerTime(res.data.serverTime || new Date().toISOString());
      }
    } catch (err) {
      console.error('[useGiveaways] Fetch failed:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGiveaways();
  }, [fetchGiveaways]);

  // Derived categorized lists
  const activeGiveaways = useMemo(
    () => giveaways.filter((g) => g.status === GIVEAWAY_STATUS.ACTIVE),
    [giveaways]
  );

  const upcomingGiveaways = useMemo(
    () => giveaways.filter((g) => g.status === GIVEAWAY_STATUS.UPCOMING),
    [giveaways]
  );

  const endedGiveaways = useMemo(
    () => giveaways.filter((g) => g.status === GIVEAWAY_STATUS.ENDED || g.status === GIVEAWAY_STATUS.ARCHIVED),
    [giveaways]
  );

  return {
    giveaways,
    activeGiveaways,
    upcomingGiveaways,
    endedGiveaways,
    stats,
    serverTime,
    loading,
    error,
    refetch: fetchGiveaways
  };
}

export default useGiveaways;

import { useState, useEffect } from 'react';
import giveawayApi from '../services/giveawayApi';
import { GIVEAWAY_STATUS } from '../config/giveawayStatus';

/**
 * Loads giveaways, platform summary stats, and server time.
 * Pure React hook with zero complex memoization (useMemo/useCallback eliminated).
 */
export function useGiveaways() {
  const [giveaways, setGiveaways] = useState([]);
  const [stats, setStats] = useState(null);
  const [serverTime, setServerTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadGiveaways() {
      try {
        const res = await giveawayApi.getCurrentGiveaways();
        if (!ignore && res.data) {
          setGiveaways(res.data.giveaways || []);
          setStats(res.data.stats || null);
          setServerTime(res.data.serverTime || new Date().toISOString());
        }
      } catch (err) {
        if (!ignore) {
          console.error('[useGiveaways] Fetch failed:', err);
          setError(err);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadGiveaways();

    return () => {
      ignore = true;
    };
  }, [refreshTrigger]);

  // Simple direct filter getters without redundant useMemo hooks
  const activeGiveaways = giveaways.filter((g) => g.status === GIVEAWAY_STATUS.ACTIVE);
  const upcomingGiveaways = giveaways.filter((g) => g.status === GIVEAWAY_STATUS.UPCOMING);
  const endedGiveaways = giveaways.filter(
    (g) => g.status === GIVEAWAY_STATUS.ENDED || g.status === GIVEAWAY_STATUS.ARCHIVED
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
    refetch: () => {
      setLoading(true);
      setError(null);
      setRefreshTrigger((prev) => prev + 1);
    }
  };
}

export default useGiveaways;

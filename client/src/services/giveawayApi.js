/**
 * VELOOP Giveaway System - Unified API Service
 * Dispatches calls to liveAdapter or mockAdapter based on VITE_API_MODE.
 * Live mode NEVER falls back to mock data per brief Section 119.
 */

import { mockAdapter } from './mockAdapter';
import { liveAdapter } from './liveAdapter';

const isLiveMode = import.meta.env.VITE_API_MODE === 'live';

if (isLiveMode) {
  console.log('[giveawayApi] Operating in LIVE API mode. Connected to:', import.meta.env.VITE_API_URL);
} else {
  console.log('[giveawayApi] Operating in MOCK API mode with simulated latency.');
}

const activeAdapter = isLiveMode ? liveAdapter : mockAdapter;

export const giveawayApi = {
  getCurrentGiveaways: () => activeAdapter.getCurrentGiveaways(),
  getPreviousGiveaways: (page, limit) => activeAdapter.getPreviousGiveaways(page, limit),
  getPreviousWinners: (limit) => activeAdapter.getPreviousWinners(limit),
  getGiveawayBySlug: (slug) => activeAdapter.getGiveawayBySlug(slug),
  getGiveawayWinners: (id) => activeAdapter.getGiveawayWinners(id),
  getMyStatus: (id) => activeAdapter.getMyStatus(id),
  joinGiveaway: (id, headers) => activeAdapter.joinGiveaway(id, headers),
  claimPrize: (id, claimData) => activeAdapter.claimPrize(id, claimData),
  getAuthUser: () => activeAdapter.getAuthUser()
};

export default giveawayApi;

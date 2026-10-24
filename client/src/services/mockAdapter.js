/**
 * VELOOP Giveaway System - Mock API Adapter
 * Simulates complete backend responses, latency, and state mutations for offline/development testing.
 */

import {
  MOCK_GIVEAWAYS,
  MOCK_STATS,
  MOCK_PAST_WINNERS,
  MOCK_USER
} from '../data/giveawayData';

// Simulated latency helper
const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory runtime state for mutations
let currentWallet = { ...MOCK_USER.wallet };
const userParticipations = new Set(['gw-apple-watch-s9']); // default 1 joined for testing
const userClaims = new Map();
const idempotencyStore = new Map();

export const mockAdapter = {
  /**
   * GET /api/giveaways/current
   */
  async getCurrentGiveaways() {
    await delay(180);
    return {
      success: true,
      data: {
        giveaways: MOCK_GIVEAWAYS.map((g) => ({
          ...g,
          participantsCount: g.participantsCount + (userParticipations.has(g.giveawayId) ? 1 : 0)
        })),
        stats: MOCK_STATS,
        serverTime: new Date().toISOString()
      }
    };
  },

  /**
   * GET /api/giveaways/previous
   */
  async getPreviousGiveaways(page = 1, _limit = 10) {
    await delay(150);
    const completed = MOCK_GIVEAWAYS.filter((g) => g.status === 'ENDED' || g.status === 'ARCHIVED');
    return {
      success: true,
      data: {
        giveaways: completed,
        total: completed.length,
        page,
        totalPages: 1,
        serverTime: new Date().toISOString()
      }
    };
  },

  /**
   * GET /api/giveaways/previous/winners
   */
  async getPreviousWinners(limit = 10) {
    await delay(150);
    return {
      success: true,
      data: {
        winners: MOCK_PAST_WINNERS.slice(0, limit),
        serverTime: new Date().toISOString()
      }
    };
  },

  /**
   * GET /api/giveaways/:idOrSlug
   */
  async getGiveawayBySlug(slug) {
    await delay(150);
    const giveaway = MOCK_GIVEAWAYS.find((g) => g.slug === slug || g.giveawayId === slug);
    if (!giveaway) {
      throw { response: { status: 404, data: { errorCode: 'GIVEAWAY_NOT_FOUND' } } };
    }
    return {
      success: true,
      data: {
        giveaway: {
          ...giveaway,
          participantsCount: giveaway.participantsCount + (userParticipations.has(giveaway.giveawayId) ? 1 : 0)
        },
        serverTime: new Date().toISOString()
      }
    };
  },

  /**
   * GET /api/giveaways/:id/winners
   */
  async getGiveawayWinners(giveawayId) {
    await delay(150);
    const giveaway = MOCK_GIVEAWAYS.find((g) => g.giveawayId === giveawayId || g.slug === giveawayId);
    if (!giveaway) {
      throw { response: { status: 404, data: { errorCode: 'GIVEAWAY_NOT_FOUND' } } };
    }

    if (giveaway.status !== 'ENDED' || giveaway.winnersStatus !== 'FINALIZED') {
      return {
        success: true,
        data: {
          winners: [],
          winnersStatus: giveaway.winnersStatus || 'PENDING',
          serverTime: new Date().toISOString()
        }
      };
    }

    return {
      success: true,
      data: {
        winners: [
          { userId: 'VE****82', maskedUserId: 'VE****82', wonAt: giveaway.endAt }
        ],
        winnersStatus: 'FINALIZED',
        serverTime: new Date().toISOString()
      }
    };
  },

  /**
   * GET /api/giveaways/:id/my-status
   */
  async getMyStatus(giveawayId) {
    await delay(120);
    const giveaway = MOCK_GIVEAWAYS.find((g) => g.giveawayId === giveawayId || g.slug === giveawayId);
    if (!giveaway) {
      throw { response: { status: 404, data: { errorCode: 'GIVEAWAY_NOT_FOUND' } } };
    }

    const currencyField = giveaway.entry.currency === 'SVE' ? 'sves' : giveaway.entry.currency === 'TOKEN' ? 'tokens' : 'ves';
    const balance = currentWallet[currencyField] || 0;
    const isJoined = userParticipations.has(giveaway.giveawayId);
    const canJoin = !isJoined && balance >= giveaway.entry.amount && giveaway.status === 'ACTIVE';

    let reason = null;
    if (isJoined) reason = 'ALREADY_PARTICIPATING';
    else if (balance < giveaway.entry.amount) reason = `INSUFFICIENT_${giveaway.entry.currency}_BALANCE`;
    else if (giveaway.status !== 'ACTIVE') reason = `GIVEAWAY_${giveaway.status}`;

    return {
      success: true,
      data: {
        giveawayId: giveaway.giveawayId,
        isJoined,
        canJoin,
        reason,
        userBalance: balance,
        fee: giveaway.entry.amount,
        currency: giveaway.entry.currency,
        isWinner: giveaway.giveawayId === 'gw-amazon-20', // demo winner on the finished mini drop
        claimState: userClaims.get(giveaway.giveawayId) || (giveaway.giveawayId === 'gw-amazon-20' ? 'NOT_SUBMITTED' : null),
        serverTime: new Date().toISOString()
      }
    };
  },

  /**
   * POST /api/giveaways/:id/join
   */
  async joinGiveaway(giveawayId, headers = {}) {
    await delay(350);
    const idempotencyKey = headers['Idempotency-Key'];
    if (idempotencyKey && idempotencyStore.has(idempotencyKey)) {
      return idempotencyStore.get(idempotencyKey);
    }

    const giveaway = MOCK_GIVEAWAYS.find((g) => g.giveawayId === giveawayId || g.slug === giveawayId);
    if (!giveaway) {
      throw { response: { status: 404, data: { errorCode: 'GIVEAWAY_NOT_FOUND' } } };
    }

    if (userParticipations.has(giveaway.giveawayId)) {
      throw { response: { status: 409, data: { errorCode: 'ALREADY_PARTICIPATING' } } };
    }

    const currencyField = giveaway.entry.currency === 'SVE' ? 'sves' : giveaway.entry.currency === 'TOKEN' ? 'tokens' : 'ves';
    if (currentWallet[currencyField] < giveaway.entry.amount) {
      throw {
        response: {
          status: 402,
          data: {
            errorCode: `INSUFFICIENT_${giveaway.entry.currency}_BALANCE`,
            needed: giveaway.entry.amount - currentWallet[currencyField]
          }
        }
      };
    }

    // Atomic mock debit
    currentWallet[currencyField] -= giveaway.entry.amount;
    userParticipations.add(giveaway.giveawayId);

    const result = {
      success: true,
      data: {
        participation: {
          giveawayId: giveaway.giveawayId,
          userId: MOCK_USER.userId,
          entryCurrency: giveaway.entry.currency,
          entryAmount: giveaway.entry.amount,
          joinedAt: new Date().toISOString()
        },
        wallet: { ...currentWallet },
        transactionId: `txn-${Date.now()}`
      }
    };

    if (idempotencyKey) {
      idempotencyStore.set(idempotencyKey, result);
    }

    return result;
  },

  /**
   * POST /api/giveaways/:id/claim
   */
  async claimPrize(giveawayId, _claimData) {
    await delay(300);
    userClaims.set(giveawayId, 'SUBMITTED');
    return {
      success: true,
      data: {
        giveawayId,
        status: 'SUBMITTED',
        submittedAt: new Date().toISOString(),
        message: 'Your claim has been recorded successfully.'
      }
    };
  },

  /**
   * Mock User & Wallet retrieval
   */
  async getAuthUser() {
    await delay(100);
    return {
      success: true,
      data: {
        user: { ...MOCK_USER, wallet: { ...currentWallet } },
        serverTime: new Date().toISOString()
      }
    };
  }
};

/**
 * VELOOP Giveaway System - Live API Adapter
 * Connects directly to the backend Express REST API.
 * STRICT RULE: Live mode never falls back to mock data.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Standard fetch wrapper with JSON parsing and authentication headers
 */
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('veloop_auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || data.error || 'Network response failed');
    error.status = response.status;
    error.errorCode = data.code || data.errorCode || 'SERVER_ERROR';
    error.data = data;
    throw error;
  }

  return data;
};

export const liveAdapter = {
  async getCurrentGiveaways() {
    const res = await request('/giveaways/current');
    return {
      success: true,
      data: {
        giveaways: res.data.giveaways,
        stats: res.data.stats,
        serverTime: res.serverTime || new Date().toISOString()
      }
    };
  },

  async getPreviousGiveaways(page = 1, limit = 10) {
    const res = await request(`/giveaways/previous?page=${page}&limit=${limit}`);
    return {
      success: true,
      data: {
        giveaways: res.data.giveaways,
        total: res.data.pagination?.total || res.data.giveaways.length,
        page: res.data.pagination?.page || page,
        totalPages: res.data.pagination?.pages || 1,
        serverTime: new Date().toISOString()
      }
    };
  },

  async getPreviousWinners(limit = 10) {
    const res = await request(`/giveaways/previous/winners?limit=${limit}`);
    return {
      success: true,
      data: {
        winners: res.data,
        serverTime: new Date().toISOString()
      }
    };
  },

  async getGiveawayBySlug(slug) {
    const res = await request(`/giveaways/${slug}`);
    return {
      success: true,
      data: res.data,
      serverTime: res.serverTime
    };
  },

  async getGiveawayWinners(giveawayId) {
    const res = await request(`/giveaways/${giveawayId}/winners`);
    return {
      success: true,
      data: {
        winners: res.data,
        winnersStatus: res.winnersStatus
      }
    };
  },

  async getMyStatus(giveawayId) {
    const res = await request(`/giveaways/${giveawayId}/my-status`);
    return {
      success: true,
      data: res.data
    };
  },

  async joinGiveaway(giveawayId, headers = {}) {
    const res = await request(`/giveaways/${giveawayId}/join`, {
      method: 'POST',
      headers: {
        'Idempotency-Key': headers['Idempotency-Key'] || crypto.randomUUID(),
        'X-Device-Id': headers['X-Device-Id'] || 'dev-browser-v1',
        ...headers
      }
    });
    return {
      success: true,
      data: res.data
    };
  },

  async claimPrize(giveawayId, claimData) {
    const res = await request(`/giveaways/${giveawayId}/claim`, {
      method: 'POST',
      body: JSON.stringify(claimData)
    });
    return {
      success: true,
      data: res.data
    };
  },

  async getAuthUser() {
    const res = await request('/auth/me');
    return {
      success: true,
      data: res.data
    };
  }
};

export default liveAdapter;

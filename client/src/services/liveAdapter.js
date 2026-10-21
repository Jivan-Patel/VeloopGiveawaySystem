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
    error.errorCode = data.errorCode || 'SERVER_ERROR';
    error.data = data;
    throw error;
  }

  return data;
};

export const liveAdapter = {
  async getCurrentGiveaways() {
    return request('/giveaways/current');
  },

  async getPreviousGiveaways(page = 1, limit = 10) {
    return request(`/giveaways/previous?page=${page}&limit=${limit}`);
  },

  async getPreviousWinners(limit = 10) {
    return request(`/giveaways/previous/winners?limit=${limit}`);
  },

  async getGiveawayBySlug(slug) {
    return request(`/giveaways/${slug}`);
  },

  async getGiveawayWinners(giveawayId) {
    return request(`/giveaways/${giveawayId}/winners`);
  },

  async getMyStatus(giveawayId) {
    return request(`/giveaways/${giveawayId}/my-status`);
  },

  async joinGiveaway(giveawayId, headers = {}) {
    return request(`/giveaways/${giveawayId}/join`, {
      method: 'POST',
      headers: {
        'Idempotency-Key': headers['Idempotency-Key'] || crypto.randomUUID(),
        'X-Device-Id': headers['X-Device-Id'] || 'dev-browser-v1',
        ...headers
      }
    });
  },

  async claimPrize(giveawayId, claimData) {
    return request(`/giveaways/${giveawayId}/claim`, {
      method: 'POST',
      body: JSON.stringify(claimData)
    });
  },

  async getAuthUser() {
    return request('/auth/me');
  }
};

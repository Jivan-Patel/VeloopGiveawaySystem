/**
 * VELOOP Giveaway System - Currencies Registry
 * Maps supported reward currencies to labels, icons, database fields, and formatting rules.
 * Palette: Emerald (VE), Champagne Gold (SVE), Warm Amber (Tokens) - NO AI PURPLE/BLUE.
 */

export const CURRENCIES = {
  VE: {
    code: 'VE',
    field: 'ves',
    name: 'Veloop Entries',
    shortName: 'VE',
    symbol: '⚡',
    color: '#10B981',
    accentClass: 'text-emerald',
    badgeClass: 'badge-ve',
    description: 'Primary platform entries earned through platform activity.',
    format: (amount) => Number(amount || 0).toLocaleString('en-IN')
  },
  SVE: {
    code: 'SVE',
    field: 'sves',
    name: 'Super Veloop Entries',
    shortName: 'SVE',
    symbol: '✦',
    color: '#F59E0B',
    accentClass: 'text-gold',
    badgeClass: 'badge-sve',
    description: 'Exclusive tier entries reserved for premium flagship reward pools.',
    format: (amount) => Number(amount || 0).toLocaleString('en-IN')
  },
  TOKEN: {
    code: 'TOKEN',
    field: 'tokens',
    name: 'Reward Tokens',
    shortName: 'Tokens',
    symbol: '🪙',
    color: '#F97316',
    accentClass: 'text-amber',
    badgeClass: 'badge-token',
    description: 'Universal reward tokens redeemable across mini-giveaways.',
    format: (amount) => Number(amount || 0).toLocaleString('en-IN')
  }
};

/**
 * Normalizes any currency string to its uppercase code, defaulting to 'VE'
 */
export const getCurrencyConfig = (currencyCode) => {
  const code = (currencyCode || '').toUpperCase();
  return CURRENCIES[code] || CURRENCIES.VE;
};

/**
 * Formats a fee and currency into a friendly string, e.g. "250 VE"
 */
export const formatCurrencyAmount = (amount, currencyCode) => {
  const config = getCurrencyConfig(currencyCode);
  return `${config.format(amount)} ${config.shortName}`;
};

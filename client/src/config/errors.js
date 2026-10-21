/**
 * VELOOP Giveaway System - Error Code Mappings
 * Maps backend error codes to user-friendly messages.
 * Never leaks internal details or stack traces to users.
 */

export const ERROR_MESSAGES = {
  LOGIN_REQUIRED: 'Please login to participate.',
  GIVEAWAY_NOT_FOUND: "We couldn't find this giveaway.",
  GIVEAWAY_NOT_ACTIVE: "This giveaway isn't open yet.",
  GIVEAWAY_ENDED: 'This giveaway has ended. Check the winners.',
  ALREADY_PARTICIPATING: "You're already participating. You can join again in the next giveaway.",
  INSUFFICIENT_VE_BALANCE: 'Not enough VE. You need {n} more.',
  INSUFFICIENT_SVE_BALANCE: 'Not enough SVE. You need {n} more.',
  INSUFFICIENT_TOKEN_BALANCE: 'Not enough Tokens. You need {n} more.',
  INSUFFICIENT_BALANCE: 'Not enough {currency}. You need {n} more.',
  PARTICIPATION_BLOCKED: "Participation couldn't be completed. Try later or contact support.",
  SUSPICIOUS_ACTIVITY: "Participation couldn't be completed. Try later or contact support.",
  RATE_LIMITED: 'Too many attempts. Please wait a moment.',
  CLAIM_NOT_ALLOWED: "This prize can't be claimed from this account.",
  CLAIM_EXPIRED: 'The claim window for this prize has expired.',
  NETWORK_ERROR: 'Unable to reach the server. Please check your connection.',
  SERVER_ERROR: 'A temporary server issue occurred. Please try again shortly.',
  DEFAULT: 'An unexpected issue occurred. Please try again.'
};

/**
 * Resolves an error code and optional dynamic parameters into a readable message.
 */
export const getErrorMessage = (code, params = {}) => {
  let template = ERROR_MESSAGES[code] || ERROR_MESSAGES.DEFAULT;

  if (params.n !== undefined) {
    template = template.replace('{n}', Number(params.n).toLocaleString('en-IN'));
  }
  if (params.currency !== undefined) {
    template = template.replace('{currency}', params.currency);
  }

  return template;
};

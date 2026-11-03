/**
 * Centralized error handler mapping error codes to HTTP status and friendly copy
 * conforming to PRD Section 165–178.
 */
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || (err.name === 'ValidationError' ? 400 : 500);
  const code = err.code || 'INTERNAL_SERVER_ERROR';

  const ERROR_MESSAGES = {
    LOGIN_REQUIRED: 'Please login to participate.',
    GIVEAWAY_NOT_FOUND: "We couldn't find this giveaway.",
    GIVEAWAY_NOT_ACTIVE: "This giveaway isn't open yet.",
    GIVEAWAY_ENDED: 'This giveaway has ended. Check the winners.',
    ALREADY_PARTICIPATING: "You're already participating. You can join again in the next giveaway.",
    INSUFFICIENT_VE_BALANCE: 'Not enough VE tokens in your wallet.',
    INSUFFICIENT_SVE_BALANCE: 'Not enough SVE tokens in your wallet.',
    INSUFFICIENT_TOKEN_BALANCE: 'Not enough Reward Tokens in your wallet.',
    PARTICIPATION_BLOCKED: "Participation couldn't be completed. Try later or contact support.",
    SUSPICIOUS_ACTIVITY: "Participation couldn't be completed. Try later or contact support.",
    RATE_LIMITED: 'Too many attempts. Please wait a moment.',
    CLAIM_NOT_ALLOWED: "This prize can't be claimed from this account.",
    INTERNAL_SERVER_ERROR: 'An unexpected error occurred. Please try again.'
  };

  const message = err.message || ERROR_MESSAGES[code] || 'Something went wrong.';

  res.status(statusCode).json({
    status: 'error',
    code,
    message
  });
}

export default errorHandler;

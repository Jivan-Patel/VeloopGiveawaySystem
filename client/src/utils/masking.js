/**
 * Masks a user ID for privacy compliance.
 * Example: 'VE10025' -> 'VE****25'
 * If already masked or invalid, handles gracefully.
 */
export function maskUserId(userId) {
  if (!userId || typeof userId !== 'string') return 'VE****--';
  if (userId.includes('*')) return userId;
  if (userId.length <= 4) return `${userId.slice(0, 2)}****`;
  return `${userId.slice(0, 2)}****${userId.slice(-2)}`;
}

export default maskUserId;

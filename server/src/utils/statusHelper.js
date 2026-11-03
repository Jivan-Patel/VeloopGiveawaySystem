/**
 * Masks a userId to protect privacy in public endpoints per PRD Section 25.
 * Example: 'VE10082' -> 'VE****82'
 */
export function maskUserId(userId) {
  if (!userId || typeof userId !== 'string') return 'VE****00';
  if (userId.length <= 4) return 'VE****';
  const prefix = userId.slice(0, 2);
  const suffix = userId.slice(-2);
  return `${prefix}****${suffix}`;
}

/**
 * Calculates effective status from authoritative serverTime per PRD Section 146.
 */
export function getEffectiveStatus(giveaway, serverTime = new Date()) {
  const now = new Date(serverTime);
  const startAt = new Date(giveaway.startAt);
  const endAt = new Date(giveaway.endAt);

  if (giveaway.status === 'ARCHIVED') return 'ARCHIVED';
  if (now < startAt) return 'UPCOMING';
  if (now >= endAt) return 'ENDED';
  return 'ACTIVE';
}

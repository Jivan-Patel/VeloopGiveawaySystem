/**
 * VELOOP Giveaway System - Status & Lifecycle Registry
 * Standardizes giveaway states, winner reveal states, claim states, and user context.
 * Non-AI Luxury Palette: Emerald, Champagne Gold, Warm Amber, Silver Muted.
 */

export const GIVEAWAY_STATUS = {
  UPCOMING: 'UPCOMING',
  ACTIVE: 'ACTIVE',
  ENDED: 'ENDED',
  ARCHIVED: 'ARCHIVED'
};

export const WINNERS_STATUS = {
  PENDING: 'PENDING',
  FINALIZED: 'FINALIZED'
};

export const CLAIM_STATUS = {
  NOT_SUBMITTED: 'NOT_SUBMITTED',
  SUBMITTED: 'SUBMITTED',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  EXPIRED: 'EXPIRED'
};

export const USER_STATE = {
  VISITOR: 'VISITOR',
  LOGGED_IN: 'LOGGED_IN',
  PARTICIPANT: 'PARTICIPANT',
  WINNER: 'WINNER',
  NON_WINNER: 'NON_WINNER'
};

/**
 * Computes effective status based on authoritative serverTime.
 * Ensures client device clock tampering cannot alter status.
 */
export const getEffectiveStatus = (giveaway, serverTimeIso) => {
  if (!giveaway) return GIVEAWAY_STATUS.ENDED;

  const now = serverTimeIso ? new Date(serverTimeIso).getTime() : Date.now();
  const startAt = new Date(giveaway.startAt).getTime();
  const endAt = new Date(giveaway.endAt).getTime();

  if (giveaway.status === GIVEAWAY_STATUS.ARCHIVED) {
    return GIVEAWAY_STATUS.ARCHIVED;
  }

  if (now < startAt) {
    return GIVEAWAY_STATUS.UPCOMING;
  }

  if (now >= endAt || giveaway.status === GIVEAWAY_STATUS.ENDED) {
    return GIVEAWAY_STATUS.ENDED;
  }

  return GIVEAWAY_STATUS.ACTIVE;
};

/**
 * Provides badge visuals, colors, and labels for any giveaway state.
 */
export const getStatusBadgeConfig = (status, winnersStatus) => {
  switch (status) {
    case GIVEAWAY_STATUS.ACTIVE:
      return {
        label: 'Live Giveaway',
        variant: 'success',
        color: '#10B981',
        bgColor: 'rgba(16, 185, 129, 0.15)',
        dotClass: 'status-dot-pulse-emerald'
      };
    case GIVEAWAY_STATUS.UPCOMING:
      return {
        label: 'Starting Soon',
        variant: 'warning',
        color: '#F59E0B',
        bgColor: 'rgba(245, 158, 11, 0.15)',
        dotClass: 'status-dot-pulse-gold'
      };
    case GIVEAWAY_STATUS.ENDED:
      if (winnersStatus === WINNERS_STATUS.FINALIZED) {
        return {
          label: 'Ended · Winners Finalized',
          variant: 'secondary',
          color: '#94A3B8',
          bgColor: 'rgba(148, 163, 184, 0.15)',
          dotClass: ''
        };
      }
      return {
        label: 'Ended · Drawing Winners',
        variant: 'warning',
        color: '#F59E0B',
        bgColor: 'rgba(245, 158, 11, 0.15)',
        dotClass: 'status-dot-pulse-amber'
      };
    case GIVEAWAY_STATUS.ARCHIVED:
    default:
      return {
        label: 'Completed',
        variant: 'dark',
        color: '#64748B',
        bgColor: 'rgba(100, 116, 139, 0.15)',
        dotClass: ''
      };
  }
};

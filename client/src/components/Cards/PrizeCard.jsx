import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Zap, Clock, ArrowRight } from 'lucide-react';
import { formatCurrencyAmount } from '../../config/currencies';
import { getStatusBadgeConfig, GIVEAWAY_STATUS } from '../../config/giveawayStatus';
import Countdown from '../Countdown/Countdown';
import styles from './PrizeCard.module.css';

/**
 * PrizeCard Component (PRD Section 6 & WD4)
 * Displays position tag, high-res image with fallback, per-prize accent, real-time countdown,
 * active participant counter, formatted fee chip, and accessible navigation CTA.
 */
export function PrizeCard({ giveaway, serverTime, onTimerZero }) {
  if (!giveaway) return null;

  const badge = getStatusBadgeConfig(giveaway.status, giveaway.winnersStatus);
  const isUpcoming = giveaway.status === GIVEAWAY_STATUS.UPCOMING;
  const isEnded = giveaway.status === GIVEAWAY_STATUS.ENDED;

  return (
    <article className={styles.card}>
      {/* Dynamic accent color line */}
      <div
        className={styles.accentLine}
        style={{ background: giveaway.prize?.accentColor || 'var(--color-primary-light)' }}
      />

      {/* Prize Image & Status Badges */}
      <div className={styles.imageContainer}>
        {giveaway.prize?.badge && (
          <span className={styles.tierPill}>
            {giveaway.prize.badge}
          </span>
        )}

        <span
          className={styles.badgeOverlay}
          style={{ backgroundColor: badge.bgColor, color: badge.color }}
        >
          {badge.label}
        </span>

        <img
          src={giveaway.prize?.image}
          alt={giveaway.prize?.name || giveaway.title}
          className={styles.prizeImage}
          loading="lazy"
          onError={(e) => {
            if (giveaway.prize?.localImage && e.currentTarget.src !== giveaway.prize.localImage) {
              e.currentTarget.src = giveaway.prize.localImage;
            }
          }}
        />
      </div>

      {/* Card Content */}
      <div className={styles.cardBody}>
        <div className={styles.metaRow}>
          <span className="badge bg-surface-elevated text-emerald border border-subtle small">
            {giveaway.entry?.currency || 'VE'} Pool
          </span>
          <span className={styles.winnerCountBadge}>
            {giveaway.winnerCount} {giveaway.winnerCount === 1 ? 'Winner' : 'Winners'}
          </span>
        </div>

        <h3 className={styles.prizeTitle}>{giveaway.title}</h3>
        <p className={styles.prizeDescription}>{giveaway.description}</p>

        {/* Real-time Countdown Box */}
        <div className={styles.countdownSection}>
          <div className={styles.countdownLabel}>
            <Clock size={13} />
            <span>{isUpcoming ? 'Starts In' : isEnded ? 'Status' : 'Ends In'}</span>
          </div>
          {isEnded ? (
            <span className="small text-muted-custom fw-bold">Draw Concluded</span>
          ) : (
            <Countdown
              variant="compact"
              targetDate={isUpcoming ? giveaway.startAt : giveaway.endAt}
              serverTime={serverTime}
              onZero={onTimerZero}
            />
          )}
        </div>

        {/* Footer: Participants and Fee Chip */}
        <div className={styles.footerStrip}>
          <div className={styles.participants}>
            <Users size={14} />
            <span>{Number(giveaway.participantsCount || 0).toLocaleString('en-IN')} Entered</span>
          </div>

          <div className={styles.feeChip}>
            <Zap size={14} />
            <span>{formatCurrencyAmount(giveaway.entry?.amount, giveaway.entry?.currency)}</span>
          </div>
        </div>

        {/* Navigation CTA (links to detail page, never triggers direct join) */}
        <Link
          to={`/giveaway/${giveaway.slug}`}
          className={`btn btn-primary-gradient ${styles.ctaButton}`}
        >
          <span>{isEnded ? 'View Results' : 'View Prize & Enter'}</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}

export default PrizeCard;

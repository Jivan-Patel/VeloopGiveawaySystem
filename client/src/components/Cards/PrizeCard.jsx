import { Link } from 'react-router-dom';
import { Users, Clock, ArrowRight, Trophy, Coins } from 'lucide-react';
import { formatCurrencyAmount } from '../../config/currencies';
import styles from './PrizeCard.module.css';

/**
 * PrizeCard Component - Modern Luxury Edition
 * Displays:
 * - Top Row: Colored Rank Badge + Prominent Entry Fee Pill (VE/SVE/TOKEN)
 * - Centered Product Image with Radial Ambient Glow & Retail Market Value
 * - Title & Subtitle with crisp typographic contrast
 * - Gamified Pool Participation Progress Bar
 * - Metadata row: Verified Winner Count + Synchronized Countdown Status
 * - Vibrant Gradient "Join Draw →" CTA with micro-interaction
 */
export function PrizeCard({ giveaway }) {
  if (!giveaway) return null;

  const {
    slug,
    title,
    subtitle,
    prize = {},
    entry = { currency: 'VE', amount: 250 },
    winnerCount = 1,
    displayParticipants,
    displayTimeLeft
  } = giveaway;

  // Visual configuration mapping
  const badgeText = prize.badge || 'Featured';
  const badgeColor = prize.badgeColor || '#F59E0B';
  const btnGradient = prize.btnGradient || 'linear-gradient(135deg, #10B981, #059669)';
  const accentColor = prize.accentColor || '#10B981';

  // Fallback image handling
  const imageSrc = prize.localImage || prize.image;

  // Pool fill progress calculation (capped between 40% and 92% for realistic visual excitement)
  const count = Number(giveaway.participantsCount) || 1200;
  const progressPercent = Math.min(94, Math.max(38, Math.round((count / 3000) * 100)));

  return (
    <div
      className={styles.card}
      style={{
        '--card-accent': accentColor,
        '--btn-gradient': btnGradient
      }}
    >
      {/* Top Bar: Rank Badge + Entry Fee Chip */}
      <div className={styles.topBar}>
        <span
          className={styles.rankBadge}
          style={{ backgroundColor: badgeColor }}
        >
          {badgeText}
        </span>

        <span className={styles.feeChip}>
          <Coins size={12} className={styles.feeIcon} />
          <span>{formatCurrencyAmount(entry.amount, entry.currency)}</span>
        </span>
      </div>

      {/* Product Image with Ambient Glow & Retail Value Badge */}
      <div className={styles.imageArea}>
        <div
          className={styles.ambientGlow}
          style={{ backgroundColor: accentColor }}
          aria-hidden="true"
        />
        <img
          src={imageSrc}
          alt={title}
          className={styles.productImage}
          loading="lazy"
          onError={(e) => {
            if (prize.localImage && e.currentTarget.src !== prize.localImage) {
              e.currentTarget.src = prize.localImage;
            }
          }}
        />
        {prize.retailValue && (
          <span className={styles.retailBadge} title="Estimated Retail Market Value">
            Est. {prize.retailValue}
          </span>
        )}
      </div>

      {/* Card Details */}
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.subtitle}>{subtitle || giveaway.description}</p>

        {/* Gamified Pool Progress Bar */}
        <div className={styles.progressWrap}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>Pool Momentum</span>
            <span className={styles.progressVal}>{progressPercent}% Filled</span>
          </div>
          <div className={styles.progressBarBg}>
            <div
              className={styles.progressBarFill}
              style={{
                width: `${progressPercent}%`,
                background: btnGradient
              }}
            />
          </div>
        </div>

        {/* Metadata Strip */}
        <div className={styles.metaRow}>
          <div className={styles.metaItem}>
            <Trophy size={13} className={styles.metaIconGold} />
            <span>{winnerCount} {winnerCount === 1 ? 'Winner' : 'Winners'}</span>
          </div>
          <div className={styles.metaItem}>
            <Users size={13} className={styles.metaIconCyan} />
            <span>{displayParticipants || `${Number(giveaway.participantsCount).toLocaleString()}`}</span>
          </div>
          <div className={styles.metaItem}>
            <Clock size={13} className={styles.metaIconClock} />
            <span>{displayTimeLeft || 'Active'}</span>
          </div>
        </div>

        {/* Join Now Button */}
        <Link
          to={`/giveaway/${slug}`}
          className={styles.joinButton}
          style={{ background: btnGradient }}
          aria-label={`Join ${title} giveaway`}
        >
          <span>Join Draw</span>
          <ArrowRight size={15} className={styles.arrowIcon} />
        </Link>
      </div>
    </div>
  );
}

export default PrizeCard;

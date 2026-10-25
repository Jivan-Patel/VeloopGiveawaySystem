import { Link } from 'react-router-dom';
import { Users, Clock, ArrowRight } from 'lucide-react';
import styles from './PrizeCard.module.css';

/**
 * PrizeCard Component - Strictly matching Ref_02.jpeg (Document last page)
 * Displays:
 * - Colored Rank Badge (1st Prize / 2nd Prize / 3rd Prize / Lucky Draw)
 * - Centered Device Product Image with Radial Ambient Glow
 * - Title & Subtitle (e.g., "iPhone 15 Pro", "Latest iPhone 15 Pro 128GB")
 * - Participants & Countdown Info Row
 * - Vibrant Gradient "Join Now →" CTA Button
 */
export function PrizeCard({ giveaway }) {
  if (!giveaway) return null;

  const {
    slug,
    title,
    subtitle,
    prize = {},
    displayParticipants,
    displayTimeLeft
  } = giveaway;

  // Visual configuration mapping from Ref_02.jpeg
  const badgeText = prize.badge || 'Featured';
  const badgeColor = prize.badgeColor || '#F59E0B';
  const btnGradient = prize.btnGradient || 'linear-gradient(135deg, #7C3AED, #6366F1)';
  const accentColor = prize.accentColor || '#8B5CF6';

  // Fallback image handling
  const imageSrc = prize.localImage || prize.image;

  return (
    <div
      className={styles.card}
      style={{
        '--card-accent': accentColor,
        '--btn-gradient': btnGradient
      }}
    >
      {/* Top Badge */}
      <div className={styles.topBar}>
        <span
          className={styles.rankBadge}
          style={{ backgroundColor: badgeColor }}
        >
          {badgeText}
        </span>
      </div>

      {/* Product Image with Ambient Glow */}
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
      </div>

      {/* Card Details */}
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.subtitle}>{subtitle || giveaway.description}</p>

        {/* Metadata Strip */}
        <div className={styles.metaRow}>
          <div className={styles.metaItem}>
            <Users size={13} className={styles.metaIcon} />
            <span>{displayParticipants || `${Number(giveaway.participantsCount).toLocaleString()} Participants`}</span>
          </div>
          <div className={styles.metaItem}>
            <Clock size={13} className={styles.metaIcon} />
            <span>{displayTimeLeft || 'Active Now'}</span>
          </div>
        </div>

        {/* Join Now Button */}
        <Link
          to={`/giveaway/${slug}`}
          className={styles.joinButton}
          style={{ background: btnGradient }}
          aria-label={`Join ${title} giveaway`}
        >
          <span>Join Now</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

export default PrizeCard;

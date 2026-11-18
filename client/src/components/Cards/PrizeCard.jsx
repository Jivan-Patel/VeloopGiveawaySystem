import { Link } from 'react-router-dom';
import { Users, Clock, ArrowRight } from 'lucide-react';
import styles from './PrizeCard.module.css';

/**
 * PrizeCard Component - Strictly Aligned with Ref_02.jpeg
 * Features:
 * - Top Left Badge: 1st Prize / 2nd Prize / 3rd Prize / Lucky Draw
 * - High-Impact Floating 3D Prize Visual with Neon Radial Aura
 * - Clean Title & Subtitle hierarchy
 * - 2-Item Meta Row: Participants & Time Left
 * - Vibrant Gradient "Join Now →" CTA Button
 */
export function PrizeCard({ giveaway }) {
  if (!giveaway) return null;

  const {
    slug,
    title,
    subtitle,
    prize = {},
    displayParticipants = '2.3K+ Participants',
    displayTimeLeft = '12d: 08h: 46m left'
  } = giveaway;

  // Visual configuration mapping matching Ref_02.jpeg
  const badgeText = prize.badge || 'Featured';
  const badgeColor = prize.badgeColor || '#F59E0B';
  const btnGradient = prize.btnGradient || 'linear-gradient(135deg, #8B5CF6, #6D28D9)';
  const accentColor = prize.accentColor || '#8B5CF6';
  const imageSrc = prize.localImage || prize.image;

  return (
    <div
      className={styles.card}
      style={{
        '--card-accent': accentColor,
        '--btn-gradient': btnGradient
      }}
    >
      {/* Top Left Prize Position Badge (Ref_02.jpeg) */}
      <div className={styles.topBar}>
        <span
          className={styles.rankBadge}
          style={{ backgroundColor: badgeColor }}
        >
          {badgeText}
        </span>
      </div>

      {/* 3D Prize Image with Luminous Radial Aura */}
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

      {/* Card Body */}
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.subtitle}>{subtitle || giveaway.description}</p>

        {/* 2-Item Meta Row (Ref_02.jpeg) */}
        <div className={styles.metaRow}>
          <div className={styles.metaItem}>
            <Users size={14} className={styles.metaIcon} />
            <span>{displayParticipants}</span>
          </div>
          <div className={styles.metaItem}>
            <Clock size={14} className={styles.metaIcon} />
            <span>{displayTimeLeft}</span>
          </div>
        </div>

        {/* Full-Width Gradient "Join Now →" CTA (Ref_02.jpeg) */}
        <Link
          to={`/giveaway/${slug}`}
          className={styles.joinButton}
          style={{ background: btnGradient }}
          aria-label={`Join ${title} giveaway`}
        >
          <span>Join Now</span>
          <ArrowRight size={15} className={styles.arrowIcon} />
        </Link>
      </div>
    </div>
  );
}

export default PrizeCard;

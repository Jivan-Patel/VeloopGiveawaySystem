import { Gift } from 'lucide-react';
import styles from './SectionHeader.module.css';

/**
 * SectionHeader Component - Strictly Aligned with Ref_02.jpeg
 * Features:
 * - Ambient cyber-violet & magenta atmospheric illumination
 * - Flanking 3D isometric purple gift boxes on glowing neon pedestals
 * - Center "🎁 EXCLUSIVE GIVEAWAYS" illuminated capsule pill
 * - "Giveaway Section" heading with high-impact magenta/violet typography
 * - "✦ More participation, more chances to win! ✦" sparkle subtitle
 */
export function SectionHeader() {
  return (
    <div className={styles.sectionHeader}>
      {/* Ambient Header Glow Behind Content */}
      <div className={styles.ambientBackdrop} aria-hidden="true" />

      {/* Left 3D Podium Gift Box (Ref_02.jpeg) */}
      <div className={`${styles.podiumWrapper} ${styles.podiumLeft}`} aria-hidden="true">
        <div className={styles.podiumGlow} />
        <img
          src="/assets/branding/giftbox_podium.png"
          alt=""
          className={styles.podiumImage}
        />
      </div>

      {/* Center Content */}
      <div className={styles.centerContent}>
        {/* Top Capsule Badge */}
        <div className={styles.exclusiveBadge}>
          <Gift size={13} className={styles.badgeGiftIcon} />
          <span>EXCLUSIVE GIVEAWAYS</span>
        </div>

        {/* Main Heading matching Ref_02.jpeg */}
        <h1 className={styles.mainTitle}>
          Giveaway <span className={styles.titleGradient}>Section</span>
        </h1>

        {/* Subtitle */}
        <p className={styles.subtitle}>
          Join exciting giveaways, complete simple tasks and win amazing rewards from VELoop Rewards.
        </p>

        {/* Sparkle Tagline */}
        <div className={styles.sparkleTagline}>
          <span className={styles.sparkleStar}>✦</span>
          <span>More participation, more chances to win!</span>
          <span className={styles.sparkleStar}>✦</span>
        </div>
      </div>

      {/* Right 3D Podium Gift Box (Mirrored) */}
      <div className={`${styles.podiumWrapper} ${styles.podiumRight}`} aria-hidden="true">
        <div className={styles.podiumGlow} />
        <img
          src="/assets/branding/giftbox_podium.png"
          alt=""
          className={`${styles.podiumImage} ${styles.podiumMirrored}`}
        />
      </div>
    </div>
  );
}

export default SectionHeader;

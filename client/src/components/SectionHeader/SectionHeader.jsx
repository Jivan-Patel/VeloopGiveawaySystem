import { Sparkles, ShieldCheck, Zap, Trophy } from 'lucide-react';
import styles from './SectionHeader.module.css';

/**
 * SectionHeader Component - Modern Luxury Edition
 * Features:
 * - Ambient backdrop radial illumination
 * - 3D Gift Box podium graphics with floating animation
 * - Glowing "Exclusive Rewards" live pill badge
 * - High-contrast luminous gradient typography
 * - Factual trust & transparency micro-chips
 */
export function SectionHeader() {
  return (
    <div className={styles.sectionHeader}>
      {/* Ambient Header Glow Behind Content */}
      <div className={styles.ambientBackdrop} aria-hidden="true" />

      {/* Left 3D Podium Gift Box */}
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
        <div className={styles.exclusiveBadge}>
          <Sparkles size={14} className={styles.badgeSparkle} />
          <span>EXCLUSIVE REWARDS POOL</span>
          <span className={styles.livePulseDot} />
        </div>

        <h1 className={styles.mainTitle}>
          Giveaway <span className={styles.titleGradient}>Showcase</span>
        </h1>

        <p className={styles.subtitle}>
          Discover verified premium drops. Enter transparent prize draws, track your tickets on the ledger, and win guaranteed high-value gadgets and vouchers.
        </p>

        {/* Value Guarantee Micro-Chips */}
        <div className={styles.guaranteeRow}>
          <div className={styles.guaranteeChip}>
            <ShieldCheck size={13} className={styles.chipIconGreen} />
            <span>100% Verified Prizes</span>
          </div>
          <div className={styles.chipDot} aria-hidden="true">•</div>
          <div className={styles.guaranteeChip}>
            <Zap size={13} className={styles.chipIconCyan} />
            <span>Atomic Ledger Tickets</span>
          </div>
          <div className={styles.chipDot} aria-hidden="true">•</div>
          <div className={styles.guaranteeChip}>
            <Trophy size={13} className={styles.chipIconGold} />
            <span>Provably Fair Selection</span>
          </div>
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

import { Gift } from 'lucide-react';
import styles from './SectionHeader.module.css';

/**
 * SectionHeader Component - Strictly matching Ref_02.jpeg (Document last page)
 * Flanked by 3D purple gift box on glowing platform, center pill, gradient title, and sparkle subtext.
 */
export function SectionHeader() {
  return (
    <div className={styles.sectionHeader}>
      {/* Left 3D Podium Gift Box */}
      <div className={`${styles.podiumWrapper} ${styles.podiumLeft}`} aria-hidden="true">
        <img
          src="/assets/branding/giftbox_podium.png"
          alt=""
          className={styles.podiumImage}
        />
      </div>

      {/* Center Content */}
      <div className={styles.centerContent}>
        <div className={styles.exclusiveBadge}>
          <Gift size={15} className={styles.badgeIcon} />
          <span>EXCLUSIVE GIVEAWAYS</span>
        </div>

        <h1 className={styles.mainTitle}>Giveaway Section</h1>

        <p className={styles.subtitle}>
          Join exciting giveaways, complete simple tasks and win amazing rewards from VELoop Rewards.
        </p>

        <div className={styles.sparkleRow}>
          <span className={styles.sparkleStar}>✦</span>
          <span>More participation, more chances to win!</span>
          <span className={styles.sparkleStar}>✦</span>
        </div>
      </div>

      {/* Right 3D Podium Gift Box (Mirrored) */}
      <div className={`${styles.podiumWrapper} ${styles.podiumRight}`} aria-hidden="true">
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

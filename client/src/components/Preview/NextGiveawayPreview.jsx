import { useState } from 'react';
import { Bell, BellRing, Calendar, Users, Award, Sparkles } from 'lucide-react';
import styles from './NextGiveawayPreview.module.css';

/**
 * Next Giveaway Preview Card (PRD Section 5 & WD7 Milestone)
 * Highlights the upcoming reward drop with a functional "Notify Me" toggle.
 */
export function NextGiveawayPreview() {
  const [isNotified, setIsNotified] = useState(false);

  const handleToggleNotify = () => {
    setIsNotified((prev) => !prev);
  };

  return (
    <div className={styles.previewCard}>
      <div className={styles.topBadgeRow}>
        <span className={styles.upcomingBadge}>
          <Sparkles size={11} />
          <span>Next Giveaway Pool</span>
        </span>
        <span className={styles.startsInBadge}>
          <Calendar size={11} />
          <span>Launches in 2d 14h</span>
        </span>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.imageWrap}>
          <img
            src="/assets/prizes/amazon500.png"
            alt="Amazon ₹500 Gift Card"
            className={styles.prizeImage}
            onError={(e) => {
              e.currentTarget.src = '/assets/prizes/amazon2000.png';
            }}
          />
        </div>

        <div className={styles.detailsWrap}>
          <h4 className={styles.title}>Amazon ₹500 Gift Vouchers (Batch 04)</h4>
          <p className={styles.description}>
            Instant digital vouchers delivered directly to your verified inbox upon draw finalization.
          </p>

          <div className={styles.metaRow}>
            <div className={styles.metaItem}>
              <Award size={13} className={styles.metaIconGold} />
              <span>25 Lucky Winners</span>
            </div>
            <div className={styles.metaItem}>
              <Users size={13} className={styles.metaIcon} />
              <span>Entry Fee: 300 VE</span>
            </div>
          </div>
        </div>

        <div className={styles.actionWrap}>
          <button
            type="button"
            className={`${styles.notifyBtn} ${isNotified ? styles.notifyBtnActive : ''}`}
            onClick={handleToggleNotify}
            aria-pressed={isNotified}
          >
            {isNotified ? (
              <>
                <BellRing size={15} />
                <span>Notification Set ✓</span>
              </>
            ) : (
              <>
                <Bell size={15} />
                <span>Notify Me on Launch</span>
              </>
            )}
          </button>
          <span className={styles.notifyHint}>
            {isNotified
              ? 'We will alert you 1 hour before entry opens'
              : 'Never miss an early-bird pool'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default NextGiveawayPreview;

import { Trophy, CheckCircle, Calendar } from 'lucide-react';
import { maskUserId } from '../../utils/masking';
import styles from './WinnerCard.module.css';

export function WinnerCard({ winner }) {
  if (!winner) return null;

  const displayId = maskUserId(winner.maskedUserId || winner.userId);
  const formattedDate = winner.wonAt instanceof Date
    ? winner.wonAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Recently';

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div
          className={styles.avatar}
          style={{ backgroundColor: winner.avatarColor || '#10B981' }}
          aria-hidden="true"
        >
          {displayId.slice(-2)}
        </div>
        <div className={styles.idWrap}>
          <span className={styles.userId}>{displayId}</span>
          <span className={styles.campaign}>{winner.campaign || 'Reward Rush'}</span>
        </div>
        <div className={styles.verifiedBadge} title="Cryptographically verified on-chain ledger">
          <CheckCircle size={12} />
          <span>Verified</span>
        </div>
      </div>

      <div className={styles.prizeSection}>
        <div className={styles.prizeIcon}>
          <Trophy size={18} />
        </div>
        <div className={styles.prizeDetails}>
          <span className={styles.prizeLabel}>Won Prize</span>
          <h4 className={styles.prizeName}>{winner.prizeName}</h4>
        </div>
      </div>

      <div className={styles.footer}>
        <Calendar size={13} className={styles.calendarIcon} />
        <span>Awarded on {formattedDate}</span>
      </div>
    </article>
  );
}

export default WinnerCard;

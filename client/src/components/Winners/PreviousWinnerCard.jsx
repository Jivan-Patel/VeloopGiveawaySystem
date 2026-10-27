import { Gift, Calendar } from 'lucide-react';
import { maskUserId } from '../../utils/masking';
import styles from './PreviousWinnerCard.module.css';

export function PreviousWinnerCard({ winner, isActive = false, onClick }) {
  if (!winner) return null;

  const displayId = maskUserId(winner.maskedUserId || winner.userId);
  const formattedDate = winner.wonAt instanceof Date
    ? winner.wonAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    : 'Concluded';

  return (
    <div
      className={`${styles.row} ${isActive ? styles.rowActive : ''} ${onClick ? styles.clickable : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      aria-current={isActive ? 'true' : undefined}
    >
      <div
        className={styles.avatar}
        style={{ backgroundColor: winner.avatarColor || '#3B82F6' }}
        aria-hidden="true"
      >
        {displayId.slice(-2)}
      </div>

      <div className={styles.info}>
        <div className={styles.topLine}>
          <span className={styles.userId}>{displayId}</span>
          <span className={styles.campaignBadge}>{winner.campaign || 'Past Draw'}</span>
          {isActive && <span className={styles.activePill}>Viewing</span>}
        </div>
        <div className={styles.prizeLine}>
          <Gift size={13} className={styles.giftIcon} />
          <span className={styles.prizeText}>{winner.prizeName}</span>
        </div>
      </div>

      <div className={styles.date}>
        <Calendar size={12} />
        <span>{formattedDate}</span>
      </div>
    </div>
  );
}

export default PreviousWinnerCard;

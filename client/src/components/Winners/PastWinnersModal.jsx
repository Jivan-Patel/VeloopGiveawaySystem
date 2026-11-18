import { useEffect } from 'react';
import { X, Trophy, Gift, Calendar, CheckCircle } from 'lucide-react';
import { MOCK_PAST_WINNERS } from '../../data/giveawayData';
import styles from './PastWinnersModal.module.css';

export function PastWinnersModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="past-winners-title">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <div className={styles.iconWrap}>
              <Trophy size={20} className={styles.trophyIcon} />
            </div>
            <div>
              <h2 id="past-winners-title" className={styles.title}>Verified Past Winners</h2>
              <p className={styles.subtitle}>Cryptographically drawn winners from concluded reward pools</p>
            </div>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        {/* Winners List */}
        <div className={styles.listArea}>
          {MOCK_PAST_WINNERS.map((w) => (
            <div key={w.id} className={styles.winnerRow}>
              <div className={styles.userBadge} style={{ backgroundColor: `${w.avatarColor}20`, borderColor: w.avatarColor }}>
                <span className={styles.userIdText} style={{ color: w.avatarColor }}>{w.maskedUserId}</span>
              </div>
              <div className={styles.infoCol}>
                <div className={styles.prizeLine}>
                  <Gift size={13} className={styles.giftIcon} />
                  <span className={styles.prizeName}>{w.prizeName}</span>
                </div>
                <div className={styles.metaLine}>
                  <span className={styles.campaignText}>{w.campaign}</span>
                  <span className={styles.dot}>•</span>
                  <span className={styles.dateText}>
                    <Calendar size={11} className={styles.calIcon} />
                    {new Date(w.wonAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <div className={styles.statusCol}>
                <span className={styles.verifiedChip}>
                  <CheckCircle size={12} />
                  <span>Verified</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <span className={styles.privacyNote}>User IDs are privacy-masked (VE****XX) in compliance with PRD privacy rules.</span>
          <button type="button" className={styles.closeActionBtn} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default PastWinnersModal;

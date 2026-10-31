import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Lock, ShieldCheck, ArrowRight, UserPlus, Coins } from 'lucide-react';
import styles from './LoginRequiredModal.module.css';

/**
 * LoginRequiredModal Component (PRD Section 128 & WD9 Milestone)
 * Accessible dialog guiding unauthenticated visitors to login or sign up
 * when attempting to enter a giveaway pool.
 */
export function LoginRequiredModal({ isOpen, onClose, giveawayTitle }) {
  // Accessibility focus trap & Escape key dismissal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const modalElement = document.getElementById('login-required-dialog');
        if (!modalElement) return;

        const focusables = modalElement.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        id="login-required-dialog"
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleWrap}>
            <div className={styles.iconCircle}>
              <Lock size={18} />
            </div>
            <div>
              <h2 id="login-modal-title" className={styles.modalTitle}>
                Authentication Required
              </h2>
              <p className={styles.modalSubtitle}>
                {giveawayTitle ? `Entry for ${giveawayTitle}` : 'Giveaway Pool Participation'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={styles.closeBtn}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className={styles.modalBody}>
          <div className={styles.noticeCard}>
            <p className={styles.noticeLead}>
              You must be logged into a verified VELOOP account to participate in prize pools.
            </p>

            <div className={styles.benefitsList}>
              <div className={styles.benefitItem}>
                <Coins size={15} className={styles.benefitIconGold} />
                <span>Spend your earned VE, SVE, or Tokens directly from your balance</span>
              </div>
              <div className={styles.benefitItem}>
                <ShieldCheck size={15} className={styles.benefitIconEmerald} />
                <span>Receive cryptographically verifiable tickets committed to the audit ledger</span>
              </div>
              <div className={styles.benefitItem}>
                <UserPlus size={15} className={styles.benefitIconCyan} />
                <span>Instant access to the 7-day winner claim portal upon draw finalization</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className={styles.actionColumn}>
            <Link to="/login" className={styles.loginBtn}>
              <Lock size={16} />
              <span>Log In to Existing Account</span>
              <ArrowRight size={15} />
            </Link>

            <Link to="/signup" className={styles.signupBtn}>
              <UserPlus size={16} />
              <span>Create New Account (Free)</span>
            </Link>

            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel & Continue Browsing
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <ShieldCheck size={13} className={styles.footerShield} />
          <span>Protected by 256-Bit SSL encryption & atomic transaction ledger</span>
        </div>
      </div>
    </div>
  );
}

export default LoginRequiredModal;

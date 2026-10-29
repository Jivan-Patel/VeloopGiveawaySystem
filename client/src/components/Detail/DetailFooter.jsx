import { Shield, Lock, Award } from 'lucide-react';
import styles from './DetailFooter.module.css';

/**
 * DetailFooter Component (PRD Section 128 & WD8 Milestone)
 * Compact footer tailored specifically for the Giveaway detail page.
 */
export function DetailFooter() {
  return (
    <footer className={styles.compactFooter}>
      <div className={styles.container}>
        <div className={styles.leftRow}>
          <div className={styles.badgeItem}>
            <Shield size={13} className={styles.iconEmerald} />
            <span>Cryptographic Ledger Verification</span>
          </div>
          <div className={styles.badgeItem}>
            <Lock size={13} className={styles.iconGold} />
            <span>256-Bit Encrypted Voucher Code Delivery</span>
          </div>
          <div className={styles.badgeItem}>
            <Award size={13} className={styles.iconCyan} />
            <span>Certified Genuine Rewards</span>
          </div>
        </div>

        <div className={styles.rightRow}>
          <span className={styles.copyright}>
            © 2026 VELOOP Giveaway System. All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default DetailFooter;

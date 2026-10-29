import { Coins, CheckCircle, AlertCircle } from 'lucide-react';
import { formatCurrencyAmount } from '../../config/currencies';
import styles from './DetailCard.module.css';

/**
 * BalancePanel Component (PRD Section 128)
 * Compares authenticated user's wallet against the required entry fee:
 * - Current balance
 * - Required fee
 * - Projected balance after join
 * - Clear sufficiency indication or deficit calculation
 */
export function BalancePanel({ currency, fee, userBalance }) {
  const isEnough = userBalance >= fee;
  const balanceAfter = Math.max(0, userBalance - fee);
  const deficit = fee - userBalance;

  return (
    <div className={styles.balancePanel}>
      <div className={styles.balanceHeader}>
        <Coins size={14} className={styles.balanceHeaderIcon} />
        <span className={styles.balanceTitle}>Wallet Balance Calculation</span>
      </div>

      <div className={styles.calcRows}>
        {/* Current Balance */}
        <div className={styles.calcRow}>
          <span className={styles.calcLabel}>Current {currency} Balance:</span>
          <span className={styles.calcValue}>
            {formatCurrencyAmount(userBalance, currency)}
          </span>
        </div>

        {/* Required Entry Fee */}
        <div className={styles.calcRow}>
          <span className={styles.calcLabel}>Required Entry Deduction:</span>
          <span className={styles.calcValueDeduct}>
            - {formatCurrencyAmount(fee, currency)}
          </span>
        </div>

        {/* Balance After */}
        <div className={`${styles.calcRow} ${styles.calcRowTotal}`}>
          <span className={styles.calcLabelTotal}>Balance After Joining:</span>
          <span className={isEnough ? styles.calcValueSuccess : styles.calcValueWarning}>
            {isEnough
              ? formatCurrencyAmount(balanceAfter, currency)
              : 'Insufficient Balance'}
          </span>
        </div>
      </div>

      {/* Status Chip */}
      <div className={styles.statusChipRow}>
        {isEnough ? (
          <div className={styles.sufficientBadge}>
            <CheckCircle size={13} />
            <span>Sufficient Balance to Enter</span>
          </div>
        ) : (
          <div className={styles.insufficientBadge}>
            <AlertCircle size={13} />
            <span>Short by {formatCurrencyAmount(deficit, currency)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default BalancePanel;

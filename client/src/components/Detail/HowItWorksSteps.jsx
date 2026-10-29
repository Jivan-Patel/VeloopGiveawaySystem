import { CheckCircle2, ListOrdered } from 'lucide-react';
import styles from './HowItWorksSteps.module.css';

const SEVEN_STEPS = [
  {
    stepNumber: '01',
    title: 'Check Eligibility & Wallet Balance',
    description: 'Ensure your account is active and verified, with sufficient VE, SVE, or Token balance to cover the required entry fee.'
  },
  {
    stepNumber: '02',
    title: 'Review Fixed Entry Fee & Currency',
    description: 'Each giveaway document sets a tamper-proof fixed fee and currency. No client-side manipulation is permitted.'
  },
  {
    stepNumber: '03',
    title: 'Atomic Entry & Idempotency Guarantee',
    description: 'Your entry is committed atomically in a single replica-set transaction with a unique idempotency key to prevent double debiting.'
  },
  {
    stepNumber: '04',
    title: 'Live Pool Countdown Concludes',
    description: 'Track the synchronized countdown. When the authoritative server clock reaches zero, entry submissions lock automatically.'
  },
  {
    stepNumber: '05',
    title: 'Deterministic Crypto-Random Draw',
    description: 'The backend executes crypto.randomInt over active participations, recording cryptographic proof of entropy and selection timestamps.'
  },
  {
    stepNumber: '06',
    title: 'Winner Notification & 7-Day Claim Window',
    description: 'Winners are announced on the verified winners showcase. A 7-calendar-day claim countdown opens in the claim portal.'
  },
  {
    stepNumber: '07',
    title: 'Insured Delivery or Instant Voucher Dispatch',
    description: 'Physical rewards are shipped with insured doorstep tracking; digital gift codes are dispatched directly to your registered email.'
  }
];

/**
 * HowItWorksSteps Component (PRD Section 128 & WD8 Milestone)
 * 7 sequential numbered steps explaining the complete lifecycle from balance check to delivery.
 */
export function HowItWorksSteps() {
  return (
    <div className={styles.sectionWrap}>
      <div className={styles.headerRow}>
        <div className={styles.iconBox}>
          <ListOrdered size={18} />
        </div>
        <div>
          <h2 className={styles.sectionTitle}>How This Giveaway Works</h2>
          <p className={styles.sectionSubtitle}>
            A 7-step transparent, tamper-proof gamified rewards lifecycle
          </p>
        </div>
      </div>

      <div className={styles.stepsContainer}>
        {SEVEN_STEPS.map((item, idx) => (
          <div key={idx} className={styles.stepCard}>
            <div className={styles.stepNumBadge}>
              <span>{item.stepNumber}</span>
            </div>
            <div className={styles.stepContent}>
              <div className={styles.stepTitleRow}>
                <h3 className={styles.stepTitle}>{item.title}</h3>
                <CheckCircle2 size={15} className={styles.checkIcon} />
              </div>
              <p className={styles.stepDescription}>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HowItWorksSteps;

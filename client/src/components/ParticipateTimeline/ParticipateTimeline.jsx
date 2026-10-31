import { Rocket, User, Coins, Ticket, Trophy, FileText, ArrowRight } from 'lucide-react';
import styles from './ParticipateTimeline.module.css';

/**
 * ParticipateTimeline Component - Modern Luxury Edition
 * Sleek gamified timeline with glowing step indicators, connecting progress beam,
 * and direct smooth scroll to official rules.
 */
export function ParticipateTimeline() {
  const steps = [
    {
      num: '01',
      icon: User,
      colorClass: styles.emeraldStep,
      title: '1. Create / Verify Account',
      desc: 'Sign up or login to activate your VELOOP rewards wallet.'
    },
    {
      num: '02',
      icon: Coins,
      colorClass: styles.cyanStep,
      title: '2. Select Drop & Entry Fee',
      desc: 'Pick your desired prize pool and pay entry in VE, SVE, or Tokens.'
    },
    {
      num: '03',
      icon: Ticket,
      colorClass: styles.purpleStep,
      title: '3. Receive Ledger Ticket',
      desc: 'Your entry ticket is cryptographically registered on the platform ledger.'
    },
    {
      num: '04',
      icon: Trophy,
      colorClass: styles.goldStep,
      title: '4. Win & Claim Prize',
      desc: 'Winners are randomly finalized on draw end with 7 days to claim.'
    }
  ];

  return (
    <aside className={styles.container} aria-label="How to participate instructions">
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <div className={styles.rocketIconWrap}>
            <Rocket size={18} className={styles.rocketIcon} />
          </div>
          <div>
            <h2 className={styles.title}>How to Join?</h2>
            <p className={styles.subtitle}>4 transparent steps to win rewards</p>
          </div>
        </div>
      </div>

      {/* Stepper Timeline */}
      <div className={styles.timeline}>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.num} className={styles.stepItem}>
              {/* Icon Circle & Vertical Connector Line */}
              <div className={styles.indicatorCol}>
                <div className={`${styles.iconCircle} ${step.colorClass}`}>
                  <Icon size={16} />
                </div>
                {!isLast && <div className={styles.connectorBeam} />}
              </div>

              {/* Text Description */}
              <div className={styles.contentCol}>
                <div className={styles.stepHeader}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <span className={styles.stepNumPill}>{step.num}</span>
                </div>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* View Rules Button */}
      <a
        href="#rules"
        className={styles.rulesButton}
        onClick={(e) => {
          e.preventDefault();
          const rulesEl = document.getElementById('rules-modal-trigger') || document.getElementById('rules') || document.getElementById('rules-section');
          if (rulesEl) rulesEl.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <FileText size={15} />
        <span>View Official Rules</span>
        <ArrowRight size={14} className={styles.arrowIcon} />
      </a>
    </aside>
  );
}

export default ParticipateTimeline;

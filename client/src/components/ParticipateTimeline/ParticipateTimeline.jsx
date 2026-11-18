import { Rocket, User, Zap, Gift, Trophy, FileText, ArrowRight } from 'lucide-react';
import styles from './ParticipateTimeline.module.css';

/**
 * ParticipateTimeline Component - Strictly Aligned with Ref_02.jpeg
 * Features:
 * - Header: "🚀 How to Participate?" + "Follow these simple steps to join and win."
 * - 4 Connected Steps:
 *   1. Sign Up / Login (Purple)
 *   2. Complete Tasks (Blue)
 *   3. Get Entries (Green)
 *   4. Win Rewards (Orange)
 * - Bottom Action: "📄 View Rules & Guidelines →" (opens clean modal)
 */
export function ParticipateTimeline({ onOpenRules }) {
  const steps = [
    {
      num: 1,
      icon: User,
      colorClass: styles.purpleStep,
      title: '1. Sign Up / Login',
      desc: 'Create your account or login to get started.'
    },
    {
      num: 2,
      icon: Zap,
      colorClass: styles.blueStep,
      title: '2. Complete Tasks',
      desc: 'Complete simple tasks and earn more entries.'
    },
    {
      num: 3,
      icon: Gift,
      colorClass: styles.greenStep,
      title: '3. Get Entries',
      desc: 'Each task gives you entries for the giveaway.'
    },
    {
      num: 4,
      icon: Trophy,
      colorClass: styles.orangeStep,
      title: '4. Win Rewards',
      desc: 'Winners are selected randomly after the giveaway ends.'
    }
  ];

  return (
    <aside className={styles.container} aria-label="How to participate instructions">
      {/* Header matching Ref_02.jpeg */}
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <div className={styles.rocketIconWrap}>
            <Rocket size={18} className={styles.rocketIcon} />
          </div>
          <div>
            <h2 className={styles.title}>How to Participate?</h2>
            <p className={styles.subtitle}>Follow these simple steps to join and win.</p>
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
                {!isLast && <div className={styles.connectorLine} />}
              </div>

              {/* Text Description */}
              <div className={styles.contentCol}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rules & Guidelines Trigger Button (Ref_02.jpeg) */}
      <button
        type="button"
        className={styles.rulesButton}
        onClick={onOpenRules}
        aria-label="View official giveaway rules and guidelines"
      >
        <FileText size={15} className={styles.rulesIcon} />
        <span>View Rules & Guidelines</span>
        <ArrowRight size={14} className={styles.rulesArrow} />
      </button>
    </aside>
  );
}

export default ParticipateTimeline;

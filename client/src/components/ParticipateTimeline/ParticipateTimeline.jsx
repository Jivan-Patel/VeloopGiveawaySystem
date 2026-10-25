import { Rocket, User, Target, Gift, Trophy, FileText, ArrowRight } from 'lucide-react';
import styles from './ParticipateTimeline.module.css';

/**
 * ParticipateTimeline Component - Strictly matching Ref_02.jpeg (Document last page)
 * "How to Participate?" sidebar panel with 4 connected step circles and guidelines CTA.
 */
export function ParticipateTimeline() {
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
      icon: Target,
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
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Rocket size={20} className={styles.rocketIcon} />
          <h2 className={styles.title}>How to Participate?</h2>
        </div>
        <p className={styles.subtitle}>Follow these simple steps to join and win.</p>
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
                {!isLast && <div className={styles.dashedLine} />}
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

      {/* View Rules Button */}
      <a
        href="#rules"
        className={styles.rulesButton}
        onClick={(e) => {
          e.preventDefault();
          const rulesEl = document.getElementById('rules-modal-trigger') || document.getElementById('rules');
          if (rulesEl) rulesEl.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <FileText size={16} />
        <span>View Rules & Guidelines</span>
        <ArrowRight size={15} />
      </a>
    </aside>
  );
}

export default ParticipateTimeline;

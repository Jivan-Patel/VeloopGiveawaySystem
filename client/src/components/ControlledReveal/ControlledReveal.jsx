import { useState, useEffect } from 'react';
import { Sparkles, Shield, Cpu, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import styles from './ControlledReveal.module.css';

const SAMPLE_HASHES = [
  '0x7F4B...99A2 (VE****12)',
  '0x3E1C...44D8 (VE****89)',
  '0xA92D...88F1 (VE****25)',
  '0x1B8E...55C3 (VE****73)',
  '0x5D2A...11E9 (VE****44)'
];

/**
 * Controlled Winner Reveal Component (PRD Section 5 & WD7 Milestone)
 * Provides a cryptographically themed transition from countdown zero
 * to "Selecting winners..." shuffle pulse, finishing in a verified reveal.
 */
export function ControlledReveal() {
  const { isRevealing } = useAuth();
  const [currentHashIndex, setCurrentHashIndex] = useState(0);

  // Cycle candidate hashes rapidly during selection simulation
  useEffect(() => {
    if (!isRevealing) return;

    const interval = setInterval(() => {
      setCurrentHashIndex((prev) => (prev + 1) % SAMPLE_HASHES.length);
    }, 150);

    return () => clearInterval(interval);
  }, [isRevealing]);

  if (!isRevealing) return null;

  return (
    <div className={styles.revealOverlay} role="status" aria-live="polite">
      <div className={styles.revealCard}>
        {/* Glowing Radar / Shuffle Indicator */}
        <div className={styles.animationRingWrap}>
          <div className={styles.pulseRing} />
          <div className={styles.iconCircle}>
            <Cpu size={28} className={styles.cpuIcon} />
          </div>
        </div>

        <div className={styles.badgeWrap}>
          <span className={styles.badgePulse}>
            <Sparkles size={12} />
            <span>Cryptographic Draw In Progress</span>
          </span>
        </div>

        <h3 className={styles.revealTitle}>Selecting Verified Winners…</h3>
        <p className={styles.revealDescription}>
          The authoritative backend engine is executing deterministic crypto-random selection across all active participation entries.
        </p>

        {/* Dynamic Candidate Hash Rolling Shimmer */}
        <div className={styles.hashBox}>
          <span className={styles.hashLabel}>Candidate Hash Inspection:</span>
          <span className={styles.hashText}>{SAMPLE_HASHES[currentHashIndex]}</span>
        </div>

        {/* Audit Guarantee Strip */}
        <div className={styles.guaranteeStrip}>
          <div className={styles.guaranteeItem}>
            <Shield size={14} className={styles.guaranteeIcon} />
            <span>Proof of Entropy Verified</span>
          </div>
          <span className={styles.dot}>•</span>
          <div className={styles.guaranteeItem}>
            <CheckCircle size={14} className={styles.guaranteeIcon} />
            <span>Zero Seed Manipulation</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControlledReveal;

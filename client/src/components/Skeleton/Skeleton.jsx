import React from 'react';
import styles from './Skeleton.module.css';

export function SkeletonText({ width = '100%', height = '1rem', className = '' }) {
  return (
    <div
      className={`${styles.skeletonPulse} ${styles.skeletonText} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className={styles.skeletonCard} aria-hidden="true">
      <div className={`${styles.skeletonPulse} ${styles.skeletonImage}`} />
      <SkeletonText width="40%" height="0.85rem" />
      <SkeletonText width="85%" height="1.4rem" className="my-2" />
      <SkeletonText width="100%" height="0.9rem" />
      <SkeletonText width="70%" height="0.9rem" />
      <div className="mt-auto pt-3 border-top border-subtle d-flex justify-content-between align-items-center">
        <SkeletonText width="30%" height="1.2rem" />
        <SkeletonText width="35%" height="2rem" />
      </div>
    </div>
  );
}

export function SkeletonCountdown() {
  return (
    <div className={`${styles.skeletonPulse} ${styles.skeletonCountdown}`} aria-hidden="true" />
  );
}

export default {
  Text: SkeletonText,
  Card: SkeletonCard,
  Countdown: SkeletonCountdown
};

import React, { useState, useEffect } from 'react';
import styles from './Countdown.module.css';

/**
 * Clean, readable Countdown Timer Component.
 * Pure React implementation with zero complex hooks.
 *
 * @param {string|Date} targetDate - The deadline timestamp
 * @param {Function} [onZero] - Callback invoked when timer hits zero
 * @param {'default'|'compact'} [variant='default'] - Visual density variant
 */
export function Countdown({ targetDate, onZero, variant = 'default' }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!targetDate) return;

    const targetTime = new Date(targetDate).getTime();

    // If target date is invalid or already in the past, no interval needed
    if (isNaN(targetTime) || targetTime <= Date.now()) {
      return;
    }

    // Tick every second until deadline is reached
    const timer = setInterval(() => {
      const current = Date.now();
      setNow(current);

      if (targetTime - current <= 0) {
        clearInterval(timer);
        if (typeof onZero === 'function') {
          onZero();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onZero]);

  // Derive remaining time directly during render (prevents cascading re-renders)
  const targetTime = (targetDate && !isNaN(new Date(targetDate).getTime()))
    ? new Date(targetDate).getTime()
    : 0;

  const difference = Math.max(0, targetTime - now);
  const totalSeconds = Math.floor(difference / 1000);
  const isEnded = targetTime === 0 || difference <= 0;

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num) => String(num).padStart(2, '0');
  const containerClass = `${styles.countdownContainer} ${variant === 'compact' ? styles.compact : ''}`;

  if (isEnded) {
    return (
      <div className={containerClass}>
        <div className={styles.verifyingState}>
          <div className={styles.pulseDot} />
          <span>Ended</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={containerClass}
      aria-label={`Time remaining: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`}
    >
      <div className={styles.countdownUnit}>
        <span className={styles.unitNumber}>{pad(days)}</span>
        <span className={styles.unitLabel}>Days</span>
      </div>
      <span className={styles.separator}>:</span>

      <div className={styles.countdownUnit}>
        <span className={styles.unitNumber}>{pad(hours)}</span>
        <span className={styles.unitLabel}>Hours</span>
      </div>
      <span className={styles.separator}>:</span>

      <div className={styles.countdownUnit}>
        <span className={styles.unitNumber}>{pad(minutes)}</span>
        <span className={styles.unitLabel}>Mins</span>
      </div>
      <span className={styles.separator}>:</span>

      <div className={styles.countdownUnit}>
        <span className={styles.unitNumber}>{pad(seconds)}</span>
        <span className={styles.unitLabel}>Secs</span>
      </div>
    </div>
  );
}

export default Countdown;

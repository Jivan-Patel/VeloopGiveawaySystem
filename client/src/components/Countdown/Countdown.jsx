import React, { useState, useEffect, useRef } from 'react';
import { useCountdown } from '../../hooks/useCountdown';
import styles from './Countdown.module.css';

/**
 * Accessible Countdown Component (PRD Section 6 & WD4 milestone)
 * Displays days, hours, minutes, and seconds calibrated to authoritative server time.
 * Features a throttled aria-live announcement region to prevent screen-reader spam.
 *
 * @param {string|Date} targetDate - The deadline timestamp
 * @param {string|Date} serverTime - Authoritative server time
 * @param {Function} [onZero] - Callback invoked when timer hits zero
 * @param {'default'|'compact'} [variant='default'] - Visual density variant
 */
export function Countdown({ targetDate, serverTime, onZero, variant = 'default' }) {
  const countdown = useCountdown(targetDate, serverTime, onZero);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  const lastAnnouncedTotalSecondsRef = useRef(null);

  // Throttled aria-live announcements
  useEffect(() => {
    if (countdown.isZero) {
      setLiveAnnouncement('Giveaway timer ended. Verifying results with server.');
      return;
    }

    const totalSeconds = Math.floor(countdown.totalMs / 1000);

    // Announce once every 60 seconds when > 1 min remains, or every 15s under 1 min
    const shouldAnnounce =
      lastAnnouncedTotalSecondsRef.current === null ||
      (totalSeconds > 60 && lastAnnouncedTotalSecondsRef.current - totalSeconds >= 60) ||
      (totalSeconds <= 60 && lastAnnouncedTotalSecondsRef.current - totalSeconds >= 15);

    if (shouldAnnounce) {
      lastAnnouncedTotalSecondsRef.current = totalSeconds;
      const text = `${countdown.days} days, ${countdown.hours} hours, and ${countdown.minutes} minutes remaining`;
      setLiveAnnouncement(text);
    }
  }, [countdown.totalMs, countdown.isZero, countdown.days, countdown.hours, countdown.minutes]);

  const pad = (n) => String(n).padStart(2, '0');
  const containerClass = `${styles.countdownContainer} ${variant === 'compact' ? styles.compact : ''}`;

  if (countdown.isZero) {
    return (
      <div className={containerClass}>
        <div className={styles.verifyingState} aria-label="Verifying with server">
          <div className={styles.pulseDot} />
          <span>{countdown.displayZeroMessage}</span>
        </div>
        {/* Throttled screen reader region */}
        <div aria-live="polite" className={styles.srOnly}>
          {liveAnnouncement}
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass} aria-label={`Time remaining: ${countdown.formatted}`}>
      {/* Visual countdown boxes */}
      <div className={styles.countdownUnit}>
        <span className={styles.unitNumber}>{countdown.days}</span>
        <span className={styles.unitLabel}>Days</span>
      </div>
      <span className={styles.separator}>:</span>

      <div className={styles.countdownUnit}>
        <span className={styles.unitNumber}>{pad(countdown.hours)}</span>
        <span className={styles.unitLabel}>Hours</span>
      </div>
      <span className={styles.separator}>:</span>

      <div className={styles.countdownUnit}>
        <span className={styles.unitNumber}>{pad(countdown.minutes)}</span>
        <span className={styles.unitLabel}>Mins</span>
      </div>
      <span className={styles.separator}>:</span>

      <div className={styles.countdownUnit}>
        <span className={styles.unitNumber}>{pad(countdown.seconds)}</span>
        <span className={styles.unitLabel}>Secs</span>
      </div>

      {/* Accessible throttled screen-reader announcement */}
      <div aria-live="polite" aria-atomic="true" className={styles.srOnly}>
        {liveAnnouncement}
      </div>
    </div>
  );
}

export default Countdown;

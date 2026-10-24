import React, { useState, useEffect } from 'react';
import { Gift } from 'lucide-react';
import styles from './ThemedLoader.module.css';

const DEFAULT_MESSAGES = [
  'Connecting to VELOOP Rewards Authority…',
  'Synchronizing active prize pools…',
  'Calibrating server-time clock offset…',
  'Verifying cryptographically signed state…'
];

/**
 * Themed brand loader supporting full-page overlay and inline card states.
 * Cycles informational messages no faster than every 2.5s per brief requirements.
 */
export function ThemedLoader({ fullScreen = false, messages = DEFAULT_MESSAGES, subText = 'Please hold on' }) {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (!messages || messages.length <= 1) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % messages.length);
        setFade(true);
      }, 300);
    }, 2600); // 2.6s cycle (honours "no faster than every 2.5 s")

    return () => clearInterval(interval);
  }, [messages]);

  const containerClass = fullScreen ? styles.loaderOverlay : styles.loaderInline;

  return (
    <div className={containerClass} role="status" aria-live="polite">
      <div className={styles.brandAura}>
        <div className={styles.pulseRing} />
        <div className={styles.pulseRingOuter} />
        <div className={styles.iconCore}>
          <Gift size={24} />
        </div>
      </div>

      <div
        className={styles.statusMessage}
        style={{ opacity: fade ? 1 : 0 }}
      >
        {messages[index] || messages[0]}
      </div>

      {subText && <div className={styles.subMessage}>{subText}</div>}
    </div>
  );
}

export default ThemedLoader;

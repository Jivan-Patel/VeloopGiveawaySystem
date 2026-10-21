import { useState, useEffect, useRef, useMemo } from 'react';

/**
 * Custom hook to manage accurate countdown timers with server-time offset calibration.
 * Prevents client clock manipulation and implements the "Verifying..." zero-state.
 *
 * @param {string|Date} targetDate - The deadline timestamp
 * @param {string|Date} serverTime - Authoritative server timestamp from the API payload
 * @param {Function} [onZero] - Callback invoked when the countdown hits zero
 */
export function useCountdown(targetDate, serverTime, onZero) {
  // Calculate difference between client clock and authoritative server clock
  const clockSkewOffset = useMemo(() => {
    if (!serverTime) return 0;
    const clientNow = Date.now();
    const authoritativeNow = new Date(serverTime).getTime();
    return authoritativeNow - clientNow;
  }, [serverTime]);

  const targetMs = useMemo(() => {
    return targetDate ? new Date(targetDate).getTime() : 0;
  }, [targetDate]);

  const calculateRemaining = () => {
    if (!targetMs) return { totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isZero: true };
    const currentAdjustedTime = Date.now() + clockSkewOffset;
    const diff = targetMs - currentAdjustedTime;

    if (diff <= 0) {
      return { totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isZero: true };
    }

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    return { totalMs: diff, days, hours, minutes, seconds, isZero: false };
  };

  const [timeLeft, setTimeLeft] = useState(calculateRemaining);
  const [isVerifying, setIsVerifying] = useState(false);
  const onZeroTriggeredRef = useRef(false);

  useEffect(() => {
    onZeroTriggeredRef.current = false;
    setTimeLeft(calculateRemaining());
  }, [targetMs, clockSkewOffset]);

  useEffect(() => {
    if (!targetMs) return;

    const interval = setInterval(() => {
      const updated = calculateRemaining();
      setTimeLeft(updated);

      if (updated.isZero) {
        clearInterval(interval);
        if (!onZeroTriggeredRef.current) {
          onZeroTriggeredRef.current = true;
          setIsVerifying(true);
          if (typeof onZero === 'function') {
            onZero();
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetMs, clockSkewOffset, onZero]);

  // Formatted string representations
  const pad = (n) => String(n).padStart(2, '0');
  const formatted = `${timeLeft.days}d ${pad(timeLeft.hours)}h ${pad(timeLeft.minutes)}m ${pad(timeLeft.seconds)}s`;

  return {
    ...timeLeft,
    isVerifying,
    formatted,
    displayZeroMessage: isVerifying ? 'Verifying with server…' : 'Ended'
  };
}

export default useCountdown;

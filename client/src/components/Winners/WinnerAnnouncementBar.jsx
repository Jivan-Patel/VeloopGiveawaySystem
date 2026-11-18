import { useState, useEffect } from 'react';
import { Trophy, ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react';
import styles from './WinnerAnnouncementBar.module.css';

const WINNER_ANNOUNCEMENTS = [
  { id: 1, user: 'VE****42', prize: 'iPhone 15 Pro', date: 'Just now', icon: '🎉' },
  { id: 2, user: 'VE****91', prize: 'Apple Watch Series 9', date: '2h ago', icon: '⚡' },
  { id: 3, user: 'VE****27', prize: 'AirPods Pro 2', date: '5h ago', icon: '🎁' },
  { id: 4, user: 'VE****92', prize: '₹2,000 Amazon Gift Card', date: '1d ago', icon: '🏆' },
  { id: 5, user: 'VE****88', prize: 'Apple Watch Series 9', date: '2d ago', icon: '✨' }
];

/**
 * WinnerAnnouncementBar Component - Fulfills Task Spec Section 18 & 19
 * Sleek, high-energy horizontal announcement ticker for live social proof.
 * Uses minimal vertical space (46px height) and auto-rotates with pause-on-hover.
 */
export function WinnerAnnouncementBar({ onOpenHistory }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isPaused || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % WINNER_ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, isHovered]);

  const current = WINNER_ANNOUNCEMENTS[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + WINNER_ANNOUNCEMENTS.length) % WINNER_ANNOUNCEMENTS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % WINNER_ANNOUNCEMENTS.length);
  };

  return (
    <div
      className={styles.tickerContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-label="Live Winner Announcements"
    >
      {/* Left Badge */}
      <div className={styles.badgePill}>
        <Trophy size={14} className={styles.badgeIcon} />
        <span className={styles.badgeText}>RECENT WINNER</span>
      </div>

      {/* Center Message */}
      <div className={styles.messageTrack}>
        <div key={current.id} className={styles.messageContent}>
          <span className={styles.emojiIcon}>{current.icon}</span>
          <span className={styles.userText}>{current.user}</span>
          <span className={styles.actionText}>just won</span>
          <span className={styles.prizeText}>{current.prize}!</span>
          <span className={styles.timeTag}>({current.date})</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className={styles.controlsArea}>
        {onOpenHistory && (
          <button
            type="button"
            className={styles.historyBtn}
            onClick={onOpenHistory}
            title="View Past Winners History"
          >
            <Sparkles size={12} />
            <span>Past Winners</span>
          </button>
        )}

        <div className={styles.arrowGroup}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={handlePrev}
            aria-label="Previous winner"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            className={styles.pauseBtn}
            onClick={() => setIsPaused((prev) => !prev)}
            aria-label={isPaused ? 'Resume auto-rotation' : 'Pause auto-rotation'}
          >
            {isPaused ? <Play size={10} /> : <Pause size={10} />}
          </button>
          <button
            type="button"
            className={styles.navBtn}
            onClick={handleNext}
            aria-label="Next winner"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default WinnerAnnouncementBar;

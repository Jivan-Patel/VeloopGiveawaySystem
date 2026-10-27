import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import WinnerCard from './WinnerCard';
import styles from './WinnerSlider.module.css';

export function WinnerSlider({ winners = [], activeIndex: controlledIndex, onChangeIndex }) {
  const [internalIndex, setInternalIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);

  const isControlled = typeof controlledIndex === 'number';
  const currentIndex = isControlled ? controlledIndex : internalIndex;
  const total = winners.length;

  const setIndex = (newIndex) => {
    if (isControlled && typeof onChangeIndex === 'function') {
      onChangeIndex(newIndex);
    } else {
      setInternalIndex(newIndex);
    }
  };

  useEffect(() => {
    if (total <= 1) return;

    // Check prefers-reduced-motion preference
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReducedMotion || isHovered || isManuallyPaused) {
      return;
    }

    const timer = setInterval(() => {
      const nextIdx = (currentIndex + 1) % total;
      if (isControlled && typeof onChangeIndex === 'function') {
        onChangeIndex(nextIdx);
      } else {
        setInternalIndex(nextIdx);
      }
    }, 4500);

    return () => clearInterval(timer);
  }, [total, isHovered, isManuallyPaused, currentIndex, isControlled, onChangeIndex]);

  if (!total) {
    return null;
  }

  const handlePrev = () => {
    setIndex((currentIndex - 1 + total) % total);
  };

  const handleNext = () => {
    setIndex((currentIndex + 1) % total);
  };

  const activeWinner = winners[currentIndex] || winners[0];

  return (
    <div
      className={styles.sliderContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsHovered(true)}
      onBlurCapture={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      role="region"
      aria-label="Flagship Winners Carousel"
      aria-roledescription="carousel"
    >
      <div key={activeWinner.id} className={styles.cardWrapper}>
        <WinnerCard winner={activeWinner} />
      </div>

      {total > 1 && (
        <div className={styles.controls}>
          <div className={styles.navButtons}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={handlePrev}
              aria-label="Previous winner"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              className={styles.pauseBtn}
              onClick={() => setIsManuallyPaused((prev) => !prev)}
              aria-label={isManuallyPaused ? 'Resume auto-rotation' : 'Pause auto-rotation'}
            >
              {isManuallyPaused ? <Play size={12} /> : <Pause size={12} />}
            </button>

            <button
              type="button"
              className={styles.navBtn}
              onClick={handleNext}
              aria-label="Next winner"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className={styles.dots} aria-hidden="true">
            {winners.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`${styles.dot} ${idx === currentIndex ? styles.activeDot : ''}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to winner slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WinnerSlider;

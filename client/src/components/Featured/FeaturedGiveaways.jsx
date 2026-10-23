import React, { useState, useMemo } from 'react';
import { Sparkles, SlidersHorizontal, ChevronRight, ChevronLeft, ArrowRightLeft } from 'lucide-react';
import { GIVEAWAY_STATUS } from '../../config/giveawayStatus';
import PrizeCard from '../Cards/PrizeCard';
import styles from './FeaturedGiveaways.module.css';

/**
 * FeaturedGiveaways Component (PRD Section 6 & WD4)
 * Responsive prize pool showcase:
 * - Desktop: 3-column structured grid
 * - Tablet: 2-column balanced grid
 * - Mobile (<768px): Touch-friendly scroll-snap horizontal carousel
 */
export function FeaturedGiveaways({ giveaways = [], serverTime, onTimerZero }) {
  const [filter, setFilter] = useState('ALL');

  const counts = useMemo(() => {
    return {
      ALL: giveaways.length,
      ACTIVE: giveaways.filter((g) => g.status === GIVEAWAY_STATUS.ACTIVE).length,
      UPCOMING: giveaways.filter((g) => g.status === GIVEAWAY_STATUS.UPCOMING).length,
      ENDED: giveaways.filter((g) => g.status === GIVEAWAY_STATUS.ENDED || g.status === GIVEAWAY_STATUS.ARCHIVED).length
    };
  }, [giveaways]);

  const filteredGiveaways = useMemo(() => {
    if (filter === 'ALL') return giveaways;
    if (filter === 'ENDED') {
      return giveaways.filter((g) => g.status === GIVEAWAY_STATUS.ENDED || g.status === GIVEAWAY_STATUS.ARCHIVED);
    }
    return giveaways.filter((g) => g.status === filter);
  }, [giveaways, filter]);

  return (
    <section id="featured-pools" className={styles.container}>
      {/* Header and Filter Controls */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h2>Featured Prize Pools</h2>
          <p className={styles.subtitle}>
            Explore reward pools backed by single-entry limits and verified random distribution
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className={styles.filterControls} role="tablist" aria-label="Giveaway status filters">
          <button
            role="tab"
            aria-selected={filter === 'ALL'}
            className={`${styles.filterTab} ${filter === 'ALL' ? styles.filterTabActive : ''}`}
            onClick={() => setFilter('ALL')}
          >
            All Pools ({counts.ALL})
          </button>
          <button
            role="tab"
            aria-selected={filter === 'ACTIVE'}
            className={`${styles.filterTab} ${filter === 'ACTIVE' ? styles.filterTabActive : ''}`}
            onClick={() => setFilter('ACTIVE')}
          >
            Live Now ({counts.ACTIVE})
          </button>
          <button
            role="tab"
            aria-selected={filter === 'UPCOMING'}
            className={`${styles.filterTab} ${filter === 'UPCOMING' ? styles.filterTabActive : ''}`}
            onClick={() => setFilter('UPCOMING')}
          >
            Upcoming ({counts.UPCOMING})
          </button>
          <button
            role="tab"
            aria-selected={filter === 'ENDED'}
            className={`${styles.filterTab} ${filter === 'ENDED' ? styles.filterTabActive : ''}`}
            onClick={() => setFilter('ENDED')}
          >
            Past Draws ({counts.ENDED})
          </button>
        </div>
      </div>

      {/* Grid on Desktop/Tablet & Scroll-Snap Carousel on Mobile */}
      {filteredGiveaways.length > 0 ? (
        <>
          <div className={styles.grid}>
            {filteredGiveaways.map((gw) => (
              <div key={gw.giveawayId} className={styles.carouselItem}>
                <PrizeCard
                  giveaway={gw}
                  serverTime={serverTime}
                  onTimerZero={onTimerZero}
                />
              </div>
            ))}
          </div>

          <div className={styles.mobileSwipeHint}>
            <ArrowRightLeft size={14} className="text-gold" />
            <span>Swipe horizontally to browse all prize pools</span>
          </div>
        </>
      ) : (
        <div className={styles.emptyState}>
          <p className="mb-0">No giveaways found in the selected category.</p>
        </div>
      )}
    </section>
  );
}

export default FeaturedGiveaways;

import { useState, useEffect } from 'react';
import { Gift, Users, Trophy, Clock } from 'lucide-react';
import styles from './GiveawayStats.module.css';

/**
 * GiveawayStats Component - Modern Luxury Command Strip
 * 4 Horizontal items in an elevated dark glass strip:
 * 1. Total Giveaways (24 Active with live indicator)
 * 2. Total Participants (8.5K+ Verified Entries)
 * 3. Prizes Won (1.2K+ Rewards Dispatched)
 * 4. Ends In (12d : 08h : 45m Remaining)
 */
export function GiveawayStats({ stats }) {
  // Live ticking countdown for the "Ends In" stat (12d : 08h : 45m)
  const [now, setNow] = useState(() => Date.now());
  const [targetTime] = useState(() => Date.now() + (12 * 86400 + 8 * 3600 + 45 * 60) * 1000);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Derive remaining time directly during render (zero cascading renders)
  const diff = Math.max(0, targetTime - now);
  const days = Math.floor(diff / 86400000);
  const hours = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
  const minutes = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');

  const totalGiveaways = stats?.totalGiveaways || 24;
  const participants = stats?.totalParticipantsLabel || '8.5K+';
  const prizesWon = stats?.prizesWonLabel || '1.2K+';

  return (
    <div className={styles.statsStrip} role="region" aria-label="Giveaway summary statistics">
      {/* 1. Total Giveaways */}
      <div className={styles.statCard}>
        <div className={`${styles.iconContainer} ${styles.emeraldIcon}`}>
          <Gift size={20} />
        </div>
        <div className={styles.statText}>
          <div className={styles.statLabel}>Active Pools</div>
          <div className={styles.statValue}>
            <span>{totalGiveaways}</span>
            <span className={styles.statusPillActive}>
              <span className={styles.pulseDot} />
              <span>Live</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Total Participants */}
      <div className={styles.statCard}>
        <div className={`${styles.iconContainer} ${styles.cyanIcon}`}>
          <Users size={20} />
        </div>
        <div className={styles.statText}>
          <div className={styles.statLabel}>Total Participants</div>
          <div className={styles.statValue}>
            <span>{participants}</span>
            <span className={styles.subLabel}>Entries</span>
          </div>
        </div>
      </div>

      {/* 3. Prizes Won */}
      <div className={styles.statCard}>
        <div className={`${styles.iconContainer} ${styles.goldIcon}`}>
          <Trophy size={20} />
        </div>
        <div className={styles.statText}>
          <div className={styles.statLabel}>Prizes Won</div>
          <div className={styles.statValue}>
            <span>{prizesWon}</span>
            <span className={styles.subLabel}>Rewarded</span>
          </div>
        </div>
      </div>

      {/* 4. Ends In Live Timer */}
      <div className={styles.statCard}>
        <div className={`${styles.iconContainer} ${styles.amberIcon}`}>
          <Clock size={20} />
        </div>
        <div className={styles.statText}>
          <div className={styles.statLabel}>Pool Draw In</div>
          <div className={styles.statValue}>
            <span className={styles.timerDigits}>
              {days}d : {hours}h : {minutes}m
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GiveawayStats;

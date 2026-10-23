import React, { useState, useEffect } from 'react';
import { Gift, Users, Trophy, Clock } from 'lucide-react';
import styles from './GiveawayStats.module.css';

/**
 * GiveawayStats Component - Strictly matching Ref_02.jpeg (Document last page)
 * 4 Horizontal items in an elevated dark glass strip:
 * 1. Total Giveaways (24 Active)
 * 2. Total Participants (8.5K+ Users)
 * 3. Prizes Won (1.2K+ Rewards)
 * 4. Ends In (12d : 08h : 45m Remaining)
 */
export function GiveawayStats({ stats, serverTime }) {
  // Live ticking countdown for the "Ends In" stat (12d : 08h : 45m)
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 8, minutes: 45, seconds: 12 });

  useEffect(() => {
    // 12 days, 8 hours, 45 minutes target
    const target = Date.now() + (12 * 86400 + 8 * 3600 + 45 * 60) * 1000;
    const interval = setInterval(() => {
      const diff = Math.max(0, target - Date.now());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalGiveaways = stats?.totalGiveaways || 24;
  const participants = stats?.totalParticipantsLabel || '8.5K+ Users';
  const prizesWon = stats?.prizesWonLabel || '1.2K+ Rewards';

  return (
    <div className={styles.statsStrip} role="region" aria-label="Giveaway summary statistics">
      {/* 1. Total Giveaways */}
      <div className={styles.statCard}>
        <div className={`${styles.iconContainer} ${styles.purpleIcon}`}>
          <Gift size={20} />
        </div>
        <div className={styles.statText}>
          <div className={styles.statLabel}>Total Giveaways</div>
          <div className={styles.statValue}>
            <span>{totalGiveaways}</span>{' '}
            <span className={styles.purpleAccent}>Active</span>
          </div>
        </div>
      </div>

      {/* 2. Total Participants */}
      <div className={styles.statCard}>
        <div className={`${styles.iconContainer} ${styles.blueIcon}`}>
          <Users size={20} />
        </div>
        <div className={styles.statText}>
          <div className={styles.statLabel}>Total Participants</div>
          <div className={styles.statValue}>
            <span>{participants}</span>
          </div>
        </div>
      </div>

      {/* 3. Prizes Won */}
      <div className={styles.statCard}>
        <div className={`${styles.iconContainer} ${styles.greenIcon}`}>
          <Trophy size={20} />
        </div>
        <div className={styles.statText}>
          <div className={styles.statLabel}>Prizes Won</div>
          <div className={styles.statValue}>
            <span>{prizesWon}</span>
          </div>
        </div>
      </div>

      {/* 4. Ends In Live Timer */}
      <div className={styles.statCard}>
        <div className={`${styles.iconContainer} ${styles.orangeIcon}`}>
          <Clock size={20} />
        </div>
        <div className={styles.statText}>
          <div className={styles.statLabel}>Ends In</div>
          <div className={styles.statValue}>
            <span className={styles.timerDigits}>
              {timeLeft.days}d : {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m
            </span>{' '}
            <span className={styles.orangeAccent}>Remaining</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GiveawayStats;

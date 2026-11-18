import { useState, useEffect } from 'react';
import { Gift, Users, Trophy, Clock } from 'lucide-react';
import styles from './GiveawayStats.module.css';

/**
 * GiveawayStats Component - Strictly Aligned with Ref_02.jpeg
 * 4 Horizontal items in an elevated dark glassmorphism pill HUD:
 * 1. Total Giveaways -> 24 Active (Purple)
 * 2. Total Participants -> 8.5K+ Users (Blue)
 * 3. Prizes Won -> 1.2K+ Rewards (Green)
 * 4. Ends In -> 12d : 08h : 45m Remaining (Orange)
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
  const participants = stats?.totalParticipants ? `${(stats.totalParticipants / 1000).toFixed(1)}K+` : '8.5K+';
  const prizesWon = stats?.prizesWon ? `${(stats.prizesWon / 1000).toFixed(1)}K+` : '1.2K+';

  return (
    <div className={styles.statsStrip} role="region" aria-label="Giveaway summary statistics">
      {/* 1. Total Giveaways (Purple) */}
      <div className={styles.statCard}>
        <div className={`${styles.iconContainer} ${styles.purpleIcon}`}>
          <Gift size={20} />
        </div>
        <div className={styles.statText}>
          <div className={styles.statLabel}>Total Giveaways</div>
          <div className={styles.statValue}>
            <span className={styles.primaryNum}>{totalGiveaways}</span>
            <span className={styles.purpleTag}>Active</span>
          </div>
        </div>
      </div>

      {/* 2. Total Participants (Blue) */}
      <div className={styles.statCard}>
        <div className={`${styles.iconContainer} ${styles.blueIcon}`}>
          <Users size={20} />
        </div>
        <div className={styles.statText}>
          <div className={styles.statLabel}>Total Participants</div>
          <div className={styles.statValue}>
            <span className={styles.primaryNum}>{participants}</span>
            <span className={styles.blueTag}>Users</span>
          </div>
        </div>
      </div>

      {/* 3. Prizes Won (Green) */}
      <div className={styles.statCard}>
        <div className={`${styles.iconContainer} ${styles.greenIcon}`}>
          <Trophy size={20} />
        </div>
        <div className={styles.statText}>
          <div className={styles.statLabel}>Prizes Won</div>
          <div className={styles.statValue}>
            <span className={styles.primaryNum}>{prizesWon}</span>
            <span className={styles.greenTag}>Rewards</span>
          </div>
        </div>
      </div>

      {/* 4. Ends In (Orange) */}
      <div className={styles.statCard}>
        <div className={`${styles.iconContainer} ${styles.orangeIcon}`}>
          <Clock size={20} />
        </div>
        <div className={styles.statText}>
          <div className={styles.statLabel}>Ends In</div>
          <div className={styles.statValue}>
            <span className={styles.timerDigits}>
              {days}d : {hours}h : {minutes}m
            </span>
            <span className={styles.orangeTag}>Remaining</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GiveawayStats;

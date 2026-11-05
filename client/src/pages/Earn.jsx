import { Link } from 'react-router-dom';
import { Zap, Award, Coins, ArrowRight, Sparkles } from 'lucide-react';
import styles from './Earn.module.css';

export function Earn() {
  const ways = [
    {
      title: 'Platform Missions & Surveys',
      reward: '+250 VE',
      desc: 'Complete daily engagement tasks, product feedbacks, and interactive learning modules to earn standard VE tokens.',
      icon: <Zap className="text-emerald" size={24} />
    },
    {
      title: 'Milestone Streaks',
      reward: '+500 SVE',
      desc: 'Maintain a 7-day active participation streak on VELOOP to unlock rare Super Veloop Entries for tier-1 gadget pools.',
      icon: <Award className="text-gold" size={24} />
    },
    {
      title: 'Community Referrals',
      reward: '+1,000 Tokens',
      desc: 'Invite your peers to VELOOP. Both of you receive instant reward tokens once they register their verified account.',
      icon: <Coins className="text-amber" size={24} />
    }
  ];

  return (
    <div className={styles.earnPage}>
      <div className={`${styles.ambientOrb} ${styles.ambientTop}`} />

      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.eyebrow}>
            <Sparkles size={14} />
            <span>VELOOP Reward Hub</span>
          </div>
          <h1 className={styles.title}>How to Earn Entries</h1>
          <p className={styles.subtitle}>
            Participate in activities across the VELOOP ecosystem to collect VE, SVE, and Reward Tokens for our exclusive prize draws.
          </p>
        </div>

        <div className={styles.grid}>
          {ways.map((w, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.iconWrap}>{w.icon}</div>
                <span className={styles.rewardBadge}>{w.reward}</span>
              </div>
              <h3 className={styles.cardTitle}>{w.title}</h3>
              <p className={styles.cardDesc}>{w.desc}</p>
              <button type="button" className={styles.actionBtn}>
                <span>Start Mission</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className={styles.bottomCta}>
          <Link to="/giveaway" className={styles.backBtn}>
            <span>Return to Giveaway Pools</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Earn;

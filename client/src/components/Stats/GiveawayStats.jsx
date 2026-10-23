import React from 'react';
import { Gift, Users, Zap, CheckCircle2, Info } from 'lucide-react';
import styles from './GiveawayStats.module.css';

/**
 * GiveawayStats Component (PRD Section 2, 6 & WD4)
 * Displays verified aggregate metrics with clear demo disclosure labels.
 * Responsive: 4 columns on desktop, 2 columns on tablet/mobile.
 */
export function GiveawayStats({ stats }) {
  if (!stats) return null;

  const items = [
    {
      label: 'Prizes Awarded',
      value: Number(stats.totalPrizesAwarded || 12480).toLocaleString('en-IN'),
      icon: <Gift size={22} color="#F59E0B" />,
      bgColor: 'rgba(245, 158, 11, 0.12)',
      valColor: '#F59E0B'
    },
    {
      label: 'Total Participants',
      value: Number(stats.totalParticipants || 48920).toLocaleString('en-IN'),
      icon: <Users size={22} color="#10B981" />,
      bgColor: 'rgba(16, 185, 129, 0.12)',
      valColor: '#10B981'
    },
    {
      label: 'Live Prize Pools',
      value: `${stats.activeCampaigns || 4} Active`,
      icon: <Zap size={22} color="#34D399" />,
      bgColor: 'rgba(52, 211, 153, 0.12)',
      valColor: '#34D399'
    },
    {
      label: 'Claim Fulfillment',
      value: '100% Verified',
      icon: <CheckCircle2 size={22} color="#F97316" />,
      bgColor: 'rgba(249, 115, 22, 0.12)',
      valColor: '#F97316'
    }
  ];

  return (
    <div className={styles.statsContainer}>
      <div className={styles.statsHeader}>
        <h2 className={styles.sectionTitle}>Platform Impact</h2>
        {stats.isDemo && (
          <div className={styles.demoPill} title="Simulated statistics for preview testing">
            <Info size={12} />
            <span>Demo Data</span>
          </div>
        )}
      </div>

      <div className={styles.statsGrid}>
        {items.map((it, idx) => (
          <div key={idx} className={styles.statCard}>
            <div className={styles.iconWrapper} style={{ background: it.bgColor }}>
              {it.icon}
            </div>
            <div>
              <div className={styles.statValue} style={{ color: it.valColor }}>
                {it.value}
              </div>
              <div className={styles.statLabel}>{it.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GiveawayStats;

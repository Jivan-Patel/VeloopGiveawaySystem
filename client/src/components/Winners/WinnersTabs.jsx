import { useState } from 'react';
import { Trophy, History, Clock, Sparkles } from 'lucide-react';
import { MOCK_PAST_WINNERS } from '../../data/giveawayData';
import WinnerSlider from './WinnerSlider';
import PreviousWinnerCard from './PreviousWinnerCard';
import styles from './WinnersTabs.module.css';

export function WinnersTabs({ winners = MOCK_PAST_WINNERS, livePoolsCount = 4 }) {
  const [activeTab, setActiveTab] = useState('recent'); // 'recent' | 'previous'
  const [selectedWinnerIndex, setSelectedWinnerIndex] = useState(0);

  return (
    <section className={styles.section} aria-labelledby="winners-heading">
      <div className={styles.header}>
        <div className={styles.badge}>
          <Sparkles size={14} className={styles.badgeIcon} />
          <span>Hall of Fame</span>
        </div>
        <h2 id="winners-heading" className={styles.title}>
          Verified Giveaway Winners
        </h2>
        <p className={styles.subtitle}>
          All prize draws are cryptographically resolved and logged on our authoritative backend.
        </p>
      </div>

      {/* ARIA Tabs Navigation */}
      <div className={styles.tabList} role="tablist" aria-label="Winners View Selection">
        <button
          type="button"
          id="tab-recent"
          role="tab"
          aria-selected={activeTab === 'recent'}
          aria-controls="panel-recent"
          className={`${styles.tabBtn} ${activeTab === 'recent' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('recent')}
        >
          <Trophy size={15} />
          <span>Recent Winners ({winners.length})</span>
        </button>

        <button
          type="button"
          id="tab-previous"
          role="tab"
          aria-selected={activeTab === 'previous'}
          aria-controls="panel-previous"
          className={`${styles.tabBtn} ${activeTab === 'previous' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('previous')}
        >
          <History size={15} />
          <span>Campaign Archive</span>
        </button>
      </div>

      {/* Still-Live Status Disclosure */}
      {livePoolsCount > 0 && (
        <div className={styles.liveNotice} role="status">
          <Clock size={14} className={styles.clockIcon} />
          <span>
            {livePoolsCount} pools currently <strong>LIVE</strong>. Entries remain open until timers reach zero.
          </span>
        </div>
      )}

      {/* Tab Panels */}
      {activeTab === 'recent' && (
        <div
          id="panel-recent"
          role="tabpanel"
          aria-labelledby="tab-recent"
          className={styles.tabPanel}
        >
          {winners.length > 0 ? (
            <div className={styles.recentGrid}>
              <div className={styles.sliderCol}>
                <WinnerSlider
                  winners={winners}
                  activeIndex={selectedWinnerIndex}
                  onChangeIndex={setSelectedWinnerIndex}
                />
              </div>
              <div className={styles.listCol}>
                {winners.slice(0, 3).map((w, idx) => (
                  <PreviousWinnerCard
                    key={w.id}
                    winner={w}
                    isActive={idx === selectedWinnerIndex}
                    onClick={() => setSelectedWinnerIndex(idx)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <Trophy size={32} className={styles.emptyIcon} />
              <p className={styles.emptyTitle}>No Winners Announced Yet</p>
              <p className={styles.emptyText}>
                Active pools will reveal verified winners immediately upon countdown expiration.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'previous' && (
        <div
          id="panel-previous"
          role="tabpanel"
          aria-labelledby="tab-previous"
          className={styles.tabPanel}
        >
          {winners.length > 0 ? (
            <div className={styles.archiveGrid}>
              {winners.map((w) => (
                <PreviousWinnerCard key={w.id} winner={w} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>No historical campaign archive available.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default WinnersTabs;

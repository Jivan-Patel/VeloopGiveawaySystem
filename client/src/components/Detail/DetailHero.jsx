import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Award, ShieldCheck } from 'lucide-react';
import { Countdown } from '../Countdown/Countdown';
import { getStatusBadgeConfig } from '../../config/giveawayStatus';
import styles from './DetailHero.module.css';

/**
 * DetailHero Component (PRD Section 128 & WD8 Milestone)
 * Displays:
 * - Responsive back navigation (Desktop: "Giveaway Home", Mobile: "← Giveaway")
 * - Category rank badge & live status indicator
 * - High-res product image with ambient radial glow
 * - Title, campaign, retail value, and sync countdown timer
 */
export function DetailHero({ giveaway, onTimerZero }) {
  if (!giveaway) return null;

  const {
    title,
    subtitle,
    campaign,
    prize = {},
    status,
    winnersStatus,
    endAt
  } = giveaway;

  const badgeConfig = getStatusBadgeConfig(status, winnersStatus);
  const accentColor = prize.accentColor || '#8B5CF6';
  const badgeColor = prize.badgeColor || '#F59E0B';
  const rankBadge = prize.badge || 'Featured Prize';
  const imageSrc = prize.localImage || prize.image;

  return (
    <div className={styles.heroContainer} style={{ '--prize-accent': accentColor }}>
      {/* Responsive Back Navigation (PRD Spec line 128) */}
      <div className={styles.navRow}>
        <Link to="/giveaway" className={styles.backLink} aria-label="Back to giveaways">
          <ArrowLeft size={16} className={styles.backIcon} />
          <span className={styles.desktopNavText}>Giveaway Home</span>
          <span className={styles.mobileNavText}>Giveaway</span>
        </Link>
        <div className={styles.campaignPill}>
          <ShieldCheck size={13} className={styles.shieldIcon} />
          <span>{campaign || 'Summer Rewards 2026'}</span>
        </div>
      </div>

      <div className={styles.heroGrid}>
        {/* Left Column: Product Showcase with Ambient Glow */}
        <div className={styles.imageColumn}>
          <div className={styles.imageCard}>
            <div className={styles.ambientGlow} aria-hidden="true" />
            <div className={styles.topBadgesRow}>
              <span className={styles.rankBadge} style={{ backgroundColor: badgeColor }}>
                <Award size={12} />
                <span>{rankBadge}</span>
              </span>
              <span
                className={styles.statusBadge}
                style={{
                  backgroundColor: badgeConfig.bgColor,
                  color: badgeConfig.color
                }}
              >
                {badgeConfig.label}
              </span>
            </div>

            <div className={styles.imageWrapper}>
              <img
                src={imageSrc}
                alt={prize.name || title}
                className={styles.productImg}
                onError={(e) => {
                  if (prize.localImage && e.currentTarget.src !== prize.localImage) {
                    e.currentTarget.src = prize.localImage;
                  }
                }}
              />
            </div>

            {prize.retailValue && (
              <div className={styles.retailBadge}>
                <span className={styles.retailLabel}>Market Value:</span>
                <span className={styles.retailVal}>{prize.retailValue}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Title, Subtitle, and Live Countdown */}
        <div className={styles.contentColumn}>
          <div className={styles.titleArea}>
            <span className={styles.categoryPill}>{prize.type || 'REWARD'}</span>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>{subtitle || giveaway.description}</p>
          </div>

          {/* Synchronized Countdown Strip */}
          <div className={styles.countdownBox}>
            <div className={styles.countdownHeader}>
              <Clock size={15} className={styles.clockIcon} />
              <span className={styles.countdownTitle}>Time Remaining in This Draw</span>
            </div>
            <div className={styles.timerWrap}>
              <Countdown targetDate={endAt} onZero={onTimerZero} />
            </div>
            <span className={styles.countdownSub}>
              Entries close automatically when countdown expires. Verified on authoritative server clock.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailHero;

import React from 'react';
import { Sparkles, ShieldCheck, Lock, Award, ArrowRight, Zap } from 'lucide-react';
import styles from './GiveawayHero.module.css';

/**
 * GiveawayHero Component (WD3 Milestone)
 * Rich visual composition with floating vector art, truthful non-deceptive copy,
 * and restrained motion respecting user preferences.
 */
export function GiveawayHero({ onExploreClick }) {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroGlow} aria-hidden="true" />

      <div className="row align-items-center g-5">
        {/* Left Column: Typography & CTAs */}
        <div className={`col-12 col-lg-7 ${styles.heroContent}`}>
          <div className={styles.badgePill}>
            <Sparkles size={15} className="text-gold" />
            <span className={styles.badgePillText}>Official Reward Pools · 2026</span>
          </div>

          <h1 className={styles.heroTitle}>
            Transparent Giveaways.{' '}
            <span className="gradient-text-gold">Real Flagship Rewards.</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Redeem your promotional Veloop Entries for verified prize draws. Engineered with single-entry limits, authoritative backend winner selection, and zero casino mechanics.
          </p>

          <div className={styles.ctaGroup}>
            <a
              href="#featured-pools"
              onClick={onExploreClick}
              className="btn btn-primary-gradient px-4 py-3 d-inline-flex align-items-center gap-2"
            >
              <span>Explore Live Giveaways</span>
              <ArrowRight size={16} />
            </a>
            <a href="/earn" className="btn btn-outline-light px-4 py-3 d-inline-flex align-items-center gap-2">
              <Zap size={16} className="text-gold" />
              <span>How to Earn Entries</span>
            </a>
          </div>

          <div className={styles.trustPoints}>
            <div className={styles.trustItem}>
              <ShieldCheck size={16} className={styles.trustIcon} />
              <span>Verifiable Backend Draw</span>
            </div>
            <div className={styles.trustItem}>
              <Lock size={16} className={styles.trustIcon} />
              <span>1 Entry Per Account</span>
            </div>
            <div className={styles.trustItem}>
              <Award size={16} className={styles.trustIcon} />
              <span>Direct Doorstep Courier</span>
            </div>
          </div>
        </div>

        {/* Right Column: Floating Visual Showcase */}
        <div className="col-12 col-lg-5">
          <div className={styles.visualContainer}>
            <img
              src="/assets/prizes/giveaway-ticket.svg"
              alt="Official Giveaway Pass"
              className={styles.ticketArt}
              loading="eager"
            />
            <img
              src="/assets/prizes/gift-box-gold.svg"
              alt="Luxury Rewards Gift Box"
              className={styles.giftBoxArt}
              loading="eager"
            />

            <div className={styles.ambientCard}>
              <div className={styles.ambientDot} />
              <div>
                <div className="fw-bold small text-white">Authoritative Ledger</div>
                <div className="text-muted-custom" style={{ fontSize: '0.75rem' }}>Atomic Deductions & Idempotency</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GiveawayHero;

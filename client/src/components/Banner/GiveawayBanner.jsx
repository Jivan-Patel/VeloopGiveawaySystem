import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ArrowRight } from 'lucide-react';
import styles from './GiveawayBanner.module.css';

/**
 * Reusable GiveawayBanner component.
 */
export function GiveawayBanner({
  heading = 'Summer Rewards 2026 is Live',
  subtext = 'Enter with your promotional Veloop Entries (VE). Verifiable on-chain random winner distribution.',
  ctaText = 'Explore Prizes',
  ctaLink = '#featured-pools',
  icon = <Award size={22} />
}) {
  return (
    <div className={styles.banner}>
      <div className={styles.leftCol}>
        <div className={styles.iconWrapper}>{icon}</div>
        <div>
          <h2 className={styles.bannerHeading}>{heading}</h2>
          <p className={styles.bannerSubtext}>{subtext}</p>
        </div>
      </div>
      {ctaLink.startsWith('#') ? (
        <a href={ctaLink} className={`btn btn-gold-gradient btn-sm ${styles.bannerCta}`}>
          <span>{ctaText}</span>
          <ArrowRight size={14} className="ms-1" />
        </a>
      ) : (
        <Link to={ctaLink} className={`btn btn-gold-gradient btn-sm ${styles.bannerCta}`}>
          <span>{ctaText}</span>
          <ArrowRight size={14} className="ms-1" />
        </Link>
      )}
    </div>
  );
}

export default GiveawayBanner;

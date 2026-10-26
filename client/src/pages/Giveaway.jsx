import { useState } from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { useGiveaways } from '../hooks/useGiveaways';
import SectionHeader from '../components/SectionHeader/SectionHeader';
import GiveawayStats from '../components/Stats/GiveawayStats';
import PrizeCard from '../components/Cards/PrizeCard';
import ParticipateTimeline from '../components/ParticipateTimeline/ParticipateTimeline';
import GiveawayRules from '../components/Rules/GiveawayRules';
import FAQAccordion from '../components/FAQ/FAQAccordion';
import TrustBadges from '../components/Trust/TrustBadges';
import ThemedLoader from '../components/Loader/ThemedLoader';
import styles from './Giveaway.module.css';

/**
 * Giveaway Page Component - Strictly matching Ref_02.jpeg (Document last page)
 * Transforms the giveaway view into a unified, self-contained "Giveaway Section":
 * 1. Section Header (Flanked by 3D gift box podiums with confetti, gradient title)
 * 2. Stats Strip (Total Giveaways, Total Participants, Prizes Won, Ends In)
 * 3. Main Area: 4 Featured Prize Cards + How to Participate Timeline sidebar
 * 4. Official Giveaway Rules & Guidelines (7 Topics)
 * 5. Frequently Asked Questions Accordion (7 Questions)
 * 6. Trust & Security Strip (4 verified platform guarantees)
 */
export function Giveaway() {
  const {
    giveaways,
    stats,
    loading,
    error,
    refetch
  } = useGiveaways();

  const [showAll, setShowAll] = useState(false);

  if (loading) {
    return <ThemedLoader fullScreen={false} />;
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger d-inline-flex align-items-center gap-2">
          <AlertCircle size={20} />
          <span>Failed to load giveaway pools: {error.message || 'Server connection error'}</span>
        </div>
        <div className="mt-3">
          <button onClick={refetch} className="btn btn-outline-light btn-sm">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Display top 4 featured cards matching Ref_02.jpeg unless user toggles "View All"
  const displayedCards = showAll ? giveaways : giveaways.slice(0, 4);

  return (
    <div className={styles.pageContainer}>
      {/* 1. Header with Flanking 3D Podium Gift Boxes */}
      <SectionHeader />

      {/* 2. Platform Summary Metrics Strip */}
      <GiveawayStats stats={stats} />

      {/* 3. Main Row: Left (4 Featured Prize Cards) + Right (How to Participate Sidebar) */}
      <div className="row g-4 mb-2">
        {/* Left Column: Featured Giveaways */}
        <div className="col-12 col-xl-9">
          <div className={styles.featuredSection}>
            <div className={styles.sectionHeadingRow}>
              <div>
                <h2 className={styles.headingTitle}>
                  <span className={styles.starIcon}>★</span>
                  <span>Featured Giveaways</span>
                </h2>
                <p className={styles.headingSubtitle}>
                  Participate in our handpicked giveaways and win exciting rewards.
                </p>
              </div>

              <button
                type="button"
                className={styles.viewAllButton}
                onClick={() => setShowAll((prev) => !prev)}
                aria-label={showAll ? 'Show top 4 featured giveaways' : 'View all giveaways'}
              >
                <span>{showAll ? 'Show Featured' : 'View All Giveaways'}</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Prize Cards Grid */}
            <div className={styles.cardsGrid}>
              {displayedCards.map((gw) => (
                <PrizeCard key={gw.giveawayId} giveaway={gw} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: How to Participate Sidebar */}
        <div className="col-12 col-xl-3">
          <ParticipateTimeline />
        </div>
      </div>

      {/* 4. Official Giveaway Rules & Guidelines (7 Topics) */}
      <GiveawayRules />

      {/* 5. Frequently Asked Questions Accordion (7 Questions) */}
      <FAQAccordion />

      {/* 6. Bottom Trust & Security Strip */}
      <TrustBadges />
    </div>
  );
}

export default Giveaway;

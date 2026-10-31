import { useState } from 'react';
import { ArrowRight, AlertCircle, Sparkles, Smartphone, Gift, Coins } from 'lucide-react';
import { useGiveaways } from '../hooks/useGiveaways';
import { useAuth } from '../hooks/useAuth';
import { USER_STATE } from '../config/giveawayStatus';
import SectionHeader from '../components/SectionHeader/SectionHeader';
import GiveawayStats from '../components/Stats/GiveawayStats';
import PrizeCard from '../components/Cards/PrizeCard';
import ParticipateTimeline from '../components/ParticipateTimeline/ParticipateTimeline';
import WinnersTabs from '../components/Winners/WinnersTabs';
import GiveawayRules from '../components/Rules/GiveawayRules';
import FAQAccordion from '../components/FAQ/FAQAccordion';
import TrustBadges from '../components/Trust/TrustBadges';
import ThemedLoader from '../components/Loader/ThemedLoader';
import PersonalStatusPanel from '../components/PersonalPanel/PersonalStatusPanel';
import ControlledReveal from '../components/ControlledReveal/ControlledReveal';
import NextGiveawayPreview from '../components/Preview/NextGiveawayPreview';
import PrizeClaimModal from '../components/Claims/PrizeClaimModal';
import styles from './Giveaway.module.css';

const CATEGORIES = [
  { id: 'ALL', label: 'All Pools', icon: Sparkles },
  { id: 'GADGETS', label: 'Gadgets & Tech', icon: Smartphone },
  { id: 'VOUCHERS', label: 'Gift Vouchers', icon: Gift },
  { id: 'TOKENS', label: 'Token Pools', icon: Coins }
];

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

  const { userState, claimPrizeType } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showAll, setShowAll] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

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

  // Filter giveaways cleanly based on selected category
  const filteredGiveaways = giveaways.filter((gw) => {
    if (selectedCategory === 'GADGETS') {
      return (
        gw.prize?.type === 'PHYSICAL' ||
        gw.slug?.includes('iphone') ||
        gw.slug?.includes('watch') ||
        gw.slug?.includes('airpods')
      );
    }
    if (selectedCategory === 'VOUCHERS') {
      return (
        gw.prize?.type === 'GIFT_CARD' ||
        gw.slug?.includes('amazon-2000') ||
        gw.slug?.includes('amazon-500')
      );
    }
    if (selectedCategory === 'TOKENS') {
      return gw.entry?.currency === 'TOKEN' || gw.slug?.includes('amazon-20');
    }
    return true;
  });

  // Display top 4 featured cards matching Ref_02.jpeg unless user toggles "View All"
  const displayedCards = showAll ? filteredGiveaways : filteredGiveaways.slice(0, 4);

  return (
    <div className={styles.pageContainer}>
      {/* Ambient Atmospheric Lighting Orbs (Visual depth) */}
      <div className={styles.ambientGlowTop} aria-hidden="true" />
      <div className={styles.ambientOrbLeft} aria-hidden="true" />
      <div className={styles.ambientOrbRight} aria-hidden="true" />

      {/* 1. Header with Flanking 3D Podium Gift Boxes */}
      <SectionHeader />

      {/* 2. Platform Summary Metrics Strip */}
      <GiveawayStats stats={stats} />

      {/* 3. Controlled Winner Selection Simulation (Revealing State) */}
      <ControlledReveal />

      {/* 4. Contextual Personal Status Panel (All 5 User States) */}
      <PersonalStatusPanel onOpenClaimModal={() => setIsClaimModalOpen(true)} />

      {/* 5. Next Giveaway Preview (Contextual for Non-Winners or Early Access) */}
      {userState === USER_STATE.NON_WINNER && <NextGiveawayPreview />}

      {/* 6. Main Row: Left (Featured Prize Cards Grid) + Right (How to Participate Sidebar) */}
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

            {/* Interactive Category Filter Bar */}
            <div className={styles.filterBar} role="tablist" aria-label="Giveaway category filters">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                const count = giveaways.filter((gw) => {
                  if (cat.id === 'GADGETS') {
                    return (
                      gw.prize?.type === 'PHYSICAL' ||
                      gw.slug?.includes('iphone') ||
                      gw.slug?.includes('watch') ||
                      gw.slug?.includes('airpods')
                    );
                  }
                  if (cat.id === 'VOUCHERS') {
                    return (
                      gw.prize?.type === 'GIFT_CARD' ||
                      gw.slug?.includes('amazon-2000') ||
                      gw.slug?.includes('amazon-500')
                    );
                  }
                  if (cat.id === 'TOKENS') {
                    return gw.entry?.currency === 'TOKEN' || gw.slug?.includes('amazon-20');
                  }
                  return true;
                }).length;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    className={`${styles.filterChip} ${isSelected ? styles.filterChipActive : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <Icon size={14} />
                    <span>{cat.label}</span>
                    <span className={styles.filterChipCount}>{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Prize Cards Grid */}
            {displayedCards.length > 0 ? (
              <div className={styles.cardsGrid}>
                {displayedCards.map((gw) => (
                  <PrizeCard key={gw.giveawayId} giveaway={gw} />
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-muted">
                <p>No giveaways found in this category.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: How to Participate Sidebar */}
        <div className="col-12 col-xl-3">
          <ParticipateTimeline />
        </div>
      </div>

      {/* 4. Verified Winners Showcase (WinnerSlider & Previous Winners Tabs) */}
      <WinnersTabs livePoolsCount={giveaways.filter((g) => g.status === 'LIVE').length} />

      {/* 5. Official Giveaway Rules & Guidelines (7 Topics) */}
      <GiveawayRules />

      {/* 5. Frequently Asked Questions Accordion (7 Questions) */}
      <FAQAccordion />

      {/* 6. Bottom Trust & Security Strip */}
      <TrustBadges />

      {/* 7. Prize Claim Modal Dialog */}
      <PrizeClaimModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        prize={{
          name: claimPrizeType === 'PHYSICAL' ? 'iPhone 15 Pro (128GB)' : 'Amazon ₹2,000 Gift Voucher',
          type: claimPrizeType,
          image: claimPrizeType === 'PHYSICAL' ? '/assets/prizes/iphone15pro.png' : '/assets/prizes/amazon2000.png'
        }}
        giveawayTitle="Summer Rewards 2026"
      />
    </div>
  );
}

export default Giveaway;

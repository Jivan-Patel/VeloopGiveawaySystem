import { useState } from 'react';
import { ArrowRight, AlertCircle, Sparkles, Smartphone, Gift, Coins } from 'lucide-react';
import { useGiveaways } from '../hooks/useGiveaways';
import { useAuth } from '../hooks/useAuth';
import { USER_STATE } from '../config/giveawayStatus';
import SectionHeader from '../components/SectionHeader/SectionHeader';
import GiveawayStats from '../components/Stats/GiveawayStats';
import WinnerAnnouncementBar from '../components/Winners/WinnerAnnouncementBar';
import PrizeCard from '../components/Cards/PrizeCard';
import ParticipateTimeline from '../components/ParticipateTimeline/ParticipateTimeline';
import TrustBadges from '../components/Trust/TrustBadges';
import RulesModal from '../components/Rules/RulesModal';
import PastWinnersModal from '../components/Winners/PastWinnersModal';
import PrizeClaimModal from '../components/Claims/PrizeClaimModal';
import PersonalStatusPanel from '../components/PersonalPanel/PersonalStatusPanel';
import ThemedLoader from '../components/Loader/ThemedLoader';
import styles from './Giveaway.module.css';

const CATEGORIES = [
  { id: 'ALL', label: 'All Pools', icon: Sparkles },
  { id: 'GADGETS', label: 'Gadgets & Tech', icon: Smartphone },
  { id: 'VOUCHERS', label: 'Gift Vouchers', icon: Gift },
  { id: 'TOKENS', label: 'Token Pools', icon: Coins }
];

/**
 * Giveaway Page Component - Strictly Aligned with Ref_02.jpeg & PRD Specification
 * Structure:
 * 1. Atmospheric Ambient Lighting
 * 2. Section Header: 3D glowing gift boxes on left & right pedestals, "🎁 EXCLUSIVE GIVEAWAYS", "Giveaway Section", sparkle subtitle
 * 3. Giveaway Stats: 4 horizontal items in an elevated glassmorphism gaming HUD
 * 4. Winner Announcement Bar: Sleek 1-line rotating social proof ticker (Section 18)
 * 5. Main 75% / 25% Split Grid:
 *    - Left (75%): "⭐ Featured Giveaways" with View All button + 4 vibrant 3D Prize Cards (iPhone, Watch, AirPods, Amazon)
 *    - Right (25%): "🚀 How to Participate?" 4 connected steps + "📄 View Rules & Guidelines →" trigger
 * 6. Bottom Trust & Security Strip: 4 horizontal pillars (Fair, Secure, Trusted, Support)
 * 7. Modals:
 *    - RulesModal: 7 Rules topics + 7 FAQs in clean dialog (0 main-page text clutter)
 *    - PastWinnersModal: Verified past winners with masked IDs
 *    - PrizeClaimModal: Winner claim submission
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
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isPastWinnersModalOpen, setIsPastWinnersModalOpen] = useState(false);
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

      {/* 1. Header with Flanking 3D Podium Gift Boxes (Ref_02.jpeg) */}
      <SectionHeader />

      {/* 2. Platform Summary Metrics Strip - 4 Horizontal Items (Ref_02.jpeg) */}
      <GiveawayStats stats={stats} />

      {/* 3. Sleek Social Proof Winner Announcement Slider (Task Spec Section 18) */}
      <WinnerAnnouncementBar onOpenHistory={() => setIsPastWinnersModalOpen(true)} />

      {/* 4. Contextual Winner Notification (Only visible when user state is WINNER) */}
      {userState === USER_STATE.WINNER && (
        <div className="mb-4">
          <PersonalStatusPanel onOpenClaimModal={() => setIsClaimModalOpen(true)} />
        </div>
      )}

      {/* 5. Main Content Grid: 75% Left (Featured Cards) + 25% Right (How to Participate) (Ref_02.jpeg) */}
      <div className={`row g-3 g-lg-4 mb-2 ${styles.mainRow}`}>
        {/* Left Column: Featured Giveaways (approx 75% width on desktop) */}
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

            {/* Prize Cards Grid: 4 Cards Side-by-Side (Ref_02.jpeg) */}
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

        {/* Right Column: How to Participate Sidebar (approx 25% width on desktop) (Ref_02.jpeg) */}
        <div className="col-12 col-xl-3">
          <ParticipateTimeline onOpenRules={() => setIsRulesModalOpen(true)} />
        </div>
      </div>

      {/* 6. Bottom Trust & Security Strip - 4 Horizontal Pillars (Ref_02.jpeg) */}
      <TrustBadges />

      {/* 7. Accessible Rules & FAQ Modal (Eliminates 1,200px of text clutter from main view) */}
      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />

      {/* 8. Verified Past Winners Modal */}
      <PastWinnersModal
        isOpen={isPastWinnersModalOpen}
        onClose={() => setIsPastWinnersModalOpen(false)}
      />

      {/* 9. Prize Claim Modal Dialog */}
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

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import giveawayApi from '../services/giveawayApi';
import ThemedLoader from '../components/Loader/ThemedLoader';
import DetailHero from '../components/Detail/DetailHero';
import PrizeInfoCard from '../components/Detail/PrizeInfoCard';
import AboutPrize from '../components/Detail/AboutPrize';
import HowItWorksSteps from '../components/Detail/HowItWorksSteps';
import DetailRules from '../components/Detail/DetailRules';
import TermsAndConditions from '../components/Detail/TermsAndConditions';
import ImportantInfoAccordion from '../components/Detail/ImportantInfoAccordion';
import DetailFooter from '../components/Detail/DetailFooter';
import DetailNotFound from '../components/Detail/DetailNotFound';
import PrizeClaimModal from '../components/Claims/PrizeClaimModal';
import ConfirmParticipationModal from '../components/Modals/ConfirmParticipationModal';
import LoginRequiredModal from '../components/Modals/LoginRequiredModal';
import { useAuth } from '../hooks/useAuth';
import styles from './GiveawayDetail.module.css';

/**
 * GiveawayDetail Page Component (PRD Section 128 & WD8 Milestone)
 * Route: `/giveaway/:slug`
 * Renders:
 * - Responsive back navigation ("Giveaway Home" desktop / "← Giveaway" mobile)
 * - Hero with prize showcase, category rank badge, ambient glow, and sync countdown
 * - Prize information card (winners, participants, ends in, fee, CTA)
 * - Real-time Balance Panel (balance, fee, balance-after, sufficiency status)
 * - About the Prize (specifications, retail value, authenticity)
 * - How This Giveaway Works (7 numbered steps)
 * - Participation Rules
 * - Terms & Conditions (10 topics, placeholders marked)
 * - Expandable Important Information accordion (Tax, Warranty, Unclaimed)
 * - Compact footer & Custom 404 state for unknown slugs
 * - Modals: PrizeClaimModal, ConfirmParticipationModal, LoginRequiredModal
 */
export function GiveawayDetail() {
  const { slug } = useParams();
  const { user } = useAuth();

  const [giveaway, setGiveaway] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadGiveaway() {
      setLoading(true);
      setError(null);
      try {
        const res = await giveawayApi.getGiveawayBySlug(slug);
        if (!ignore && res.data?.giveaway) {
          setGiveaway(res.data.giveaway);

          if (res.data.giveaway.giveawayId) {
            try {
              const statusRes = await giveawayApi.getMyStatus(res.data.giveaway.giveawayId);
              if (!ignore) {
                setUserStatus(statusRes.data || null);
              }
            } catch {
              // Status lookup non-fatal in mock/visitor mode
            }
          }
        } else if (!ignore) {
          setGiveaway(null);
        }
      } catch (err) {
        if (!ignore) {
          setError(err);
          setGiveaway(null);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadGiveaway();

    return () => {
      ignore = true;
    };
  }, [slug]);

  const reloadData = async () => {
    try {
      const res = await giveawayApi.getGiveawayBySlug(slug);
      if (res.data?.giveaway) {
        setGiveaway(res.data.giveaway);
        if (res.data.giveaway.giveawayId) {
          const statusRes = await giveawayApi.getMyStatus(res.data.giveaway.giveawayId);
          setUserStatus(statusRes.data || null);
        }
      }
    } catch {
      // Reload error handled gracefully
    }
  };

  const handleParticipationSuccess = (result) => {
    // Immediate state synchronization
    setUserStatus((prev) => ({
      ...prev,
      isJoined: true,
      ticketId: result?.ticketId || (giveaway?.giveawayId ? giveaway.giveawayId.slice(-6).toUpperCase() : 'TKT-2026')
    }));

    // Update participant count
    setGiveaway((prev) => (prev ? { ...prev, participantsCount: (prev.participantsCount || 0) + 1 } : prev));
  };

  // Derive authoritative wallet balance matching giveaway entry currency
  const entryCurrency = giveaway?.entry?.currency || 'VE';
  const wallet = user?.wallet || { ves: 1250, sves: 800, tokens: 5000 };
  let currentBalance = 0;
  if (entryCurrency === 'SVE') {
    currentBalance = wallet.sves ?? 0;
  } else if (entryCurrency === 'TOKEN') {
    currentBalance = wallet.tokens ?? 0;
  } else {
    currentBalance = wallet.ves ?? 0;
  }

  if (loading) {
    return <ThemedLoader fullScreen={false} />;
  }

  // 404 State when slug is unknown or not present in database
  if (error || !giveaway) {
    return (
      <div className="container py-4">
        <DetailNotFound slug={slug} />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className="container">
        {/* 1. Detail Hero with Back Navigation, Badges, Image & Countdown */}
        <DetailHero giveaway={giveaway} onTimerZero={reloadData} />

        {/* 2. Main Two-Column Layout */}
        <div className={styles.mainLayoutGrid}>
          {/* Left Column: Comprehensive Information & Rules */}
          <div className={styles.leftContentArea}>
            {/* About the Prize */}
            <AboutPrize giveaway={giveaway} />

            {/* How This Giveaway Works (7 Steps) */}
            <HowItWorksSteps />

            {/* Participation Rules */}
            <DetailRules />

            {/* Terms and Conditions (10 Topics, placeholders flagged) */}
            <TermsAndConditions />

            {/* Expandable Important Information (Tax, Warranty, Unclaimed) */}
            <ImportantInfoAccordion />
          </div>

          {/* Right Column: Sticky Prize Info Card & Real-Time Balance Panel */}
          <div className={styles.rightSidebarArea}>
            <PrizeInfoCard
              giveaway={giveaway}
              userStatus={userStatus}
              onOpenConfirmJoin={() => setIsConfirmModalOpen(true)}
              onOpenLoginRequired={() => setIsLoginModalOpen(true)}
              onOpenClaim={() => setIsClaimModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* 3. Compact Detail Footer */}
      <DetailFooter />

      {/* 4. Prize Claim Modal (For Winner State) */}
      <PrizeClaimModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        prize={giveaway.prize}
        giveawayTitle={giveaway.title}
      />

      {/* 5. Confirm Participation Modal */}
      <ConfirmParticipationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        giveaway={giveaway}
        userBalance={currentBalance}
        onParticipationSuccess={handleParticipationSuccess}
      />

      {/* 6. Login Required Modal for Unauthenticated Visitors */}
      <LoginRequiredModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        giveawayTitle={giveaway.title}
      />
    </div>
  );
}

export default GiveawayDetail;

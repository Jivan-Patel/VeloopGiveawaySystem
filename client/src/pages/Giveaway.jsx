import React from 'react';
import { Calendar, ArrowRight, AlertCircle } from 'lucide-react';
import { useGiveaways } from '../hooks/useGiveaways';
import { formatCurrencyAmount } from '../config/currencies';
import GiveawayHero from '../components/Hero/GiveawayHero';
import GiveawayBanner from '../components/Banner/GiveawayBanner';
import GiveawayStats from '../components/Stats/GiveawayStats';
import FeaturedGiveaways from '../components/Featured/FeaturedGiveaways';
import ThemedLoader from '../components/Loader/ThemedLoader';
import Countdown from '../components/Countdown/Countdown';

export function Giveaway() {
  const {
    giveaways,
    upcomingGiveaways,
    stats,
    loading,
    error,
    serverTime,
    refetch
  } = useGiveaways();

  if (loading) {
    return <ThemedLoader fullScreen={false} />;
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger d-inline-flex align-items-center gap-2">
          <AlertCircle size={20} />
          <span>Failed to load reward pools: {error.message || 'Server connection error'}</span>
        </div>
        <div className="mt-3">
          <button onClick={refetch} className="btn btn-outline-light btn-sm">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Earliest upcoming giveaway for the "Next Giveaway Starts In" block
  const nextUpcoming = upcomingGiveaways.length > 0 ? upcomingGiveaways[0] : null;

  return (
    <div className="container py-4">
      {/* 1. Page Hero with Restrained Motion */}
      <GiveawayHero />

      {/* 2. Platform Campaign Credentials Banner */}
      <GiveawayBanner
        badge="Official Campaign"
        heading="Summer Rewards Rush 2026"
        subtext="All entry deductions executed atomically on authoritative backend ledger. Cryptographic random distribution."
        ctaText="View Prize Pools"
        ctaLink="#featured-pools"
      />

      {/* 3. Next Giveaway Starts In Block (PRD line 298 requirement) */}
      {nextUpcoming && (
        <div className="card bg-surface border border-subtle p-3 p-md-4 rounded-4 mb-5 shadow-sm">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-surface-elevated rounded-3 text-gold">
                <Calendar size={24} />
              </div>
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="badge rounded-pill bg-warning text-dark fw-bold">Next Drop</span>
                  <span className="small text-muted-custom">Coming Soon</span>
                </div>
                <h3 className="h6 fw-bold text-white mb-0">{nextUpcoming.title}</h3>
                <div className="small text-secondary-custom">
                  Entry: {formatCurrencyAmount(nextUpcoming.entry.amount, nextUpcoming.entry.currency)} · {nextUpcoming.winnerCount} Winners
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div className="text-md-end">
                <div className="small text-muted-custom mb-1">Opens In:</div>
                <Countdown
                  variant="compact"
                  targetDate={nextUpcoming.startAt}
                  serverTime={serverTime}
                  onZero={refetch}
                />
              </div>
              <a
                href={`/giveaway/${nextUpcoming.slug}`}
                className="btn btn-outline-light btn-sm d-flex align-items-center gap-1"
              >
                <span>Details</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 4. Platform Impact & Aggregate Stats (with demo disclosure) */}
      <GiveawayStats stats={stats} />

      {/* 5. Featured Prize Pools with Mobile Scroll-Snap Carousel */}
      <FeaturedGiveaways
        giveaways={giveaways}
        serverTime={serverTime}
        onTimerZero={refetch}
      />
    </div>
  );
}

export default Giveaway;

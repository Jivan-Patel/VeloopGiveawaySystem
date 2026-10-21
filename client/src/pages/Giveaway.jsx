import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Sparkles, Clock, Users, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { useGiveaways } from '../hooks/useGiveaways';
import { formatCurrencyAmount } from '../config/currencies';
import { getStatusBadgeConfig } from '../config/giveawayStatus';

export function Giveaway() {
  const { giveaways, stats, loading, error, serverTime } = useGiveaways();

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary mb-3" role="status" />
        <p className="text-secondary-custom">Connecting to VELOOP Rewards Authority…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger d-inline-block">
          Failed to load giveaways: {error.message || 'Server error'}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Hero Section Banner */}
      <section className="text-center py-4 mb-5">
        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3 border border-subtle bg-surface">
          <Sparkles size={16} className="text-gold" />
          <span className="small text-gold fw-bold">Official Summer Rewards 2026</span>
        </div>
        <h1 className="display-4 fw-bold gradient-text-platinum mb-3">
          Win Flagship Tech & Gift Cards
        </h1>
        <p className="lead text-secondary-custom mx-auto mb-4" style={{ maxWidth: '640px' }}>
          Participate using your earned Veloop Entries (VE). Backed by cryptographically fair distribution, authoritative state management, and direct doorstep shipping.
        </p>

        {/* Quick Stats Grid */}
        {stats && (
          <div className="row g-3 justify-content-center mb-4">
            <div className="col-6 col-md-3">
              <div className="glass-panel p-3 text-center">
                <div className="fs-3 fw-bold text-gold">{Number(stats.totalPrizesAwarded).toLocaleString()}</div>
                <div className="small text-muted-custom">Prizes Awarded</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="glass-panel p-3 text-center">
                <div className="fs-3 fw-bold text-emerald">{Number(stats.totalParticipants).toLocaleString()}</div>
                <div className="small text-muted-custom">Participants</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="glass-panel p-3 text-center">
                <div className="fs-3 fw-bold text-success">{stats.activeCampaigns} Live</div>
                <div className="small text-muted-custom">Active Pools</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="glass-panel p-3 text-center">
                <div className="fs-3 fw-bold text-amber">100%</div>
                <div className="small text-muted-custom">Verified Claims</div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Featured Giveaways Grid */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="h3 fw-bold mb-1">Featured Giveaways</h2>
            <p className="text-muted-custom small mb-0">Select a prize pool to review participation details and enter the draw</p>
          </div>
          <span className="badge bg-surface border border-subtle text-secondary-custom px-3 py-2">
            Server Time: {serverTime ? new Date(serverTime).toLocaleTimeString() : 'Synced'}
          </span>
        </div>

        <div className="row g-4">
          {giveaways.map((gw) => {
            const badge = getStatusBadgeConfig(gw.status, gw.winnersStatus);
            return (
              <div key={gw.giveawayId} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 bg-surface border-subtle shadow-sm overflow-hidden d-flex flex-column">
                  {/* Prize Image & Accent */}
                  <div className="position-relative overflow-hidden" style={{ height: '210px', background: 'var(--color-bg-base)' }}>
                    <span
                      className="position-absolute top-0 end-0 m-3 badge rounded-pill px-3 py-2 shadow-sm"
                      style={{ backgroundColor: badge.bgColor, color: badge.color, zIndex: 2 }}
                    >
                      {badge.label}
                    </span>
                    <img
                      src={gw.prize.image}
                      alt={gw.prize.name}
                      onError={(e) => {
                        if (gw.prize.localImage && e.currentTarget.src !== gw.prize.localImage) {
                          e.currentTarget.src = gw.prize.localImage;
                        }
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </div>

                  {/* Body Content */}
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="badge bg-surface-elevated text-emerald border border-subtle small">
                        {gw.prize.badge || 'Featured'}
                      </span>
                      <span className="small text-muted-custom">
                        {gw.winnerCount} {gw.winnerCount === 1 ? 'Winner' : 'Winners'}
                      </span>
                    </div>

                    <h3 className="h5 fw-bold text-white mb-2">{gw.title}</h3>
                    <p className="small text-secondary-custom flex-grow-1 mb-3">
                      {gw.description}
                    </p>

                    {/* Metadata strip */}
                    <div className="d-flex justify-content-between align-items-center py-2 border-top border-bottom border-subtle mb-3">
                      <div className="small text-muted-custom d-flex align-items-center gap-1">
                        <Users size={14} />
                        <span>{Number(gw.participantsCount).toLocaleString()} Joined</span>
                      </div>
                      <div className="small fw-bold text-gold d-flex align-items-center gap-1">
                        <Zap size={14} />
                        <span>{formatCurrencyAmount(gw.entry.amount, gw.entry.currency)}</span>
                      </div>
                    </div>

                    {/* Navigation CTA */}
                    <Link
                      to={`/giveaway/${gw.slug}`}
                      className="btn btn-primary-gradient w-100 d-flex justify-content-center align-items-center gap-2"
                    >
                      <span>View Prize & Enter</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Giveaway;

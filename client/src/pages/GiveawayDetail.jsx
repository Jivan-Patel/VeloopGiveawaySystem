import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, ShieldCheck, CheckCircle } from 'lucide-react';
import giveawayApi from '../services/giveawayApi';
import { Countdown } from '../components/Countdown/Countdown';
import { useAuth } from '../hooks/useAuth';
import { formatCurrencyAmount } from '../config/currencies';
import { getStatusBadgeConfig } from '../config/giveawayStatus';

export function GiveawayDetail() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();

  const [giveaway, setGiveaway] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadGiveawayDetail() {
      try {
        const res = await giveawayApi.getGiveawayBySlug(slug);
        if (!ignore && res.data) {
          setGiveaway(res.data.giveaway);

          if (res.data.giveaway?.giveawayId) {
            const statusRes = await giveawayApi.getMyStatus(res.data.giveaway.giveawayId);
            if (!ignore) {
              setUserStatus(statusRes.data || null);
            }
          }
        }
      } catch (err) {
        if (!ignore) {
          console.error('[GiveawayDetail] Error loading data:', err);
          setError(err);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadGiveawayDetail();

    return () => {
      ignore = true;
    };
  }, [slug]);

  async function reloadData() {
    try {
      const res = await giveawayApi.getGiveawayBySlug(slug);
      if (res.data) {
        setGiveaway(res.data.giveaway);
        if (res.data.giveaway?.giveawayId) {
          const statusRes = await giveawayApi.getMyStatus(res.data.giveaway.giveawayId);
          setUserStatus(statusRes.data || null);
        }
      }
    } catch (err) {
      console.error('[GiveawayDetail] Error reloading data:', err);
    }
  }

  const handleJoin = async () => {
    if (!giveaway) return;
    try {
      setIsJoining(true);
      await giveawayApi.joinGiveaway(giveaway.giveawayId, {
        'Idempotency-Key': crypto.randomUUID()
      });
      setJoinSuccess(true);
      // Refresh status
      const statusRes = await giveawayApi.getMyStatus(giveaway.giveawayId);
      setUserStatus(statusRes.data || null);
    } catch (err) {
      alert(err.message || 'Failed to join giveaway');
    } finally {
      setIsJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary mb-3" />
        <p className="text-secondary-custom">Loading giveaway specification…</p>
      </div>
    );
  }

  if (error || !giveaway) {
    return (
      <div className="container py-5 text-center">
        <h2 className="h4 text-danger mb-3">Giveaway Not Found</h2>
        <p className="text-secondary-custom mb-4">We couldn't locate the prize pool with slug "{slug}".</p>
        <Link to="/giveaway" className="btn btn-outline-light">
          ← Back to Giveaways
        </Link>
      </div>
    );
  }

  const badge = getStatusBadgeConfig(giveaway.status, giveaway.winnersStatus);
  const isJoined = userStatus?.isJoined || joinSuccess;

  return (
    <div className="container py-5">
      {/* Back Link */}
      <Link to="/giveaway" className="d-inline-flex align-items-center gap-2 text-secondary-custom mb-4 text-decoration-none">
        <ArrowLeft size={16} />
        <span>Giveaway Home</span>
      </Link>

      <div className="row g-5">
        {/* Left Column: Image and details */}
        <div className="col-12 col-lg-7">
          <div className="rounded-4 border border-subtle overflow-hidden mb-4 shadow-sm" style={{ maxHeight: '420px', background: 'var(--color-bg-surface)' }}>
            <img
              src={giveaway.prize.image}
              alt={giveaway.prize.name}
              onError={(e) => {
                if (giveaway.prize.localImage && e.currentTarget.src !== giveaway.prize.localImage) {
                  e.currentTarget.src = giveaway.prize.localImage;
                }
              }}
              style={{ width: '100%', maxHeight: '420px', objectFit: 'cover' }}
            />
          </div>

          <h1 className="h2 fw-bold text-white mb-3">{giveaway.title}</h1>
          <p className="lead text-secondary-custom mb-4">{giveaway.description}</p>

          {/* Rules */}
          <div className="card bg-surface border-subtle p-4 mb-4">
            <h3 className="h6 fw-bold text-white text-uppercase tracking-wider mb-3">
              Participation Rules
            </h3>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
              {giveaway.rules?.map((rule, idx) => (
                <li key={idx} className="small text-secondary-custom d-flex align-items-start gap-2">
                  <span className="text-emerald">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Entry & Status Card */}
        <div className="col-12 col-lg-5">
          <div className="card bg-surface border-subtle p-4 shadow-lg sticky-top" style={{ top: '100px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: badge.bgColor, color: badge.color }}>
                {badge.label}
              </span>
              <span className="small text-muted-custom">
                {giveaway.winnerCount} {giveaway.winnerCount === 1 ? 'Winner' : 'Winners'}
              </span>
            </div>

            {/* Countdown Display */}
            <div className="p-3 rounded-3 bg-surface-elevated border border-subtle text-center mb-4">
              <div className="small text-muted-custom mb-2 d-flex justify-content-center align-items-center gap-1">
                <Clock size={14} />
                <span>Ends In</span>
              </div>
              <div className="d-flex justify-content-center">
                <Countdown targetDate={giveaway?.endAt} onZero={reloadData} />
              </div>
            </div>

            {/* Entry Fee & Balance Comparison */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center py-2 border-bottom border-subtle">
                <span className="text-secondary-custom small">Required Entry Fee:</span>
                <span className="fw-bold text-white">
                  {formatCurrencyAmount(giveaway.entry.amount, giveaway.entry.currency)}
                </span>
              </div>
              {isAuthenticated && (
                <div className="d-flex justify-content-between align-items-center py-2 border-bottom border-subtle">
                  <span className="text-secondary-custom small">Your Balance:</span>
                  <span className="fw-bold text-emerald">
                    {formatCurrencyAmount(userStatus?.userBalance || 0, giveaway.entry.currency)}
                  </span>
                </div>
              )}
            </div>

            {/* Participation CTA Button */}
            {!isAuthenticated ? (
              <Link to="/login" className="btn btn-primary-gradient w-100 py-3 fw-bold">
                Login to Participate
              </Link>
            ) : isJoined ? (
              <div className="alert alert-success d-flex align-items-center gap-2 mb-0">
                <CheckCircle size={20} />
                <div>
                  <div className="fw-bold">You're Participating ✓</div>
                  <div className="small">Your entry is registered on the backend.</div>
                </div>
              </div>
            ) : userStatus?.canJoin ? (
              <button
                onClick={handleJoin}
                disabled={isJoining}
                className="btn btn-gold-gradient w-100 py-3 fw-bold"
              >
                {isJoining ? 'Registering Entry…' : `Join for ${formatCurrencyAmount(giveaway.entry.amount, giveaway.entry.currency)}`}
              </button>
            ) : (
              <Link to="/earn" className="btn btn-outline-warning w-100 py-3 fw-bold">
                Earn More {giveaway.entry.currency} to Join
              </Link>
            )}

            <div className="mt-3 text-center">
              <span className="small text-muted-custom d-flex justify-content-center align-items-center gap-1">
                <ShieldCheck size={14} />
                <span>Authoritative backend validation & deduction</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GiveawayDetail;

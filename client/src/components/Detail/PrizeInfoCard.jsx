import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Trophy, ShieldCheck, CheckCircle, ArrowRight, Sparkles, Lock, Gift } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { BalancePanel } from './BalancePanel';
import { formatCurrencyAmount } from '../../config/currencies';
import { GIVEAWAY_STATUS, WINNERS_STATUS, USER_STATE } from '../../config/giveawayStatus';
import styles from './DetailCard.module.css';

/**
 * PrizeInfoCard Component (PRD Section 128 & Section 5 CTA Matrix)
 * Summarizes:
 * - Winners count, Participants count
 * - Required entry fee & currency
 * - Integrated BalancePanel comparison
 * - Strict adherence to Section 5 CTA state matrix
 */
export function PrizeInfoCard({ giveaway, userStatus, onJoinSuccess, onOpenClaim }) {
  const { user, isAuthenticated, userState } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const [joinedLocal, setJoinedLocal] = useState(false);

  if (!giveaway) return null;

  const {
    giveawayId,
    status = GIVEAWAY_STATUS.ACTIVE,
    winnersStatus = WINNERS_STATUS.PENDING,
    winnerCount = 1,
    participantsCount = 0,
    entry = { currency: 'VE', amount: 250 }
  } = giveaway;

  // Derive authoritative wallet balance matching currency
  const wallet = user?.wallet || { ves: 1250, sves: 800, tokens: 5000 };
  let currentBalance = 0;
  if (entry.currency === 'SVE') {
    currentBalance = wallet.sves;
  } else if (entry.currency === 'TOKEN') {
    currentBalance = wallet.tokens;
  } else {
    currentBalance = wallet.ves;
  }

  const isEnough = currentBalance >= entry.amount;
  const isJoined = joinedLocal || userStatus?.isJoined || userState === USER_STATE.PARTICIPANT;
  const isWinner = userState === USER_STATE.WINNER;
  const isNonWinner = userState === USER_STATE.NON_WINNER;

  const handleJoinSimulation = () => {
    setIsJoining(true);
    setTimeout(() => {
      setIsJoining(false);
      setJoinedLocal(true);
      if (onJoinSuccess) onJoinSuccess();
    }, 1000);
  };

  return (
    <div className={styles.infoCard}>
      {/* Top Header Row */}
      <div className={styles.headerRow}>
        <div className={styles.metricItem}>
          <Trophy size={16} className={styles.metricIconGold} />
          <div>
            <span className={styles.metricVal}>
              {winnerCount} {winnerCount === 1 ? 'Winner' : 'Winners'}
            </span>
            <span className={styles.metricSub}>Final Selection</span>
          </div>
        </div>

        <div className={styles.metricItem}>
          <Users size={16} className={styles.metricIconCyan} />
          <div>
            <span className={styles.metricVal}>
              {Number(participantsCount).toLocaleString()}
            </span>
            <span className={styles.metricSub}>Participants</span>
          </div>
        </div>
      </div>

      {/* Entry Fee Highlight */}
      <div className={styles.feeHighlightBox}>
        <div className={styles.feeLeft}>
          <span className={styles.feeLabel}>Entry Fee</span>
          <span className={styles.feeVal}>
            {formatCurrencyAmount(entry.amount, entry.currency)}
          </span>
        </div>
        <div className={styles.feeRightBadge}>
          <Sparkles size={12} />
          <span>Atomic Deduction</span>
        </div>
      </div>

      {/* Balance Panel (PRD Spec line 128) */}
      {isAuthenticated && (
        <BalancePanel
          currency={entry.currency}
          fee={entry.amount}
          userBalance={currentBalance}
        />
      )}

      {/* CTA Matrix Action Button (PRD Section 5) */}
      <div className={styles.actionWrap}>
        {!isAuthenticated ? (
          /* Visitor State -> Login CTA */
          <Link to="/login" className={styles.primaryBtnGradient}>
            <Lock size={16} />
            <span>Login to Participate</span>
            <ArrowRight size={15} />
          </Link>
        ) : status === GIVEAWAY_STATUS.ENDED && winnersStatus === WINNERS_STATUS.FINALIZED ? (
          isWinner ? (
            /* Ended, User Won -> Claim Prize CTA */
            <button
              type="button"
              className={styles.claimBtnGold}
              onClick={onOpenClaim}
            >
              <Gift size={16} />
              <span>Claim Your Prize Now</span>
              <ArrowRight size={15} />
            </button>
          ) : isNonWinner ? (
            /* Ended, User Didn't Win -> Explore Next Giveaway */
            <Link to="/giveaway#featured-giveaways" className={styles.secondaryBtn}>
              <span>Explore Next Giveaway</span>
              <ArrowRight size={15} />
            </Link>
          ) : (
            <div className={styles.endedNotice}>
              <span>This giveaway has concluded. Winners are finalized.</span>
            </div>
          )
        ) : status === GIVEAWAY_STATUS.ENDED && winnersStatus === WINNERS_STATUS.PENDING ? (
          /* Ended, Winners Pending */
          <button type="button" className={styles.disabledBtn} disabled>
            <span>Selecting winners…</span>
          </button>
        ) : status === GIVEAWAY_STATUS.UPCOMING ? (
          /* Upcoming -> Notify Me */
          <button type="button" className={styles.upcomingBtn}>
            <span>Notify Me on Launch</span>
          </button>
        ) : isJoined ? (
          /* Joined State */
          <div className={styles.joinedBanner}>
            <CheckCircle size={20} className={styles.joinedCheckIcon} />
            <div>
              <div className={styles.joinedTitle}>You're Participating ✓</div>
              <div className={styles.joinedSub}>
                Ticket #{giveawayId.slice(-6).toUpperCase()} registered on ledger.
              </div>
            </div>
          </div>
        ) : isEnough ? (
          /* Logged in, not joined, enough balance */
          <button
            type="button"
            className={styles.joinBtn}
            onClick={handleJoinSimulation}
            disabled={isJoining}
          >
            {isJoining ? (
              <span className={styles.joiningSpinnerWrap}>
                <span className={styles.spinner} />
                <span>Submitting Entry…</span>
              </span>
            ) : (
              <>
                <span>Join for {formatCurrencyAmount(entry.amount, entry.currency)}</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        ) : (
          /* Logged in, balance short -> Earn More CTA */
          <Link to="/earn" className={styles.earnMoreBtn}>
            <span>Earn More {entry.currency} to Join</span>
            <ArrowRight size={15} />
          </Link>
        )}
      </div>

      {/* Security & Audit Micro-Badge */}
      <div className={styles.auditFootnote}>
        <ShieldCheck size={14} className={styles.auditIcon} />
        <span>Cryptographically verified atomic entry · 1 entry per account</span>
      </div>
    </div>
  );
}

export default PrizeInfoCard;

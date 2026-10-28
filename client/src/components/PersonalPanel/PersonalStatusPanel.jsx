import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  CheckCircle2,
  LogIn,
  Wallet,
  Sparkles,
  ArrowRight,
  Clock,
  Gift,
  Coins
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { USER_STATE } from '../../config/giveawayStatus';
import styles from './PersonalStatusPanel.module.css';

/**
 * Personal Status Panel (PRD Section 5 Matrix & WD7 Milestone)
 * Renders dynamically tailored UI for all 5 user states:
 * 1. VISITOR: Login prompt banner with redirect to /login
 * 2. LOGGED_IN: Wallet balance overview & active pool readiness
 * 3. PARTICIPANT: "You're In! Entry Verified" ticket badge & waiting for draw
 * 4. WINNER: Champagne gold celebration banner with "Claim Your Prize" CTA
 * 5. NON_WINNER: Empathetic encouragement notice with countdown to next drop
 */
export function PersonalStatusPanel({ onOpenClaimModal }) {
  const { user, isAuthenticated, userState, claimPrizeType } = useAuth();
  const [ticketCopied, setTicketCopied] = useState(false);

  const wallet = user?.wallet || { ves: 1250, sves: 800, tokens: 5000 };
  const ticketId = 'TKT-2026-99214';

  const handleCopyTicket = () => {
    navigator.clipboard?.writeText?.(ticketId);
    setTicketCopied(true);
    setTimeout(() => setTicketCopied(false), 2000);
  };

  // State 1: VISITOR (Unauthenticated)
  if (!isAuthenticated || userState === USER_STATE.VISITOR) {
    return (
      <div className={`${styles.panelCard} ${styles.visitorTheme}`}>
        <div className={styles.leftCol}>
          <div className={styles.iconBoxVisitor}>
            <LogIn size={22} />
          </div>
          <div>
            <div className={styles.badgeRow}>
              <span className={styles.badgeVisitor}>Platform Visitor</span>
              <span className={styles.dotSeparator}>•</span>
              <span className={styles.metaNotice}>Login Required for Pool Entry</span>
            </div>
            <h3 className={styles.panelTitle}>
              Connect Your VELOOP Account to Win Exclusive Gadgets & Vouchers
            </h3>
            <p className={styles.panelDescription}>
              Join thousands of members participating in verified reward pools. Spend your earned VE tokens and win iPhones, watches, and instant gift cards.
            </p>
          </div>
        </div>
        <div className={styles.rightCol}>
          <Link to="/login" className={styles.loginBtn}>
            <span>Login to Participate</span>
            <ArrowRight size={15} />
          </Link>
          <span className={styles.subtext}>Free signup in 30 seconds</span>
        </div>
      </div>
    );
  }

  // State 4: WINNER (Celebration & Claim Call to Action)
  if (userState === USER_STATE.WINNER) {
    const isPhysical = claimPrizeType === 'PHYSICAL';
    const wonPrizeTitle = isPhysical ? 'iPhone 15 Pro (128GB)' : 'Amazon ₹2,000 Gift Voucher';

    return (
      <div className={`${styles.panelCard} ${styles.winnerTheme}`}>
        <div className={styles.confettiGlow} aria-hidden="true" />
        <div className={styles.leftCol}>
          <div className={styles.iconBoxWinner}>
            <Trophy size={26} />
          </div>
          <div>
            <div className={styles.badgeRow}>
              <span className={styles.badgeWinner}>
                <Sparkles size={11} />
                <span>Verified Winner</span>
              </span>
              <span className={styles.badgePill}>VE****25</span>
              <span className={styles.dotSeparator}>•</span>
              <span className={styles.claimDeadlineBadge}>7-Day Claim Window Active</span>
            </div>
            <h3 className={styles.panelTitleWinner}>
              Congratulations! You Won the {wonPrizeTitle}
            </h3>
            <p className={styles.panelDescriptionWinner}>
              Your entry ticket was officially drawn by the cryptographically verified selection engine. Submit your delivery details before the deadline to claim.
            </p>
          </div>
        </div>
        <div className={styles.rightCol}>
          <button
            type="button"
            className={styles.claimBtn}
            onClick={onOpenClaimModal}
          >
            <Gift size={16} />
            <span>Claim Your Prize</span>
            <ArrowRight size={15} />
          </button>
          <span className={styles.subtextGold}>Claim within 6d 23h 48m</span>
        </div>
      </div>
    );
  }

  // State 3: PARTICIPANT (Joined active draw)
  if (userState === USER_STATE.PARTICIPANT) {
    return (
      <div className={`${styles.panelCard} ${styles.participantTheme}`}>
        <div className={styles.leftCol}>
          <div className={styles.iconBoxParticipant}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className={styles.badgeRow}>
              <span className={styles.badgeParticipant}>
                <CheckCircle2 size={11} />
                <span>You're Participating</span>
              </span>
              <span className={styles.dotSeparator}>•</span>
              <span className={styles.metaNotice}>Entry Confirmed on Ledger</span>
            </div>
            <h3 className={styles.panelTitle}>
              You're In! Entry Verified for the Summer Grand Pool
            </h3>
            <p className={styles.panelDescription}>
              Your participation has been committed to the atomic transaction ledger. When the countdown ends, the crypto-random engine will select the verified winner list.
            </p>
          </div>
        </div>
        <div className={styles.rightCol}>
          <div className={styles.ticketBox}>
            <span className={styles.ticketLabel}>Your Entry Ticket</span>
            <button
              type="button"
              className={styles.ticketPill}
              onClick={handleCopyTicket}
              title="Click to copy ticket hash"
            >
              <span>{ticketId}</span>
              <span className={styles.copyNotice}>
                {ticketCopied ? 'Copied!' : 'Copy'}
              </span>
            </button>
          </div>
          <span className={styles.subtext}>Draw in 12d : 08h remaining</span>
        </div>
      </div>
    );
  }

  // State 5: NON_WINNER (Empathetic notification with next drop recommendation)
  if (userState === USER_STATE.NON_WINNER) {
    return (
      <div className={`${styles.panelCard} ${styles.nonWinnerTheme}`}>
        <div className={styles.leftCol}>
          <div className={styles.iconBoxNonWinner}>
            <Clock size={22} />
          </div>
          <div>
            <div className={styles.badgeRow}>
              <span className={styles.badgeNonWinner}>Previous Round Ended</span>
              <span className={styles.dotSeparator}>•</span>
              <span className={styles.metaNotice}>Better Luck Next Time!</span>
            </div>
            <h3 className={styles.panelTitle}>
              Thank You for Participating in the Recent Drop
            </h3>
            <p className={styles.panelDescription}>
              While your ticket wasn't drawn this round, the next reward pool is gearing up with Amazon vouchers and Apple accessories. Check the preview below to turn on notifications.
            </p>
          </div>
        </div>
        <div className={styles.rightCol}>
          <a href="#featured-giveaways" className={styles.exploreBtn}>
            <span>Explore Next Drops</span>
            <ArrowRight size={15} />
          </a>
          <span className={styles.subtext}>New pools drop weekly</span>
        </div>
      </div>
    );
  }

  // State 2: LOGGED_IN (Authenticated, Not Yet Joined)
  return (
    <div className={`${styles.panelCard} ${styles.loggedInTheme}`}>
      <div className={styles.leftCol}>
        <div className={styles.iconBoxLoggedIn}>
          <Wallet size={22} />
        </div>
        <div>
          <div className={styles.badgeRow}>
            <span className={styles.badgeLoggedIn}>Member Active</span>
            <span className={styles.badgePill}>{user?.userId || 'VE10025'}</span>
            <span className={styles.dotSeparator}>•</span>
            <span className={styles.metaNotice}>Ready to Enter Giveaways</span>
          </div>
          <h3 className={styles.panelTitle}>
            Choose Your Favorite Prize & Join With Your Balance
          </h3>
          <p className={styles.panelDescription}>
            Select from the featured rewards below. Entry fees are deducted securely from your VE or SVE balance upon confirmation.
          </p>
        </div>
      </div>
      <div className={styles.rightCol}>
        {/* Live Balance Chips */}
        <div className={styles.balanceSummaryBox}>
          <span className={styles.balanceSummaryLabel}>Your Available Balances</span>
          <div className={styles.balanceChipsRow}>
            <div className={styles.balanceChip}>
              <Coins size={12} className={styles.balanceIconGold} />
              <span>{wallet.ves.toLocaleString()} VE</span>
            </div>
            <div className={styles.balanceChip}>
              <Coins size={12} className={styles.balanceIconCyan} />
              <span>{wallet.sves.toLocaleString()} SVE</span>
            </div>
          </div>
        </div>
        <Link to="/earn" className={styles.earnMoreLink}>
          Need more tokens? Earn More →
        </Link>
      </div>
    </div>
  );
}

export default PersonalStatusPanel;

import { useState } from 'react';
import { Sliders, X, Sparkles, RefreshCw } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { USER_STATE, CLAIM_STATUS } from '../../config/giveawayStatus';
import styles from './DevStateSwitcher.module.css';

/**
 * Dev State Switcher (Brief Section 132 & WD7 milestone)
 * Active in dev builds or when ?demo=1 query parameter is present.
 * Allows 1-click toggling of user state, claim state, prize types, and winner reveal for QA screenshots.
 */
export function DevStateSwitcher() {
  const isDev = import.meta.env.DEV || window.location.search.includes('demo=1');
  const [isOpen, setIsOpen] = useState(false);
  const {
    isAuthenticated,
    userState,
    setUserState,
    claimStatus,
    setClaimStatus,
    claimPrizeType,
    setClaimPrizeType,
    isRevealing,
    setIsRevealing,
    resetClaim,
    login,
    logout,
    setCustomWallet
  } = useAuth();

  if (!isDev) return null;

  const handleSimulateReveal = () => {
    setIsRevealing(true);
    setTimeout(() => {
      setIsRevealing(false);
    }, 4000);
  };

  return (
    <div className={styles.floatingWidget}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className={styles.toggleBtn}
          title="Open Dev State Switcher (QA & Screenshots)"
        >
          <Sliders size={16} />
          <span>Dev QA</span>
        </button>
      ) : (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <Sliders size={16} />
              <span>Dev State Switcher (WD7)</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={styles.closeBtn}
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          <div className={styles.panelBody}>
            {/* 1. User State Matrix (Sec 5 & WD7) */}
            <div className={styles.section}>
              <div className={styles.sectionLabel}>User State (Sec 5 Matrix)</div>
              <div className={styles.buttonGrid}>
                <button
                  className={`${styles.actionBtn} ${userState === USER_STATE.VISITOR ? styles.actionBtnActive : ''}`}
                  onClick={() => {
                    logout();
                    setUserState(USER_STATE.VISITOR);
                  }}
                >
                  Visitor (Out)
                </button>
                <button
                  className={`${styles.actionBtn} ${userState === USER_STATE.LOGGED_IN ? styles.actionBtnActive : ''}`}
                  onClick={() => {
                    login('jivan@veloop.io', 'pass');
                    setUserState(USER_STATE.LOGGED_IN);
                  }}
                >
                  Logged In
                </button>
                <button
                  className={`${styles.actionBtn} ${userState === USER_STATE.PARTICIPANT ? styles.actionBtnActive : ''}`}
                  onClick={() => {
                    if (!isAuthenticated) login('jivan@veloop.io', 'pass');
                    setUserState(USER_STATE.PARTICIPANT);
                  }}
                >
                  Participant ✓
                </button>
                <button
                  className={`${styles.actionBtn} ${userState === USER_STATE.WINNER ? styles.actionBtnActiveGold : ''}`}
                  onClick={() => {
                    if (!isAuthenticated) login('jivan@veloop.io', 'pass');
                    setUserState(USER_STATE.WINNER);
                  }}
                >
                  ★ Winner
                </button>
                <button
                  className={`${styles.actionBtn} ${userState === USER_STATE.NON_WINNER ? styles.actionBtnActive : ''}`}
                  onClick={() => {
                    if (!isAuthenticated) login('jivan@veloop.io', 'pass');
                    setUserState(USER_STATE.NON_WINNER);
                  }}
                  style={{ gridColumn: 'span 2' }}
                >
                  Non-Winner (Next Drop CTA)
                </button>
              </div>
            </div>

            {/* 2. Prize Type for Claim */}
            <div className={styles.section}>
              <div className={styles.sectionLabel}>Claim Prize Type</div>
              <div className={styles.buttonGrid}>
                <button
                  className={`${styles.actionBtn} ${claimPrizeType === 'PHYSICAL' ? styles.actionBtnActive : ''}`}
                  onClick={() => setClaimPrizeType('PHYSICAL')}
                >
                  Physical (iPhone)
                </button>
                <button
                  className={`${styles.actionBtn} ${claimPrizeType === 'GIFT_CARD' ? styles.actionBtnActive : ''}`}
                  onClick={() => setClaimPrizeType('GIFT_CARD')}
                >
                  Gift Card (Amazon)
                </button>
              </div>
            </div>

            {/* 3. Claim State (5 States) */}
            <div className={styles.section}>
              <div className={styles.sectionHeaderRow}>
                <span className={styles.sectionLabel}>Claim State (5 States)</span>
                <button
                  onClick={resetClaim}
                  className={styles.textActionBtn}
                  title="Reset claim to unclaimed"
                >
                  <RefreshCw size={11} /> Reset
                </button>
              </div>
              <div className={styles.buttonGrid}>
                <button
                  className={`${styles.actionBtn} ${claimStatus === CLAIM_STATUS.NOT_SUBMITTED ? styles.actionBtnActive : ''}`}
                  onClick={() => setClaimStatus(CLAIM_STATUS.NOT_SUBMITTED)}
                >
                  Unclaimed
                </button>
                <button
                  className={`${styles.actionBtn} ${claimStatus === 'SUBMITTING' ? styles.actionBtnActive : ''}`}
                  onClick={() => setClaimStatus('SUBMITTING')}
                >
                  Submitting…
                </button>
                <button
                  className={`${styles.actionBtn} ${claimStatus === CLAIM_STATUS.SUBMITTED ? styles.actionBtnActive : ''}`}
                  onClick={() => setClaimStatus(CLAIM_STATUS.SUBMITTED)}
                >
                  Submitted ✓
                </button>
                <button
                  className={`${styles.actionBtn} ${claimStatus === CLAIM_STATUS.PROCESSING ? styles.actionBtnActive : ''}`}
                  onClick={() => setClaimStatus(CLAIM_STATUS.PROCESSING)}
                >
                  Processing
                </button>
                <button
                  className={`${styles.actionBtn} ${claimStatus === CLAIM_STATUS.EXPIRED ? styles.actionBtnActiveDanger : ''}`}
                  onClick={() => setClaimStatus(CLAIM_STATUS.EXPIRED)}
                  style={{ gridColumn: 'span 2' }}
                >
                  Expired (7-Day Limit)
                </button>
              </div>
            </div>

            {/* 4. Controlled Reveal Simulation */}
            <div className={styles.section}>
              <div className={styles.sectionLabel}>Controlled Winner Reveal</div>
              <button
                className={`${styles.actionBtn} ${styles.revealBtn} ${isRevealing ? styles.actionBtnActiveGold : ''}`}
                onClick={handleSimulateReveal}
                disabled={isRevealing}
              >
                <Sparkles size={13} />
                <span>{isRevealing ? 'Selecting Winners…' : 'Simulate Reveal (4s)'}</span>
              </button>
            </div>

            {/* 5. Wallet Balance Scenarios */}
            <div className={styles.section}>
              <div className={styles.sectionLabel}>Wallet Balance Scenario</div>
              <div className={styles.buttonGrid}>
                <button
                  className={styles.actionBtn}
                  onClick={() => setCustomWallet({ ves: 2500, sves: 1000, tokens: 5000 })}
                >
                  Sufficient (2.5k VE)
                </button>
                <button
                  className={styles.actionBtn}
                  onClick={() => setCustomWallet({ ves: 40, sves: 800, tokens: 5000 })}
                >
                  Low VE (40 VE)
                </button>
                <button
                  className={styles.actionBtn}
                  onClick={() => setCustomWallet({ ves: 1000, sves: 20, tokens: 5000 })}
                >
                  Low SVE (20 SVE)
                </button>
                <button
                  className={styles.actionBtn}
                  onClick={() => setCustomWallet({ ves: 0, sves: 0, tokens: 0 })}
                >
                  Zero Balance
                </button>
              </div>
            </div>
          </div>

          {/* Screenshot Helper Note */}
          <div className={styles.panelFooter}>
            <span className="text-gold fw-bold">Tip:</span> Switch states to verify the Personal Panel, Prize Claim Modal, and reveal transitions.
          </div>
        </div>
      )}
    </div>
  );
}

export default DevStateSwitcher;

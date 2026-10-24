import React, { useState } from 'react';
import { Sliders, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import styles from './DevStateSwitcher.module.css';

/**
 * Dev State Switcher (Brief Section 132 & WD3 milestone)
 * Active in dev builds or when ?demo=1 query parameter is present.
 * Allows 1-click toggling of user auth, balance sufficiency, and test states for QA screenshots.
 */
export function DevStateSwitcher() {
  const isDev = import.meta.env.DEV || window.location.search.includes('demo=1');
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, login, logout, setCustomWallet } = useAuth();

  if (!isDev) return null;

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
              <span>Dev State Switcher</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={styles.closeBtn}
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          {/* User Auth State */}
          <div className={styles.section}>
            <div className={styles.sectionLabel}>User State</div>
            <div className={styles.buttonGrid}>
              <button
                className={`${styles.actionBtn} ${!isAuthenticated ? styles.actionBtnActive : ''}`}
                onClick={logout}
              >
                Visitor (Logged Out)
              </button>
              <button
                className={`${styles.actionBtn} ${isAuthenticated ? styles.actionBtnActive : ''}`}
                onClick={() => login('jivan@veloop.io', 'pass')}
              >
                Logged In (VE10025)
              </button>
            </div>
          </div>

          {/* Balance Scenarios */}
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

          {/* Screenshot Helper Note */}
          <div className="pt-2 border-top border-subtle small text-muted-custom">
            <span className="text-gold fw-bold">Tip:</span> Use this widget to capture all 11 required screenshot states across mobile & desktop.
          </div>
        </div>
      )}
    </div>
  );
}

export default DevStateSwitcher;

import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.topRow}>
          <div className={styles.brandCol}>
            <h4>VELOOP Rewards & Giveaways</h4>
            <p className={styles.brandDesc}>
              A transparent reward ecosystem backed by authoritative server-side verification, cryptographically random winner distribution, and zero gambling mechanics.
            </p>
          </div>

          <div>
            <div className={styles.colTitle}>Platform</div>
            <ul className={styles.linkList}>
              <li><Link to="/giveaway">Active Giveaways</Link></li>
              <li><Link to="/earn">How to Earn Entries</Link></li>
              <li><a href="#how-it-works">Rules & Transparency</a></li>
              <li><a href="#faq">Frequently Asked Questions</a></li>
            </ul>
          </div>

          <div>
            <div className={styles.colTitle}>Trust & Policy</div>
            <ul className={styles.linkList}>
              <li><a href="#terms">Terms of Participation</a></li>
              <li><a href="#privacy">Privacy & Masked Winner IDs</a></li>
              <li><a href="#shipping">Courier Delivery & Claims</a></li>
              <li><a href="#compliance">Regulatory Compliance</a></li>
            </ul>
          </div>
        </div>

        {/* Policy Flag & Disclaimer per PRD Section 2 & 10 */}
        <div className={styles.disclaimerBox}>
          <div className="d-flex align-items-center gap-2 mb-1">
            <ShieldCheck size={16} className="text-emerald" />
            <span className={styles.disclaimerHighlight}>Platform Transparency Notice:</span>
          </div>
          VELOOP Rewards is an engagement and loyalty rewards system. Entry tokens (VE, SVE, Tokens) are promotional reward units earned through platform activity and do not represent fiat currency or redeemable legal tender. Selection of recipients is conducted via verified backend algorithms. Refund and dispute policies: <span className="text-secondary-custom">[PLACEHOLDER — pending VELOOP legal & compliance sign-off]</span>.
        </div>

        <div className={styles.bottomRow}>
          <span>© 2026 VELOOP Rewards. All rights reserved.</span>
          <span>Designed & Built with React, Bootstrap & CSS Modules</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

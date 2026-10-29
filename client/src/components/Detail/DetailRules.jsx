import { ShieldAlert } from 'lucide-react';
import styles from './HowItWorksSteps.module.css';

const RULES_LIST = [
  'Strictly 1 entry per verified user account and device signature.',
  'Entry fees are debited atomically upon confirmation and are non-refundable.',
  'Winners are selected via cryptographically secure server random distributions.',
  'Physical prize claims require a verifiable Indian postal address and active phone number.',
  'Digital vouchers are dispatched exclusively to the registered account email address.',
  'Tamper attempts, script injection, or device spoofing result in immediate forfeiture.'
];

/**
 * DetailRules Component (PRD Section 128 & WD8 Milestone)
 * Key participation standards and platform integrity guidelines.
 */
export function DetailRules() {
  return (
    <div className={styles.sectionWrap}>
      <div className={styles.headerRow}>
        <div className={styles.iconBox} style={{ background: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.35)', color: '#F59E0B' }}>
          <ShieldAlert size={18} />
        </div>
        <div>
          <h2 className={styles.sectionTitle}>Participation Rules</h2>
          <p className={styles.sectionSubtitle}>
            Mandatory guidelines governing pool participation and reward distribution
          </p>
        </div>
      </div>

      <div className="card bg-surface border-subtle p-3 p-md-4 rounded-4" style={{ background: 'rgba(18, 24, 20, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
          {RULES_LIST.map((rule, idx) => (
            <li key={idx} className="small text-secondary-custom d-flex align-items-start gap-2 text-white-50">
              <span className="text-emerald fw-bold" style={{ color: '#10B981', marginTop: '2px' }}>✓</span>
              <span style={{ fontSize: '0.84rem', color: '#CBD5E1', lineHeight: '1.5' }}>{rule}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DetailRules;

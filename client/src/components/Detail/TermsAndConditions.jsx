import { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import styles from './TermsAndConditions.module.css';

const TEN_TOPICS = [
  {
    id: 'tc-01',
    title: '1. Eligibility & Minimum Age',
    content: 'Participation is open solely to registered members in good standing who are at least 18 years of age. Employees of VELOOP and immediate affiliates are barred from prize eligibility.',
    placeholder: '[PLACEHOLDER — pending VELOOP user terms compliance and jurisdictional age review]'
  },
  {
    id: 'tc-02',
    title: '2. Campaign Timelines & Clock Authority',
    content: 'All campaign opening, participation, and concluding times are synchronized against the authoritative backend server clock (UTC/IST). Client device system clock offsets will not affect eligibility.',
    placeholder: '[PLACEHOLDER — pending multi-region server latency tolerance threshold]'
  },
  {
    id: 'tc-03',
    title: '3. Currency Mechanics & Non-Refundability',
    content: 'Fees deducted in VELOOP Entries (VE), Super Veloop Entries (SVE), or Tokens represent digital platform credits and cannot be exchanged for fiat currency or transferred across accounts. Deductions are final once confirmed on the atomic ledger.',
    placeholder: '[PLACEHOLDER — pending formal rewards program tax classification statement]'
  },
  {
    id: 'tc-04',
    title: '4. Selection Engine & Proof of Entropy',
    content: 'Winner selection is performed via cryptographically secure pseudo-random number generator (crypto.randomInt) evaluated over all confirmed entry hashes. Results are immutable once generated.',
    placeholder: '[PLACEHOLDER — pending external cryptographic audit firm certification note]'
  },
  {
    id: 'tc-05',
    title: '5. Winner Verification & KYC Procedures',
    content: 'Prior to prize dispatch, prospective winners must verify account ownership and may be requested to furnish government-issued photo identification to prevent fraud and multi-accounting abuse.',
    placeholder: '[PLACEHOLDER — pending Indian PII data retention and DPDP compliance protocol]'
  },
  {
    id: 'tc-06',
    title: '6. Claim Procedure & 7-Day Forfeiture Window',
    content: 'Winners must submit full delivery and contact specifications through the claim portal within exactly 7 calendar days (168 hours) from announcement. Unclaimed prizes are forfeited or re-rolled.',
    placeholder: '[PLACEHOLDER — pending final community pool re-roll vs rollover specification]'
  },
  {
    id: 'tc-07',
    title: '7. Delivery, Logistics & Shipping Duties',
    content: 'Physical merchandise is dispatched via insured courier services across serviceable Indian postal PIN codes. Digital vouchers are transmitted via encrypted email vouchers.',
    placeholder: '[PLACEHOLDER — pending third-party logistics courier SLA & remote PIN clause]'
  },
  {
    id: 'tc-08',
    title: '8. Disqualification & Fraud Prevention',
    content: 'Any participant attempting to deploy bots, duplicate accounts on identical hardware devices, modify network headers, or tamper with entry payloads is subject to permanent ban and entry forfeiture.',
    placeholder: '[PLACEHOLDER — pending risk engine device fingerprinting disclosure]'
  },
  {
    id: 'tc-09',
    title: '9. Limitation of Liability & Force Majeure',
    content: 'The platform is not responsible for technical outages, telecom drops, or postal carrier delays beyond reasonable administrative control. In the event of supplier unavailability, an equivalent retail value alternative may be offered.',
    placeholder: '[PLACEHOLDER — pending legal counsel limitation of liability standard phrasing]'
  },
  {
    id: 'tc-10',
    title: '10. Governing Law & Dispute Resolution',
    content: 'These terms and conditions are governed by and construed in accordance with the laws of the Republic of India. Any disputes arising hereunder shall be subject to the exclusive jurisdiction of the competent courts in India.',
    placeholder: '[PLACEHOLDER — pending designated state and city arbitration venue finalization]'
  }
];

/**
 * TermsAndConditions Component (PRD Section 128 & WD8 Milestone)
 * 10 topics with explicit [PLACEHOLDER — ...] markers flagged per PRD specification.
 */
export function TermsAndConditions() {
  const [openTopicId, setOpenTopicId] = useState('tc-01');

  const toggleTopic = (id) => {
    setOpenTopicId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={styles.sectionWrap}>
      <div className={styles.headerRow}>
        <div className={styles.iconBox}>
          <FileText size={18} />
        </div>
        <div>
          <h2 className={styles.sectionTitle}>Terms & Conditions</h2>
          <p className={styles.sectionSubtitle}>
            10 official topics governing platform giveaways (Legal placeholders flagged)
          </p>
        </div>
      </div>

      <div className={styles.accordionContainer}>
        {TEN_TOPICS.map((topic) => {
          const isOpen = openTopicId === topic.id;
          return (
            <div key={topic.id} className={`${styles.topicCard} ${isOpen ? styles.topicCardOpen : ''}`}>
              <button
                type="button"
                className={styles.topicHeader}
                onClick={() => toggleTopic(topic.id)}
                aria-expanded={isOpen}
              >
                <span className={styles.topicTitle}>{topic.title}</span>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {isOpen && (
                <div className={styles.topicBody}>
                  <p className={styles.topicContent}>{topic.content}</p>
                  <div className={styles.placeholderBanner}>
                    <AlertCircle size={14} className={styles.placeholderIcon} />
                    <span className={styles.placeholderText}>{topic.placeholder}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TermsAndConditions;

import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import styles from './ImportantInfo.module.css';

const IMPORTANT_TOPICS = [
  {
    id: 'info-01',
    title: 'Tax Implications & Regulatory Compliance (TDS)',
    content: 'All promotional rewards and gadget distributions are conducted in strict compliance with applicable Indian tax statutes. Under Section 194B/194BA of the Income Tax Act, prizes exceeding statutory value thresholds may be subject to applicable Tax Deducted at Source (TDS) prior to delivery confirmation.'
  },
  {
    id: 'info-02',
    title: 'Manufacturer Warranty, Service & Replacement',
    content: 'All branded physical gadgets (such as Apple iPhone 15 Pro, Apple Watch, and AirPods) are brand-new, genuine factory-sealed retail units carrying full 1-year official manufacturer warranty. In the rare event of transit damage, recipients must report within 48 hours with unboxing video documentation.'
  },
  {
    id: 'info-03',
    title: 'Unclaimed Rewards & Platform Reserve Re-Allocation',
    content: 'Winners must finalize their claim within the strict 7-calendar-day window (168 hours). Prizes uncollected upon expiry are returned automatically to the platform community rewards reserve or re-drawn for randomized runner-ups.'
  }
];

/**
 * ImportantInfoAccordion Component (PRD Section 128)
 * Expandable disclosures covering Tax, Warranty, and Unclaimed policies.
 */
export function ImportantInfoAccordion() {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={styles.sectionWrap}>
      <div className={styles.headerRow}>
        <div className={styles.iconBox}>
          <HelpCircle size={18} />
        </div>
        <div>
          <h2 className={styles.sectionTitle}>Important Information</h2>
          <p className={styles.sectionSubtitle}>
            Key platform compliance, tax guidelines, and warranty guarantees
          </p>
        </div>
      </div>

      <div className={styles.accordionContainer}>
        {IMPORTANT_TOPICS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id} className={`${styles.card} ${isOpen ? styles.cardOpen : ''}`}>
              <button
                type="button"
                className={styles.headerBtn}
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
              >
                <div className={styles.titleWrap}>
                  <AlertTriangle size={15} className={styles.alertIcon} />
                  <span className={styles.title}>{item.title}</span>
                </div>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {isOpen && (
                <div className={styles.body}>
                  <p className={styles.content}>{item.content}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ImportantInfoAccordion;

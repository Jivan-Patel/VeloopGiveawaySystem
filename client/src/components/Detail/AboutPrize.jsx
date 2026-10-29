import { Info, Shield, Truck, Sparkles } from 'lucide-react';
import styles from './AboutPrize.module.css';

/**
 * AboutPrize Component (PRD Section 128)
 * Displays rich specifications, retail value, warranty disclosures,
 * and delivery commitments tailored to the active giveaway item.
 */
export function AboutPrize({ giveaway }) {
  if (!giveaway) return null;

  const { title, description, prize = {} } = giveaway;
  const isPhysical = prize.type === 'PHYSICAL';

  const specs = [
    { label: 'Prize Item', value: prize.name || title },
    { label: 'Fulfillment Category', value: isPhysical ? 'Physical Doorstep Delivery' : 'Instant Digital Voucher' },
    { label: 'Estimated Retail Value', value: prize.retailValue || '₹1,34,900' },
    { label: 'Authenticity Guarantee', value: '100% Genuine Sealed Unit / Merchant Code' },
    { label: 'Warranty / Validity', value: isPhysical ? '1-Year Official Manufacturer Warranty' : '12-Month Redemption Validity' },
    { label: 'Delivery Timeline', value: isPhysical ? '3–7 Business Days (Tracked)' : 'Dispatched within 24 Hours' }
  ];

  return (
    <div className={styles.sectionWrap}>
      <div className={styles.headerRow}>
        <div className={styles.iconBox}>
          <Info size={18} />
        </div>
        <div>
          <h2 className={styles.sectionTitle}>About the Prize</h2>
          <p className={styles.sectionSubtitle}>
            Official specifications and manufacturer-backed platform guarantees
          </p>
        </div>
      </div>

      <div className={styles.bodyCard}>
        <p className={styles.descriptionText}>
          {description ||
            'Each reward unit offered on the VELOOP platform is procured directly from authorized distributors and verified for authenticity.'}
        </p>

        {/* Feature Highlights Grid */}
        <div className={styles.specsGrid}>
          {specs.map((item, idx) => (
            <div key={idx} className={styles.specItem}>
              <span className={styles.specLabel}>{item.label}</span>
              <span className={styles.specVal}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Security & Logistics Badges */}
        <div className={styles.guaranteeRow}>
          <div className={styles.guaranteeItem}>
            <Shield size={14} className={styles.guaranteeIcon} />
            <span>Sealed Factory Condition</span>
          </div>
          <div className={styles.guaranteeItem}>
            <Truck size={14} className={styles.guaranteeIcon} />
            <span>Zero Out-of-Pocket Delivery Surcharge</span>
          </div>
          <div className={styles.guaranteeItem}>
            <Sparkles size={14} className={styles.guaranteeIconGold} />
            <span>Direct Brand Support</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPrize;

import { ShieldCheck, Lock, Users, Headphones } from 'lucide-react';
import styles from './TrustBadges.module.css';

/**
 * TrustBadges Component - Strictly matching Ref_02.jpeg (Document last page)
 * 4 bottom security and credibility badges:
 * 1. 100% Fair & Transparent
 * 2. Secure & Safe
 * 3. Trusted by 10K+ Users
 * 4. 24/7 Customer Support
 */
export function TrustBadges() {
  const items = [
    {
      icon: ShieldCheck,
      colorClass: styles.purple,
      title: 'Clear & Verifiable Rules',
      desc: 'Cryptographically randomized draws on an authoritative backend ledger.'
    },
    {
      icon: Lock,
      colorClass: styles.blue,
      title: 'Secure & Safe',
      desc: 'Your data, entry state, and token balances are protected with enterprise-grade encryption.'
    },
    {
      icon: Users,
      colorClass: styles.green,
      title: 'Transparent Community',
      desc: 'Real participants, verified prize distributions, and zero hidden shipping costs.'
    },
    {
      icon: Headphones,
      colorClass: styles.orange,
      title: '24/7 Dedicated Support',
      desc: 'Prompt assistance for account inquiries, reward tracking, and delivery support.'
    }
  ];

  return (
    <div className={styles.container} role="region" aria-label="Trust and platform security assurances">
      <div className={styles.grid}>
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className={styles.item}>
              <div className={`${styles.iconWrap} ${item.colorClass}`}>
                <Icon size={20} />
              </div>
              <div className={styles.textWrap}>
                <h4 className={styles.title}>{item.title}</h4>
                <p className={styles.desc}>{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TrustBadges;

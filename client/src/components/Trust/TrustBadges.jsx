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
      title: '100% Fair & Transparent',
      desc: 'All giveaways are conducted fairly and transparently.'
    },
    {
      icon: Lock,
      colorClass: styles.blue,
      title: 'Secure & Safe',
      desc: 'Your data and privacy are our top priority.'
    },
    {
      icon: Users,
      colorClass: styles.green,
      title: 'Trusted by 10K+ Users',
      desc: 'Join thousands of happy users who trust VELoop Rewards.'
    },
    {
      icon: Headphones,
      colorClass: styles.orange,
      title: '24/7 Customer Support',
      desc: "We're here to help you anytime, anywhere."
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

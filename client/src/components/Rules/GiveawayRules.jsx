import { useState } from 'react';
import {
  FileText,
  UserCheck,
  ShieldAlert,
  Coins,
  Cpu,
  Clock,
  Truck,
  Lock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { MOCK_GIVEAWAY_RULES } from '../../data/giveawayData';
import styles from './GiveawayRules.module.css';

const RULE_ICONS = [
  UserCheck,
  ShieldAlert,
  Coins,
  Cpu,
  Clock,
  Truck,
  Lock
];

export function GiveawayRules() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleRule = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="rules" className={styles.section} aria-labelledby="rules-heading">
      <div className={styles.header}>
        <div className={styles.headerBadge}>
          <FileText size={14} className={styles.badgeIcon} />
          <span>Official Participation Guidelines</span>
        </div>
        <h2 id="rules-heading" className={styles.title}>
          Giveaway Rules & Transparency Policies
        </h2>
        <p className={styles.subtitle}>
          Authoritative standards governing entry validation, cryptographic winner selection, and verified prize distribution.
        </p>
      </div>

      <div className={styles.rulesGrid}>
        {MOCK_GIVEAWAY_RULES.map((rule, idx) => {
          const Icon = RULE_ICONS[idx % RULE_ICONS.length];
          const isExpanded = expandedId === rule.id;

          return (
            <div
              key={rule.id}
              className={`${styles.ruleCard} ${isExpanded ? styles.ruleCardExpanded : ''}`}
            >
              <button
                type="button"
                className={styles.ruleCardHeader}
                onClick={() => toggleRule(rule.id)}
                aria-expanded={isExpanded}
                aria-controls={`rule-body-${rule.id}`}
              >
                <div className={styles.ruleIconWrap}>
                  <Icon size={18} />
                </div>
                <div className={styles.ruleHeaderContent}>
                  <h3 className={styles.ruleTopic}>{rule.topic}</h3>
                  <p className={styles.ruleSummary}>{rule.summary}</p>
                </div>
                <div className={styles.toggleIconWrap}>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {isExpanded && (
                <div
                  id={`rule-body-${rule.id}`}
                  className={styles.ruleDetails}
                  role="region"
                  aria-label={rule.topic}
                >
                  <p>{rule.details}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default GiveawayRules;

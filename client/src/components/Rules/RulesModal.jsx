import { useState, useEffect } from 'react';
import {
  X,
  FileText,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  UserCheck,
  ShieldAlert,
  Coins,
  Cpu,
  Clock,
  Truck,
  Lock
} from 'lucide-react';
import { MOCK_GIVEAWAY_RULES, MOCK_FAQS } from '../../data/giveawayData';
import styles from './RulesModal.module.css';

const RULE_ICONS = [
  UserCheck,
  ShieldAlert,
  Coins,
  Cpu,
  Clock,
  Truck,
  Lock
];

export function RulesModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('rules'); // 'rules' | 'faqs'
  const [expandedRule, setExpandedRule] = useState('rule-1');
  const [expandedFaq, setExpandedFaq] = useState('faq-1');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <div className={styles.iconWrap}>
              <ShieldCheck size={22} className={styles.shieldIcon} />
            </div>
            <div>
              <h2 id="modal-title" className={styles.title}>Rules & Guidelines</h2>
              <p className={styles.subtitle}>Verified standards, transparency policies, and FAQs</p>
            </div>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className={styles.tabBar} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'rules'}
            className={`${styles.tabBtn} ${activeTab === 'rules' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('rules')}
          >
            <FileText size={15} />
            <span>Official Rules (7 Topics)</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'faqs'}
            className={`${styles.tabBtn} ${activeTab === 'faqs' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('faqs')}
          >
            <HelpCircle size={15} />
            <span>FAQs (7 Questions)</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className={styles.contentBody}>
          {activeTab === 'rules' ? (
            <div className={styles.accordionList}>
              {MOCK_GIVEAWAY_RULES.map((rule, idx) => {
                const Icon = RULE_ICONS[idx % RULE_ICONS.length];
                const isExpanded = expandedRule === rule.id;

                return (
                  <div key={rule.id} className={`${styles.accordionItem} ${isExpanded ? styles.itemActive : ''}`}>
                    <button
                      type="button"
                      className={styles.accordionHeader}
                      onClick={() => setExpandedRule(isExpanded ? null : rule.id)}
                      aria-expanded={isExpanded}
                    >
                      <div className={styles.headerLeft}>
                        <div className={styles.ruleIconWrap}>
                          <Icon size={16} />
                        </div>
                        <span className={styles.ruleTitle}>{rule.title}</span>
                      </div>
                      {isExpanded ? <ChevronUp size={18} className={styles.chevron} /> : <ChevronDown size={18} className={styles.chevron} />}
                    </button>
                    {isExpanded && (
                      <div className={styles.accordionBody}>
                        <p className={styles.ruleContent}>{rule.content}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.accordionList}>
              {MOCK_FAQS.map((faq) => {
                const isExpanded = expandedFaq === faq.id;

                return (
                  <div key={faq.id} className={`${styles.accordionItem} ${isExpanded ? styles.itemActive : ''}`}>
                    <button
                      type="button"
                      className={styles.accordionHeader}
                      onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                      aria-expanded={isExpanded}
                    >
                      <div className={styles.headerLeft}>
                        <div className={styles.faqIconWrap}>
                          <HelpCircle size={16} />
                        </div>
                        <span className={styles.ruleTitle}>{faq.question}</span>
                      </div>
                      {isExpanded ? <ChevronUp size={18} className={styles.chevron} /> : <ChevronDown size={18} className={styles.chevron} />}
                    </button>
                    {isExpanded && (
                      <div className={styles.accordionBody}>
                        <p className={styles.ruleContent}>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <span className={styles.footerNote}>All giveaways are 100% compliant with platform integrity standards.</span>
          <button type="button" className={styles.doneBtn} onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

export default RulesModal;

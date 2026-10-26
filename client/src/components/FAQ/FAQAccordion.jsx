import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { MOCK_FAQS } from '../../data/giveawayData';
import styles from './FAQAccordion.module.css';

export function FAQAccordion() {
  const [openId, setOpenId] = useState('faq-1');

  const toggleItem = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className={styles.section} aria-labelledby="faq-heading">
      <div className={styles.header}>
        <div className={styles.headerBadge}>
          <HelpCircle size={14} className={styles.badgeIcon} />
          <span>Support & Clarity</span>
        </div>
        <h2 id="faq-heading" className={styles.title}>
          Frequently Asked Questions
        </h2>
        <p className={styles.subtitle}>
          Everything you need to know about entries, cryptographic winner selection, and reward delivery.
        </p>
      </div>

      <div className={styles.accordionList} role="region" aria-label="FAQ Accordion">
        {MOCK_FAQS.map((item) => {
          const isOpen = openId === item.id;

          return (
            <div
              key={item.id}
              className={`${styles.accordionItem} ${isOpen ? styles.accordionItemOpen : ''}`}
            >
              <button
                type="button"
                className={styles.questionButton}
                onClick={() => toggleItem(item.id)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${item.id}`}
              >
                <span className={styles.questionText}>{item.question}</span>
                <span className={styles.chevronWrap}>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </button>

              {isOpen && (
                <div
                  id={`faq-answer-${item.id}`}
                  className={styles.answerWrap}
                  role="region"
                  aria-label={item.question}
                >
                  <p className={styles.answerText}>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default FAQAccordion;

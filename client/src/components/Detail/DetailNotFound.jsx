import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft, Sparkles } from 'lucide-react';
import styles from './DetailNotFound.module.css';

/**
 * DetailNotFound Component (PRD Section 128 & 317)
 * Rendered when a giveaway slug is unknown or not present in the dataset.
 */
export function DetailNotFound({ slug }) {
  return (
    <div className={styles.notFoundWrap}>
      <div className={styles.card}>
        <div className={styles.iconCircle}>
          <HelpCircle size={36} />
        </div>

        <span className={styles.badge}>404 · Unknown Pool</span>
        <h1 className={styles.title}>Giveaway Pool Not Found</h1>
        <p className={styles.description}>
          We couldn't locate any active, upcoming, or archived giveaway associated with the identifier{' '}
          <span className={styles.slugCode}>{slug || 'unknown'}</span>.
        </p>

        <div className={styles.actionRow}>
          <Link to="/giveaway" className={styles.primaryBtn}>
            <ArrowLeft size={16} />
            <span>Return to Giveaway Home</span>
          </Link>
          <Link to="/giveaway#featured-giveaways" className={styles.secondaryBtn}>
            <Sparkles size={15} />
            <span>Browse Active Drops</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DetailNotFound;

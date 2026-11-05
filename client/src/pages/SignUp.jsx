import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import styles from './Auth.module.css';

export function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/giveaway');
    } catch (err) {
      setError(err.message || 'Account creation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={`${styles.ambientOrb} ${styles.ambientOrbEmerald}`} />

      <div className={styles.authCard}>
        <div className={styles.headerBlock}>
          <div className={`${styles.iconCircle} ${styles.iconCircleGold}`}>
            <UserPlus size={26} />
          </div>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join VELOOP Rewards and start collecting entries</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email Address</label>
            <input
              type="email"
              className={styles.input}
              value={email}
              placeholder="you@domain.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              className={styles.input}
              value={password}
              placeholder="Create a strong password (min 8 chars)"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className={`${styles.submitBtn} ${styles.submitBtnGold}`}>
            {loading ? 'Creating Account…' : 'Register & Get 1,000 VE'}
          </button>
        </form>

        <div className={styles.footerRow}>
          <span>Already have an account?</span>
          <Link to="/login" className={`${styles.footerLink} ${styles.footerLinkGold}`}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import styles from './Auth.module.css';

export function Login() {
  const [email, setEmail] = useState('jivan@veloop.io');
  const [password, setPassword] = useState('password123');
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
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={`${styles.ambientOrb} ${styles.ambientOrbEmerald}`} />

      <div className={styles.authCard}>
        <div className={styles.headerBlock}>
          <div className={styles.iconCircle}>
            <LogIn size={26} />
          </div>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to inspect your wallet balances and join exclusive draws</p>
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
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Authenticating…' : 'Sign In'}
          </button>
        </form>

        <div className={styles.footerRow}>
          <span>Don't have an account?</span>
          <Link to="/signup" className={styles.footerLink}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

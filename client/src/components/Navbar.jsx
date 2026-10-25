import { Link, NavLink } from 'react-router-dom';
import { Gift, Zap, Award, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import styles from './Navbar.module.css';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.navContainer}>
        {/* Brand */}
        <Link to="/giveaway" className={styles.brand}>
          <div className={styles.brandLogo}>
            <Gift size={18} color="#FFFFFF" />
          </div>
          <span className={styles.brandText}>VELOOP</span>
          <span className={styles.brandBadge}>Rewards</span>
        </Link>

        {/* Navigation Links */}
        <nav>
          <ul className={styles.navLinks}>
            <li>
              <NavLink
                to="/giveaway"
                className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink)}
              >
                Giveaways
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/earn"
                className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink)}
              >
                Earn Entries
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Right Section: Wallet & User */}
        <div className={styles.rightSection}>
          {isAuthenticated && user?.wallet && (
            <div className={styles.walletChips} title="Your current wallet balances">
              <div className={`${styles.chip} ${styles.chipVe}`}>
                <Zap size={14} />
                <span>{Number(user.wallet.ves || 0).toLocaleString()} VE</span>
              </div>
              <span className={styles.chipDivider}>•</span>
              <div className={`${styles.chip} ${styles.chipSve}`}>
                <Award size={14} />
                <span>{Number(user.wallet.sves || 0).toLocaleString()} SVE</span>
              </div>
            </div>
          )}

          {isAuthenticated ? (
            <div className="d-flex align-items-center gap-2">
              <div className={styles.userBadge} title={`Logged in as ${user.userId}`}>
                <User size={14} className="me-1 text-emerald" />
                <span>{user.userId}</span>
              </div>
              <button
                onClick={logout}
                className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                title="Logout"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary-gradient d-flex align-items-center gap-1 btn-sm">
              <LogIn size={14} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

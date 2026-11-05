import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Gift, Zap, Award, LogIn, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import styles from './Navbar.module.css';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.navContainer}>
        {/* Brand */}
        <Link to="/giveaway" className={styles.brand} onClick={closeMenu}>
          <div className={styles.brandLogo}>
            <Gift size={18} color="#FFFFFF" />
          </div>
          <span className={styles.brandText}>VELOP</span>
          <span className={styles.brandBadge}>Rewards</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className={styles.desktopNav}>
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
                <Zap size={13} />
                <span>{Number(user.wallet.ves || 0).toLocaleString()} VE</span>
              </div>
              <span className={styles.chipDivider}>•</span>
              <div className={`${styles.chip} ${styles.chipSve}`}>
                <Award size={13} />
                <span>{Number(user.wallet.sves || 0).toLocaleString()} SVE</span>
              </div>
            </div>
          )}

          {isAuthenticated ? (
            <div className={styles.userControls}>
              <div className={styles.userBadge} title={`Logged in as ${user.userId}`}>
                <User size={14} className="text-emerald" />
                <span className={styles.userIdText}>{user.userId}</span>
              </div>
              <button
                onClick={logout}
                className={styles.logoutBtn}
                title="Logout"
                aria-label="Logout"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link to="/login" className={styles.loginBtn}>
              <LogIn size={14} />
              <span>Login</span>
            </Link>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            className={styles.mobileMenuToggle}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className={styles.mobileDrawer}>
          <ul className={styles.mobileNavLinks}>
            <li>
              <NavLink
                to="/giveaway"
                onClick={closeMenu}
                className={location.pathname === '/giveaway' ? `${styles.mobileNavLink} ${styles.mobileNavLinkActive}` : styles.mobileNavLink}
              >
                <Gift size={16} />
                <span>Giveaway Pools</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/earn"
                onClick={closeMenu}
                className={location.pathname === '/earn' ? `${styles.mobileNavLink} ${styles.mobileNavLinkActive}` : styles.mobileNavLink}
              >
                <Zap size={16} />
                <span>Earn Entries</span>
              </NavLink>
            </li>
          </ul>

          {isAuthenticated && user?.wallet && (
            <div className={styles.mobileWalletBar}>
              <span className={styles.mobileWalletLabel}>Your Wallet:</span>
              <div className={styles.mobileWalletChips}>
                <span className={styles.mobileChipVe}>🪙 {Number(user.wallet.ves || 0).toLocaleString()} VE</span>
                <span className={styles.mobileChipSve}>🏆 {Number(user.wallet.sves || 0).toLocaleString()} SVE</span>
                <span className={styles.mobileChipToken}>⚡ {Number(user.wallet.tokens || 0).toLocaleString()} TOKEN</span>
              </div>
            </div>
          )}

          <div className={styles.mobileAuthRow}>
            {isAuthenticated ? (
              <button onClick={() => { logout(); closeMenu(); }} className={styles.mobileLogoutBtn}>
                <LogOut size={15} />
                <span>Sign Out ({user.userId})</span>
              </button>
            ) : (
              <Link to="/login" onClick={closeMenu} className={styles.mobileLoginBtn}>
                <LogIn size={15} />
                <span>Sign In to Your Account</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;

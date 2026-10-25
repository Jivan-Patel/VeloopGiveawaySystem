import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import giveawayApi from '../services/giveawayApi';
import { MOCK_USER } from '../data/giveawayData';

/**
 * Authentication and User Session Context Provider.
 * Manages user authentication, wallet balances, and live demo scenarios.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadInitialUser() {
      try {
        const res = await giveawayApi.getAuthUser();
        if (!ignore) {
          setUser(res.data?.user || MOCK_USER);
        }
      } catch {
        if (!ignore) {
          setUser(MOCK_USER);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadInitialUser();

    return () => {
      ignore = true;
    };
  }, []);

  const login = async (_email, _password) => {
    localStorage.setItem('veloop_auth_token', 'mock-jwt-token-veloop');
    setUser(MOCK_USER);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('veloop_auth_token');
    setUser(null);
  };

  const setCustomWallet = (balances) => {
    setUser((prev) => (prev ? { ...prev, wallet: { ...prev.wallet, ...balances } } : null));
  };

  const refreshUser = async () => {
    try {
      const res = await giveawayApi.getAuthUser();
      setUser(res.data?.user || MOCK_USER);
    } catch {
      setUser(MOCK_USER);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    refreshUser,
    setCustomWallet
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;

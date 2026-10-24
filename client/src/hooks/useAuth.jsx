import React, { createContext, useContext, useState, useEffect } from 'react';
import giveawayApi from '../services/giveawayApi';
import { MOCK_USER } from '../data/giveawayData';

const AuthContext = createContext(null);

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

  // Helper for Dev State Switcher to flip balances on the fly
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth;

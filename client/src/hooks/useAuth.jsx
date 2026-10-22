import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import giveawayApi from '../services/giveawayApi';
import { MOCK_USER } from '../data/giveawayData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await giveawayApi.getAuthUser();
      if (res.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(MOCK_USER);
      }
    } catch {
      setUser(MOCK_USER);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
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

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    refreshUser: loadUser,
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

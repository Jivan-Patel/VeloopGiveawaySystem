import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import giveawayApi from '../services/giveawayApi';
import { MOCK_USER } from '../data/giveawayData';
import { USER_STATE, CLAIM_STATUS } from '../config/giveawayStatus';

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

  const [userState, setUserState] = useState(USER_STATE.WINNER);
  const [claimStatus, setClaimStatus] = useState(CLAIM_STATUS.NOT_SUBMITTED);
  const [claimPrizeType, setClaimPrizeType] = useState('PHYSICAL');
  const [isRevealing, setIsRevealing] = useState(false);
  const [claimRecord, setClaimRecord] = useState(null);

  const login = async (_email, _password) => {
    localStorage.setItem('veloop_auth_token', 'mock-jwt-token-veloop');
    setUser(MOCK_USER);
    setUserState(USER_STATE.LOGGED_IN);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('veloop_auth_token');
    setUser(null);
    setUserState(USER_STATE.VISITOR);
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

  const submitClaim = (formData) => {
    setClaimStatus(CLAIM_STATUS.SUBMITTED);
    setClaimRecord({
      claimId: `CLM-${Math.floor(10000 + Math.random() * 90000)}`,
      submittedAt: new Date().toISOString(),
      ...formData
    });
  };

  const resetClaim = () => {
    setClaimStatus(CLAIM_STATUS.NOT_SUBMITTED);
    setClaimRecord(null);
  };

  const value = {
    user,
    isAuthenticated: !!user && userState !== USER_STATE.VISITOR,
    loading,
    userState,
    setUserState,
    claimStatus,
    setClaimStatus,
    claimPrizeType,
    setClaimPrizeType,
    isRevealing,
    setIsRevealing,
    claimRecord,
    submitClaim,
    resetClaim,
    login,
    logout,
    refreshUser,
    setCustomWallet
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;

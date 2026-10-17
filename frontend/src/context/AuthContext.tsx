import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';
import { User, Wallet, ProfileResponse } from '../types';

interface AuthContextType {
  user: User | null;
  wallet: Wallet | null;
  profile: ProfileResponse | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, referralCode?: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshProfile = async () => {
    try {
      const token = localStorage.getItem('royalbull_access_token');
      if (!token) {
        setUser(null);
        setWallet(null);
        setProfile(null);
        setIsLoading(false);
        return;
      }
      const data = await api.get<ProfileResponse>('/customer/profile');
      setUser(data.user);
      setWallet(data.wallet);
      setProfile(data);
    } catch (err) {
      console.warn('Failed to load profile:', err);
      // If profile fails, check if user is admin who may not have full customer profile
      try {
        const adminMe = await api.get<User>('/auth/me');
        setUser(adminMe);
      } catch {
        localStorage.removeItem('royalbull_access_token');
        localStorage.removeItem('royalbull_refresh_token');
        setUser(null);
        setWallet(null);
        setProfile(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.post<{ access_token: string; refresh_token: string; user: User }>('/auth/login', {
        email,
        password,
      });
      localStorage.setItem('royalbull_access_token', res.access_token);
      localStorage.setItem('royalbull_refresh_token', res.refresh_token);
      setUser(res.user);
      await refreshProfile();
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, referralCode?: string) => {
    setIsLoading(true);
    try {
      const res = await api.post<{ access_token: string; refresh_token: string; user: User }>('/auth/register', {
        name,
        email,
        password,
        referral_code: referralCode ? referralCode.trim() : undefined,
      });
      localStorage.setItem('royalbull_access_token', res.access_token);
      localStorage.setItem('royalbull_refresh_token', res.refresh_token);
      setUser(res.user);
      await refreshProfile();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('royalbull_access_token');
    localStorage.removeItem('royalbull_refresh_token');
    setUser(null);
    setWallet(null);
    setProfile(null);
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <AuthContext.Provider
      value={{
        user,
        wallet,
        profile,
        isLoading,
        isAdmin,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

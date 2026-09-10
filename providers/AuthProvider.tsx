'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiGet, apiSend, ApiError } from '@/lib/api-client';

// The only authenticated user is an administrator. The context field is named
// `member` for backward compatibility with the admin layout/pages.
interface Admin {
  id: number;
  name: string;
  email: string;
  role: 'administrator';
}

interface AuthContextType {
  member: Admin | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [member, setMember] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const admin = await apiGet<Admin>('/api/auth/me');
      setMember(admin);
    } catch {
      setMember(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await apiSend<Admin>('/api/auth/login', 'POST', {
        email,
        password,
      });
      setMember(data);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Invalid email or password';
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await apiSend('/api/auth/logout', 'POST');
    } finally {
      setMember(null);
    }
  };

  const value: AuthContextType = {
    member,
    isAuthenticated: !!member,
    // Any authenticated user is an administrator under the admin-only model.
    isAdmin: !!member,
    isLoading,
    login,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

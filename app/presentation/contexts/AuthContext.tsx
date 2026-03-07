import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../../core/types';
import { SupabaseAuthRepository } from '../../data/repositories/SupabaseAuthRepository';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const authRepo = new SupabaseAuthRepository();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authRepo.getCurrentUser().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const signIn = async (email: string, password: string) => {
    const { user: u } = await authRepo.signIn({ email, password });
    setUser(u);
  };

  const signUp = async (name: string, email: string, password: string) => {
    const { user: u } = await authRepo.signUp({ name, email, password });
    setUser(u);
  };

  const signOut = async () => {
    await authRepo.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

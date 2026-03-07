import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Couple, User } from '../../core/types';
import { SupabaseCoupleRepository } from '../../data/repositories/SupabaseCoupleRepository';
import { useAuth } from './AuthContext';

interface CoupleContextValue {
  couple: Couple | null;
  partner: User | null;
  loading: boolean;
  generateInviteCode: () => Promise<string>;
  joinWithCode: (code: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const CoupleContext = createContext<CoupleContextValue | null>(null);
const coupleRepo = new SupabaseCoupleRepository();

export function CoupleProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [couple, setCouple] = useState<Couple | null>(null);
  const [partner, setPartner] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCouple = async () => {
    if (!user) {
      setCouple(null);
      setPartner(null);
      setLoading(false);
      return;
    }
    try {
      const c = await coupleRepo.getByUserId(user.id);
      setCouple(c);
      setPartner(null); // TODO: carregar partner do profiles
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCouple();
  }, [user?.id]);

  const generateInviteCode = async () => {
    if (!user) throw new Error('Não autenticado');
    return coupleRepo.createInviteCode(user.id);
  };

  const joinWithCode = async (code: string) => {
    if (!user) throw new Error('Não autenticado');
    await coupleRepo.joinByInviteCode(user.id, code);
    await loadCouple();
  };

  return (
    <CoupleContext.Provider
      value={{
        couple,
        partner,
        loading,
        generateInviteCode,
        joinWithCode,
        refresh: loadCouple,
      }}
    >
      {children}
    </CoupleContext.Provider>
  );
}

export function useCouple() {
  const ctx = useContext(CoupleContext);
  if (!ctx) throw new Error('useCouple must be used within CoupleProvider');
  return ctx;
}

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Couple, User } from '../../core/types';
import { SupabaseCoupleRepository } from '../../data/repositories/SupabaseCoupleRepository';
import { supabase } from '../../data/supabase/client';
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

async function loadPartnerProfile(partnerId: string): Promise<User | null> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', partnerId)
    .single();

  if (error || !profile) return null;

  return {
    id: profile.id,
    name: profile.name ?? 'Parceiro(a)',
    email: '',
    avatar_url: profile.avatar_url ?? undefined,
    created_at: profile.created_at ?? new Date().toISOString(),
    updated_at: profile.updated_at ?? new Date().toISOString(),
  };
}

export function CoupleProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [couple, setCouple] = useState<Couple | null>(null);
  const [partner, setPartner] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCouple = useCallback(async () => {
    if (!user) {
      setCouple(null);
      setPartner(null);
      setLoading(false);
      return;
    }
    try {
      const c = await coupleRepo.getByUserId(user.id);
      setCouple(c);
      setLoading(false);

      if (c && c.user1_id !== c.user2_id) {
        const partnerId = coupleRepo.getPartner(c, user.id);
        loadPartnerProfile(partnerId).then((p) => setPartner(p));
      } else {
        setPartner(null);
      }
    } catch {
      setCouple(null);
      setPartner(null);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCouple();
  }, [loadCouple]);

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

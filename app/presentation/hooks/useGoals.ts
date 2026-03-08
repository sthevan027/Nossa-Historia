import { useEffect, useState, useCallback } from 'react';
import type { Goal } from '../../core/types';
import type { CreateGoalData } from '../../core/interfaces/IGoalRepository';
import { SupabaseGoalRepository } from '../../data/repositories/SupabaseGoalRepository';
import { useCouple } from '../contexts/CoupleContext';
import { useAuth } from '../contexts/AuthContext';

const repo = new SupabaseGoalRepository();

export function useGoals() {
  const { couple } = useCouple();
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!couple) return;
    setLoading(true);
    try {
      const data = await repo.getByCoupleId(couple.id);
      setGoals(data);
    } finally {
      setLoading(false);
    }
  }, [couple?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const add = async (data: Omit<CreateGoalData, 'couple_id' | 'created_by'>) => {
    if (!couple || !user) throw new Error('Não autenticado ou sem parceiro');
    const goal = await repo.create({ ...data, couple_id: couple.id, created_by: user.id });
    setGoals((prev) => [goal, ...prev]);
    return goal;
  };

  const toggle = async (id: string, completed: boolean) => {
    const updated = await repo.toggleComplete(id, completed);
    setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
    return updated;
  };

  const remove = async (id: string) => {
    await repo.delete(id);
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const completedCount = goals.filter((g) => g.completed).length;

  return { goals, loading, refresh: load, add, toggle, remove, completedCount };
}

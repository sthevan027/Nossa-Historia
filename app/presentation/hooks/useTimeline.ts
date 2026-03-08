import { useEffect, useState, useCallback } from 'react';
import type { TimelineEvent } from '../../core/types';
import type { CreateTimelineEventData } from '../../core/interfaces/ITimelineRepository';
import { SupabaseTimelineRepository } from '../../data/repositories/SupabaseTimelineRepository';
import { useCouple } from '../contexts/CoupleContext';
import { useAuth } from '../contexts/AuthContext';

const repo = new SupabaseTimelineRepository();

export function useTimeline() {
  const { couple } = useCouple();
  const { user } = useAuth();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!couple) return;
    setLoading(true);
    try {
      const data = await repo.getByCoupleId(couple.id);
      setEvents(data);
    } finally {
      setLoading(false);
    }
  }, [couple?.id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!couple) return;
    const unsubscribe = repo.subscribe(couple.id, () => {
      load();
    });
    return unsubscribe;
  }, [couple?.id, load]);

  const add = async (data: Omit<CreateTimelineEventData, 'couple_id' | 'created_by'>) => {
    if (!couple || !user) throw new Error('Não autenticado ou sem parceiro');
    const event = await repo.create({ ...data, couple_id: couple.id, created_by: user.id });
    setEvents((prev) => [event, ...prev]);
    return event;
  };

  const remove = async (id: string) => {
    await repo.delete(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return { events, loading, refresh: load, add, remove };
}

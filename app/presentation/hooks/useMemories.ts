import { useEffect, useState, useCallback } from 'react';
import type { Memory } from '../../core/types';
import type { CreateMemoryData } from '../../core/interfaces/IMemoryRepository';
import { SupabaseMemoryRepository } from '../../data/repositories/SupabaseMemoryRepository';
import { SupabaseStorageService } from '../../data/services/SupabaseStorageService';
import { useCouple } from '../contexts/CoupleContext';
import { useAuth } from '../contexts/AuthContext';

const repo = new SupabaseMemoryRepository();
const storage = new SupabaseStorageService();

export function useMemories() {
  const { couple } = useCouple();
  const { user } = useAuth();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!couple) return;
    setLoading(true);
    try {
      const data = await repo.getByCoupleId(couple.id);
      setMemories(data);
    } finally {
      setLoading(false);
    }
  }, [couple?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const add = async (
    data: Omit<CreateMemoryData, 'couple_id' | 'created_by' | 'photo_url'>,
    photoUri: string,
  ) => {
    if (!couple || !user) throw new Error('Não autenticado ou sem parceiro');
    const path = `memories/${couple.id}/${Date.now()}.jpg`;
    const photoUrl = await storage.uploadPhoto('photos', path, photoUri);
    const memory = await repo.create({
      ...data,
      photo_url: photoUrl,
      couple_id: couple.id,
      created_by: user.id,
    });
    setMemories((prev) => [memory, ...prev]);
    return memory;
  };

  const remove = async (id: string) => {
    await repo.delete(id);
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  return { memories, loading, refresh: load, add, remove };
}

import { supabase } from '../supabase/client';
import type { Memory } from '../../core/types';
import type {
  IMemoryRepository,
  CreateMemoryData,
  UpdateMemoryData,
} from '../../core/interfaces/IMemoryRepository';

export class SupabaseMemoryRepository implements IMemoryRepository {
  async getByCoupleId(coupleId: string): Promise<Memory[]> {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('couple_id', coupleId)
      .order('memory_date', { ascending: false });

    if (error) throw error;
    return (data ?? []) as Memory[];
  }

  async create(data: CreateMemoryData): Promise<Memory> {
    const { data: memory, error } = await supabase
      .from('memories')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return memory as Memory;
  }

  async update(id: string, data: UpdateMemoryData): Promise<Memory> {
    const { data: memory, error } = await supabase
      .from('memories')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return memory as Memory;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('memories').delete().eq('id', id);
    if (error) throw error;
  }
}

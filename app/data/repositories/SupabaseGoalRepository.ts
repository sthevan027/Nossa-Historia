import { supabase } from '../supabase/client';
import type { Goal } from '../../core/types';
import type { IGoalRepository, CreateGoalData } from '../../core/interfaces/IGoalRepository';

export class SupabaseGoalRepository implements IGoalRepository {
  async getByCoupleId(coupleId: string): Promise<Goal[]> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []) as Goal[];
  }

  async create(data: CreateGoalData): Promise<Goal> {
    const { data: goal, error } = await supabase
      .from('goals')
      .insert({ ...data, completed: false })
      .select()
      .single();

    if (error) throw error;
    return goal as Goal;
  }

  async toggleComplete(id: string, completed: boolean): Promise<Goal> {
    const { data: goal, error } = await supabase
      .from('goals')
      .update({
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return goal as Goal;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (error) throw error;
  }
}

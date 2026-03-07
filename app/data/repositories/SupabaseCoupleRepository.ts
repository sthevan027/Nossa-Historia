import { supabase } from '../supabase/client';
import type { Couple } from '../../core/types';
import type { ICoupleRepository } from '../../core/interfaces/ICoupleRepository';

function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export class SupabaseCoupleRepository implements ICoupleRepository {
  async getByUserId(userId: string): Promise<Couple | null> {
    const { data, error } = await supabase
      .from('couples')
      .select('*')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .maybeSingle();

    if (error) throw error;
    return data as Couple | null;
  }

  async createInviteCode(userId: string): Promise<string> {
    const code = generateInviteCode();
    const { data: existing } = await supabase
      .from('couples')
      .select('id')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('couples')
        .update({ invite_code: code })
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('couples').insert({
        user1_id: userId,
        user2_id: userId,
        invite_code: code,
      });
      if (error) throw error;
    }
    return code;
  }

  async joinByInviteCode(userId: string, code: string): Promise<Couple> {
    const { data: couple, error } = await supabase
      .from('couples')
      .select('*')
      .eq('invite_code', code.toUpperCase())
      .maybeSingle();

    if (error) throw error;
    if (!couple) throw new Error('Código inválido ou expirado');

    const { data: updated, error: updateError } = await supabase
      .from('couples')
      .update({
        user2_id: userId,
        invite_code: null,
      })
      .eq('id', couple.id)
      .select()
      .single();

    if (updateError) throw updateError;
    return updated as Couple;
  }

  getPartner(couple: Couple, currentUserId: string): string {
    return couple.user1_id === currentUserId ? couple.user2_id : couple.user1_id;
  }
}

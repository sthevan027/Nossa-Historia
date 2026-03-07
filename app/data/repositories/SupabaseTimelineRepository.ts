import { supabase } from '../supabase/client';
import type { TimelineEvent } from '../../core/types';
import type {
  ITimelineRepository,
  CreateTimelineEventData,
  UpdateTimelineEventData,
} from '../../core/interfaces/ITimelineRepository';

export class SupabaseTimelineRepository implements ITimelineRepository {
  async getByCoupleId(coupleId: string): Promise<TimelineEvent[]> {
    const { data, error } = await supabase
      .from('timeline_events')
      .select('*')
      .eq('couple_id', coupleId)
      .order('event_date', { ascending: false });

    if (error) throw error;
    return (data ?? []) as TimelineEvent[];
  }

  async create(data: CreateTimelineEventData): Promise<TimelineEvent> {
    const { data: event, error } = await supabase
      .from('timeline_events')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return event as TimelineEvent;
  }

  async update(id: string, data: UpdateTimelineEventData): Promise<TimelineEvent> {
    const { data: event, error } = await supabase
      .from('timeline_events')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return event as TimelineEvent;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('timeline_events').delete().eq('id', id);
    if (error) throw error;
  }

  subscribe(coupleId: string, callback: (event: TimelineEvent) => void): () => void {
    const channel = supabase
      .channel(`timeline:${coupleId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'timeline_events', filter: `couple_id=eq.${coupleId}` },
        (payload) => {
          callback(payload.new as TimelineEvent);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}

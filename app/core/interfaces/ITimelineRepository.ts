import type { TimelineEvent } from '../types';

export interface CreateTimelineEventData {
  couple_id: string;
  title: string;
  description?: string;
  event_date: string;
  photo_url?: string;
  location?: string;
  emoji?: string;
  created_by: string;
}

export interface UpdateTimelineEventData extends Partial<CreateTimelineEventData> {}

export interface ITimelineRepository {
  getByCoupleId(coupleId: string): Promise<TimelineEvent[]>;
  create(data: CreateTimelineEventData): Promise<TimelineEvent>;
  update(id: string, data: UpdateTimelineEventData): Promise<TimelineEvent>;
  delete(id: string): Promise<void>;
  subscribe(coupleId: string, callback: (event: TimelineEvent) => void): () => void;
}

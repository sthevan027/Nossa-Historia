// Tipos compartilhados do domínio

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Couple {
  id: string;
  user1_id: string;
  user2_id: string;
  relationship_start_date?: string;
  invite_code: string;
  created_at: string;
}

export interface TimelineEvent {
  id: string;
  couple_id: string;
  title: string;
  description?: string;
  event_date: string;
  photo_url?: string;
  location?: string;
  emoji?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Memory {
  id: string;
  couple_id: string;
  title: string;
  description?: string;
  photo_url: string;
  memory_date: string;
  location?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  couple_id: string;
  title: string;
  emoji?: string;
  completed: boolean;
  completed_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type ImportantDateType = 'anniversary' | 'birthday' | 'custom';

export interface ImportantDate {
  id: string;
  couple_id: string;
  title: string;
  date: string;
  type: ImportantDateType;
  remind_before_days?: number;
  created_at: string;
  updated_at: string;
}

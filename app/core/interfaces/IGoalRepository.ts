import type { Goal } from '../types';

export interface CreateGoalData {
  couple_id: string;
  title: string;
  emoji?: string;
  created_by: string;
}

export interface IGoalRepository {
  getByCoupleId(coupleId: string): Promise<Goal[]>;
  create(data: CreateGoalData): Promise<Goal>;
  toggleComplete(id: string, completed: boolean): Promise<Goal>;
  delete(id: string): Promise<void>;
}

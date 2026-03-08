import type { IAuthRepository } from '../../core/interfaces/IAuthRepository';
import type { ICoupleRepository } from '../../core/interfaces/ICoupleRepository';
import type { ITimelineRepository } from '../../core/interfaces/ITimelineRepository';
import type { IMemoryRepository } from '../../core/interfaces/IMemoryRepository';
import type { IGoalRepository } from '../../core/interfaces/IGoalRepository';
import type { IStorageService } from '../../core/interfaces/IStorageService';
import { SupabaseAuthRepository } from './SupabaseAuthRepository';
import { SupabaseCoupleRepository } from './SupabaseCoupleRepository';
import { SupabaseTimelineRepository } from './SupabaseTimelineRepository';
import { SupabaseMemoryRepository } from './SupabaseMemoryRepository';
import { SupabaseGoalRepository } from './SupabaseGoalRepository';
import { SupabaseStorageService } from '../services/SupabaseStorageService';

interface Repositories {
  auth: IAuthRepository;
  couple: ICoupleRepository;
  timeline: ITimelineRepository;
  memory: IMemoryRepository;
  goal: IGoalRepository;
  storage: IStorageService;
}

const defaults: Repositories = {
  auth: new SupabaseAuthRepository(),
  couple: new SupabaseCoupleRepository(),
  timeline: new SupabaseTimelineRepository(),
  memory: new SupabaseMemoryRepository(),
  goal: new SupabaseGoalRepository(),
  storage: new SupabaseStorageService(),
};

let current: Repositories = { ...defaults };

export const repositories = {
  get auth() { return current.auth; },
  get couple() { return current.couple; },
  get timeline() { return current.timeline; },
  get memory() { return current.memory; },
  get goal() { return current.goal; },
  get storage() { return current.storage; },

  /** Override repositories for testing */
  override(overrides: Partial<Repositories>) {
    current = { ...current, ...overrides };
  },

  /** Reset to default Supabase implementations */
  reset() {
    current = { ...defaults };
  },
};

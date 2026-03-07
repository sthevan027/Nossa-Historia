import type { Couple } from '../types';

export interface ICoupleRepository {
  getByUserId(userId: string): Promise<Couple | null>;
  createInviteCode(userId: string): Promise<string>;
  joinByInviteCode(userId: string, code: string): Promise<Couple>;
  getPartner(couple: Couple, currentUserId: string): string;
}

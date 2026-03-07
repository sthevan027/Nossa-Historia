import type { Memory } from '../types';

export interface CreateMemoryData {
  couple_id: string;
  title: string;
  description?: string;
  photo_url: string;
  memory_date: string;
  location?: string;
  created_by: string;
}

export interface UpdateMemoryData extends Partial<CreateMemoryData> {}

export interface IMemoryRepository {
  getByCoupleId(coupleId: string): Promise<Memory[]>;
  create(data: CreateMemoryData): Promise<Memory>;
  update(id: string, data: UpdateMemoryData): Promise<Memory>;
  delete(id: string): Promise<void>;
}

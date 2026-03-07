import { supabase } from '../supabase/client';
import type { IStorageService } from '../../core/interfaces/IStorageService';

export class SupabaseStorageService implements IStorageService {
  async uploadPhoto(bucket: string, path: string, uri: string): Promise<string> {
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileName = path || `photos/${Date.now()}.jpg`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, blob, { upsert: true });

    if (error) throw error;

    const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return publicUrl.publicUrl;
  }

  async deletePhoto(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
  }
}

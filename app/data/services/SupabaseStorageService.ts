import { decode } from 'base64-arraybuffer';
import { supabase } from '../supabase/client';
import type { IStorageService } from '../../core/interfaces/IStorageService';

export class SupabaseStorageService implements IStorageService {
  async uploadPhoto(
    bucket: string,
    path: string,
    uriOrBase64: string,
    options?: { isBase64?: boolean }
  ): Promise<string> {
    const fileName = path || `photos/${Date.now()}.jpg`;
    let body: ArrayBuffer | Blob;

    if (options?.isBase64) {
      body = decode(uriOrBase64);
    } else {
      const response = await fetch(uriOrBase64);
      body = await response.blob();
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, body, {
        upsert: true,
        contentType: 'image/jpeg',
      });

    if (error) throw error;

    const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return publicUrl.publicUrl;
  }

  async deletePhoto(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
  }
}

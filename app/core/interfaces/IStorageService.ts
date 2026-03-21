export interface IStorageService {
  uploadPhoto(bucket: string, path: string, uriOrBase64: string, options?: { isBase64?: boolean }): Promise<string>;
  deletePhoto(bucket: string, path: string): Promise<void>;
}

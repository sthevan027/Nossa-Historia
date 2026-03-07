export interface IStorageService {
  uploadPhoto(bucket: string, path: string, uri: string): Promise<string>;
  deletePhoto(bucket: string, path: string): Promise<void>;
}

import type { User } from '../types';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  name: string;
}

export interface IAuthRepository {
  signIn(credentials: AuthCredentials): Promise<{ user: User; session: unknown }>;
  signUp(data: RegisterData): Promise<{ user: User; session: unknown }>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  getSession(): Promise<unknown>;
  resetPassword(email: string): Promise<void>;
  updateAvatarUrl(userId: string, avatarUrl: string | null): Promise<void>;
}

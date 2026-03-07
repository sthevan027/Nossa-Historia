import { supabase } from '../supabase/client';
import type { User } from '../../core/types';
import type {
  IAuthRepository,
  AuthCredentials,
  RegisterData,
} from '../../core/interfaces/IAuthRepository';

export class SupabaseAuthRepository implements IAuthRepository {
  async signIn(credentials: AuthCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) throw error;
    const user = data.user ? await this.mapToUser(data.user) : null;
    if (!user) throw new Error('Usuário não encontrado');
    return { user, session: data.session };
  }

  async signUp(data: RegisterData) {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { name: data.name } },
    });
    if (error) throw error;
    const user = authData.user ? await this.mapToUser(authData.user) : null;
    if (!user) throw new Error('Usuário não encontrado');
    return { user, session: authData.session };
  }

  async signOut() {
    await supabase.auth.signOut();
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user ? this.mapToUser(user) : null;
  }

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }

  private async mapToUser(authUser: { id: string; email?: string; user_metadata?: { name?: string } }): Promise<User> {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    return {
      id: authUser.id,
      name: profile?.name ?? authUser.user_metadata?.name ?? 'Usuário',
      email: authUser.email ?? '',
      avatar_url: profile?.avatar_url,
      created_at: profile?.created_at ?? new Date().toISOString(),
      updated_at: profile?.updated_at ?? new Date().toISOString(),
    };
  }
}

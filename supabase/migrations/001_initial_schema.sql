-- Nossa História - Schema inicial
-- Execute no SQL Editor do Supabase

-- Tabela profiles (extensão do auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trigger para criar profile no signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'name', 'Usuário'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Tabela couples
CREATE TABLE IF NOT EXISTS public.couples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  relationship_start_date date,
  invite_code text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_couples_user1 ON public.couples(user1_id);
CREATE INDEX IF NOT EXISTS idx_couples_user2 ON public.couples(user2_id);
CREATE INDEX IF NOT EXISTS idx_couples_invite ON public.couples(invite_code);

ALTER TABLE public.couples ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own couples" ON public.couples
  FOR ALL USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Tabela timeline_events
CREATE TABLE IF NOT EXISTS public.timeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  event_date date NOT NULL,
  photo_url text,
  location text,
  emoji text,
  created_by uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_timeline_couple ON public.timeline_events(couple_id);
CREATE INDEX IF NOT EXISTS idx_timeline_date ON public.timeline_events(event_date);

ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Couple members can manage timeline" ON public.timeline_events
  FOR ALL USING (
    couple_id IN (SELECT id FROM public.couples WHERE user1_id = auth.uid() OR user2_id = auth.uid())
  );

-- Tabela memories
CREATE TABLE IF NOT EXISTS public.memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  photo_url text NOT NULL,
  memory_date date NOT NULL,
  location text,
  created_by uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_memories_couple ON public.memories(couple_id);

ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Couple members can manage memories" ON public.memories
  FOR ALL USING (
    couple_id IN (SELECT id FROM public.couples WHERE user1_id = auth.uid() OR user2_id = auth.uid())
  );

-- Tabela goals
CREATE TABLE IF NOT EXISTS public.goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  title text NOT NULL,
  emoji text,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_by uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_goals_couple ON public.goals(couple_id);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Couple members can manage goals" ON public.goals
  FOR ALL USING (
    couple_id IN (SELECT id FROM public.couples WHERE user1_id = auth.uid() OR user2_id = auth.uid())
  );

-- Bucket para fotos (execute no Supabase Dashboard > Storage ou via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true);
-- Políticas de storage para o bucket photos

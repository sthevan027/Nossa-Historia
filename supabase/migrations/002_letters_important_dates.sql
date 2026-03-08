-- Tabela important_dates
CREATE TABLE IF NOT EXISTS public.important_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  title text NOT NULL,
  date date NOT NULL,
  type text NOT NULL DEFAULT 'custom' CHECK (type IN ('anniversary', 'birthday', 'custom')),
  remind_before_days integer DEFAULT 7,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_important_dates_couple ON public.important_dates(couple_id);
CREATE INDEX IF NOT EXISTS idx_important_dates_date ON public.important_dates(date);

ALTER TABLE public.important_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Couple members can manage important dates" ON public.important_dates
  FOR ALL USING (
    couple_id IN (SELECT id FROM public.couples WHERE user1_id = auth.uid() OR user2_id = auth.uid())
  );

-- Tabela letters
CREATE TABLE IF NOT EXISTS public.letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  created_by uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_letters_couple ON public.letters(couple_id);

ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Couple members can manage letters" ON public.letters
  FOR ALL USING (
    couple_id IN (SELECT id FROM public.couples WHERE user1_id = auth.uid() OR user2_id = auth.uid())
  );

-- Política para profiles: permitir leitura de profiles de parceiros
CREATE POLICY "Users can read partner profile" ON public.profiles
  FOR SELECT USING (
    id IN (
      SELECT CASE
        WHEN user1_id = auth.uid() THEN user2_id
        WHEN user2_id = auth.uid() THEN user1_id
      END
      FROM public.couples
      WHERE user1_id = auth.uid() OR user2_id = auth.uid()
    )
  );

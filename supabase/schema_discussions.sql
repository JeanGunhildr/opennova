-- Script SQL untuk membuat tabel challenge_discussions di Supabase

-- 1. Buat tabel challenge_discussions
CREATE TABLE IF NOT EXISTS public.challenge_discussions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Aktifkan RLS (Row Level Security)
ALTER TABLE public.challenge_discussions ENABLE ROW LEVEL SECURITY;

-- 3. Kebijakan RLS (Policies)

-- Allow public read access
CREATE POLICY "Allow public read access on challenge_discussions"
  ON public.challenge_discussions
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert comment
CREATE POLICY "Allow authenticated users to insert challenge_discussions"
  ON public.challenge_discussions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own comment
CREATE POLICY "Allow users to delete own challenge_discussions"
  ON public.challenge_discussions
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- Migration: Competition Automation System
-- Adds: is_finalist, finalist_selected_at, winner_rank to challenge_entries
--       notifications table
--       prize_awards table
--       certificates table
-- ============================================================

-- 1. Add new columns to challenge_entries
ALTER TABLE public.challenge_entries
  ADD COLUMN IF NOT EXISTS is_finalist BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS finalist_selected_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS winner_rank INTEGER;

-- 2. Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'system',
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for faster lookups by user
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_user_read_idx ON public.notifications(user_id, is_read);

-- 3. Create prize_awards table
CREATE TABLE IF NOT EXISTS public.prize_awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  entry_id UUID NOT NULL REFERENCES public.challenge_entries(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  amount NUMERIC,
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT prize_awards_challenge_entry_unique UNIQUE (challenge_id, entry_id),
  CONSTRAINT prize_awards_challenge_rank_unique UNIQUE (challenge_id, rank)
);

-- 4. Create certificates table
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  entry_id UUID NOT NULL REFERENCES public.challenge_entries(id) ON DELETE CASCADE,
  rank INTEGER,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT certificates_challenge_entry_unique UNIQUE (challenge_id, entry_id)
);

-- 5. Enable RLS on new tables
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prize_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- 6. RLS policies for notifications
-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Inserts are done server-side via service role (no client insert policy)
-- This is intentional — the server uses the service role key for inserts

-- 7. RLS policies for prize_awards (read-only for authenticated users)
CREATE POLICY "Authenticated users can view prize_awards"
  ON public.prize_awards
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- 8. RLS policies for certificates (read-only for authenticated users)
CREATE POLICY "Authenticated users can view certificates"
  ON public.certificates
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- 9. Ensure UNIQUE constraint on criterion_scores if not already present
-- (already referenced in code via onConflict but adding explicit constraint for safety)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'criterion_scores_entry_criterion_unique'
  ) THEN
    ALTER TABLE public.criterion_scores
      ADD CONSTRAINT criterion_scores_entry_criterion_unique
      UNIQUE (entry_id, criterion_id);
  END IF;
END $$;

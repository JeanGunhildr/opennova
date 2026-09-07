-- ============================================================
-- Migration: Add RLS policy for Seekers on challenge_entries
-- Allows Seekers to update challenge_entries (e.g., set finalist, winner, eliminated)
-- for challenges that they own (challenges.seeker_id = auth.uid())
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'challenge_entries'
      AND policyname = 'Seekers can update entries for own challenges'
  ) THEN
    CREATE POLICY "Seekers can update entries for own challenges"
      ON public.challenge_entries
      FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM public.challenges
          WHERE challenges.id = challenge_entries.challenge_id
            AND challenges.seeker_id = auth.uid()
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.challenges
          WHERE challenges.id = challenge_entries.challenge_id
            AND challenges.seeker_id = auth.uid()
        )
      );
  END IF;
END $$;

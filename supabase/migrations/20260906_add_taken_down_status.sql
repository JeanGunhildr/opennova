-- ============================================================
-- OpenNova Migration: Add 'taken_down' to challenge_status ENUM & RLS
-- ============================================================

-- 1. Add 'taken_down' value to challenge_status ENUM if not already present
ALTER TYPE public.challenge_status ADD VALUE IF NOT EXISTS 'taken_down';

-- 2. Ensure Admin role has UPDATE permission on public.challenges table via RLS
DROP POLICY IF EXISTS "Admin update challenges policy" ON public.challenges;

CREATE POLICY "Admin update challenges policy"
ON public.challenges
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

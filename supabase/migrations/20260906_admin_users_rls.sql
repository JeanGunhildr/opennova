-- ============================================================
-- OpenNova Migration: RLS Policies for Admin User Management
-- ============================================================

-- 1. Profiles table: Admin SELECT & UPDATE policies
DROP POLICY IF EXISTS "Admin select profiles policy" ON public.profiles;
CREATE POLICY "Admin select profiles policy"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admin update profiles policy" ON public.profiles;
CREATE POLICY "Admin update profiles policy"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 2. Seeker Profiles table: Admin SELECT & UPDATE policies
DROP POLICY IF EXISTS "Admin select seeker_profiles policy" ON public.seeker_profiles;
CREATE POLICY "Admin select seeker_profiles policy"
ON public.seeker_profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admin update seeker_profiles policy" ON public.seeker_profiles;
CREATE POLICY "Admin update seeker_profiles policy"
ON public.seeker_profiles
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 3. Solver Profiles table: Admin SELECT & UPDATE policies
DROP POLICY IF EXISTS "Admin select solver_profiles policy" ON public.solver_profiles;
CREATE POLICY "Admin select solver_profiles policy"
ON public.solver_profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admin update solver_profiles policy" ON public.solver_profiles;
CREATE POLICY "Admin update solver_profiles policy"
ON public.solver_profiles
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

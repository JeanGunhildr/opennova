-- ============================================================
-- Migration: Solver Balance & Transactions System
-- Adds: balance column to solver_profiles
--       balance_transactions table for wallet history
-- ============================================================

-- 1. Add balance column to solver_profiles
ALTER TABLE public.solver_profiles
  ADD COLUMN IF NOT EXISTS balance NUMERIC NOT NULL DEFAULT 0;

-- 2. Create balance_transactions table
CREATE TABLE IF NOT EXISTS public.balance_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL DEFAULT 'prize', -- 'prize' | 'withdrawal' | 'adjustment'
  description TEXT,
  reference_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for transaction history by user
CREATE INDEX IF NOT EXISTS balance_transactions_user_id_idx ON public.balance_transactions(user_id);
CREATE INDEX IF NOT EXISTS balance_transactions_created_at_idx ON public.balance_transactions(created_at DESC);

-- 3. Enable RLS on balance_transactions
ALTER TABLE public.balance_transactions ENABLE ROW LEVEL SECURITY;

-- 4. RLS policies for balance_transactions
CREATE POLICY "Users can view own transactions"
  ON public.balance_transactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

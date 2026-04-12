-- Migration for Quota Management System

-- 1. Add limits to plans
ALTER TABLE public.plans
  ADD COLUMN IF NOT EXISTS generations_limit INTEGER NOT NULL DEFAULT 50;

-- 2. Update existing plans with higher limits
UPDATE public.plans SET generations_limit = 50 WHERE slug = 'basic';
UPDATE public.plans SET generations_limit = 200 WHERE slug = 'intermediary';
UPDATE public.plans SET generations_limit = 999999 WHERE slug = 'professional';

-- 3. Create a view for easy usage tracking
CREATE OR REPLACE VIEW public.user_usage_stats AS
SELECT 
  u.id as user_id,
  u.email,
  p.slug as plan_slug,
  p.generations_limit,
  (
    SELECT count(*) 
    FROM public.app_executions ae 
    WHERE ae.user_id = u.id 
    AND ae.status = 'completed'
    AND ae.created_at >= date_trunc('month', now())
  ) as generations_this_month
FROM public.users u
LEFT JOIN public.plans p ON u.plan_id = p.id;

-- 4. Enable RLS on the view (though views in Supabase usually inherit or need special handling if not security definer)
-- Actually, we'll just query the tables directly in our RPC or API.

-- 5. Function to check if user has remaining quota
CREATE OR REPLACE FUNCTION public.check_user_quota(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_limit INTEGER;
  v_count INTEGER;
BEGIN
  -- Get limit
  SELECT p.generations_limit INTO v_limit
  FROM public.users u
  JOIN public.plans p ON u.plan_id = p.id
  WHERE u.id = p_user_id;

  -- If no plan or limit, assume basic limit or 0
  IF v_limit IS NULL THEN
    v_limit := 5; -- Trial limit
  END IF;

  -- Get current month count
  SELECT count(*) INTO v_count
  FROM public.app_executions
  WHERE user_id = p_user_id
  AND status = 'completed'
  AND created_at >= date_trunc('month', now());

  RETURN v_count < v_limit;
END;
$$;

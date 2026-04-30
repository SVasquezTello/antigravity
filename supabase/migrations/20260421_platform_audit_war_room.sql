-- MIGRACIÓN: Auditoría y Plataforma - War Room (Sección 28)

-- 1. Logs de Auditoría (28.1)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- 'update_balance', 'delete_app', 'impersonate_start'
  resource_type TEXT NOT NULL, -- 'partners', 'clients', 'offers'
  resource_id UUID,
  
  old_values JSONB,
  new_values JSONB,
  
  ip_address TEXT,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Métricas Diarias (28.2)
CREATE TABLE IF NOT EXISTS public.daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date DATE UNIQUE DEFAULT CURRENT_DATE,
  
  mrr DECIMAL(15,2),
  total_users INTEGER,
  total_subscriptions INTEGER,
  total_credits_sold BIGINT,
  total_app_executions BIGINT,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Logs de Sistema (28.3)
CREATE TABLE IF NOT EXISTS public.system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  severity TEXT DEFAULT 'info', -- 'info', 'warning', 'error', 'critical'
  context TEXT, -- 'stripe_webhook', 'n8n_gateway', 'cron_cleanup'
  message TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Feature Flags (28.4)
CREATE TABLE IF NOT EXISTS public.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL, -- 'beta_marketplace', 'paypal_payments'
  description TEXT,
  is_enabled BOOLEAN DEFAULT false,
  
  rules JSONB DEFAULT '{"roles": [], "users": [], "percentage": 100}',
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Solo Admin de Plataforma entra aquí
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform Admin Access" ON public.audit_logs FOR ALL USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
);
CREATE POLICY "Platform Admin Access Sys" ON public.system_logs FOR ALL USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
);
CREATE POLICY "Platform Admin Access Flags" ON public.feature_flags FOR ALL USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
);

-- 5. Función Snapshot Automática
CREATE OR REPLACE FUNCTION public.snap_daily_metrics()
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.daily_metrics (
        snapshot_date, mrr, total_users, total_subscriptions, total_credits_sold, total_app_executions
    )
    VALUES (
        CURRENT_DATE,
        (SELECT public.get_platform_mrr()),
        (SELECT COUNT(*) FROM public.users),
        (SELECT COUNT(*) FROM public.subscriptions WHERE status = 'active'),
        (SELECT COALESCE(SUM(credits_awarded), 0) FROM public.transactions WHERE type = 'payment'),
        (SELECT COUNT(*) FROM public.app_executions)
    )
    ON CONFLICT (snapshot_date) DO UPDATE SET
        mrr = EXCLUDED.mrr,
        total_users = EXCLUDED.total_users,
        total_subscriptions = EXCLUDED.total_subscriptions,
        total_credits_sold = EXCLUDED.total_credits_sold,
        total_app_executions = EXCLUDED.total_app_executions;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

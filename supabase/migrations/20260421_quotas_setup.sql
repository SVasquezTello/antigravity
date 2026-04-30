-- MIGRACIÓN: Cuotas y Límites de Uso (Día 15)

-- 1. Añadir límites a los planes
ALTER TABLE public.plans 
  ADD COLUMN IF NOT EXISTS monthly_limit INTEGER DEFAULT 50;

-- Actualizar límites actuales (ejemplo)
UPDATE public.plans SET monthly_limit = 50 WHERE slug = 'basic';
UPDATE public.plans SET monthly_limit = 200 WHERE slug = 'intermediary';
UPDATE public.plans SET monthly_limit = 999999 WHERE slug = 'professional';

-- 2. Función para obtener consumo actual del mes
CREATE OR REPLACE FUNCTION public.get_user_monthly_usage(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER 
    FROM public.app_executions 
    WHERE user_id = p_user_id 
    AND created_at >= date_trunc('month', now())
  );
END;
$$;

-- 3. Vista de Cuotas consolidada
CREATE OR REPLACE VIEW public.user_quotas AS
SELECT 
  u.id as user_id,
  u.plan_id,
  p.monthly_limit,
  public.get_user_monthly_usage(u.id) as current_usage
FROM public.users u
JOIN public.plans p ON u.plan_id = p.id;

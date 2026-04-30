-- MIGRACIÓN: Sistema de Suplantación (Sección 12)

-- 1. Registro de Sesiones de Suplantación
CREATE TABLE IF NOT EXISTS public.impersonation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.users(id),
  target_user_id UUID NOT NULL REFERENCES public.users(id),
  reason TEXT,
  ip_address TEXT,
  user_agent TEXT,
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Solo Super Admin puede auditar estos logs
ALTER TABLE public.impersonation_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Super Admin audits impersonations" ON public.impersonation_logs 
  FOR ALL TO authenticated USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
  );

-- 2. Función para iniciar suplantación (Punto de control)
CREATE OR REPLACE FUNCTION public.start_impersonation(p_target_user_id UUID, p_reason TEXT)
RETURNS void AS $$
BEGIN
    -- Validar que el solicitante sea Admin o Partner
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'partner')) THEN
        RAISE EXCEPTION 'Unauthorized: Only admins or partners can impersonate';
    END IF;

    -- Registrar el inicio
    INSERT INTO public.impersonation_logs (admin_id, target_user_id, reason)
    VALUES (auth.uid(), p_target_user_id, p_reason);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

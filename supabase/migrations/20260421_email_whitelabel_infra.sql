-- MIGRACIÓN: Infraestructura de Email White-Label (Sección 14)

-- 1. Soporte para SMTP Propio por Partner (14.1)
ALTER TABLE public.partners 
  ADD COLUMN IF NOT EXISTS smtp_host TEXT,
  ADD COLUMN IF NOT EXISTS smtp_port INTEGER DEFAULT 587,
  ADD COLUMN IF NOT EXISTS smtp_user TEXT,
  ADD COLUMN IF NOT EXISTS smtp_pass TEXT, -- Encriptado idealmente
  ADD COLUMN IF NOT EXISTS smtp_from_email TEXT,
  ADD COLUMN IF NOT EXISTS smtp_from_name TEXT;

-- 2. Registro de Logs de Envío de Email
-- Para depuración de fallos de SMTP de partners
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES public.partners(id),
  user_id UUID REFERENCES public.users(id),
  template_type TEXT NOT NULL, -- 'welcome', 'invite', 'billing_alert'
  status TEXT DEFAULT 'sent', -- 'sent', 'failed'
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS para Logs (Admin can see all)
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view email logs" ON public.email_logs FOR SELECT USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'super_admin')
);

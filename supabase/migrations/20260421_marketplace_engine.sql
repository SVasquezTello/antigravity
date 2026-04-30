-- MIGRACIÓN: Marketplace de Apps Engine (Sección 11)

-- 1. Upgrade de Aplicaciones (11.1)
ALTER TABLE public.applications 
  ADD COLUMN IF NOT EXISTS cost_credits INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS webhook_url TEXT,
  ADD COLUMN IF NOT EXISTS markup_percent DECIMAL(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_beta BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS timeout_seconds INTEGER DEFAULT 60,
  ADD COLUMN IF NOT EXISTS json_schema JSONB DEFAULT '{}', -- Formulario dinámico
  ADD COLUMN IF NOT EXISTS version TEXT DEFAULT '1.0.0';

-- 2. Configuración por Partner (11.6)
-- Permite que cada socio decida qué apps ofrece y a qué precio
CREATE TABLE IF NOT EXISTS public.partner_app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  app_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  markup_override DECIMAL(5,2), -- Si el partner quiere ganar más que el sistema
  UNIQUE(partner_id, app_id)
);

-- 3. Seguimiento de Ejecución Maestro (11.4)
-- Historial detallado para reconciliación y auditoría
CREATE TABLE IF NOT EXISTS public.app_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id),
  user_id UUID NOT NULL REFERENCES public.users(id),
  app_id UUID NOT NULL REFERENCES public.applications(id),
  
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'timed_out'
  input_data JSONB,
  output_data JSONB,
  
  credits_charged INTEGER,
  tokens_used INTEGER,
  processing_time_ms INTEGER,
  
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- RLS: Clientes ven su propio historial de ejecución
ALTER TABLE public.app_executions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own executions" ON public.app_executions 
  FOR SELECT USING (user_id = auth.uid());

-- RLS: Partners ven ejecuciones de sus clientes
CREATE POLICY "Partners see client executions" ON public.app_executions 
  FOR SELECT USING (
    client_id IN (SELECT id FROM public.clients WHERE partner_id = (SELECT partner_id FROM public.users WHERE id = auth.uid()))
  );

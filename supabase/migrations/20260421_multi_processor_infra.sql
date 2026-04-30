-- MIGRACIÓN: Infraestructura Multi-Procesador (Sección 18)

-- 1. Registro Maestro de Procesadores (18.1)
CREATE TABLE IF NOT EXISTS public.payment_processors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- 'Stripe', 'PayPal', 'MercadoPago'
  adapter_key TEXT NOT NULL UNIQUE, -- 'stripe_adapter', 'paypal_adapter'
  is_active BOOLEAN DEFAULT true,
  config_schema JSONB DEFAULT '[]', -- Definiciones de campos necesarios (18.2)
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Cuentas Vinculadas de Partners (18.3)
CREATE TABLE IF NOT EXISTS public.partner_payment_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  processor_id UUID NOT NULL REFERENCES public.payment_processors(id),
  
  credentials JSONB DEFAULT '{}', -- Credenciales encriptadas (Key, Secret, etc.)
  status TEXT DEFAULT 'pending', -- 'pending', 'active', 'restricted'
  capabilities JSONB DEFAULT '["payments", "subscriptions"]',
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(partner_id, processor_id)
);

-- 3. Mapeos de Ofertas a Procesadores
-- Cada oferta/precio tiene un ID externo en el procesador (ej: prod_123, price_456)
CREATE TABLE IF NOT EXISTS public.offer_processor_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID REFERENCES public.offers(id) ON DELETE CASCADE,
  processor_id UUID REFERENCES public.payment_processors(id),
  external_product_id TEXT,
  external_price_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS para Seguridad Financiera
ALTER TABLE public.payment_processors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage processors" ON public.payment_processors FOR ALL USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'super_admin')
);

ALTER TABLE public.partner_payment_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partners manage their own accounts" ON public.partner_payment_accounts 
  FOR ALL USING (partner_id = (SELECT partner_id FROM public.users WHERE id = auth.uid()));

-- SEED: Procesador Base
INSERT INTO public.payment_processors (name, adapter_key, config_schema) 
VALUES ('Stripe', 'stripe_v1', '[{"name":"secret_key","type":"text","label":"Secret Key","secret":true}, {"name":"publishable_key","type":"text","label":"Publishable Key"}]')
ON CONFLICT DO NOTHING;

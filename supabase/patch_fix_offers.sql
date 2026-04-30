-- PARCHE: Corrección de Arquitectura y Nomenclatura (Offers & Workspaces)
-- Ejecutar en el SQL Editor de Supabase

-- 1. Renombrar 'clients' a 'workspaces' para consistencia con el Frontend
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clients') THEN
        ALTER TABLE public.clients RENAME TO workspaces;
    END IF;
END $$;

-- 2. Asegurar que 'users' use 'workspace_id' en lugar de 'client_id'
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'client_id') THEN
        ALTER TABLE public.users RENAME COLUMN client_id TO workspace_id;
    END IF;
END $$;

-- 3. Crear tabla de Procesadores de Pago (Requisito para suscripciones)
CREATE TABLE IF NOT EXISTS public.payment_processors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  provider TEXT NOT NULL, -- 'stripe', 'paypal', 'lemon_squeezy'
  config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Crear tabla de Ofertas (Unified Offers)
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL DEFAULT 'client_plan', -- 'client_plan', 'partner_plan', 'credit_topup'
  status TEXT DEFAULT 'active',
  visibility TEXT DEFAULT 'public',
  description TEXT,
  features JSONB DEFAULT '[]',
  prices JSONB DEFAULT '[]', -- [{ "type": "monthly", "amount": 29, "currency": "USD" }]
  grants JSONB DEFAULT '{}', -- { "credits": 500 }
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Crear tabla de Suscripciones Maestras
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id),
  partner_id UUID REFERENCES public.partners(id),
  offer_id UUID NOT NULL REFERENCES public.offers(id),
  status TEXT NOT NULL DEFAULT 'active',
  processor_id UUID REFERENCES public.payment_processors(id),
  external_subscription_id TEXT UNIQUE,
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '1 month'),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Tabla de Estado de Usuario (SSOT para Permisos)
CREATE TABLE IF NOT EXISTS public.user_status (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  current_plan_id UUID REFERENCES public.offers(id),
  status TEXT NOT NULL DEFAULT 'active',
  access_until TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Migrar datos de 'plans' a 'offers' (Para no perder los planes actuales)
INSERT INTO public.offers (name, slug, type, description, features, prices, grants)
SELECT 
    name_es, 
    slug, 
    'client_plan', 
    description_es, 
    items_es,
    jsonb_build_array(jsonb_build_object('type', 'monthly', 'amount', price_monthly, 'currency', 'USD')),
    jsonb_build_object('credits', 500)
FROM public.plans
ON CONFLICT (slug) DO NOTHING;

-- 8. Notificar cambios al esquema
NOTIFY pgrst, 'reload schema';

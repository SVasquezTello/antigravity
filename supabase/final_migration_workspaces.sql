-- PARCHE FINAL: Migración Maestra (Workspaces & Offers)
-- Este script unifica los parches previos y asegura la consistencia para el seeding

-- 1. Renombrar 'clients' a 'workspaces'
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clients') THEN
        ALTER TABLE public.clients RENAME TO workspaces;
    END IF;
END $$;

-- 2. Asegurar que las tablas usen 'workspace_id' en lugar de 'client_id'
DO $$ 
DECLARE
    t_name TEXT;
BEGIN
    FOR t_name IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('users', 'invitations', 'usage_logs', 'credit_batches')
    LOOP
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = t_name AND column_name = 'client_id') THEN
            EXECUTE format('ALTER TABLE public.%I RENAME COLUMN client_id TO workspace_id', t_name);
        END IF;
    END LOOP;
END $$;

-- 3. Crear tablas base si no existen
CREATE TABLE IF NOT EXISTS public.payment_processors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL DEFAULT 'client_plan',
  status TEXT DEFAULT 'active',
  visibility TEXT DEFAULT 'public',
  description TEXT,
  features JSONB DEFAULT '[]',
  prices JSONB DEFAULT '[]',
  grants JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Crear offer_apps (Reemplazo de plan_apps)
CREATE TABLE IF NOT EXISTS public.offer_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
  app_id UUID NOT NULL REFERENCES public.micro_apps(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(offer_id, app_id)
);

-- 5. Crear tablas de estado y suscripciones
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

CREATE TABLE IF NOT EXISTS public.user_status (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  current_plan_id UUID REFERENCES public.offers(id),
  status TEXT NOT NULL DEFAULT 'active',
  access_until TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Migrar datos de 'plans' a 'offers'
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

-- 7. Migrar mapeos de apps
INSERT INTO public.offer_apps (offer_id, app_id)
SELECT o.id, pa.app_id
FROM public.plan_apps pa
JOIN public.plans p ON pa.plan_id = p.id
JOIN public.offers o ON p.slug = o.slug
ON CONFLICT (offer_id, app_id) DO NOTHING;

-- 8. Notificar
NOTIFY pgrst, 'reload schema';

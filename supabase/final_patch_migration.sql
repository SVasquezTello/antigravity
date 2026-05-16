-- FINAL PATCH: Completar Migración de Arquitectura
-- Ejecutar este script si ya renombraste 'clients' a 'workspaces' pero faltan las nuevas tablas.

-- 1. Renombrar columnas en tablas existentes
DO $$ 
BEGIN
    -- users
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'client_id') THEN
        ALTER TABLE public.users RENAME COLUMN client_id TO workspace_id;
    END IF;
    
    -- invitations
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'invitations') AND 
       EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'client_id') THEN
        ALTER TABLE public.invitations RENAME COLUMN client_id TO workspace_id;
    END IF;

    -- usage_logs
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'usage_logs') AND 
       EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'usage_logs' AND column_name = 'client_id') THEN
        ALTER TABLE public.usage_logs RENAME COLUMN client_id TO workspace_id;
    END IF;
END $$;

-- 2. Crear Tabla de Ofertas (Offers)
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

-- 3. Crear Tabla de Aplicaciones por Oferta
CREATE TABLE IF NOT EXISTS public.offer_apps (
  offer_id UUID REFERENCES public.offers(id) ON DELETE CASCADE,
  app_id UUID REFERENCES public.micro_apps(id) ON DELETE CASCADE,
  PRIMARY KEY (offer_id, app_id)
);

-- 4. Crear Tabla de Suscripciones
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id),
  offer_id UUID NOT NULL REFERENCES public.offers(id),
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '1 month'),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Crear Tabla de Estado de Usuario
CREATE TABLE IF NOT EXISTS public.user_status (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  current_plan_id UUID REFERENCES public.offers(id),
  status TEXT NOT NULL DEFAULT 'active',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Recargar Esquema PostgREST
NOTIFY pgrst, 'reload schema';

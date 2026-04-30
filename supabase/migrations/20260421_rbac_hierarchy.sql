-- MIGRACIÓN: Sistema de Roles y Multi-tenancy (Día 12)

-- 1. Evolución de Roles
-- Nota: En Supabase, para cambiar un ENUM se suele crear uno nuevo y reemplazarlo
DO $$ BEGIN
    CREATE TYPE user_role_new AS ENUM ('super_admin', 'partner', 'client', 'staff');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Estructura de Multi-tenancy
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  partner_id UUID REFERENCES public.partners(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Actualización de Usuarios
ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS partner_id UUID REFERENCES public.partners(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS admin_tags TEXT[] DEFAULT '{}';

-- 4. Partner del Sistema por defecto
INSERT INTO public.partners (name, slug, is_system) 
VALUES ('Antigravity System', 'antigravity', true)
ON CONFLICT (slug) DO NOTHING;

-- 5. Función de Gating por Tags (1.5)
ALTER TABLE public.micro_apps ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- 6. Seguridad a Nivel de Fila (RLS) mejorado
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Políticas para Partners
DROP POLICY IF EXISTS "Super admins see all partners" ON public.partners;
CREATE POLICY "Super admins see all partners" ON public.partners
  FOR ALL TO authenticated USING ( 
    (SELECT role::text FROM public.users WHERE id = auth.uid()) = 'super_admin' OR 
    (SELECT role::text FROM public.users WHERE id = auth.uid()) = 'admin' 
  );

DROP POLICY IF EXISTS "Partners see own data" ON public.partners;
CREATE POLICY "Partners see own data" ON public.partners
  FOR SELECT TO authenticated USING ( id = (SELECT partner_id FROM public.users WHERE id = auth.uid()) );

-- Políticas para Clientes
DROP POLICY IF EXISTS "Partners see their clients" ON public.clients;
CREATE POLICY "Partners see their clients" ON public.clients
  FOR ALL TO authenticated USING ( 
    partner_id = (SELECT partner_id FROM public.users WHERE id = auth.uid()) 
    OR (SELECT role::text FROM public.users WHERE id = auth.uid()) IN ('super_admin', 'admin')
  );

-- 7. Actualización de la función get_user_role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (SELECT role::text FROM public.users WHERE id = auth.uid());
END;
$$;

-- --- Prerequisite from Previous Days ---
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role user_role DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- Default policy
DROP POLICY IF EXISTS "users can see own row" ON public.users;
CREATE POLICY "users can see own row" ON public.users FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    'user'
  );
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Restore any missing existing users
INSERT INTO public.users (id, email, role)
SELECT id, email, 'user' FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;
-- ------------------------------------

-- Migration 1: Create SECURITY DEFINER function for role checks
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (SELECT role::text FROM public.users WHERE id = auth.uid());
END;
$$;

-- Migration 2: New Table — plans
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_es TEXT NOT NULL,
  description_en TEXT,
  description_es TEXT,
  price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
  items_en JSONB NOT NULL DEFAULT '[]',
  items_es JSONB NOT NULL DEFAULT '[]',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plans_select_authenticated" ON public.plans
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "plans_admin_all" ON public.plans
  FOR ALL TO authenticated
  USING (public.get_user_role() = 'admin');

-- Migration 3: New Table — plan_apps
CREATE TABLE IF NOT EXISTS public.plan_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  app_id UUID NOT NULL REFERENCES public.micro_apps(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(plan_id, app_id)
);

ALTER TABLE public.plan_apps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plan_apps_select_authenticated" ON public.plan_apps
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "plan_apps_admin_all" ON public.plan_apps
  FOR ALL TO authenticated
  USING (public.get_user_role() = 'admin');

-- Migration 4: New Table — user_app_overrides
CREATE TABLE IF NOT EXISTS public.user_app_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  app_id UUID NOT NULL REFERENCES public.micro_apps(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, app_id)
);

ALTER TABLE public.user_app_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "overrides_admin_all" ON public.user_app_overrides
  FOR ALL TO authenticated
  USING (public.get_user_role() = 'admin');

-- Migration 5: Modify users Table — Add Plan Columns
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS plan_assigned_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS plan_source TEXT;

-- Migration 6: Update users RLS — Add Admin SELECT/UPDATE Policies
CREATE POLICY "users_admin_select_all" ON public.users
  FOR SELECT TO authenticated
  USING (public.get_user_role() = 'admin');

CREATE POLICY "users_admin_update_all" ON public.users
  FOR UPDATE TO authenticated
  USING (public.get_user_role() = 'admin');

-- Migration 7: Auto-Seed Plans + Plan-App Assignments
DO $$
DECLARE
  basic_id UUID;
  intermediary_id UUID;
  professional_id UUID;
  app_ids UUID[];
BEGIN
  IF (SELECT COUNT(*) FROM public.plans) = 0 THEN
    SELECT ARRAY(SELECT id FROM public.micro_apps ORDER BY created_at ASC) INTO app_ids;

    INSERT INTO public.plans (slug, name_en, name_es, description_en, description_es, price_monthly, sort_order, items_en, items_es)
    VALUES
      ('basic', 'Basic', 'Básico', 'Perfect for getting started', 'Perfecto para empezar', 29.00, 1,
        '["Access to 1 AI app", "Up to 50 generations/month", "Email support"]',
        '["Acceso a 1 app de IA", "Hasta 50 generaciones/mes", "Soporte por email"]'),
      ('intermediary', 'Intermediary', 'Intermedio', 'For growing businesses', 'Para negocios en crecimiento', 49.00, 2,
        '["Access to 3 AI apps", "Up to 200 generations/month", "Priority email support"]',
        '["Acceso a 3 apps de IA", "Hasta 200 generaciones/mes", "Soporte prioritario por email"]'),
      ('professional', 'Professional', 'Profesional', 'Unlimited power for professionals', 'Poder ilimitado para profesionales', 97.00, 3,
        '["Access to ALL AI apps", "Unlimited generations", "Priority support + onboarding call"]',
        '["Acceso a TODAS las apps de IA", "Generaciones ilimitadas", "Soporte prioritario + llamada de onboarding"]');

    SELECT id INTO basic_id FROM public.plans WHERE slug = 'basic';
    SELECT id INTO intermediary_id FROM public.plans WHERE slug = 'intermediary';
    SELECT id INTO professional_id FROM public.plans WHERE slug = 'professional';

    IF array_length(app_ids, 1) >= 1 THEN
      INSERT INTO public.plan_apps (plan_id, app_id) VALUES (basic_id, app_ids[1]);
    END IF;

    IF array_length(app_ids, 1) >= 1 THEN
      INSERT INTO public.plan_apps (plan_id, app_id) VALUES (intermediary_id, app_ids[1]);
    END IF;
    IF array_length(app_ids, 1) >= 2 THEN
      INSERT INTO public.plan_apps (plan_id, app_id) VALUES (intermediary_id, app_ids[2]);
    END IF;
    IF array_length(app_ids, 1) >= 3 THEN
      INSERT INTO public.plan_apps (plan_id, app_id) VALUES (intermediary_id, app_ids[3]);
    END IF;

    FOR i IN 1..array_length(app_ids, 1) LOOP
      INSERT INTO public.plan_apps (plan_id, app_id) VALUES (professional_id, app_ids[i]);
    END LOOP;
  END IF;
END $$;

-- Migration 8: Promote First User to Admin
UPDATE public.users
SET role = 'admin'
WHERE id = (SELECT id FROM public.users ORDER BY created_at ASC LIMIT 1)
AND role = 'user'::user_role;

-- Migration 9: Add Admin Policies for micro_apps
CREATE POLICY "micro_apps_admin_all" ON public.micro_apps
  FOR ALL TO authenticated
  USING (public.get_user_role() = 'admin');

-- Migration 10: Add Admin Policies for app_executions
CREATE POLICY "executions_admin_all" ON public.app_executions
  FOR ALL TO authenticated
  USING (public.get_user_role() = 'admin');

-- Migration 11: Allow users to update their own executions (for status updates)
DROP POLICY IF EXISTS "Users can update their own executions" ON public.app_executions;
CREATE POLICY "Users can update their own executions" ON public.app_executions
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Migration 12: Force PostgREST to Reload Schema
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';

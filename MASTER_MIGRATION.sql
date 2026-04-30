-- MIGRATION: 20240401000000_foundation.sql
-- Migration for Micro-Apps Portal Foundation

-- Tables
CREATE TABLE IF NOT EXISTS public.micro_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_es TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_es TEXT,
  description_en TEXT,
  icon TEXT DEFAULT 'Sparkles',
  form_schema JSONB NOT NULL,
  autofill_presets JSONB DEFAULT '[]'::jsonb,
  prompt_template TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.app_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id UUID NOT NULL REFERENCES public.micro_apps(id) ON DELETE CASCADE,
  inputs JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'error')),
  result JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- RLS
ALTER TABLE public.micro_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on micro_apps" ON public.micro_apps
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can only see their own executions" ON public.app_executions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own executions" ON public.app_executions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.app_executions;


-- MIGRATION: 20240407000000_day8_control.sql
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


-- MIGRATION: 20240408000000_day9_quotas.sql
-- Migration for Quota Management System

-- 1. Add limits to plans
ALTER TABLE public.plans
  ADD COLUMN IF NOT EXISTS generations_limit INTEGER NOT NULL DEFAULT 50;

-- 2. Update existing plans with higher limits
UPDATE public.plans SET generations_limit = 50 WHERE slug = 'basic';
UPDATE public.plans SET generations_limit = 200 WHERE slug = 'intermediary';
UPDATE public.plans SET generations_limit = 999999 WHERE slug = 'professional';

-- 3. Create a view for easy usage tracking
CREATE OR REPLACE VIEW public.user_usage_stats AS
SELECT 
  u.id as user_id,
  u.email,
  p.slug as plan_slug,
  p.generations_limit,
  (
    SELECT count(*) 
    FROM public.app_executions ae 
    WHERE ae.user_id = u.id 
    AND ae.status = 'completed'
    AND ae.created_at >= date_trunc('month', now())
  ) as generations_this_month
FROM public.users u
LEFT JOIN public.plans p ON u.plan_id = p.id;

-- 4. Enable RLS on the view (though views in Supabase usually inherit or need special handling if not security definer)
-- Actually, we'll just query the tables directly in our RPC or API.

-- 5. Function to check if user has remaining quota
CREATE OR REPLACE FUNCTION public.check_user_quota(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_limit INTEGER;
  v_count INTEGER;
BEGIN
  -- Get limit
  SELECT p.generations_limit INTO v_limit
  FROM public.users u
  JOIN public.plans p ON u.plan_id = p.id
  WHERE u.id = p_user_id;

  -- If no plan or limit, assume basic limit or 0
  IF v_limit IS NULL THEN
    v_limit := 5; -- Trial limit
  END IF;

  -- Get current month count
  SELECT count(*) INTO v_count
  FROM public.app_executions
  WHERE user_id = p_user_id
  AND status = 'completed'
  AND created_at >= date_trunc('month', now());

  RETURN v_count < v_limit;
END;
$$;


-- MIGRATION: 20240408000000_day9_webhooks.sql
CREATE TABLE public.webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  event_type TEXT NOT NULL,
  raw_payload JSONB NOT NULL DEFAULT '{}',
  normalized_payload JSONB NOT NULL DEFAULT '{}',
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read/write webhook logs — uses existing SECURITY DEFINER function
CREATE POLICY "webhook_logs_admin_all" ON public.webhook_logs
  FOR ALL TO authenticated
  USING (public.get_user_role() = 'admin');

NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';


-- MIGRATION: 20240412000000_day10_email.sql
CREATE TABLE public.smtp_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host TEXT NOT NULL DEFAULT '',
  port INTEGER NOT NULL DEFAULT 587,
  username TEXT NOT NULL DEFAULT '',
  password TEXT NOT NULL DEFAULT '',
  from_email TEXT NOT NULL DEFAULT '',
  from_name TEXT NOT NULL DEFAULT '',
  is_verified BOOLEAN NOT NULL DEFAULT false,
  verified_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.smtp_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can read/write SMTP settings — uses existing SECURITY DEFINER function
CREATE POLICY "smtp_settings_admin_all" ON public.smtp_settings
  FOR ALL TO authenticated
  USING (public.get_user_role() = 'admin');

NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';


-- MIGRATION: 20240413000000_day11_ad_creator.sql
-- Day 11: Create Ad Copy Generator Micro App
-- Inserts a powerful new marketing tool and binds it to Premium plans.

WITH inserted_app AS (
  INSERT INTO public.micro_apps (slug, name_en, name_es, description_en, description_es, icon, form_schema, autofill_presets, prompt_template)
  VALUES (
    'ad-creator',
    'Ad Copy Generator',
    'Creador de Anuncios',
    'Generate high-converting ad copy optimized for specific social media platforms.',
    'Genera el texto de anuncios publicitarios optimizado para plataformas de redes sociales.',
    'Target',
    '[
      {"name": "product", "label": {"en": "Product / Service", "es": "Producto o Servicio"}, "type": "textarea", "placeholder": {"en": "Describe what you are selling...", "es": "Describe qué estás vendiendo..."}, "required": true},
      {"name": "audience", "label": {"en": "Target Audience", "es": "Público Objetivo"}, "type": "text", "placeholder": {"en": "e.g., Young professionals, Parents", "es": "Ej: Estudiantes universitarios, emprendedores"}, "required": true},
      {"name": "platform", "label": {"en": "Platform", "es": "Plataforma"}, "type": "select", "options": [
        {"value": "facebook", "label": {"en": "Facebook Ads", "es": "Facebook Ads"}},
        {"value": "instagram", "label": {"en": "Instagram Ads", "es": "Instagram Ads"}},
        {"value": "tiktok", "label": {"en": "TikTok Ads", "es": "TikTok Ads"}},
        {"value": "google", "label": {"en": "Google Search Ads", "es": "Google Search Ads"}}
      ], "required": true},
      {"name": "tone", "label": {"en": "Tone of voice", "es": "Tono de voz"}, "type": "select", "options": [
        {"value": "persuasive", "label": {"en": "Persuasive", "es": "Persuasivo"}},
        {"value": "urgent", "label": {"en": "Urgent", "es": "Urgente / FOMO"}},
        {"value": "humorous", "label": {"en": "Humorous", "es": "Humorístico"}},
        {"value": "professional", "label": {"en": "Professional", "es": "Profesional"}}
      ], "required": true}
    ]'::jsonb,
    '[
      {"name": {"en": "Fitness App (Facebook)", "es": "App de Fitness (Facebook)"}, "values": {"product": "A revolutionary mobile app that generates personalized 15-minute home workouts without any equipment.", "audience": "Busy professionals who want to stay fit", "platform": "facebook", "tone": "urgent"}},
      {"name": {"en": "Local Cafe (TikTok)", "es": "Cafetería (TikTok)"}, "values": {"product": "Artisan coffee beans roasted locally with a deep, chocolatey flavor. Try our new iced vanilla latte.", "audience": "Gen Z and Millennials who love aesthetic coffee shops", "platform": "tiktok", "tone": "humorous"}}
    ]'::jsonb,
    'Act as an expert digital marketer and direct response copywriter. Your task is to write high-converting ad copy based on the following inputs:

Product/Service: {{product}}
Target Audience: {{audience}}
Platform: {{platform}}
Tone of Voice: {{tone}}

Please generate 3 different variations of ad copy. This output must be specifically tailored for the chosen platform:
- For Facebook/Instagram: Include an engaging hook, supportive body copy, emojis, and a clear call-to-action (CTA).
- For TikTok: Provide a hook script, visual cues or audio trends suggestions, and a catchy caption with 3-5 hashtags.
- For Google Search: Provide 3 Headlines (up to 30 chars each) and 2 Descriptions (up to 90 chars each).

Make sure the output is formatting cleanly with bolding, and the response is around 250 words minimum to provide comprehensive value.'
  )
  RETURNING id
)
INSERT INTO public.plan_apps (plan_id, app_id)
SELECT p.id, i.id
FROM public.plans p
CROSS JOIN inserted_app i
WHERE p.slug IN ('professional', 'enterprise');


-- MIGRATION: 20260418_profile_updates.sql
-- 1. Add avatar_url column to users if it doesn't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url text;

-- 2. Create the avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('avatars', 'avatars', true, 1048576, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- 3. Set up Storage RLS for avatars bucket
DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatars." ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars." ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars." ON storage.objects;

-- Allow public viewing
CREATE POLICY "Avatar images are publicly accessible."
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- Allow authenticated users to upload
CREATE POLICY "Users can upload their own avatars."
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );

-- Allow users to update their own avatars
CREATE POLICY "Users can update their own avatars."
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatars."
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );

-- Notify about schema change
NOTIFY pgrst, 'reload schema';


-- MIGRATION: 20260418_smtp_settings.sql
CREATE TABLE public.smtp_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host TEXT NOT NULL DEFAULT '',
  port INTEGER NOT NULL DEFAULT 587,
  username TEXT NOT NULL DEFAULT '',
  password TEXT NOT NULL DEFAULT '',
  from_email TEXT NOT NULL DEFAULT '',
  from_name TEXT NOT NULL DEFAULT '',
  is_verified BOOLEAN NOT NULL DEFAULT false,
  verified_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.smtp_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can read/write SMTP settings — uses existing SECURITY DEFINER function
CREATE POLICY "smtp_settings_admin_all" ON public.smtp_settings
  FOR ALL TO authenticated
  USING (public.get_user_role() = 'admin');

NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';


-- MIGRATION: 20260421_admin_intelligence_metrics.sql
-- MIGRACIÓN: Inteligencia Administrativa y Analytics (Sección 27)

-- 1. Función para calcular MRR (Monthly Recurring Revenue)
CREATE OR REPLACE FUNCTION public.get_platform_mrr()
RETURNS DECIMAL AS $$
BEGIN
    RETURN (
        SELECT COALESCE(SUM(o.price_monthly), 0)
        FROM public.subscriptions s
        JOIN public.offers o ON s.offer_id = o.id
        WHERE s.status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Función para calcular Churn Rate (Últimos 30 días)
CREATE OR REPLACE FUNCTION public.get_platform_churn_rate()
RETURNS FLOAT AS $$
DECLARE
    total_active FLOAT;
    total_canceled FLOAT;
BEGIN
    SELECT COUNT(*)::FLOAT INTO total_active FROM public.subscriptions WHERE status = 'active';
    SELECT COUNT(*)::FLOAT INTO total_canceled FROM public.subscriptions 
    WHERE status = 'canceled' AND canceled_at > now() - INTERVAL '30 days';
    
    IF total_active = 0 THEN RETURN 0; END IF;
    RETURN (total_canceled / (total_active + total_canceled)) * 100;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Métricas de Consumo vs Venta de Créditos (27.4)
CREATE OR REPLACE FUNCTION public.get_credit_economics()
RETURNS TABLE (
    total_sold BIGINT,
    total_consumed BIGINT,
    gross_revenue DECIMAL,
    estimated_cost FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COALESCE(SUM(credits_awarded), 0) FROM public.transactions WHERE type = 'payment')::BIGINT,
        (SELECT COUNT(*) FROM public.app_executions)::BIGINT, -- Simplificado a ejecuciones
        (SELECT COALESCE(SUM(amount), 0) FROM public.transactions WHERE type = 'payment'),
        (SELECT COALESCE(SUM(cost_credits), 0) * 0.01 FROM public.app_executions); -- Estimando costo base
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Ranking de Partners (27.5)
CREATE OR REPLACE FUNCTION public.get_partner_performance_leaderboard()
RETURNS TABLE (
    partner_name TEXT,
    client_count BIGINT,
    total_revenue DECIMAL,
    wallet_balance INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.name,
        COUNT(c.id),
        COALESCE(SUM(t.amount), 0),
        p.credits
    FROM public.partners p
    LEFT JOIN public.clients c ON c.partner_id = p.id
    LEFT JOIN public.transactions t ON t.partner_id = p.id
    GROUP BY p.id, p.name, p.credits
    ORDER BY total_revenue DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- MIGRATION: 20260421_auth_onboarding.sql
-- MIGRACIÓN: Autenticación Avanzada y Onboarding Automatizado (Día 13)

-- 1. Campos de Auditoría y Seguridad
ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS last_ip TEXT,
  ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT false;

-- 2. Trigger de Onboarding Automatizado (2.1)
-- Esta función se dispara cuando un nuevo usuario se registra en Auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_system_partner_id UUID;
  v_new_client_id UUID;
BEGIN
  -- Obtener el Partner del Sistema (Antigravity)
  SELECT id INTO v_system_partner_id FROM public.partners WHERE slug = 'antigravity' LIMIT 1;
  
  -- Crear un Workspace (Client) automático para el usuario
  INSERT INTO public.clients (name, partner_id)
  VALUES (COALESCE(new.raw_user_meta_data->>'first_name', 'My Workspace'), v_system_partner_id)
  RETURNING id INTO v_new_client_id;

  -- Insertar el perfil del usuario vinculado a su nuevo workspace y al partner del sistema
  INSERT INTO public.users (id, email, first_name, last_name, role, partner_id, client_id)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    'client', -- Por defecto es dueño de su propio negocio
    v_system_partner_id,
    v_new_client_id
  );

  RETURN new;
END;
$$;

-- 3. Función para rastrear Login (2.2)
CREATE OR REPLACE FUNCTION public.track_login(p_user_id UUID, p_ip TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.users 
  SET last_login = now(),
      last_ip = p_ip
  WHERE id = p_user_id;
END;
$$;


-- MIGRATION: 20260421_branding_setup.sql
-- MIGRACIÓN: Branding y Marca Blanca (Día 14)

-- 1. Campos de Marca Blanca en Partners
ALTER TABLE public.partners 
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#7C3AED', -- El violeta de Antigravity por defecto
  ADD COLUMN IF NOT EXISTS custom_domain TEXT;

-- 2. Bucket de Logos en Storage
INSERT INTO storage.buckets (id, name, public) 
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Políticas de RLS para el bucket de logos
CREATE POLICY "Logos are publicly accessible" ON storage.objects
  FOR SELECT USING ( bucket_id = 'logos' );

CREATE POLICY "Partners can upload their logos" ON storage.objects
  FOR INSERT TO authenticated 
  WITH CHECK ( bucket_id = 'logos' );


-- MIGRATION: 20260421_email_whitelabel_infra.sql
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


-- MIGRATION: 20260421_fefo_credits_system.sql
-- MIGRACIÓN: Sistema de Créditos FEFO (Sección 9)

-- 1. Lotes de Crédito (Grants)
-- Permite tener créditos que expiran en diferentes fechas
CREATE TABLE IF NOT EXISTS public.credit_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  initial_amount INTEGER NOT NULL,
  remaining_amount INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'subscription', 'topup', 'bonus'
  
  -- FEFO: Fecha de expiración (9.2)
  expires_at TIMESTAMPTZ,
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indice para optimizar FEFO (buscar los que expiran antes)
CREATE INDEX IF NOT EXISTS idx_credit_batches_fefo ON public.credit_batches (client_id, expires_at, remaining_amount) WHERE remaining_amount > 0;

-- 2. Registro de Consumo Detallado (9.3)
CREATE TABLE IF NOT EXISTS public.usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id),
  partner_id UUID NOT NULL REFERENCES public.partners(id),
  user_id UUID REFERENCES public.users(id),
  app_id UUID, -- Referencia a la micro-app ejecutada
  
  batch_id UUID REFERENCES public.credit_batches(id),
  amount INTEGER NOT NULL,
  
  -- Precios de Tres Niveles (9.5)
  cost_t0_base DECIMAL(12,4), -- Costo real API
  price_t1_system DECIMAL(12,4), -- Markup Antigravity
  price_t2_partner DECIMAL(12,4), -- Precio final al cliente
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. FUNCIÓN MAESTRA: Deducción Dual Atómica FEFO (9.4)
CREATE OR REPLACE FUNCTION public.execute_dual_deduction(
    p_client_id UUID,
    p_user_id UUID,
    p_app_id UUID,
    p_amount INTEGER,
    p_cost_t0 DECIMAL,
    p_price_t2 DECIMAL
) RETURNS BOOLEAN AS $$
DECLARE
    v_partner_id UUID;
    v_batch_id UUID;
    v_remaining_to_deduct INTEGER := p_amount;
    v_deducted_from_batch INTEGER;
BEGIN
    -- 1. Obtener el Partner del cliente
    SELECT partner_id INTO v_partner_id FROM public.clients WHERE id = p_client_id;

    -- 2. Deducción del Partner (Costo T0)
    -- El Partner paga por el costo base para que el sistema funcione
    UPDATE public.partners 
    SET wallet_balance = wallet_balance - p_cost_t0 
    WHERE id = v_partner_id AND wallet_balance >= p_cost_t0;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Saldo insuficiente del Partner';
    END IF;

    -- 3. Lógica FEFO para el Cliente (9.2)
    -- Buscamos lotes con saldo, ordenados por expiración
    FOR v_batch_id, v_deducted_from_batch IN 
        SELECT id, LEAST(remaining_amount, v_remaining_to_deduct)
        FROM public.credit_batches
        WHERE client_id = p_client_id AND remaining_amount > 0 AND (expires_at > now() OR expires_at IS NULL)
        ORDER BY expires_at ASC NULLS LAST
    LOOP
        UPDATE public.credit_batches 
        SET remaining_amount = remaining_amount - v_deducted_from_batch 
        WHERE id = v_batch_id;

        v_remaining_to_deduct := v_remaining_to_deduct - v_deducted_from_batch;
        
        -- Logging del consumo de este lote
        INSERT INTO public.usage_logs (client_id, partner_id, user_id, app_id, batch_id, amount, cost_t0_base, price_t2_partner)
        VALUES (p_client_id, v_partner_id, p_user_id, p_app_id, v_batch_id, v_deducted_from_batch, p_cost_t0, p_price_t2);

        EXIT WHEN v_remaining_to_deduct <= 0;
    END LOOP;

    IF v_remaining_to_deduct > 0 THEN
        RAISE EXCEPTION 'Créditos insuficientes para el Cliente';
    END IF;

    -- 4. Actualizar saldos finales denormalizados para velocidad (9.1)
    UPDATE public.clients SET credits = (SELECT SUM(remaining_amount) FROM public.credit_batches WHERE client_id = p_client_id) WHERE id = p_client_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- MIGRATION: 20260421_impersonation_system.sql
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


-- MIGRATION: 20260421_maintenance_cron_jobs.sql
-- MIGRACIÓN: Mantenimiento Autónomo (Sección 21)

-- 21.1 Manejo de Suscripciones Expiradas
CREATE OR REPLACE FUNCTION public.maintenance_handle_expired_subscriptions()
RETURNS JSON AS $$
DECLARE
    affected_count INTEGER;
BEGIN
    -- 1. Marcar como expiradas las vencidas
    UPDATE public.subscriptions
    SET status = 'expired', 
        updated_at = now()
    WHERE status IN ('active', 'past_due', 'trialing')
      AND current_period_end < now()
      AND cancel_at_period_end = true;
      
    GET DIAGNOSTICS affected_count = ROW_COUNT;
    
    -- 2. Sincronizar user_status (SSOT)
    -- El trigger on_subscription_status_change ya hará la magia por nosotros
    
    RETURN json_build_object('expired_processed', affected_count);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 21.3 Limpieza de Skeletons (Checkout Sessions Huérfanos)
CREATE OR REPLACE FUNCTION public.maintenance_cleanup_skeletons()
RETURNS JSON AS $$
DECLARE
    affected_count INTEGER;
BEGIN
    -- Eliminamos registros de log/transacciones pendientes de más de 48 horas sin completar
    DELETE FROM public.transactions
    WHERE status = 'pending'
      AND created_at < now() - INTERVAL '48 hours';
      
    GET DIAGNOSTICS affected_count = ROW_COUNT;
    
    RETURN json_build_object('skeletons_removed', affected_count);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 21.4 Monitor de Wallet de Partners
CREATE OR REPLACE FUNCTION public.maintenance_monitor_partner_wallets()
RETURNS JSON AS $$
DECLARE
    p_id UUID;
    p_val FLOAT;
    total_alerts INTEGER := 0;
BEGIN
    FOR p_id, p_val IN SELECT id, credits FROM public.partners WHERE is_active = true LOOP
        IF p_val < 500 THEN
           -- Disparar notificación (13.2)
           INSERT INTO public.notifications (user_id, title, message, type)
           SELECT u.id, '⚠️ Saldo Partner Bajo', 'Tu billetera de partner está por debajo de 500 créditos. Recarga para evitar interrupciones.', 'billing'
           FROM public.users u WHERE u.partner_id = p_id AND u.role = 'partner'
           ON CONFLICT DO NOTHING;
           
           total_alerts := total_alerts + 1;
        END IF;
    END LOOP;
    
    RETURN json_build_object('partner_alerts_sent', total_alerts);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Procedimiento Maestro de Mantenimiento
CREATE OR REPLACE FUNCTION public.run_platform_maintenance()
RETURNS JSON AS $$
DECLARE
    result_sub JSON;
    result_skel JSON;
    result_part JSON;
BEGIN
    SELECT public.maintenance_handle_expired_subscriptions() INTO result_sub;
    SELECT public.maintenance_cleanup_skeletons() INTO result_skel;
    SELECT public.maintenance_monitor_partner_wallets() INTO result_part;
    
    RETURN json_build_object(
        'timestamp', now(),
        'subscriptions', result_sub,
        'cleanup', result_skel,
        'partners', result_part
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- MIGRATION: 20260421_marketing_leads_system.sql
-- MIGRACIÓN: Captura de Leads (Sección 23)

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  industry TEXT,
  message TEXT,
  source TEXT DEFAULT 'direct', -- 'direct', 'ads', 'referral', 'help_center'
  status TEXT DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'customer'
  metadata JSONB DEFAULT '{}', -- Para UTM tags y analytics
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Solo Admin puede ver los leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin manages all leads" ON public.leads FOR ALL TO authenticated USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'super_admin')
);

-- Public insert allowed
CREATE POLICY "Public can insert leads" ON public.leads FOR INSERT WITH CHECK (true);


-- MIGRATION: 20260421_marketplace_engine.sql
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


-- MIGRATION: 20260421_multi_processor_infra.sql
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


-- MIGRATION: 20260421_notifications_pro_system.sql
-- MIGRACIÓN: Notificaciones Pro y Broadcasts (Sección 13)

-- 1. Upgrade de Notificaciones Existentes (13.2)
ALTER TABLE public.notifications 
  ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'system', -- 'billing', 'security', 'announcement', 'success'
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- 2. Sistema de Broadcast (13.3)
-- Mensajes enviados a grupos de usuarios
CREATE TABLE IF NOT EXISTS public.broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.users(id),
  partner_id UUID REFERENCES public.partners(id), -- NULL para global
  
  target_audience TEXT DEFAULT 'all', -- 'all', 'partners_only', 'clients_only', 'tag_specific'
  target_tag_id UUID REFERENCES public.tags(id),
  
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  
  scheduled_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabla de Seguimiento de Lectura de Broadcasts
-- Como un broadcast no va a un solo user_id, rastreamos quién lo leyó
CREATE TABLE IF NOT EXISTS public.broadcast_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broadcast_id UUID NOT NULL REFERENCES public.broadcasts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(broadcast_id, user_id)
);

-- RLS para Broadcasts
ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view relevant broadcasts" ON public.broadcasts 
  FOR SELECT USING (
    (partner_id IS NULL OR partner_id = (SELECT partner_id FROM public.users WHERE id = auth.uid()))
    AND (scheduled_at <= now())
    AND (expires_at IS NULL OR expires_at > now())
  );

-- 4. FUNCIÓN: Obtener Notificaciones Unificadas (13.1)
-- Junta notificaciones directas y broadcasts no leídos
CREATE OR REPLACE FUNCTION public.get_user_notifications(p_user_id UUID)
RETURNS TABLE (
    id UUID, 
    title TEXT, 
    message TEXT, 
    type TEXT, 
    is_read BOOLEAN, 
    created_at TIMESTAMPTZ,
    link TEXT
) AS $$
BEGIN
    RETURN QUERY
    -- Notificaciones directas
    SELECT n.id, n.title, n.message, n.type, n.is_read, n.created_at, n.link
    FROM public.notifications n
    WHERE n.user_id = p_user_id
    
    UNION ALL
    
    -- Broadcasts no leídos
    SELECT b.id, b.title, b.message, 'announcement' as type, false as is_read, b.scheduled_at as created_at, b.link
    FROM public.broadcasts b
    WHERE (b.partner_id IS NULL OR b.partner_id = (SELECT u.partner_id FROM public.users u WHERE u.id = p_user_id))
      AND b.scheduled_at <= now()
      AND (b.expires_at IS NULL OR b.expires_at > now())
      AND b.id NOT IN (SELECT br.broadcast_id FROM public.broadcast_reads br WHERE br.user_id = p_user_id)
      
    ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- MIGRATION: 20260421_notifications_setup.sql
-- MIGRACIÓN: Sistema de Notificaciones del Portal (Día 16)

-- 1. Tabla de Notificaciones
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title_en TEXT NOT NULL,
  title_es TEXT NOT NULL,
  message_en TEXT,
  message_es TEXT,
  type TEXT DEFAULT 'info', -- 'info', 'warning', 'success', 'error'
  is_read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. RLS para Notificaciones
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- 3. Función para crear notificación del sistema
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id UUID, 
  p_title_es TEXT, 
  p_title_en TEXT, 
  p_type TEXT DEFAULT 'info',
  p_link TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, title_es, title_en, type, link)
  VALUES (p_user_id, p_title_es, p_title_en, p_type, p_link);
END;
$$;


-- MIGRATION: 20260421_operations_suite.sql
-- MIGRACIÓN: Staff, Soporte y Auditoría (Día 17-20)

-- --- SECCIÓN 8: INVITACIONES DE STAFF ---
CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'staff',
  token TEXT NOT NULL UNIQUE,
  invited_by UUID REFERENCES public.users(id),
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'expired'
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '7 days')
);

-- --- SECCIÓN 9: SISTEMA DE TICKETS ---
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'closed'
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ticket_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id),
  message TEXT NOT NULL,
  is_admin_reply BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- --- SECCIÓN 10: AUDITORÍA GLOBAL ---
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'LOGIN', 'APP_EXEC', 'PLAN_CHANGE', 'USER_INVITE', etc.
  target_type TEXT,
  target_id TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Básico
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Invitations: Client owners can see own" ON public.invitations
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND client_id = invitations.client_id AND role IN ('client_owner', 'admin', 'super_admin'))
  );

CREATE POLICY "Tickets: Users see own, Admins see all" ON public.tickets
  FOR ALL TO authenticated USING (
    auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Trigger para guardar log de auditoría automáticamente en ejecuciones
CREATE OR REPLACE FUNCTION public.log_app_execution()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (user_id, action, target_type, target_id, metadata)
  VALUES (NEW.user_id, 'APP_EXECUTION', 'micro_app', NEW.app_id::text, jsonb_build_object('execution_id', NEW.id));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_log_app_exec
AFTER INSERT ON public.app_executions
FOR EACH ROW EXECUTE FUNCTION public.log_app_execution();


-- MIGRATION: 20260421_partner_pro_suite.sql
-- MIGRACIÓN: Ecosistema de Partners Avanzado (Día 21-25)

-- 1. Expansión de la tabla Partners
ALTER TABLE public.partners 
  ADD COLUMN IF NOT EXISTS wallet_balance DECIMAL(12,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS stripe_connect_id TEXT,
  ADD COLUMN IF NOT EXISTS paypal_client_id TEXT,
  ADD COLUMN IF NOT EXISTS favicon_url TEXT,
  ADD COLUMN IF NOT EXISTS custom_smtp_settings JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS default_registration_plan_id UUID REFERENCES public.plans(id),
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active'; -- 'active', 'suspended', 'pending'

-- 2. Historial de Transacciones del Partner (Wallet)
CREATE TABLE IF NOT EXISTS public.partner_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  type TEXT NOT NULL, -- 'topup', 'withdrawal', 'purchase'
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Plantillas de Temas (Presets)
CREATE TABLE IF NOT EXISTS public.partner_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES public.partners(id),
  name TEXT NOT NULL,
  colors JSONB NOT NULL, -- { primary: '', secondary: '', base: '' }
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS para Partner Transactions
ALTER TABLE public.partner_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partners see own transactions" ON public.partner_transactions
  FOR SELECT TO authenticated USING (
    partner_id = (SELECT partner_id FROM public.users WHERE id = auth.uid())
  );

-- Función para recargar wallet (Demo/Admin)
CREATE OR REPLACE FUNCTION public.add_partner_funds(p_partner_id UUID, p_amount DECIMAL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.partners SET wallet_balance = wallet_balance + p_amount WHERE id = p_partner_id;
  INSERT INTO public.partner_transactions (partner_id, amount, type, description)
  VALUES (p_partner_id, p_amount, 'topup', 'Carga de saldo administrativa');
END;
$$;


-- MIGRATION: 20260421_payments_billing_infra.sql
-- MIGRACIÓN: Infraestructura de Pagos y Billing (Sección 8)

-- 1. Estados de Suscripción Normalizados
CREATE TYPE subscription_status AS ENUM (
  'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'incomplete', 'incomplete_expired', 'paused'
);

-- 2. Tabla de Suscripciones Mejorada
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  offer_id UUID NOT NULL REFERENCES public.offers(id),
  
  -- Campos de Procesador (Adapter)
  processor TEXT NOT NULL, -- 'stripe', 'paypal'
  processor_subscription_id TEXT UNIQUE NOT NULL,
  processor_customer_id TEXT,
  
  status subscription_status NOT NULL DEFAULT 'active',
  
  -- Ciclo de Vida (8.5)
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Historial de Transacciones Detallado (8.7)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id),
  subscription_id UUID REFERENCES public.subscriptions(id),
  
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  type TEXT NOT NULL, -- 'payment', 'refund', 'chargeback', 'bonus'
  status TEXT NOT NULL, -- 'succeeded', 'failed', 'pending', 'refunded'
  
  processor TEXT NOT NULL,
  processor_transaction_id TEXT UNIQUE,
  receipt_url TEXT,
  
  -- Snapshot de Saldo (Para auditoría)
  credits_before INTEGER,
  credits_after INTEGER,
  
  metadata JSONB DEFAULT '{}',
  idempotency_key TEXT UNIQUE, -- 8.3: Prevención de duplicados
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Soporte para Idempotencia de Webhooks
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processor TEXT NOT NULL,
  processor_event_id TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  payload JSONB,
  processed_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Clientes ven su propio billing
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients see own subscriptions" ON public.subscriptions 
  FOR SELECT USING (client_id = (SELECT client_id FROM public.users WHERE id = auth.uid()));

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients see own transactions" ON public.transactions 
  FOR SELECT USING (client_id = (SELECT client_id FROM public.users WHERE id = auth.uid()));


-- MIGRATION: 20260421_platform_audit_war_room.sql
-- MIGRACIÓN: Auditoría y Plataforma - War Room (Sección 28)

-- 1. Logs de Auditoría (28.1)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- 'update_balance', 'delete_app', 'impersonate_start'
  resource_type TEXT NOT NULL, -- 'partners', 'clients', 'offers'
  resource_id UUID,
  
  old_values JSONB,
  new_values JSONB,
  
  ip_address TEXT,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Métricas Diarias (28.2)
CREATE TABLE IF NOT EXISTS public.daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date DATE UNIQUE DEFAULT CURRENT_DATE,
  
  mrr DECIMAL(15,2),
  total_users INTEGER,
  total_subscriptions INTEGER,
  total_credits_sold BIGINT,
  total_app_executions BIGINT,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Logs de Sistema (28.3)
CREATE TABLE IF NOT EXISTS public.system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  severity TEXT DEFAULT 'info', -- 'info', 'warning', 'error', 'critical'
  context TEXT, -- 'stripe_webhook', 'n8n_gateway', 'cron_cleanup'
  message TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Feature Flags (28.4)
CREATE TABLE IF NOT EXISTS public.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL, -- 'beta_marketplace', 'paypal_payments'
  description TEXT,
  is_enabled BOOLEAN DEFAULT false,
  
  rules JSONB DEFAULT '{"roles": [], "users": [], "percentage": 100}',
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Solo Admin de Plataforma entra aquí
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform Admin Access" ON public.audit_logs FOR ALL USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
);
CREATE POLICY "Platform Admin Access Sys" ON public.system_logs FOR ALL USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
);
CREATE POLICY "Platform Admin Access Flags" ON public.feature_flags FOR ALL USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
);

-- 5. Función Snapshot Automática
CREATE OR REPLACE FUNCTION public.snap_daily_metrics()
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.daily_metrics (
        snapshot_date, mrr, total_users, total_subscriptions, total_credits_sold, total_app_executions
    )
    VALUES (
        CURRENT_DATE,
        (SELECT public.get_platform_mrr()),
        (SELECT COUNT(*) FROM public.users),
        (SELECT COUNT(*) FROM public.subscriptions WHERE status = 'active'),
        (SELECT COALESCE(SUM(credits_awarded), 0) FROM public.transactions WHERE type = 'payment'),
        (SELECT COUNT(*) FROM public.app_executions)
    )
    ON CONFLICT (snapshot_date) DO UPDATE SET
        mrr = EXCLUDED.mrr,
        total_users = EXCLUDED.total_users,
        total_subscriptions = EXCLUDED.total_subscriptions,
        total_credits_sold = EXCLUDED.total_credits_sold,
        total_app_executions = EXCLUDED.total_app_executions;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- MIGRATION: 20260421_quotas_setup.sql
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


-- MIGRATION: 20260421_rbac_hierarchy.sql
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


-- MIGRATION: 20260421_staff_limits_upgrade.sql
-- MIGRACIÓN: Refinamiento de Staff y Límites (Sección 6)

-- 1. Añadir créditos opcionales a la invitación
ALTER TABLE public.invitations 
  ADD COLUMN IF NOT EXISTS allocated_credits INTEGER DEFAULT 0;

-- 2. Añadir límite de créditos al perfil del usuario
-- Esto permite que un Client Owner controle el gasto de cada Staff
ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS credit_limit INTEGER DEFAULT NULL, -- NULL significa sin límite (usa el del workspace)
  ADD COLUMN IF NOT EXISTS credit_usage INTEGER DEFAULT 0;

-- 3. Función para validar si un staff puede ejecutar (considerando su límite personal)
CREATE OR REPLACE FUNCTION public.can_staff_execute(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_limit INTEGER;
    v_usage INTEGER;
BEGIN
    SELECT credit_limit, credit_usage INTO v_limit, v_usage FROM public.users WHERE id = p_user_id;
    
    IF v_limit IS NULL THEN
        RETURN TRUE; -- No tiene límite personal
    END IF;
    
    RETURN v_usage < v_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- MIGRATION: 20260421_subscription_lifecycle_ssot.sql
-- MIGRACIÓN: Ciclo de Vida de Suscripción y SSOT (Sección 19)

-- 1. Registro de Suscripciones Maestras (19.1)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id),
  partner_id UUID REFERENCES public.partners(id),
  offer_id UUID NOT NULL REFERENCES public.offers(id),
  
  status TEXT NOT NULL DEFAULT 'trialing', -- trialing, active, past_due, canceled, expired
  processor_id UUID REFERENCES public.payment_processors(id),
  external_subscription_id TEXT UNIQUE, -- Stripe/PayPal Sub ID
  
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_period_end TIMESTAMPTZ NOT NULL,
  
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Fuente Única de Verdad (SSOT): User Access Status (19.3)
-- Esta tabla es la que consultan los permisos (RLS)
CREATE TABLE IF NOT EXISTS public.user_status (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  current_plan_id UUID REFERENCES public.offers(id),
  status TEXT NOT NULL DEFAULT 'inactive', -- active, trialing, past_due, inactive
  
  access_until TIMESTAMPTZ,
  features_bundle_id UUID REFERENCES public.tag_bundles(id),
  
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Historial Cronológico de Suscripciones
CREATE TABLE IF NOT EXISTS public.subscription_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  prev_status TEXT,
  new_status TEXT NOT NULL,
  event_type TEXT, -- 'renewal', 'cancellation', 'payment_failed', 'trial_ended'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Disparador de Actualización SSOT
-- Cuando una suscripción cambia, actualiza la tabla de acceso real
CREATE OR REPLACE FUNCTION public.sync_user_status_on_sub_change()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_status (user_id, workspace_id, current_plan_id, status, access_until, updated_at)
    VALUES (NEW.user_id, NEW.workspace_id, NEW.offer_id, NEW.status, NEW.current_period_end, now())
    ON CONFLICT (user_id) DO UPDATE SET
        current_plan_id = EXCLUDED.current_plan_id,
        status = EXCLUDED.status,
        access_until = EXCLUDED.access_until,
        updated_at = now();
    
    -- Log history
    IF (OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO public.subscription_history (subscription_id, prev_status, new_status, event_type)
        VALUES (NEW.id, OLD.status, NEW.status, 'status_transition');
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_subscription_status_change
  AFTER INSERT OR UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_status_on_sub_change();

-- RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view their own subscription" ON public.subscriptions 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Partners view their clients' subscriptions" ON public.subscriptions 
  FOR SELECT USING (partner_id = (SELECT partner_id FROM public.users WHERE id = auth.uid()));


-- MIGRATION: 20260421_tags_bundles_system.sql
-- MIGRACIÓN: Sistema de Tags y Bundles (Sección 10)

-- 1. Registro de Tags (Llaves)
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- Ej: 'app_rrhh_gen', 'feature_white_label'
  category TEXT DEFAULT 'access', -- 'access', 'role', 'status'
  icon TEXT,
  color TEXT DEFAULT '#7C3AED',
  partner_id UUID REFERENCES public.partners(id) ON DELETE CASCADE, -- NULL para tags de plataforma
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Bundles (Paquetes de Llaves)
CREATE TABLE IF NOT EXISTS public.tag_bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  tag_ids JSONB NOT NULL DEFAULT '[]', -- Array de UUIDs de tags
  partner_id UUID REFERENCES public.partners(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Asignaciones Runtime (10.4)
CREATE TABLE IF NOT EXISTS public.user_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  source_offer_id UUID REFERENCES public.offers(id), -- Sabes por qué oferta tiene este tag
  expires_at TIMESTAMPTZ, -- Soporte para llaves temporales
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indice para validación rápida de acceso
CREATE INDEX IF NOT EXISTS idx_user_tags_lookup ON public.user_tags (user_id, tag_id) WHERE (expires_at > now() OR expires_at IS NULL);

-- 4. Vinculación Oferta -> Bundle (Upgrade de tabla offers)
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS bundle_id UUID REFERENCES public.tag_bundles(id);

-- 5. FUNCIÓN: Otorgar Bundle a Usuario
CREATE OR REPLACE FUNCTION public.grant_bundle_to_user(p_user_id UUID, p_bundle_id UUID, p_offer_id UUID)
RETURNS void AS $$
DECLARE
    v_tag_id UUID;
    v_tag_ids JSONB;
BEGIN
    SELECT tag_ids INTO v_tag_ids FROM public.tag_bundles WHERE id = p_bundle_id;
    
    FOR v_tag_id IN SELECT jsonb_array_elements_text(v_tag_ids)::UUID LOOP
        -- Evitar duplicados
        INSERT INTO public.user_tags (user_id, tag_id, source_offer_id)
        VALUES (p_user_id, v_tag_id, p_offer_id)
        ON CONFLICT DO NOTHING;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- MIGRATION: 20260421_transaction_ledger_system.sql
-- MIGRACIÓN: Ledger Transaccional e Historial Financiero (Sección 20)

-- 1. Libro Maestro de Transacciones (20.1)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  partner_id UUID REFERENCES public.partners(id) ON DELETE SET NULL,
  
  type TEXT NOT NULL, -- 'payment', 'renewal', 'refund', 'credit_grant', 'manual_adjustment'
  status TEXT DEFAULT 'completed', -- 'completed', 'pending', 'failed', 'refunded'
  
  amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  credits_awarded INTEGER DEFAULT 0,
  
  processor_id UUID REFERENCES public.payment_processors(id),
  external_transaction_id TEXT, -- Stripe Charge ID / PayPal ID
  receipt_url TEXT,
  
  internal_notes TEXT,
  snapshot JSONB DEFAULT '{}', -- Datos de la oferta al momento de la compra
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexación para Reportes Financieros Rápidos
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_partner ON public.transactions(partner_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(created_at);

-- RLS: Seguridad Contable
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view all transactions" ON public.transactions 
  FOR SELECT USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'super_admin')
  );

CREATE POLICY "Partners view their own network transactions" ON public.transactions 
  FOR SELECT USING (
    partner_id = (SELECT partner_id FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "Users view their own receipts" ON public.transactions 
  FOR SELECT USING (user_id = auth.uid());


-- MIGRATION: 20260421_unified_offers_architecture.sql
-- MIGRACIÓN: Arquitectura Unificada de Ofertas (Sección 7)

-- 1. Crear la tabla unificada de Ofertas
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL DEFAULT 'client_plan', -- 'client_plan', 'partner_plan', 'credit_topup', 'product', 'service'
  status TEXT DEFAULT 'active', -- 'active', 'archived', 'draft'
  visibility TEXT DEFAULT 'public', -- 'public', 'private', 'hidden'
  description TEXT,
  features JSONB DEFAULT '[]', -- Lista de beneficios/bullets
  image_url TEXT,
  
  -- Precios Normalizados (7.3)
  -- [{ "type": "monthly", "amount": 29, "currency": "USD", "stripe_id": "...", "paypal_id": "..." }, ...]
  prices JSONB DEFAULT '[]',
  
  -- Grants de Oferta (7.4)
  -- { "credits": 500, "tags": ["premium", "beta"], "limits": { "staff": 10 } }
  grants JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Migrar los planes actuales a la tabla de ofertas (Opcional si ya existen)
-- INSERT INTO public.offers (name, slug, type, description, features, prices, grants)
-- SELECT name, slug, 'client_plan', description, features, 
--        jsonb_build_array(jsonb_build_object('type', 'monthly', 'amount', monthly_price, 'currency', 'USD')),
--        jsonb_build_object('credits', monthly_quota)
-- FROM public.plans;

-- 3. Crear tabla de Contenido (Cursos/Ebooks) vinculada a ofertas (7.8)
CREATE TABLE IF NOT EXISTS public.content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID REFERENCES public.offers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- 'course', 'ebook', 'service_guide'
  modules JSONB DEFAULT '[]', -- [{ "title": "Mod 1", "lessons": [...] }]
  difficulty TEXT,
  preview_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Todo el mundo puede ver ofertas públicas, solo admin edita
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public offers are visible to all" ON public.offers FOR SELECT USING (visibility = 'public');
CREATE POLICY "Admin manages all offers" ON public.offers FOR ALL TO authenticated USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'super_admin')
);



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

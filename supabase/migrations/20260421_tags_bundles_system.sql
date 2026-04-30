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

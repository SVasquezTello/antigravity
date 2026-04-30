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

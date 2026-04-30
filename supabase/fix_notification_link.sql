-- PARCHE FINAL: Asegurar columna 'link' en Notificaciones
-- Ejecutar en el SQL Editor de Supabase

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'link') THEN
        ALTER TABLE public.notifications ADD COLUMN link TEXT;
    END IF;
END $$;

-- Recargar esquema
NOTIFY pgrst, 'reload schema';

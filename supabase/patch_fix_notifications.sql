-- PARCHE: Sistema de Notificaciones Pro y RPC
-- Ejecutar en el SQL Editor de Supabase

-- 1. Crear tabla base de Notificaciones (si no existe)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title_en TEXT NOT NULL,
  title_es TEXT NOT NULL,
  message_en TEXT,
  message_es TEXT,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Sistema de Broadcast (Mensajes globales)
CREATE TABLE IF NOT EXISTS public.broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.users(id),
  partner_id UUID REFERENCES public.partners(id), 
  target_audience TEXT DEFAULT 'all',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  scheduled_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Seguimiento de lectura de Broadcasts
CREATE TABLE IF NOT EXISTS public.broadcast_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broadcast_id UUID NOT NULL REFERENCES public.broadcasts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(broadcast_id, user_id)
);

-- 4. RPC: get_user_notifications (Solución al error 404)
-- Esta función unifica notificaciones directas y broadcasts
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
    -- Notificaciones directas (Mapeamos title_es/en a 'title' para el frontend)
    -- Por defecto devolvemos español, o podrías añadir lógica de idioma aquí
    SELECT n.id, n.title_es as title, n.message_es as message, n.type, n.is_read, n.created_at, n.link
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

-- 5. RPC: create_notification (Utilidad para el sistema)
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

-- RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcast_reads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can see own notifications" ON public.notifications;
CREATE POLICY "Users can see own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

NOTIFY pgrst, 'reload schema';

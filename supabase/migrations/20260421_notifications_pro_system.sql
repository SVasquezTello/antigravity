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

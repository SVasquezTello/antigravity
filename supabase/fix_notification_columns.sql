-- PARCHE CORRECTIVO: Sincronización de Columnas de Notificaciones
-- Ejecutar en el SQL Editor de Supabase

DO $$ 
BEGIN
    -- Añadir title_es si falta
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'title_es') THEN
        ALTER TABLE public.notifications ADD COLUMN title_es TEXT;
    END IF;

    -- Añadir title_en si falta
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'title_en') THEN
        ALTER TABLE public.notifications ADD COLUMN title_en TEXT;
    END IF;

    -- Añadir message_es si falta
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'message_es') THEN
        ALTER TABLE public.notifications ADD COLUMN message_es TEXT;
    END IF;

    -- Añadir message_en si falta
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'message_en') THEN
        ALTER TABLE public.notifications ADD COLUMN message_en TEXT;
    END IF;
END $$;

-- Asegurar que la función use los nombres correctos
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
    SELECT n.id, 
           COALESCE(n.title_es, n.title_en, 'Notificación') as title, 
           COALESCE(n.message_es, n.message_en, '') as message, 
           n.type, n.is_read, n.created_at, n.link
    FROM public.notifications n
    WHERE n.user_id = p_user_id
    
    UNION ALL
    
    SELECT b.id, b.title, b.message, 'announcement'::text as type, false as is_read, b.scheduled_at as created_at, b.link
    FROM public.broadcasts b
    WHERE (b.partner_id IS NULL OR b.partner_id = (SELECT u.partner_id FROM public.users u WHERE u.id = p_user_id))
      AND b.scheduled_at <= now()
      AND (b.expires_at IS NULL OR b.expires_at > now())
      AND b.id NOT IN (SELECT br.broadcast_id FROM public.broadcast_reads br WHERE br.user_id = p_user_id)
      
    ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

NOTIFY pgrst, 'reload schema';

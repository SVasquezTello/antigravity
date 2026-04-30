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

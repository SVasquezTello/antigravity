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

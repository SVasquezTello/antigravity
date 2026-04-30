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

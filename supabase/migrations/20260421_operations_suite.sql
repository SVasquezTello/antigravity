-- MIGRACIÓN: Staff, Soporte y Auditoría (Día 17-20)

-- --- SECCIÓN 8: INVITACIONES DE STAFF ---
CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'staff',
  token TEXT NOT NULL UNIQUE,
  invited_by UUID REFERENCES public.users(id),
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'expired'
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '7 days')
);

-- --- SECCIÓN 9: SISTEMA DE TICKETS ---
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'closed'
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ticket_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id),
  message TEXT NOT NULL,
  is_admin_reply BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- --- SECCIÓN 10: AUDITORÍA GLOBAL ---
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'LOGIN', 'APP_EXEC', 'PLAN_CHANGE', 'USER_INVITE', etc.
  target_type TEXT,
  target_id TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Básico
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Invitations: Client owners can see own" ON public.invitations
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND client_id = invitations.client_id AND role IN ('client_owner', 'admin', 'super_admin'))
  );

CREATE POLICY "Tickets: Users see own, Admins see all" ON public.tickets
  FOR ALL TO authenticated USING (
    auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Trigger para guardar log de auditoría automáticamente en ejecuciones
CREATE OR REPLACE FUNCTION public.log_app_execution()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (user_id, action, target_type, target_id, metadata)
  VALUES (NEW.user_id, 'APP_EXECUTION', 'micro_app', NEW.app_id::text, jsonb_build_object('execution_id', NEW.id));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_log_app_exec
AFTER INSERT ON public.app_executions
FOR EACH ROW EXECUTE FUNCTION public.log_app_execution();

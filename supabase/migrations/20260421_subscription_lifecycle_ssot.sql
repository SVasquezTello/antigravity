-- MIGRACIÓN: Ciclo de Vida de Suscripción y SSOT (Sección 19)

-- 1. Registro de Suscripciones Maestras (19.1)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id),
  partner_id UUID REFERENCES public.partners(id),
  offer_id UUID NOT NULL REFERENCES public.offers(id),
  
  status TEXT NOT NULL DEFAULT 'trialing', -- trialing, active, past_due, canceled, expired
  processor_id UUID REFERENCES public.payment_processors(id),
  external_subscription_id TEXT UNIQUE, -- Stripe/PayPal Sub ID
  
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_period_end TIMESTAMPTZ NOT NULL,
  
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Fuente Única de Verdad (SSOT): User Access Status (19.3)
-- Esta tabla es la que consultan los permisos (RLS)
CREATE TABLE IF NOT EXISTS public.user_status (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  current_plan_id UUID REFERENCES public.offers(id),
  status TEXT NOT NULL DEFAULT 'inactive', -- active, trialing, past_due, inactive
  
  access_until TIMESTAMPTZ,
  features_bundle_id UUID REFERENCES public.tag_bundles(id),
  
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Historial Cronológico de Suscripciones
CREATE TABLE IF NOT EXISTS public.subscription_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  prev_status TEXT,
  new_status TEXT NOT NULL,
  event_type TEXT, -- 'renewal', 'cancellation', 'payment_failed', 'trial_ended'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Disparador de Actualización SSOT
-- Cuando una suscripción cambia, actualiza la tabla de acceso real
CREATE OR REPLACE FUNCTION public.sync_user_status_on_sub_change()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_status (user_id, workspace_id, current_plan_id, status, access_until, updated_at)
    VALUES (NEW.user_id, NEW.workspace_id, NEW.offer_id, NEW.status, NEW.current_period_end, now())
    ON CONFLICT (user_id) DO UPDATE SET
        current_plan_id = EXCLUDED.current_plan_id,
        status = EXCLUDED.status,
        access_until = EXCLUDED.access_until,
        updated_at = now();
    
    -- Log history
    IF (OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO public.subscription_history (subscription_id, prev_status, new_status, event_type)
        VALUES (NEW.id, OLD.status, NEW.status, 'status_transition');
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_subscription_status_change
  AFTER INSERT OR UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_status_on_sub_change();

-- RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view their own subscription" ON public.subscriptions 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Partners view their clients' subscriptions" ON public.subscriptions 
  FOR SELECT USING (partner_id = (SELECT partner_id FROM public.users WHERE id = auth.uid()));

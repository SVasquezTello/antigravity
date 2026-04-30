-- MIGRACIÓN: Infraestructura de Pagos y Billing (Sección 8)

-- 1. Estados de Suscripción Normalizados
CREATE TYPE subscription_status AS ENUM (
  'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'incomplete', 'incomplete_expired', 'paused'
);

-- 2. Tabla de Suscripciones Mejorada
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  offer_id UUID NOT NULL REFERENCES public.offers(id),
  
  -- Campos de Procesador (Adapter)
  processor TEXT NOT NULL, -- 'stripe', 'paypal'
  processor_subscription_id TEXT UNIQUE NOT NULL,
  processor_customer_id TEXT,
  
  status subscription_status NOT NULL DEFAULT 'active',
  
  -- Ciclo de Vida (8.5)
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Historial de Transacciones Detallado (8.7)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id),
  subscription_id UUID REFERENCES public.subscriptions(id),
  
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  type TEXT NOT NULL, -- 'payment', 'refund', 'chargeback', 'bonus'
  status TEXT NOT NULL, -- 'succeeded', 'failed', 'pending', 'refunded'
  
  processor TEXT NOT NULL,
  processor_transaction_id TEXT UNIQUE,
  receipt_url TEXT,
  
  -- Snapshot de Saldo (Para auditoría)
  credits_before INTEGER,
  credits_after INTEGER,
  
  metadata JSONB DEFAULT '{}',
  idempotency_key TEXT UNIQUE, -- 8.3: Prevención de duplicados
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Soporte para Idempotencia de Webhooks
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processor TEXT NOT NULL,
  processor_event_id TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  payload JSONB,
  processed_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Clientes ven su propio billing
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients see own subscriptions" ON public.subscriptions 
  FOR SELECT USING (client_id = (SELECT client_id FROM public.users WHERE id = auth.uid()));

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients see own transactions" ON public.transactions 
  FOR SELECT USING (client_id = (SELECT client_id FROM public.users WHERE id = auth.uid()));

-- MIGRACIÓN: Ledger Transaccional e Historial Financiero (Sección 20)

-- 1. Libro Maestro de Transacciones (20.1)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  partner_id UUID REFERENCES public.partners(id) ON DELETE SET NULL,
  
  type TEXT NOT NULL, -- 'payment', 'renewal', 'refund', 'credit_grant', 'manual_adjustment'
  status TEXT DEFAULT 'completed', -- 'completed', 'pending', 'failed', 'refunded'
  
  amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  credits_awarded INTEGER DEFAULT 0,
  
  processor_id UUID REFERENCES public.payment_processors(id),
  external_transaction_id TEXT, -- Stripe Charge ID / PayPal ID
  receipt_url TEXT,
  
  internal_notes TEXT,
  snapshot JSONB DEFAULT '{}', -- Datos de la oferta al momento de la compra
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexación para Reportes Financieros Rápidos
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_partner ON public.transactions(partner_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(created_at);

-- RLS: Seguridad Contable
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view all transactions" ON public.transactions 
  FOR SELECT USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'super_admin')
  );

CREATE POLICY "Partners view their own network transactions" ON public.transactions 
  FOR SELECT USING (
    partner_id = (SELECT partner_id FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "Users view their own receipts" ON public.transactions 
  FOR SELECT USING (user_id = auth.uid());

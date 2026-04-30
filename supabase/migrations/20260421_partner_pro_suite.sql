-- MIGRACIÓN: Ecosistema de Partners Avanzado (Día 21-25)

-- 1. Expansión de la tabla Partners
ALTER TABLE public.partners 
  ADD COLUMN IF NOT EXISTS wallet_balance DECIMAL(12,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS stripe_connect_id TEXT,
  ADD COLUMN IF NOT EXISTS paypal_client_id TEXT,
  ADD COLUMN IF NOT EXISTS favicon_url TEXT,
  ADD COLUMN IF NOT EXISTS custom_smtp_settings JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS default_registration_plan_id UUID REFERENCES public.plans(id),
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active'; -- 'active', 'suspended', 'pending'

-- 2. Historial de Transacciones del Partner (Wallet)
CREATE TABLE IF NOT EXISTS public.partner_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  type TEXT NOT NULL, -- 'topup', 'withdrawal', 'purchase'
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Plantillas de Temas (Presets)
CREATE TABLE IF NOT EXISTS public.partner_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES public.partners(id),
  name TEXT NOT NULL,
  colors JSONB NOT NULL, -- { primary: '', secondary: '', base: '' }
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS para Partner Transactions
ALTER TABLE public.partner_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partners see own transactions" ON public.partner_transactions
  FOR SELECT TO authenticated USING (
    partner_id = (SELECT partner_id FROM public.users WHERE id = auth.uid())
  );

-- Función para recargar wallet (Demo/Admin)
CREATE OR REPLACE FUNCTION public.add_partner_funds(p_partner_id UUID, p_amount DECIMAL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.partners SET wallet_balance = wallet_balance + p_amount WHERE id = p_partner_id;
  INSERT INTO public.partner_transactions (partner_id, amount, type, description)
  VALUES (p_partner_id, p_amount, 'topup', 'Carga de saldo administrativa');
END;
$$;

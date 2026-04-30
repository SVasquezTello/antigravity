-- MIGRACIÓN: Sistema de Créditos FEFO (Sección 9)

-- 1. Lotes de Crédito (Grants)
-- Permite tener créditos que expiran en diferentes fechas
CREATE TABLE IF NOT EXISTS public.credit_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  initial_amount INTEGER NOT NULL,
  remaining_amount INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'subscription', 'topup', 'bonus'
  
  -- FEFO: Fecha de expiración (9.2)
  expires_at TIMESTAMPTZ,
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indice para optimizar FEFO (buscar los que expiran antes)
CREATE INDEX IF NOT EXISTS idx_credit_batches_fefo ON public.credit_batches (client_id, expires_at, remaining_amount) WHERE remaining_amount > 0;

-- 2. Registro de Consumo Detallado (9.3)
CREATE TABLE IF NOT EXISTS public.usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id),
  partner_id UUID NOT NULL REFERENCES public.partners(id),
  user_id UUID REFERENCES public.users(id),
  app_id UUID, -- Referencia a la micro-app ejecutada
  
  batch_id UUID REFERENCES public.credit_batches(id),
  amount INTEGER NOT NULL,
  
  -- Precios de Tres Niveles (9.5)
  cost_t0_base DECIMAL(12,4), -- Costo real API
  price_t1_system DECIMAL(12,4), -- Markup Antigravity
  price_t2_partner DECIMAL(12,4), -- Precio final al cliente
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. FUNCIÓN MAESTRA: Deducción Dual Atómica FEFO (9.4)
CREATE OR REPLACE FUNCTION public.execute_dual_deduction(
    p_client_id UUID,
    p_user_id UUID,
    p_app_id UUID,
    p_amount INTEGER,
    p_cost_t0 DECIMAL,
    p_price_t2 DECIMAL
) RETURNS BOOLEAN AS $$
DECLARE
    v_partner_id UUID;
    v_batch_id UUID;
    v_remaining_to_deduct INTEGER := p_amount;
    v_deducted_from_batch INTEGER;
BEGIN
    -- 1. Obtener el Partner del cliente
    SELECT partner_id INTO v_partner_id FROM public.clients WHERE id = p_client_id;

    -- 2. Deducción del Partner (Costo T0)
    -- El Partner paga por el costo base para que el sistema funcione
    UPDATE public.partners 
    SET wallet_balance = wallet_balance - p_cost_t0 
    WHERE id = v_partner_id AND wallet_balance >= p_cost_t0;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Saldo insuficiente del Partner';
    END IF;

    -- 3. Lógica FEFO para el Cliente (9.2)
    -- Buscamos lotes con saldo, ordenados por expiración
    FOR v_batch_id, v_deducted_from_batch IN 
        SELECT id, LEAST(remaining_amount, v_remaining_to_deduct)
        FROM public.credit_batches
        WHERE client_id = p_client_id AND remaining_amount > 0 AND (expires_at > now() OR expires_at IS NULL)
        ORDER BY expires_at ASC NULLS LAST
    LOOP
        UPDATE public.credit_batches 
        SET remaining_amount = remaining_amount - v_deducted_from_batch 
        WHERE id = v_batch_id;

        v_remaining_to_deduct := v_remaining_to_deduct - v_deducted_from_batch;
        
        -- Logging del consumo de este lote
        INSERT INTO public.usage_logs (client_id, partner_id, user_id, app_id, batch_id, amount, cost_t0_base, price_t2_partner)
        VALUES (p_client_id, v_partner_id, p_user_id, p_app_id, v_batch_id, v_deducted_from_batch, p_cost_t0, p_price_t2);

        EXIT WHEN v_remaining_to_deduct <= 0;
    END LOOP;

    IF v_remaining_to_deduct > 0 THEN
        RAISE EXCEPTION 'Créditos insuficientes para el Cliente';
    END IF;

    -- 4. Actualizar saldos finales denormalizados para velocidad (9.1)
    UPDATE public.clients SET credits = (SELECT SUM(remaining_amount) FROM public.credit_batches WHERE client_id = p_client_id) WHERE id = p_client_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- MIGRACIÓN: Inteligencia Administrativa y Analytics (Sección 27)

-- 1. Función para calcular MRR (Monthly Recurring Revenue)
CREATE OR REPLACE FUNCTION public.get_platform_mrr()
RETURNS DECIMAL AS $$
BEGIN
    RETURN (
        SELECT COALESCE(SUM(o.price_monthly), 0)
        FROM public.subscriptions s
        JOIN public.offers o ON s.offer_id = o.id
        WHERE s.status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Función para calcular Churn Rate (Últimos 30 días)
CREATE OR REPLACE FUNCTION public.get_platform_churn_rate()
RETURNS FLOAT AS $$
DECLARE
    total_active FLOAT;
    total_canceled FLOAT;
BEGIN
    SELECT COUNT(*)::FLOAT INTO total_active FROM public.subscriptions WHERE status = 'active';
    SELECT COUNT(*)::FLOAT INTO total_canceled FROM public.subscriptions 
    WHERE status = 'canceled' AND canceled_at > now() - INTERVAL '30 days';
    
    IF total_active = 0 THEN RETURN 0; END IF;
    RETURN (total_canceled / (total_active + total_canceled)) * 100;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Métricas de Consumo vs Venta de Créditos (27.4)
CREATE OR REPLACE FUNCTION public.get_credit_economics()
RETURNS TABLE (
    total_sold BIGINT,
    total_consumed BIGINT,
    gross_revenue DECIMAL,
    estimated_cost FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COALESCE(SUM(credits_awarded), 0) FROM public.transactions WHERE type = 'payment')::BIGINT,
        (SELECT COUNT(*) FROM public.app_executions)::BIGINT, -- Simplificado a ejecuciones
        (SELECT COALESCE(SUM(amount), 0) FROM public.transactions WHERE type = 'payment'),
        (SELECT COALESCE(SUM(cost_credits), 0) * 0.01 FROM public.app_executions); -- Estimando costo base
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Ranking de Partners (27.5)
CREATE OR REPLACE FUNCTION public.get_partner_performance_leaderboard()
RETURNS TABLE (
    partner_name TEXT,
    client_count BIGINT,
    total_revenue DECIMAL,
    wallet_balance INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.name,
        COUNT(c.id),
        COALESCE(SUM(t.amount), 0),
        p.credits
    FROM public.partners p
    LEFT JOIN public.clients c ON c.partner_id = p.id
    LEFT JOIN public.transactions t ON t.partner_id = p.id
    GROUP BY p.id, p.name, p.credits
    ORDER BY total_revenue DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

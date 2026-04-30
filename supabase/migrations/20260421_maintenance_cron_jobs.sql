-- MIGRACIÓN: Mantenimiento Autónomo (Sección 21)

-- 21.1 Manejo de Suscripciones Expiradas
CREATE OR REPLACE FUNCTION public.maintenance_handle_expired_subscriptions()
RETURNS JSON AS $$
DECLARE
    affected_count INTEGER;
BEGIN
    -- 1. Marcar como expiradas las vencidas
    UPDATE public.subscriptions
    SET status = 'expired', 
        updated_at = now()
    WHERE status IN ('active', 'past_due', 'trialing')
      AND current_period_end < now()
      AND cancel_at_period_end = true;
      
    GET DIAGNOSTICS affected_count = ROW_COUNT;
    
    -- 2. Sincronizar user_status (SSOT)
    -- El trigger on_subscription_status_change ya hará la magia por nosotros
    
    RETURN json_build_object('expired_processed', affected_count);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 21.3 Limpieza de Skeletons (Checkout Sessions Huérfanos)
CREATE OR REPLACE FUNCTION public.maintenance_cleanup_skeletons()
RETURNS JSON AS $$
DECLARE
    affected_count INTEGER;
BEGIN
    -- Eliminamos registros de log/transacciones pendientes de más de 48 horas sin completar
    DELETE FROM public.transactions
    WHERE status = 'pending'
      AND created_at < now() - INTERVAL '48 hours';
      
    GET DIAGNOSTICS affected_count = ROW_COUNT;
    
    RETURN json_build_object('skeletons_removed', affected_count);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 21.4 Monitor de Wallet de Partners
CREATE OR REPLACE FUNCTION public.maintenance_monitor_partner_wallets()
RETURNS JSON AS $$
DECLARE
    p_id UUID;
    p_val FLOAT;
    total_alerts INTEGER := 0;
BEGIN
    FOR p_id, p_val IN SELECT id, credits FROM public.partners WHERE is_active = true LOOP
        IF p_val < 500 THEN
           -- Disparar notificación (13.2)
           INSERT INTO public.notifications (user_id, title, message, type)
           SELECT u.id, '⚠️ Saldo Partner Bajo', 'Tu billetera de partner está por debajo de 500 créditos. Recarga para evitar interrupciones.', 'billing'
           FROM public.users u WHERE u.partner_id = p_id AND u.role = 'partner'
           ON CONFLICT DO NOTHING;
           
           total_alerts := total_alerts + 1;
        END IF;
    END LOOP;
    
    RETURN json_build_object('partner_alerts_sent', total_alerts);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Procedimiento Maestro de Mantenimiento
CREATE OR REPLACE FUNCTION public.run_platform_maintenance()
RETURNS JSON AS $$
DECLARE
    result_sub JSON;
    result_skel JSON;
    result_part JSON;
BEGIN
    SELECT public.maintenance_handle_expired_subscriptions() INTO result_sub;
    SELECT public.maintenance_cleanup_skeletons() INTO result_skel;
    SELECT public.maintenance_monitor_partner_wallets() INTO result_part;
    
    RETURN json_build_object(
        'timestamp', now(),
        'subscriptions', result_sub,
        'cleanup', result_skel,
        'partners', result_part
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

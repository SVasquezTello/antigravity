-- Tabla para gestionar depósitos bancarios manuales
CREATE TABLE IF NOT EXISTS public.payment_vouchers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.offers(id),
    amount DECIMAL(10,2) NOT NULL,
    bank_name TEXT NOT NULL, -- BCP, BBVA, Yape, etc.
    voucher_url TEXT NOT NULL, -- URL de la imagen en Supabase Storage
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.payment_vouchers ENABLE ROW LEVEL SECURITY;

-- Políticas: El usuario puede ver sus propios vouchers
CREATE POLICY "Users can view own vouchers" ON public.payment_vouchers
    FOR SELECT USING (auth.uid() = user_id);

-- El usuario puede insertar sus propios vouchers
CREATE POLICY "Users can insert own vouchers" ON public.payment_vouchers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Solo administradores pueden actualizar (aprobar/rechazar)
CREATE POLICY "Admins can update vouchers" ON public.payment_vouchers
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')
        )
    );

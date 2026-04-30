-- MIGRACIÓN: Captura de Leads (Sección 23)

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  industry TEXT,
  message TEXT,
  source TEXT DEFAULT 'direct', -- 'direct', 'ads', 'referral', 'help_center'
  status TEXT DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'customer'
  metadata JSONB DEFAULT '{}', -- Para UTM tags y analytics
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Solo Admin puede ver los leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin manages all leads" ON public.leads FOR ALL TO authenticated USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'super_admin')
);

-- Public insert allowed
CREATE POLICY "Public can insert leads" ON public.leads FOR INSERT WITH CHECK (true);

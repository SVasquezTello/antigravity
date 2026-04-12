-- Migration for Micro-Apps Portal Foundation

-- Tables
CREATE TABLE IF NOT EXISTS public.micro_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_es TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_es TEXT,
  description_en TEXT,
  icon TEXT DEFAULT 'Sparkles',
  form_schema JSONB NOT NULL,
  autofill_presets JSONB DEFAULT '[]'::jsonb,
  prompt_template TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.app_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id UUID NOT NULL REFERENCES public.micro_apps(id) ON DELETE CASCADE,
  inputs JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'error')),
  result JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- RLS
ALTER TABLE public.micro_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on micro_apps" ON public.micro_apps
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can only see their own executions" ON public.app_executions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own executions" ON public.app_executions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.app_executions;

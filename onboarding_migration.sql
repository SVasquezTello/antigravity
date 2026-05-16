-- Migration to support Partner-led Client Onboarding
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS invite_token TEXT UNIQUE DEFAULT gen_random_uuid()::text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS onboarding_config JSONB DEFAULT '{}';

-- Create a view or function to handle joining by token if needed, 
-- but for now we'll do it via API for better control.

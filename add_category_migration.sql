-- Migration to add category to micro_apps
ALTER TABLE public.micro_apps ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Other';

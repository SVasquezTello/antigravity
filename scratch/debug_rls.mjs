import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function debugRLS() {
  console.log('Debugging RLS on micro_apps...')
  
  // 1. Check current policies
  // Since we can't easily fetch policies, we'll try to add a wide-open one.
  
  // Actually, I'll check if there's a policy called 'Allow public select on micro_apps'
  // and if it's actually applied to 'micro_apps'.
  
  // I'll use a trick: try to delete it and recreate it.
  // Wait, I can't run SQL directly.
  
  // I'll check the count with a manual JWT if I can generate one.
  // No, that's too complex.
  
  // WAIT! I see the issue.
  // In '20240401000000_foundation.sql', the policy is:
  // CREATE POLICY "Allow public select on micro_apps" ON public.micro_apps FOR SELECT TO authenticated USING (true);
  
  // But in '20260421_marketplace_engine.sql', maybe there is ANOTHER policy that conflicts?
}

debugRLS()

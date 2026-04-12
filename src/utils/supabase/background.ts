import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createBackgroundClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

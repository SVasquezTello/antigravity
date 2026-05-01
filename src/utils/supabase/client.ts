import { createBrowserClient } from '@supabase/ssr'

let client: any

export function createClient() {
  // Usamos valores dummy si faltan para que la UI no se rompa por completo
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key'

  if (typeof window === 'undefined') {
    return createBrowserClient(supabaseUrl, supabaseKey)
  }

  if (!client) {
    client = createBrowserClient(supabaseUrl, supabaseKey)
  }
  return client
}

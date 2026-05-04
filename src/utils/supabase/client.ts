import { createBrowserClient } from '@supabase/ssr'

let client: any

export function createClient() {
  // Usamos valores dummy si faltan para que la UI no se rompa por completo
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mzgabbgclbkcsbjkyklv.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MTg5ODcsImV4cCI6MjA5MDM5NDk4N30.SwH3DhGoVmeujanWf0iJXGhtPG0AaPk7EudcLwMID1o'

  if (typeof window === 'undefined') {
    return createBrowserClient(supabaseUrl, supabaseKey)
  }

  if (!client) {
    client = createBrowserClient(supabaseUrl, supabaseKey)
  }
  return client
}

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function verify() {
  console.log('--- VERIFYING SCHEMA ---')
  
  const { data: offers, error: oError } = await supabase.from('offers').select('count', { count: 'exact', head: true })
  console.log('Offers Table:', oError ? `Error: ${oError.message}` : 'OK (exists)')

  const { data: workspaces, error: wError } = await supabase.from('workspaces').select('count', { count: 'exact', head: true })
  console.log('Workspaces Table:', wError ? `Error: ${wError.message}` : 'OK (exists)')

  const { data: subs, error: sError } = await supabase.from('subscriptions').select('count', { count: 'exact', head: true })
  console.log('Subscriptions Table:', sError ? `Error: ${sError.message}` : 'OK (exists)')
}

verify()

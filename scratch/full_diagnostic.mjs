import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function diagnostic() {
  console.log('--- ANTIGRAVITY DIAGNOSTIC ---')
  console.log('Project:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  
  const tables = ['micro_apps', 'plan_apps', 'plans', 'users', 'notifications', 'app_executions', 'partners', 'clients']
  const rpcs = ['get_user_role', 'get_user_notifications', 'add_partner_funds']
  
  console.log('\nChecking Tables:')
  for (const table of tables) {
    const { error } = await supabase.from(table).select('count').limit(1)
    if (error) {
      console.log(`❌ ${table}: MISSING or Error (${error.code})`)
    } else {
      const { count } = await supabase.from(table).select('*', { count: 'exact', head: true })
      console.log(`✅ ${table}: EXISTS (${count} rows)`)
    }
  }
  
  console.log('\nChecking RPCs:')
  for (const rpc of rpcs) {
    const { error } = await supabase.rpc(rpc, { p_user_id: '00000000-0000-0000-0000-000000000000' })
    if (error && error.code === 'PGRST202') {
      console.log(`❌ ${rpc}: MISSING`)
    } else {
      console.log(`✅ ${rpc}: EXISTS (or reachable)`)
    }
  }
  
  console.log('\nChecking RLS on micro_apps:')
  const anonClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  const { count: anonCount, error: anonError } = await anonClient.from('micro_apps').select('*', { count: 'exact', head: true })
  console.log(`ANON User sees ${anonCount} apps.`)
  if (anonCount === 0) {
    console.log('⚠️ WARNING: RLS might be blocking the Marketplace for public/logged-in users!')
  }
}

diagnostic()

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function inspect() {
  console.log('--- PLANS TABLE ---')
  const { data: plans, error: pError } = await supabase.from('plans').select('*').limit(5)
  console.log(plans || pError)

  console.log('\n--- USERS TABLE ---')
  const { data: users, error: uError } = await supabase.from('users').select('*').limit(1)
  console.log(users || uError)
}

inspect()

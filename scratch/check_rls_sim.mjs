import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkPolicies() {
  console.log('Fetching policies for micro_apps...')
  // We can't fetch policies directly via the client easily, but we can try to do a select with the ANON key to simulate a user.
  
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  
  const { data, error, count } = await anonClient.from('micro_apps').select('*', { count: 'exact', head: true })
  console.log('ANON Select results:', { count, error })
  
  if (error) {
    console.error('ANON Select error:', error)
  }
}

checkPolicies()

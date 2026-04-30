import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function testQuota() {
  const userId = 'c27f6987-dbfb-4e5c-bb97-1c2ec5102ad5' // demo user
  console.log(`Checking quota for user ${userId}...`)
  
  const { data, error } = await supabase.rpc('check_user_quota', { p_user_id: userId })
  
  if (error) {
    console.error('Error calling RPC:', error)
  } else {
    console.log('Quota Check Result:', data)
  }
}

testQuota()

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkOffers() {
  const { data, error } = await supabase.from('offers').select('*')
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Offers count:', data.length)
  }
}

checkOffers()

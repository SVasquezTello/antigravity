import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkSchema() {
  const { data, count, error } = await supabase.from('clients').select('*', { count: 'exact', head: true })
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Total Apps:', count)
    const { data: sample } = await supabase.from('clients').select('*').limit(1)
    if (sample && sample[0]) {
      console.log('Columns:', Object.keys(sample[0]))
    }
  }
}

checkSchema()

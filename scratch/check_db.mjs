import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function check() {
  const { count, error } = await supabase
    .from('micro_apps')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Micro Apps Count:', count)
  }
}

check()

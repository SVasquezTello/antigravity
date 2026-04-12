import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function check() {
  const { count, error } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Error users:', error)
  } else {
    console.log('Users Count:', count)
  }

  const { data: apps } = await supabase.from('micro_apps').select('slug')
  console.log('Apps:', apps)
}

check()

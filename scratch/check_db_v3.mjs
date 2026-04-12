import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 10) + '...')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function check() {
  const resApps = await supabase.from('micro_apps').select('*', { count: 'exact' })
  if (resApps.error) {
    console.error('Apps Error:', resApps.error)
  } else {
    console.log('Apps Count:', resApps.count, 'Data:', resApps.data?.length)
  }

  const resUsers = await supabase.from('users').select('*', { count: 'exact' })
  if (resUsers.error) {
    console.error('Users Error:', resUsers.error)
  } else {
    console.log('Users Count:', resUsers.count, 'Data:', resUsers.data?.length)
  }
}

check()

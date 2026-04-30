import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkUsers() {
  const { data, error } = await supabase.from('users').select('*')
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Users found:', data.length)
    data.forEach(u => {
      console.log(`- ${u.email} (${u.role})`)
      console.log(`  Columns available in this row:`, Object.keys(u))
    })
  }
}

checkUsers()

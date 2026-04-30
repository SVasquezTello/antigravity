import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkUser() {
  console.log('Checking user gavanzadavid@gmail.com on current project...')
  const { data: user, error } = await supabase.from('users').select('*').eq('email', 'gavanzadavid@gmail.com').single()
  
  if (error) {
    console.error('Error fetching user:', error.message)
    return
  }
  
  console.log('User found:', {
    id: user.id,
    role: user.role,
    plan_id: user.plan_id
  })
  
  if (user.plan_id) {
    const { count } = await supabase.from('plan_apps').select('*', { count: 'exact', head: true }).eq('plan_id', user.plan_id)
    console.log(`Plan apps count for plan ${user.plan_id}: ${count}`)
  } else {
    console.log('User has NO plan_id assigned!')
  }
}

checkUser()

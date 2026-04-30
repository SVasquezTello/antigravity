import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkConsistency() {
  console.log('--- USER DATA ---')
  const { data: user } = await supabase.from('users').select('id, email, plan_id, role').eq('email', 'gavanzadavid@gmail.com').single()
  console.log('User:', user)

  console.log('\n--- ALL PLANS ---')
  const { data: plans } = await supabase.from('plans').select('id, slug, name_en')
  console.table(plans)

  if (user && user.plan_id) {
    const planExists = plans.some(p => p.id === user.plan_id)
    console.log(`\nDoes user plan_id exist in plans table? ${planExists ? '✅ YES' : '❌ NO'}`)
    
    const { count } = await supabase.from('plan_apps').select('*', { count: 'exact', head: true }).eq('plan_id', user.plan_id)
    console.log(`Apps linked to this plan (${user.plan_id}): ${count}`)
  }
}

checkConsistency()

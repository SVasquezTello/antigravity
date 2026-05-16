import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function check() {
  const { data: plans } = await supabase.from('plans').select('id, name_es')
  for (const plan of plans || []) {
    const { count } = await supabase
      .from('plan_apps')
      .select('*', { count: 'exact', head: true })
      .eq('plan_id', plan.id)
    console.log(`Plan: ${plan.name_es} (${plan.id}) -> Apps vinculadas: ${count}`)
  }
}

check()

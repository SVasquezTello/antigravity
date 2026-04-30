import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function check() {
  const { data: planApps, error: paError } = await supabase.from('plan_apps').select('plan_id, app_id').limit(10)
  console.log('Sample plan_apps:', planApps)
  
  if (planApps && planApps.length > 0) {
    const appId = planApps[0].app_id
    const { data: app, error: aError } = await supabase.from('micro_apps').select('slug').eq('id', appId).single()
    console.log(`Checking app ${appId}:`, { app, aError })
  }
}

check()

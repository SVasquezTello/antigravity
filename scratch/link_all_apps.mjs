import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function linkAllApps() {
  console.log('🔗 Linking all apps to the Professional Plan...')
  
  // 1. Get Professional Plan ID
  const { data: plan } = await supabase.from('plans').select('id').eq('slug', 'professional').single()
  if (!plan) {
    console.error('Professional plan not found!')
    return
  }
  
  const planId = plan.id
  
  // 2. Get all apps
  const { data: apps } = await supabase.from('micro_apps').select('id')
  console.log(`Total apps to link: ${apps?.length}`)
  
  // 3. Link them
  let linked = 0
  for (const app of (apps || [])) {
    const { error } = await supabase.from('plan_apps').upsert({
      plan_id: planId,
      app_id: app.id
    }, { onConflict: 'plan_id,app_id' })
    
    if (!error) linked++
  }
  
  console.log(`✅ Linked ${linked} apps to plan ${planId}`)
}

linkAllApps()

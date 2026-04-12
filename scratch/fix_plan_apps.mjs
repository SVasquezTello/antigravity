import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function fixPlanApps() {
  console.log('Fetching current micro_apps...')
  const { data: apps, error: appError } = await supabase.from('micro_apps').select('id, slug')
  
  if (appError) {
    console.error('Error fetching apps', appError)
    return
  }

  console.log(`Found ${apps.length} apps.`)

  console.log('Fetching plans...')
  const { data: plans, error: planError } = await supabase.from('plans').select('id, slug')
  
  if (planError) {
    console.error('Error fetching plans', planError)
    return
  }

  console.log('Clearing old plan_apps mappings...')
  await supabase.from('plan_apps').delete().neq('id', '00000000-0000-0000-0000-000000000000') // delete all

  const newMappings = []

  for (const plan of plans) {
    for (const app of apps) {
      // we can give all apps to the professional and intermediary plans
      // basic gets a subset, but let's give all to all for now to unblock
      newMappings.push({
        plan_id: plan.id,
        app_id: app.id
      })
    }
  }

  if (newMappings.length > 0) {
    console.log(`Inserting ${newMappings.length} mappings...`)
    const { error: insertError } = await supabase.from('plan_apps').insert(newMappings)
    if (insertError) {
      console.error('Error inserting mappings', insertError)
    } else {
      console.log('Successfully remapped all apps to all plans!')
    }
  }
}

fixPlanApps()

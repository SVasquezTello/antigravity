import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function linkAllApps() {
  console.log('🔗 Linking all apps to the Professional Plan...')
  
  // 1. Get Professional Offer ID
  const { data: offer } = await supabase.from('offers').select('id').eq('slug', 'professional').single()
  if (!offer) {
    console.error('Professional offer not found!')
    return
  }
  
  const offerId = offer.id
  
  // 2. Get all apps
  const { data: apps } = await supabase.from('micro_apps').select('id')
  console.log(`Total apps to link: ${apps?.length}`)
  
  // 3. Link them
  let linked = 0
  for (const app of (apps || [])) {
    const { error } = await supabase.from('offer_apps').upsert({
      offer_id: offerId,
      app_id: app.id
    }, { onConflict: 'offer_id,app_id' })
    
    if (!error) linked++
  }
  
  console.log(`✅ Linked ${linked} apps to offer ${offerId}`)
}

linkAllApps()

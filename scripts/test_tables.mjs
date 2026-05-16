import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function test() {
  console.log('🔍 Buscando tablas de relación...')
  
  const { data: plans, error: plansError } = await supabase.from('plan_apps').select('*').limit(1)
  if (plansError) {
    console.log('❌ plan_apps no encontrada:', plansError.message)
  } else {
    console.log('✅ plan_apps encontrada.')
  }

  const { data: offers, error: offersError } = await supabase.from('offer_apps').select('*').limit(1)
  if (offersError) {
    console.log('❌ offer_apps no encontrada:', offersError.message)
  } else {
    console.log('✅ offer_apps encontrada.')
  }
}

test()

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function test() {
  console.log('🔍 Diagnosticando base de datos...')
  
  // Probar lectura de offers
  const { data: offers, error: offersError } = await supabase.from('offers').select('*').limit(1)
  if (offersError) {
    console.error('❌ Error leyendo "offers":', offersError.message)
  } else {
    console.log('✅ Tabla "offers" accesible. Filas encontradas:', offers?.length)
    if (offers && offers.length > 0) {
      console.log('Columnas detectadas:', Object.keys(offers[0]))
    }
  }

  // Probar lectura de micro_apps
  const { data: apps, error: appsError } = await supabase.from('micro_apps').select('slug').limit(1)
  if (appsError) {
    console.error('❌ Error leyendo "micro_apps":', appsError.message)
  } else {
    console.log('✅ Tabla "micro_apps" accesible.')
  }
}

test()

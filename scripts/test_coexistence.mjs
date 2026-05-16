import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function test() {
  console.log('🔍 Verificando coexistencia de plans y offers...')
  
  const { data: plans } = await supabase.from('plans').select('slug').limit(5)
  console.log('Planes en "plans":', plans?.map(p => p.slug) || 'Tabla no accesible')

  const { data: offers } = await supabase.from('offers').select('slug').limit(5)
  console.log('Planes en "offers":', offers?.map(o => o.slug) || 'Tabla no accesible')
}

test()

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for migration-like power
)

async function runTest() {
  console.log('🚀 Iniciando Prueba de Marca Blanca Dinámica...\n')

  // 1. Crear el Socio de Prueba
  const partnerSlug = 'david-premium'
  const { data: partner, error: pError } = await supabase
    .from('partners')
    .upsert({
      slug: partnerSlug,
      name: "David's Premium Agency",
      primary_color: '#10B981', // Verde Esmeralda AI
    }, { onConflict: 'slug' })
    .select()
    .single()

  if (pError) {
    console.error('❌ Error creando partner:', pError)
    return
  }
  console.log(`✅ Socio creado: ${partner.name}`)

  // 2. Vincular al Usuario Admin (David)
  const userEmail = 'gavanzadavid@gmail.com'
  const { error: uError } = await supabase
    .from('users')
    .update({ partner_id: partner.id })
    .eq('email', userEmail)

  if (uError) {
    console.error('❌ Error vinculando usuario:', uError)
    return
  }
  console.log(`✅ Usuario ${userEmail} vinculado al nuevo socio.`)

  console.log('\n--- SIMULACIÓN DE MANIFEST.TS ---')
  console.log('Si entraras ahora mismo a la aplicación con tu cuenta:')
  console.log(`📱 Nombre PWA: ${partner.name} | MicroApps`)
  console.log(`🎨 Color Tema: ${partner.primary_color}`)
  console.log(`🖼️ Icono: ${partner.logo_url}`)
  console.log('---------------------------------\n')
  
  console.log('✅ Prueba completada con éxito. Ahora tu sesión "verá" la marca personalizada.')
}

runTest()

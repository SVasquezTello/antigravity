import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🚀 Seeding Richard Branson / PR Stunts App...')

  const app = {
    slug: 'branson-pr-ai',
    name_en: 'PR Stunt & Brand Architect',
    name_es: 'Arquitecto de Marca & PR Stunts',
    description_en: 'Generate crazy, high-impact PR stunts and asymmetric risk strategies like Richard Branson.',
    description_es: 'Genera locuras publicitarias (PR Stunts) para que la prensa hable de ti gratis, y evalúa el Riesgo Asimétrico de tus proyectos al estilo Virgin.',
    icon: 'Megaphone',
    form_schema: [
      { id: 'empresa', type: 'text', label_es: 'A qué se dedica tu empresa', required: true },
      { id: 'aburrido', type: 'text', label_es: '¿Qué es lo más "aburrido" o corporativo de tu industria?', required: true },
      { id: 'lanzamiento', type: 'text', label_es: 'El producto o evento que quieres lanzar', required: true }
    ],
    prompt_template: 'Actúa como Richard Branson, fundador de Virgin. Mi empresa hace: {{empresa}}. Lo más aburrido y corporativo de mi industria es: {{aburrido}}. Quiero lanzar: {{lanzamiento}}.\nEres el maestro de las Relaciones Públicas gratuitas. Diseña 3 ideas de "PR Stunts" (Acrobacias publicitarias) completamente excéntricas, divertidas o desafiantes que rompan con lo aburrido de mi industria y atraigan a todos los medios sin gastar en agencias de publicidad. Además, para cada idea, dime cómo proteger el "Downside" (Riesgo Asimétrico) por si sale mal.'
  }

  const { data: offer } = await supabase.from('offers').select('id').eq('slug', 'professional').single()
  
  if (!offer) {
    console.error('Professional offer not found.')
    return
  }

  const { data: newApp, error } = await supabase.from('micro_apps').upsert(app, { onConflict: 'slug' }).select('id').single()
  if (error) {
    console.error(`Error inserting ${app.slug}:`, error.message)
    return
  }
  if (newApp) {
    await supabase.from('offer_apps').upsert({ offer_id: offer.id, app_id: newApp.id }, { onConflict: 'offer_id,app_id' })
  }

  console.log('✅ Branson PR Stunts App Seeded and Linked to Pro Plan.')
}

run()

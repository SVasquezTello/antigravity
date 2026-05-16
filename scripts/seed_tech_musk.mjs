import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🚀 Seeding Elon Musk / First Principles App...')

  const app = {
    slug: 'musk-first-principles',
    name_en: 'First Principles Architect',
    name_es: 'Arquitecto First Principles',
    description_en: 'Break down complex problems into fundamental truths and build disruptive solutions.',
    description_es: 'Desglosa problemas complejos en verdades fundamentales para construir soluciones disruptivas al estilo Elon Musk.',
    icon: 'Brain',
    form_schema: [
      { id: 'problema', type: 'textarea', label_es: 'El problema u obstáculo', required: true },
      { id: 'suposicion', type: 'text', label_es: 'La creencia popular (Ej: Los cohetes son desechables)', required: true }
    ],
    prompt_template: 'Actúa como Elon Musk utilizando el marco de "First Principles Thinking". Tengo el siguiente problema: {{problema}}. La creencia popular es que: {{suposicion}}.\nDestruye esta suposición desglosándola hasta sus verdades fundamentales (Física y Matemáticas básicas). Luego, reconstrúyela desde cero proponiendo una solución radicalmente innovadora y eficiente que nadie más en la industria esté viendo.'
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

  console.log('✅ Musk First Principles App Seeded and Linked to Pro Plan.')
}

run()

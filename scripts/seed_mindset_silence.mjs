import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🚀 Seeding Mindset / Wealth In Silence App...')

  const app = {
    slug: 'stoic-focus-ai',
    name_en: 'Silent Builder Auditor',
    name_es: 'Auditor de Silencio y Enfoque',
    description_en: 'Audit your social circle and daily habits to eliminate noise and build wealth in silence.',
    description_es: 'Audita tu entorno, elimina el ruido social y crea un protocolo de trabajo profundo para construir tu imperio en silencio.',
    icon: 'VolumeX',
    form_schema: [
      { id: 'distraccion', type: 'text', label_es: 'Principal distracción actual (Ej: Redes Sociales, Amigos que se quejan)', required: true },
      { id: 'proyecto', type: 'text', label_es: 'Proyecto que estás construyendo en secreto', required: true },
      { id: 'habilidad', type: 'text', label_es: 'Habilidad en la que vas a invertir', required: true }
    ],
    prompt_template: 'Actúa como un mentor de mentalidad y estoicismo. Mi mayor distracción actual es: {{distraccion}}. Estoy tratando de construir en silencio el siguiente proyecto: {{proyecto}}, e invirtiendo en la habilidad: {{habilidad}}.\nGenera un "Protocolo de Aislamiento Estratégico". Debes:\n1. Darme una estrategia fría y táctica para cortar o minimizar mi distracción sin dar explicaciones innecesarias.\n2. Diseñar una rutina de trabajo profundo para avanzar en mi proyecto.\n3. Explicarme por qué debo mantener esto en secreto hasta que los resultados sean innegables.'
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

  console.log('✅ Wealth In Silence App Seeded and Linked to Pro Plan.')
}

run()

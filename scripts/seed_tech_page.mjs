import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🚀 Seeding Larry Page / Moonshot App...')

  const app = {
    slug: 'page-moonshot-ai',
    name_en: '10X Moonshot Evaluator',
    name_es: 'Evaluador Moonshot 10X',
    description_en: 'Force your startup idea to be 10x better, not just 10% better, using Larry Page\'s mental models.',
    description_es: 'Somete tu idea de negocio a la prueba de fuego de Google: cómo hacerla 10 VECES mejor que la competencia en lugar de solo un 10%.',
    icon: 'Rocket',
    form_schema: [
      { id: 'idea_actual', type: 'text', label_es: 'Tu idea de negocio / producto actual', required: true },
      { id: 'competencia', type: 'text', label_es: 'Qué hace la competencia (El estándar actual)', required: true },
      { id: 'mejora_10', type: 'text', label_es: 'Tu mejora del 10% (Ej: Es un poco más rápido, tiene mejor diseño)', required: true }
    ],
    prompt_template: 'Actúa como Larry Page, fundador de Google y Alphabet. Te presento mi producto: {{idea_actual}}. La competencia actualmente hace esto: {{competencia}}. Mi plan inicial era hacer una mejora incremental (10%): {{mejora_10}}.\nDestruye mi mejora del 10%. Explícame por qué las mejoras incrementales son una pérdida de tiempo. Luego, aplícale el "Pensamiento 10X (First Principles)" y rediseña mi producto para que sea 10 VECES (1000%) mejor, más barato o más rápido que la competencia. Dame la hoja de ruta del "Moonshot" para lograrlo.'
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

  console.log('✅ Moonshot 10X App Seeded and Linked to Pro Plan.')
}

run()

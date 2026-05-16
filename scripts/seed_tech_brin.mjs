import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🚀 Seeding Sergey Brin / Acqui-hire App...')

  const app = {
    slug: 'brin-acquihire-ai',
    name_en: 'Acqui-hire Strategist',
    name_es: 'Estratega Acqui-hire AI',
    description_en: 'Evaluate acquiring small competitors just to absorb their talent, mimicking Google\'s early M&A strategy.',
    description_es: 'Aplica la estrategia de Google de "Adquisición-Contratación": Evalúa si debes comprar a un pequeño competidor solo para absorber a su equipo de talento.',
    icon: 'Briefcase',
    form_schema: [
      { id: 'competidor', type: 'text', label_es: 'Nombre / Tipo de pequeña empresa a adquirir', required: true },
      { id: 'talento', type: 'text', label_es: 'Habilidad técnica clave de su equipo (Ej: Son buenos en IA, Venden bien)', required: true },
      { id: 'costo', type: 'number', label_es: 'Costo estimado de adquisición ($)', required: true }
    ],
    prompt_template: 'Actúa como Sergey Brin, co-fundador de Google. Estoy evaluando una estrategia de "Acqui-hire" (Adquisición-Contratación). Quiero comprar a la empresa {{competidor}}, que costaría aproximadamente ${{costo}}. No me importan sus ingresos, me importa el talento de su equipo que es experto en: {{talento}}.\nCrea un "Term Sheet de Adquisición-Contratación". Analiza si el costo de comprar la empresa es menor al costo de cazar a ingenieros de ese nivel individualmente. Propón una estructura para retener a ese talento post-compra (Vesting de acciones) y alinearlos con la filosofía de 1 dólar de salario + equidad masiva.'
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

  console.log('✅ Brin Acqui-hire App Seeded and Linked to Pro Plan.')
}

run()

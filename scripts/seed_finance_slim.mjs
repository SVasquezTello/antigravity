import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🚀 Seeding Carlos Slim / Mass Market App...')

  const app = {
    slug: 'slim-crisis-ai',
    name_en: 'Mass Market & Crisis Strategist',
    name_es: 'Estratega de Mercado Masivo & Crisis',
    description_en: 'Turn your expensive, low-volume service into a prepaid, high-volume mass market product using Carlos Slim\'s Telcel framework.',
    description_es: 'Aplica el modelo Telcel: Transforma tu servicio de alto costo (que pocos pueden pagar) en un producto "Prepago" de volumen masivo.',
    icon: 'Signal',
    form_schema: [
      { id: 'servicio', type: 'text', label_es: 'El servicio o producto de alto ticket que vendes actualmente', required: true },
      { id: 'precio', type: 'number', label_es: 'Precio actual ($)', required: true },
      { id: 'cuello_botella', type: 'text', label_es: '¿Por qué la gente de bajos recursos o clase media no te puede comprar?', required: true }
    ],
    prompt_template: 'Actúa como Carlos Slim. Mi empresa actualmente vende el siguiente servicio: {{servicio}} a un precio de ${{precio}}. El gran problema por el que las masas no pueden comprarlo es: {{cuello_botella}}.\nAplica la estrategia de "Tarjetas de Prepago" que usaste en Telcel. Destruye mi modelo elitista actual. Rediseña mi oferta para que el Volumen sea más importante que el Precio. Divídelo en micro-transacciones (prepago) que sean "tan fáciles de comprar como un dulce" en cualquier esquina. Enséñame a optimizar mis costos operativos ("Ingeniería Lineal") para que este nuevo modelo masivo sea ridículamente rentable.'
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

  console.log('✅ Carlos Slim App Seeded and Linked to Pro Plan.')
}

run()

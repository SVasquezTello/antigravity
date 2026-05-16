import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🚀 Seeding Taylor Swift / Brand Eras App...')

  const app = {
    slug: 'swift-brand-ai',
    name_en: 'Brand Era & IP Strategist',
    name_es: 'Diseñador de "Eras" Comerciales',
    description_en: 'Avoid market obsolescence by designing a new aesthetic and narrative "Era" for your brand, just like Taylor Swift.',
    description_es: 'Evita la obsolescencia. Diseña una nueva "Era" estética y narrativa para tu marca que enganche a tu audiencia como si fueran fans de Taylor Swift.',
    icon: 'Music',
    form_schema: [
      { id: 'negocio', type: 'text', label_es: 'Tu negocio y cómo te has estado presentando hasta ahora', required: true },
      { id: 'problema', type: 'text', label_es: '¿Por qué sientes que tu audiencia se está aburriendo o estancando?', required: true },
      { id: 'emocion', type: 'text', label_es: '¿Qué emoción radicalmente diferente quieres transmitir ahora? (ej: Rebeldía, Lujo, Cercanía)', required: true }
    ],
    prompt_template: 'Actúa como el estratega maestro detrás de Taylor Swift. Mi negocio es: {{negocio}}. El problema es que siento que me estoy estancando por esto: {{problema}}. Ahora quiero proyectar esta nueva emoción: {{emocion}}.\nTu trabajo es diseñar el lanzamiento de mi nueva "Era". Dime cómo destruir mi antigua imagen corporativa de forma dramática y controlada. Dame una estética, un tono de "copywriting" emocional (usando nombres o detalles ultra-específicos para generar conexión parasocial), y una estrategia para que mi audiencia espere este cambio como si fuera el lanzamiento del álbum del año. Además, dame una regla estricta sobre cómo proteger la Propiedad Intelectual de mi nueva Era.'
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

  console.log('✅ Taylor Swift App Seeded and Linked to Pro Plan.')
}

run()

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🚀 Seeding Oprah Winfrey / Emotional Brand App...')

  const app = {
    slug: 'oprah-media-ai',
    name_en: 'Emotional Brand & Community Auditor',
    name_es: 'Auditor de Marca Emocional y Comunidad',
    description_en: 'Apply the "Oprah Effect" to your brand: transform transactional customers into a loyal, deeply connected community using empathy and vulnerability.',
    description_es: 'Transforma a tus clientes fríos en una comunidad devota. Aplica el "Efecto Oprah" usando la empatía, la vulnerabilidad estratégica y la curaduría para construir autoridad masiva.',
    icon: 'Heart',
    form_schema: [
      { id: 'marca', type: 'text', label_es: 'El nombre de tu marca personal o empresa', required: true },
      { id: 'comunicacion', type: 'textarea', label_es: '¿Cómo te comunicas actualmente con tus clientes? (Ej: Solo les envío ofertas de venta)', required: true },
      { id: 'vulnerabilidad', type: 'text', label_es: '¿Cuál es el fracaso o la historia difícil que te llevó a crear este negocio?', required: true }
    ],
    prompt_template: 'Actúa como Oprah Winfrey, magnate de los medios y experta en inteligencia emocional. Mi marca se llama: {{marca}}. Actualmente me comunico con mi audiencia así: {{comunicacion}}. La historia difícil detrás de mi marca es: {{vulnerabilidad}}.\nTu trabajo es destruir mi comunicación "transaccional" y aburrida. Enséñame a usar el "Principio de la Intención". Dime exactamente cómo usar mi historia difícil (vulnerabilidad estratégica) para crear un vínculo emocional irrompible con mi audiencia. Luego, diséñame un plan para aplicar el "Efecto Kingmaker": ¿cómo puedo empezar a recomendar y elevar a otros en mi industria para construir mi propia autoridad masiva (como el Club de Lectura de Oprah)?'
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

  console.log('✅ Oprah Winfrey App Seeded and Linked to Pro Plan.')
}

run()

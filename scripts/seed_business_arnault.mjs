import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🚀 Seeding Bernard Arnault / Luxury Desire App...')

  const app = {
    slug: 'arnault-luxury-ai',
    name_en: 'Luxury, Hype & Desire Architect',
    name_es: 'Arquitecto de Lujo y Deseo',
    description_en: 'Apply LVMH strategies to your brand. Stop competing on price and start engineering irrational desire, exclusivity, and hype.',
    description_es: 'Deja de competir por precio y empieza a vender exclusividad. Aplica las estrategias de Louis Vuitton y Dior para crear un producto "Estrella" que genere deseo irracional.',
    icon: 'Gem',
    form_schema: [
      { id: 'producto', type: 'text', label_es: '¿Cuál es tu producto/servicio principal?', required: true },
      { id: 'precio', type: 'text', label_es: '¿Cómo compites actualmente en tu mercado? (Ej: Doy descuentos, soy el más barato, soy rápido)', required: true },
      { id: 'innovacion', type: 'text', label_es: '¿Qué porcentaje de tu tiempo o dinero gastas intentando lanzar cosas nuevas?', required: true }
    ],
    prompt_template: 'Actúa como Bernard Arnault, el "Lobo de Cachemira" y dueño de LVMH. Mi producto es: {{producto}}. Actualmente compito así: {{precio}}. Y gasto esto en innovación: {{innovacion}}.\nAudita mi negocio con frialdad corporativa. Destruye mi estrategia de competir por precio o dar descuentos (el lujo no tiene descuentos). Rediseña mi negocio usando tu regla del 15/85: dime cómo crear una línea de "Hype" súper limitada y costosa (el 15%) para generar deseo masivo, que luego empuje las ventas de mi línea principal (el 85%). Finalmente, dime cómo aplicar la paradoja de ser "Atemporal" y "Moderno" a mi marca para que nunca pase de moda.'
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

  console.log('✅ Bernard Arnault App Seeded and Linked to Pro Plan.')
}

run()

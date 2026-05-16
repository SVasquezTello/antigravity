import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🚀 Seeding Amancio Ortega / Fast Operations App...')

  const app = {
    slug: 'ortega-supply-ai',
    name_en: 'Vertical Integration & Speed Auditor',
    name_es: 'Auditor de Integración Vertical y Agilidad',
    description_en: 'Apply Zara\'s Fast Fashion model to your business: eliminate bottlenecks and integrate vertically to go from idea to market in 14 days.',
    description_es: 'Aplica el modelo operativo de Zara (Inditex) a tu negocio. Reduce tus tiempos de lanzamiento de meses a solo 2 semanas eliminando intermediarios y cuellos de botella.',
    icon: 'RefreshCw',
    form_schema: [
      { id: 'producto', type: 'text', label_es: '¿Qué producto o servicio vendes?', required: true },
      { id: 'tiempo', type: 'number', label_es: '¿Cuántos días tardas desde que lo diseñas hasta que se lo entregas al cliente final?', required: true },
      { id: 'terceros', type: 'text', label_es: '¿Qué partes de tu proceso dependen de otras empresas (Ej: Envío, Manufactura, Diseño)?', required: true }
    ],
    prompt_template: 'Actúa como Amancio Ortega, fundador de Inditex y Zara. Yo vendo: {{producto}}. Actualmente me toma {{tiempo}} días llevarlo desde el diseño hasta el cliente. Dependo de estos terceros: {{terceros}}.\nEsto es inaceptable. Como experto en "Fast Fashion" y agilidad operativa, destruye mi cadena de suministro actual. Diseña un plan de "Integración Vertical" para que yo asuma el control de esas piezas clave. Rediseña mi proceso para reducir el tiempo de salida al mercado (Time-to-Market) a menos de 14 días. Explícame por qué el inventario almacenado es mi peor enemigo y cómo rotarlo constantemente.'
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

  console.log('✅ Amancio Ortega App Seeded and Linked to Pro Plan.')
}

run()

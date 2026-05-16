import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🚀 Seeding The Outsiders / Finance App...')

  const app = {
    slug: 'outsiders-capital-allocator',
    name_en: 'Capital Allocator Pro',
    name_es: 'Simulador de Capital (Outsiders)',
    description_en: 'Evaluate your business cash flow using the capital allocation models of the world\'s best CEOs.',
    description_es: 'Toma decisiones de inversión como Warren Buffett o John Malone: evalúa si recomprar acciones, pagar deuda, o adquirir competidores.',
    icon: 'BarChart3',
    form_schema: [
      { id: 'caja_disponible', type: 'number', label_es: 'Flujo de Caja Libre Disponible ($)', required: true },
      { id: 'tasa_retorno', type: 'number', label_es: 'Tasa mínima de retorno esperada (Hurdle Rate %)', required: true },
      { id: 'opciones', type: 'text', label_es: 'Opciones en la mesa (Ej: Comprar local nuevo, Pagar préstamo al 8%, Repartir dividendos)', required: true }
    ],
    prompt_template: 'Actúa como Warren Buffett y John Malone (Los "Outsiders"). Soy el CEO de una empresa. Tengo ${{caja_disponible}} en Flujo de Caja Libre. Mi "Hurdle Rate" (Tasa mínima de retorno exigida) es del {{tasa_retorno}}%. Mis opciones actuales sobre qué hacer con el dinero son: {{opciones}}.\nGenera un análisis estricto de Asignación de Capital descartando las opciones que destruyen valor (que no superan el Hurdle Rate o son ineficientes fiscalmente, como los dividendos frente a recompras o deuda barata). Recomienda el camino exacto que maximice el valor a largo plazo de la compañía.'
  }

  const { data: offer } = await supabase.from('offers').select('id').eq('slug', 'business').single()
  
  if (!offer) {
    console.error('Business offer not found. Falling back to professional...')
    const { data: fallbackOffer } = await supabase.from('offers').select('id').eq('slug', 'professional').single()
    if (fallbackOffer) {
      const { data: newApp, error } = await supabase.from('micro_apps').upsert(app, { onConflict: 'slug' }).select('id').single()
      if (newApp) {
        await supabase.from('offer_apps').upsert({ offer_id: fallbackOffer.id, app_id: newApp.id }, { onConflict: 'offer_id,app_id' })
      }
    }
    console.log('✅ Outsiders App Seeded and Linked to Pro Plan (Fallback).')
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

  console.log('✅ Outsiders App Seeded and Linked to Business Plan.')
}

run()

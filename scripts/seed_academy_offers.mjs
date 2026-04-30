import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function seed() {
  console.log('🚀 Sembrando Ofertas para Academias...')

  const offers = [
    {
      name: 'Starter Academy',
      slug: 'starter-academy',
      type: 'client_plan',
      description: 'Ideal para educadores independientes y pequeñas academias físicas que inician su salto al mundo digital.',
      features: [
        'Acceso a 50 Micro-Apps de Educación',
        'Generador de Sílabos Express',
        'Guiones de Venta por WhatsApp',
        'Soporte por Email'
      ],
      prices: [
        { type: 'monthly', amount: 47, currency: 'USD', stripe_id: 'price_starter_monthly' },
        { type: 'annual', amount: 450, currency: 'USD', stripe_id: 'price_starter_annual' }
      ],
      grants: { credits: 200, tags: ['starter'] }
    },
    {
      name: 'Pro Academy',
      slug: 'professional', // Use the slug 'professional' to match existing logic
      type: 'client_plan',
      description: 'Perfecto para academias en crecimiento que operan con varios asesores y necesitan automatización total.',
      features: [
        'Acceso a TODAS las Micro-Apps (269+)',
        'Estructurador de Cursos Avanzado',
        'Dashboard de ROI Financiero',
        '3 Staff Members incluidos'
      ],
      prices: [
        { type: 'monthly', amount: 67, currency: 'USD', stripe_id: 'price_pro_monthly' },
        { type: 'annual', amount: 640, currency: 'USD', stripe_id: 'price_pro_annual' }
      ],
      grants: { credits: 1000, tags: ['pro', 'premium'] }
    },
    {
      name: 'Enterprise Academy',
      slug: 'enterprise',
      type: 'client_plan',
      description: 'Para redes de academias y centros de idiomas que buscan el máximo control y personalización operativa.',
      features: [
        'Infraestructura de Marca Blanca',
        'Gestión de Sedes y Equipos Ilimitada',
        'Consultoría de Estrategia Digital',
        'Soporte Prioritario 24/7'
      ],
      prices: [
        { type: 'monthly', amount: 127, currency: 'USD', stripe_id: 'price_ent_monthly' },
        { type: 'annual', amount: 1200, currency: 'USD', stripe_id: 'price_ent_annual' }
      ],
      grants: { credits: 5000, tags: ['enterprise', 'whitelabel'] }
    }
  ]

  for (const offer of offers) {
    console.log(`- Insertando oferta: ${offer.name}`)
    const { error } = await supabase.from('offers').upsert(offer, { onConflict: 'slug' })
    if (error) console.error(`Error en ${offer.slug}:`, error.message)
  }

  console.log('✅ Ofertas de Academias configuradas.')
}

seed()

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🚀 Seeding Jack Ma / E-commerce App...')

  const app = {
    slug: 'jackma-sourcing-ai',
    name_en: 'Sourcing Negotiator',
    name_es: 'Negociador B2B',
    description_en: 'Generate precise negotiation scripts to deal with Asian suppliers on Alibaba.',
    description_es: 'Genera guiones de negociación precisos para tratar con proveedores asiáticos en Alibaba y conseguir los mejores márgenes.',
    icon: 'ShoppingCart',
    form_schema: [
      { id: 'producto', type: 'text', label_es: 'Producto a importar (Ej: Relojes Inteligentes)', required: true },
      { id: 'cantidad', type: 'number', label_es: 'Cantidad Inicial (MOQ)', required: true },
      { id: 'precio_cotizado', type: 'number', label_es: 'Precio cotizado por unidad ($)', required: true },
      { id: 'precio_objetivo', type: 'number', label_es: 'Tu precio objetivo ($)', required: true }
    ],
    prompt_template: 'Eres un experto negociador internacional al estilo Jack Ma. Quiero importar {{cantidad}} unidades de "{{producto}}". El proveedor chino en Alibaba me cotizó a ${{precio_cotizado}}, pero mi precio objetivo es ${{precio_objetivo}}.\nEscribe un mensaje de negociación estructurado, directo y respetuoso (considerando la cultura de negocios china: Guanxi). Debes:\n1. Agradecer la cotización.\n2. Mencionar que tienes otras fábricas compitiendo por la orden.\n3. Proponer el precio objetivo justificando una relación a largo plazo y grandes volúmenes futuros.\n4. Pedir términos de envío (FOB/EXW) y tiempos de entrega.'
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

  console.log('✅ Jack Ma Sourcing App Seeded and Linked to Pro Plan.')
}

run()

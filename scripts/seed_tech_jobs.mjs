import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🚀 Seeding Steve Jobs / Product App...')

  const app = {
    slug: 'jobs-product-ai',
    name_en: 'Product Purist Auditor',
    name_es: 'Auditor de Producto (Estilo Jobs)',
    description_en: 'Audit your product to eliminate unnecessary features and focus on the intersection of art and technology.',
    description_es: 'Somete tu producto o servicio a la crítica de Steve Jobs: elimina lo innecesario y enfócate en la fusión perfecta entre diseño y tecnología.',
    icon: 'Apple',
    form_schema: [
      { id: 'producto', type: 'text', label_es: 'Describe tu producto o servicio principal', required: true },
      { id: 'features', type: 'textarea', label_es: 'Lista todas las funciones/features que tiene', required: true },
      { id: 'problema', type: 'text', label_es: '¿Por qué la gente no lo está comprando o entendiendo?', required: true }
    ],
    prompt_template: 'Actúa como Steve Jobs en su regreso a Apple en 1997. Te presento mi producto: {{producto}}. Actualmente tiene todas estas funciones: {{features}}, pero la gente no lo compra o no lo entiende por esto: {{problema}}.\nDestruye mi enfoque actual. Eres un purista del diseño. Aplica la "Matriz de 4 Cuadrantes" y oblígame a decir NO. Dime exactamente qué funciones (features) debo ELIMINAR para hacerlo absurdamente simple e intuitivo. Luego, rediseña el núcleo del producto para que esté en la intersección perfecta entre la Tecnología y las Humanidades (Arte).'
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

  console.log('✅ Jobs Product App Seeded and Linked to Pro Plan.')
}

run()

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🚀 Seeding Cristiano Ronaldo / High Performance App...')

  const app = {
    slug: 'ronaldo-performance-ai',
    name_en: 'High Performance & Brand Auditor',
    name_es: 'Auditor de Alto Rendimiento y Marca',
    description_en: 'Audit your daily routine, discipline, and personal brand capital to match the elite standards of Cristiano Ronaldo.',
    description_es: 'Audita tu rutina diaria, tu nivel de obsesión y tu marca personal. Te obligará a eliminar excusas y a operar con estándares de élite.',
    icon: 'Activity',
    form_schema: [
      { id: 'rutina', type: 'textarea', label_es: 'Describe tu rutina diaria promedio (ej: me levanto, trabajo 8h, veo Netflix)', required: true },
      { id: 'talento', type: 'text', label_es: '¿En qué área confías demasiado en tu "talento" y descuidas la disciplina?', required: true },
      { id: 'marca', type: 'text', label_es: '¿Cómo estás monetizando tu nombre/marca personal hoy?', required: true }
    ],
    prompt_template: 'Actúa como Cristiano Ronaldo, el atleta más disciplinado y rentable de la historia. Mi rutina actual es: {{rutina}}. Confío en mi talento en esta área: {{talento}}. Y así monetizo mi marca: {{marca}}.\nAudita mi vida con extrema dureza y arrogancia constructiva. Destruye mis excusas. Dime por qué mi rutina es de "amateur" y rediseña un plan de "Entrenamiento Invisible" (lo que debo hacer cuando nadie me ve). Finalmente, analízame como empresa: cómo dejo de ser solo un "empleado/jugador" y convierto mi nombre en una franquicia global como CR7.'
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

  console.log('✅ Cristiano Ronaldo App Seeded and Linked to Pro Plan.')
}

run()

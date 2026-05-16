import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🚀 Seeding Bill Gates / Delegation App...')

  const app = {
    slug: 'gates-delegation-ai',
    name_en: 'Delegation Engine',
    name_es: 'Motor de Delegación AI',
    description_en: 'Transition from Founder to Executive by delegating complex technical and operational tasks.',
    description_es: 'Transiciona de Fundador Técnico a Ejecutivo delegando tareas complejas con métricas de rendimiento y protocolos de revisión.',
    icon: 'Users',
    form_schema: [
      { id: 'tarea', type: 'text', label_es: 'Tarea que hoy haces tú (Ej: Revisar el código de todos, Contestar quejas)', required: true },
      { id: 'riesgo', type: 'text', label_es: 'Tu mayor miedo al delegar esto', required: true },
      { id: 'perfil', type: 'text', label_es: 'Perfil a quien se lo vas a delegar (Ej: Gerente Junior, Asistente Virtual)', required: true }
    ],
    prompt_template: 'Actúa como Bill Gates en la etapa de escalamiento de Microsoft. Yo, como fundador, estoy haciendo actualmente: {{tarea}}. Mi mayor miedo al soltar esto es: {{riesgo}}. Se lo voy a delegar a: {{perfil}}.\nCrea un "Marco de Delegación Ejecutiva" que incluya:\n1. El protocolo de transición paso a paso.\n2. Qué KPIs (indicadores) medir para garantizar que la calidad no baje.\n3. Los límites de autonomía (qué decisiones puede tomar esa persona y cuáles deben ser escaladas a mí).\n4. El ciclo de retroalimentación de "Revisión de Gerentes" en lugar de hacer micromanagement.'
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

  console.log('✅ Bill Gates Delegation App Seeded and Linked to Pro Plan.')
}

run()

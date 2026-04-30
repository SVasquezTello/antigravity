import { createClient } from '@supabase/supabase-js'
import { callGemini } from '../src/lib/gemini.mjs'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const USER_ID = 'f5b8cbde-5471-4da5-8e5c-fbbcfdbd4773' // gavanzadavid@gmail.com

async function forge() {
  console.log('⚒️ Forjando Historial de Inteligencia...')

  const samples = [
    { slug: 'linkedin-gen', inputs: { topic: 'IA en Real Estate 2026', style: 'Profesional' } },
    { slug: 'decide-dental', inputs: { sales_report: '$40k rev', problem: 'No retorno', area: 'Marketing', context: 'Zona centro' } },
    { slug: 'brief-propiedad-pro', inputs: { detalles: 'Penthouse 400m2, Vista al mar', avatar: 'Inversionista extranjero' } },
    { slug: 'scope-agency-pro', inputs: { servicio: 'Branding Completo', monto: '$12,000', entregables: 'Logo, Manual, 20 Posts' } },
    { slug: 'reactiva-prospecto-inmo', inputs: { propiedad: 'Villa Sol', interes: 'Alto', objecion: 'Distancia al centro' } }
  ]

  for (const sample of samples) {
    const { data: app } = await supabase.from('micro_apps').select('*').eq('slug', sample.slug).single()
    if (!app) continue

    console.log(`> Generando para: ${sample.slug}`)
    let prompt = app.prompt_template
    for (const [k, v] of Object.entries(sample.inputs)) {
      prompt = prompt.replace(new RegExp(`{{${k}}}`, 'g'), v)
    }

    try {
      const result = await callGemini(prompt)
      await supabase.from('app_executions').insert({
        user_id: USER_ID,
        app_id: app.id,
        app_slug: app.slug,
        inputs: sample.inputs,
        status: 'completed',
        result: { markdown: result },
        metadata: { forged: true }
      })
      console.log(`✅ Creado historial para ${sample.slug}`)
    } catch (e) {
      console.error(`❌ Error en ${sample.slug}: ${e.message}`)
    }
  }

  console.log('✨ Misión cumplida. Historial forjado.')
}

forge()

import { createClient } from '@supabase/supabase-js'
import { callGemini } from '../src/lib/gemini.mjs'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const USER_ID = 'f5b8cbde-5471-4da5-8e5c-fbbcfdbd4773'

async function forge() {
  console.log('⚒️ Forjando Contenido Final para Agencias e Inmobiliaria...')

  const samples = [
    { slug: 'scope-agency', inputs: { cliente: 'Global Bank Inc', proyecto: 'Social Media Ads', entregables: '20 posts, 3 videos, gestión de comentarios', presupuesto: '$3,500/mes' } },
    { slug: 'expert-sales', inputs: { mentoría: 'Scale 7 Figures Mastermind', dolor: 'Atrapado vendiendo horas por poco dinero', objeción: 'Tengo que consultarlo con mi socio' } },
    { slug: 'reactiva-home', inputs: { nombre_cliente: 'Lorena Pérez', propiedad: 'Depto 204 Residencial Arcos', presupuesto: '$1.2M', fecha_consulta: '12 Abril', ultimo_mensaje: 'Lo voy a pensar', dias_inactivo: '7' } }
  ]

  for (const sample of samples) {
    const { data: app } = await supabase.from('micro_apps').select('*').eq('slug', sample.slug).single()
    if (!app) continue

    console.log(`> Forjando ${sample.slug}...`)
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
      console.log(`✅ ${sample.slug} forjado.`)
    } catch (e) {
      // In case of quota errors, use a high quality fallback
      const fallback = `## REPORTE DE INTELIGENCIA PROFESIONAL (${sample.slug})\n\nEste es un ejemplo de alta fidelidad generado por Antigravity para propósitos de demostración. Los resultados reales utilizan Gemini 3 Pro para un análisis personalizado.\n\n### Acciones Recomendadas\n1. Realizar el seguimiento en las próximas 24 horas.\n2. Aplicar el guion de cierre sugerido.\n3. Monitorear el ROI en el panel principal.`
      await supabase.from('app_executions').insert({
        user_id: USER_ID,
        app_id: app.id,
        app_slug: app.slug,
        inputs: sample.inputs,
        status: 'completed',
        result: { markdown: fallback },
        metadata: { forged_fallback: true }
      })
      console.log(`⚠️ ${sample.slug} forjado con fallback por cuota API.`)
    }
  }

  console.log('✨ Todo el ecosistema está listo y poblado.')
}

forge()

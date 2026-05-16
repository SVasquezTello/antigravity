import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🌿 Seeding Home & Garden Apps...')

  const apps = [
    {
      slug: 'greenhome-pro-ia',
      name_en: 'GreenHome Pro',
      name_es: 'GreenHome Pro',
      description_en: 'AI-powered plant diagnosis and maintenance scheduling.',
      description_es: 'Diagnóstico de plantas por IA y agenda inteligente de mantenimiento.',
      icon: 'Leaf',
      form_schema: [
        { id: 'planta', type: 'text', label_es: 'Nombre de la planta (opcional)', placeholder_es: 'Ej: Monstera, Rosal...' },
        { id: 'sintomas', type: 'textarea', label_es: 'Síntomas observados', placeholder_es: 'Ej: Hojas amarillas, manchas negras...', required: true },
        { id: 'ubicacion', type: 'select', label_es: 'Ubicación', options: [
          { value: 'interior', label_es: 'Interior' },
          { value: 'exterior', label_es: 'Exterior / Jardín' }
        ], required: true }
      ],
      prompt_template: 'Actúa como un experto botánico y paisajista. Analiza la planta {{planta}} ubicada en {{ubicacion}} con los síntomas: {{sintomas}}. Entrega: 1. Diagnóstico probable. 2. Tratamiento paso a paso. 3. Recomendaciones de riego y luz. 4. Calendario de mantenimiento sugerido.'
    },
    {
      slug: 'fixcasa-handyman-ai',
      name_en: 'FixCasa App',
      name_es: 'FixCasa App',
      description_en: 'Quick quotes and technical guidance for home repairs.',
      description_es: 'Cotizaciones rápidas y guía técnica para reparaciones del hogar.',
      icon: 'Wrench',
      form_schema: [
        { id: 'problema', type: 'textarea', label_es: 'Describe el problema', placeholder_es: 'Ej: Fuga en el grifo de la cocina, cortocircuito...', required: true },
        { id: 'urgencia', type: 'select', label_es: 'Nivel de urgencia', options: [
          { value: 'baja', label_es: 'Puede esperar' },
          { value: 'media', label_es: 'Necesario pronto' },
          { value: 'alta', label_es: 'Emergencia inmediata' }
        ], required: true }
      ],
      prompt_template: 'Actúa como un maestro de obras y técnico especializado. El cliente reporta: {{problema}} (Urgencia: {{urgencia}}). Genera: 1. Análisis técnico del problema. 2. Lista de materiales necesarios. 3. Tiempo estimado de reparación. 4. Rango de precio sugerido para el mercado latinoamericano.'
    }
  ]

  // Buscamos el plan profesional en la tabla 'plans' (que es la que está activa)
  const { data: offer } = await supabase.from('plans').select('id').eq('slug', 'professional').single()
  
  if (!offer) {
    console.error('❌ Error: Plan "professional" no encontrado en la tabla plans.')
    return
  }

  for (const app of apps) {
    const { data: newApp, error: appError } = await supabase.from('micro_apps').upsert(app, { onConflict: 'slug' }).select('id').single()
    
    if (appError) {
      console.error(`❌ Error al insertar ${app.slug}:`, appError.message)
      continue
    }

    if (newApp) {
      const { error: linkError } = await supabase.from('plan_apps').upsert({ 
        plan_id: offer.id, 
        app_id: newApp.id 
      }, { onConflict: 'plan_id,app_id' })
      
      if (linkError) {
        console.error(`❌ Error al vincular ${app.slug}:`, linkError.message)
      } else {
        console.log(`✅ App ${app.name_es} lista y vinculada al Plan Pro.`)
      }
    }
  }

  console.log('✨ Nicho Hogar y Jardín sembrado con éxito.')
}

run()

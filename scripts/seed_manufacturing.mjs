import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🏭 Seeding Micro-Apps para Manufactura y Producción...')

  const apps = [
    {
      slug: 'manufactura-lean-ai',
      name_en: 'Lean Manufacturing Advisor',
      name_es: 'Asesor Manufactura Lean',
      description_en: 'Optimize production processes and eliminate waste in your factory.',
      description_es: 'Optimiza procesos de producción y elimina desperdicios en tu fábrica.',
      icon: 'Settings',
      form_schema: [
        { id: 'proceso_actual', type: 'textarea', label_en: 'Current Process', label_es: 'Proceso actual / Cuello de botella', required: true },
        { id: 'tasa_error', type: 'text', label_en: 'Error Rate', label_es: 'Tasa de error/defectos (%)', required: true }
      ],
      prompt_template: `Actúa como un Consultor de Manufactura Lean (Six Sigma). Analizamos el proceso: {{proceso_actual}}.
      
      DATOS:
      - Tasa de error: {{tasa_error}}
      
      TAREA:
      1. Identifica el "Mudá" (Desperdicio) principal.
      2. Propón 3 mejoras inmediatas (Kaizen).
      3. Diseña un tablero de control visual para los operarios.
      4. Estima el impacto en productividad tras aplicar los cambios.`
    },
    {
      slug: 'produccion-scheduler-ai',
      name_en: 'Smart Production Scheduler',
      name_es: 'Programador de Producción Inteligente',
      description_en: 'Optimize shifts and machine usage for maximum output.',
      description_es: 'Optimiza turnos y uso de maquinaria para máxima producción.',
      icon: 'Clock',
      form_schema: [
        { id: 'maquinas_disponibles', type: 'number', label_en: 'Available Machines', label_es: 'Máquinas disponibles', required: true },
        { id: 'pedidos_pendientes', type: 'textarea', label_en: 'Pending Orders', label_es: 'Pedidos pendientes / Volumen', required: true }
      ],
      prompt_template: `Eres un Jefe de Planta experto en logística. Debemos programar:
      - Maquinaria: {{maquinas_disponibles}}
      - Carga de trabajo: {{pedidos_pendientes}}
      
      GENERA:
      1. Plan de turnos optimizado.
      2. Secuencia de producción para minimizar tiempos muertos.
      3. Alerta de mantenimiento preventivo sugerida.`
    }
  ]

  const { data: plans } = await supabase.from('plans').select('id, slug')
  const proPlan = plans?.find(p => p.slug === 'professional')

  for (const app of apps) {
    const { data: newApp } = await supabase.from('micro_apps').upsert({
      slug: app.slug, name_en: app.name_en, name_es: app.name_es,
      description_en: app.description_en, description_es: app.description_es,
      icon: app.icon, form_schema: app.form_schema, prompt_template: app.prompt_template
    }, { onConflict: 'slug' }).select('id').single()

    if (proPlan && newApp) {
      await supabase.from('plan_apps').upsert({ plan_id: proPlan.id, app_id: newApp.id }, { onConflict: 'plan_id,app_id' })
    }
  }

  console.log('\n✅ Vertical de Manufactura completada.')
}

run()

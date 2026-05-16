const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const industrialApps = [
  {
    slug: 'quality-audit-pro',
    name_es: 'Auditor de Calidad Industrial',
    name_en: 'Industrial Quality Auditor',
    description_es: 'Analiza métricas de producción para detectar desviaciones y cuellos de botella.',
    description_en: 'Analyzes production metrics to detect deviations and bottlenecks.',
    icon: 'ShieldCheck',
    price_credits: 5,
    prompt_template: 'Actúa como un Auditor de Calidad Senior en Manufactura. Analiza los siguientes datos de producción: {{production_data}}. Identifica: 1. Desviaciones estándar, 2. Probables causas raíz, 3. Acciones correctivas inmediatas.',
    form_schema: [
      { id: 'production_data', label: 'Datos de Producción (JSON o Texto)', type: 'textarea', placeholder: 'Ej: Lote 402, Velocidad 40hz, Temperatura 80C...' }
    ],
    autofill_presets: [
      { label: 'Demo: Desviación Térmica', values: { production_data: 'Lote: A-102\nSensor_T: 92C (Nominal 85C)\nVibración: 0.4mm/s\nRechazos: 4%' } }
    ]
  },
  {
    slug: 'predictive-maint-factory',
    name_es: 'Planificador de Mantenimiento Predictivo',
    name_en: 'Predictive Maintenance Planner',
    description_es: 'Predice fallos mecánicos basados en telemetría de sensores.',
    description_en: 'Predicts mechanical failures based on sensor telemetry.',
    icon: 'Settings',
    price_credits: 8,
    prompt_template: 'Eres un sistema de Inteligencia Predictiva Industrial. Telemetría actual: {{telemetry}}. Genera un plan de mantenimiento preventivo basado en la probabilidad de falla de los componentes mencionados.',
    form_schema: [
      { id: 'telemetry', label: 'Telemetría de Sensores', type: 'textarea', placeholder: 'Presión: 120psi, Carga: 90%...' }
    ]
  },
  {
    slug: 'lean-sigma-coach',
    name_es: 'Coach Lean Six Sigma',
    name_en: 'Lean Six Sigma Coach',
    description_es: 'Optimización de procesos usando metodologías Lean y mejora continua.',
    description_en: 'Process optimization using Lean and continuous improvement methodologies.',
    icon: 'Target',
    price_credits: 10,
    prompt_template: 'Como experto Black Belt en Six Sigma, analiza el siguiente proceso: {{process_desc}}. Aplica el marco DMAIC y sugiere 3 mejoras de alto impacto para reducir el desperdicio (Muda).',
    form_schema: [
      { id: 'process_desc', label: 'Descripción del Proceso Actual', type: 'textarea', placeholder: 'El flujo de empaque tarda 20 minutos por pallet...' }
    ]
  }
]

async function seed() {
  console.log('🚀 Seeding High-End Industrial Apps...')
  for (const app of industrialApps) {
    const { error } = await supabase.from('micro_apps').upsert(app, { onConflict: 'slug' })
    if (error) console.error(`Error seeding ${app.slug}:`, error)
    else console.log(`✅ App seeded: ${app.slug}`)
  }
}

seed()

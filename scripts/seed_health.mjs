import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🦷 Seeding Micro-Apps para Salud y Bienestar...')

  const apps = [
    {
      slug: 'patient-recall-ai',
      name_en: 'PatientRecall AI',
      name_es: 'PatientRecall AI',
      description_en: 'Reactivate ghost patients with emotional and persuasive messages.',
      description_es: 'Reactiva pacientes que no han vuelto a consulta con mensajes persuasivos.',
      icon: 'Users',
      form_schema: [
        { id: 'nombre_paciente', type: 'text', label_en: 'Patient Name', label_es: 'Nombre del paciente', required: true },
        { id: 'ultimo_tratamiento', type: 'text', label_en: 'Last Treatment', label_es: 'Último tratamiento (Ej: Limpieza, Empaste)', required: true },
        { id: 'tiempo_ausente', type: 'text', label_en: 'Time Absent', label_es: 'Tiempo desde última visita', required: true }
      ],
      prompt_template: `Eres un experto en Marketing para Salud (Dental/Médico). Escribe un mensaje de seguimiento para {{nombre_paciente}}.
      
      CONTEXTO:
      - Tratamiento anterior: {{ultimo_tratamiento}}
      - Ausencia: {{tiempo_ausente}}
      
      GENERA 3 MENSAJES (WhatsApp/SMS):
      1. EL PREVENTIVO: Enfocado en la importancia de la revisión para evitar dolor.
      2. EL EMOCIONAL: Enfocado en que le echamos de menos y queremos ver su sonrisa.
      3. EL EXCLUSIVO: Ofreciendo un pequeño detalle o prioridad de agenda por volver.`
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

  console.log('\n✅ Vertical de Salud completada.')
}

run()

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🎓 Seeding Premium Education Apps...')

  const apps = [
    {
      slug: 'reactiva-edu-whatsapp',
      name_en: 'ReactivaEdu',
      name_es: 'ReactivaEdu',
      description_en: 'Reactivate interested students who disappeared after asking for price.',
      description_es: 'Reactiva interesados que desaparecieron tras preguntar el precio.',
      icon: 'MessageSquare',
      form_schema: [
        { id: 'nombre', type: 'text', label_es: 'Nombre del interesado', required: true },
        { id: 'curso', type: 'text', label_es: 'Curso consultado', required: true },
        { id: 'presupuesto', type: 'text', label_es: 'Presupuesto estimado' },
        { id: 'dias', type: 'number', label_es: 'Días sin responder', required: true }
      ],
      prompt_template: 'Eres un experto en ventas educativas. El interesado {{nombre}} preguntó por {{curso}} hace {{dias}} días. Genera un mensaje de WhatsApp suave y uno directo para cerrar la matrícula.'
    },
    {
      slug: 'upsell-edu-ia',
      name_en: 'UpsellEdu IA',
      name_es: 'UpsellEdu IA',
      description_en: 'Identify upselling opportunities for current students.',
      description_es: 'Identifica qué más puede comprar un alumno actual.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'curso_actual', type: 'text', label_es: 'Curso principal', required: true },
        { id: 'perfil', type: 'textarea', label_es: 'Perfil del alumno', required: true },
        { id: 'catalogo', type: 'textarea', label_es: 'Catálogo de programas', required: true }
      ],
      prompt_template: 'Analiza el perfil {{perfil}} y el curso actual {{curso_actual}}. Basado en el catálogo {{catalogo}}, propón 3 ofertas complementarias y el guion de venta.'
    },
    {
      slug: 'matricula-edu-checklist',
      name_en: 'MatriculaEdu',
      name_es: 'MatriculaEdu',
      description_en: 'Never lose a registration due to lack of organization.',
      description_es: 'Organiza el proceso de matrícula para no perder alumnos.',
      icon: 'ClipboardCheck',
      form_schema: [
        { id: 'alumno', type: 'text', label_es: 'Nombre del alumno', required: true },
        { id: 'curso', type: 'text', label_es: 'Curso elegido', required: true },
        { id: 'inicio', type: 'text', label_es: 'Fecha de inicio', required: true }
      ],
      prompt_template: 'Genera un checklist operativo completo para la matrícula de {{alumno}} en el curso {{curso}} que inicia el {{inicio}}.'
    },
    {
      slug: 'decide-edu-analytics',
      name_en: 'DecideEdu',
      name_es: 'DecideEdu',
      description_en: 'Actionable business decisions based on your academy numbers.',
      description_es: 'Toma decisiones comerciales basadas en los números de tu academia.',
      icon: 'BarChart3',
      form_schema: [
        { id: 'reporte', type: 'textarea', label_es: 'Reporte comercial del mes', required: true },
        { id: 'problema', type: 'text', label_es: 'Problema principal a resolver', required: true }
      ],
      prompt_template: 'Analiza el reporte {{reporte}} enfocado en {{problema}}. Entrega 3 decisiones accionables con justificación clara.'
    },
    {
      slug: 'pulse-edu-dashboard',
      name_en: 'PulseEdu',
      name_es: 'PulseEdu',
      description_en: 'Know your academy health in seconds without calling anyone.',
      description_es: 'Conoce el estado de tu academia hoy mismo mediante un semáforo operativo.',
      icon: 'Activity',
      form_schema: [
        { id: 'reporte_dia', type: 'textarea', label_es: 'Reporte del día', required: true },
        { id: 'meta', type: 'text', label_es: 'Meta esperada', required: true }
      ],
      prompt_template: 'Basado en el reporte {{reporte_dia}} y la meta {{meta}}, genera un semáforo operativo (Verde/Amarillo/Rojo) y las 3 acciones urgentes del día.'
    }
  ]

  const { data: offer } = await supabase.from('offers').select('id').eq('slug', 'professional').single()
  
  for (const app of apps) {
    const { data: newApp } = await supabase.from('micro_apps').upsert(app, { onConflict: 'slug' }).select('id').single()
    if (offer && newApp) {
      await supabase.from('offer_apps').upsert({ offer_id: offer.id, app_id: newApp.id }, { onConflict: 'offer_id,app_id' })
    }
  }

  console.log('✅ 5 Education Apps Seeded and Linked to Pro Plan.')
}

run()

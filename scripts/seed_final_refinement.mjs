import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🚀 Optimizando AgencyLoop y ExpertLoop al Estándar de Alta Gama...')

  const apps = [
    // --- AGENCY LOOP ---
    {
      slug: 'scope-agency',
      name_es: 'ScopeAgency Pro',
      name_en: 'ScopeAgency Pro',
      description_es: 'El escudo contra el "Scope Creep". Define límites que protegen tu tiempo.',
      description_en: 'The shield against "Scope Creep". Define boundaries that protect your time.',
      icon: 'Shield',
      form_schema: [
        { id: 'cliente', type: 'text', label_es: 'Nombre del Cliente', label_en: 'Client Name', required: true },
        { id: 'proyecto', type: 'text', label_es: 'Proyecto / Servicio', label_en: 'Project / Service', required: true },
        { id: 'entregables', type: 'textarea', label_es: 'Lista de Entregables', label_en: 'Deliverables List', required: true },
        { id: 'presupuesto', type: 'text', label_es: 'Presupuesto total', label_en: 'Total Budget', required: true }
      ],
      prompt_template: `Actúa como un Dueño de Agencia veterano. El cliente {{cliente}} contrató {{proyecto}} por {{presupuesto}}. 1. Estructura el SOW (Statement of Work) basado en {{entregables}}. 2. Define 5 cláusulas drásticas de "EXCLUSIÓN" para que el cliente no pida extras gratis. 3. Redacta el mensaje de bienvenida que establece estas reglas desde el minuto 1.`
    },
    {
      slug: 'upsell-agency',
      name_es: 'UpsellAgency',
      name_en: 'UpsellAgency',
      description_es: 'Convierte clientes de un solo pago en retainers mensuales recurrentes.',
      description_en: 'Convert one-time payment clients into recurring monthly retainers.',
      icon: 'RefreshCw',
      form_schema: [
        { id: 'servicio_previo', type: 'text', label_es: '¿Qué le vendiste antes?', label_en: 'Last service sold', required: true },
        { id: 'resultado', type: 'textarea', label_es: 'Resultados obtenidos', label_en: 'Results achieved', required: true },
        { id: 'meta_cliente', type: 'text', label_es: 'Próxima meta del cliente', label_en: 'Next goal', required: true }
      ],
      prompt_template: `El cliente ya compró {{servicio_previo}} y logramos {{resultado}}. Su meta es {{meta_cliente}}. Diseña un "Upgrade a Retainer" (Contrato mensual). Genera: 1. Por qué necesita supervisión mensual para {{meta_cliente}}. 2. Propuesta de 3 niveles de mantenimiento/crecimiento. 3. El Pitch de cierre del contrato recurrente.`
    },
    {
      slug: 'agency-loop',
      name_es: 'AgencyLoop',
      name_en: 'AgencyLoop',
      description_es: 'El ecosistema operativo para agencias que quieren escalar facturación.',
      description_en: 'The operational ecosystem for agencies that want to scale billing.',
      icon: 'Zap',
      form_schema: [
        { id: 'nombre', type: 'text', label_es: 'Agencia', label_en: 'Agency Name', required: true },
        { id: 'nicho', type: 'text', label_es: 'Nicho / Especialidad', label_en: 'Niche', required: true },
        { id: 'cuello_botella', type: 'textarea', label_es: 'Mayor problema hoy', label_en: 'Main bottleneck', required: true }
      ],
      prompt_template: `Diseña el Master Plan "AgencyLoop" para {{nombre}}. Especialidad: {{nicho}}. Reto: {{cuello_botella}}. Genera un plan de 3 fases: 1. Blindaje Operativo (SOPs), 2. Estrategia de Venta Recurrente y 3. Sistema de Captación Automatizada por IA.`
    },

    // --- EXPERT LOOP ---
    {
      slug: 'expert-sales',
      name_es: 'ExpertSales AI',
      name_en: 'ExpertSales AI',
      description_es: 'Guiones psicológicos para cerrar programas de mentoría High Ticket.',
      description_en: 'Psychological scripts for closing High Ticket mentorship programs.',
      icon: 'Mic',
      form_schema: [
        { id: 'mentoría', type: 'text', label_es: 'Nombre del programa', label_en: 'Program Name', required: true },
        { id: 'dolor', type: 'text', label_es: 'Dolor más grande del alumno', label_en: 'Core student pain', required: true },
        { id: 'objeción', type: 'text', label_es: 'Objeción que más te dan', label_en: 'Most common objection', required: true }
      ],
      prompt_template: `Actúa como un Closer de $10,000 USD. El programa es {{mentoría}} enfocado en resolver {{dolor}}. Genera un guion de 15 minutos que utilice "Psicología Inversa" y "Venta por Diagnóstico". Incluye un manejo específico e implacable para la objeción: "{{objeción}}".`
    },
    {
      slug: 'course-architect',
      name_es: 'CourseArchitect',
      name_en: 'CourseArchitect',
      description_es: 'Diseña la estructura de tu curso para que el 90% de los alumnos lo termine.',
      description_en: 'Design your course structure so 90% of students finish it.',
      icon: 'BookOpen',
      form_schema: [
        { id: 'promesa', type: 'text', label_es: '¿Qué lograrán en 8 semanas?', label_en: 'Result in 8 weeks', required: true },
        { id: 'niveles', type: 'select', label_es: 'Nivel del alumno', label_en: 'Student level', options_es: ['Novato', 'Intermedio', 'Avanzado'], options_en: ['Novice', 'Intermediate', 'Advanced'], required: true },
        { id: 'metodos', type: 'textarea', label_es: 'Recursos (vídeos, PDFs, llamadas)', label_en: 'Resources', required: true }
      ],
      prompt_template: `Eres el mejor diseñador instruccional. El objetivo es {{promesa}} para alumnos {{niveles}}. Diseña: 1. Los 8 módulos semanales. 2. Los "Quick Wins" de cada semana para mantener la dopamina. 3. Cómo usar {{metodos}} para garantizar la implementación real.`
    },
    {
      slug: 'expert-loop',
      name_es: 'ExpertLoop',
      name_en: 'ExpertLoop',
      description_es: 'Convierte tu conocimiento en una máquina de libertad financiera.',
      description_en: 'Turn your knowledge into a financial freedom machine.',
      icon: 'Star',
      form_schema: [
        { id: 'experto', type: 'text', label_es: 'Nombre del Experto', label_en: 'Expert Name', required: true },
        { id: 'conocimiento', type: 'text', label_es: 'Área de expertise', label_en: 'Area of expertise', required: true },
        { id: 'comunidad', type: 'text', label_es: 'Tamaño de audiencia actual', label_en: 'Current audience size', required: true }
      ],
      prompt_template: `Diseña el Plan de Libertad "ExpertLoop" para {{experto}}. Su activo es {{conocimiento}} para {{comunidad}} personas. Crea un Roadmap: 1. El Producto de Entrada (Low ticket), 2. El Programa Elite (High ticket) y 3. El Sistema de Ventas basado en VSL y Webinars automatizados.`
    }
  ]

  const { data: plans } = await supabase.from('plans').select('id, slug')
  const multiPlan = plans.find(p => p.slug === 'professional' || p.slug === 'pro') || plans[0]

  for (const app of apps) {
    console.log(`- Upserting ${app.slug}...`)
    const { data: inserted, error } = await supabase.from('micro_apps').upsert(app, { onConflict: 'slug' }).select('id').single()
    if (!error && inserted && multiPlan) {
      await supabase.from('plan_apps').upsert({ plan_id: multiPlan.id, app_id: inserted.id }, { onConflict: 'plan_id,app_id' })
    }
  }

  console.log('✅ AgencyLoop y ExpertLoop refinados al 100%.')
}

run()

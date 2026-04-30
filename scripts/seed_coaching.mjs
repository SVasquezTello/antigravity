import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('🧠 Seeding Micro-Apps para Coaching y Consultoría de Vida/Negocios...')

  const apps = [
    {
      slug: 'session-planner-pro',
      name_en: 'SessionPlanner Pro',
      name_es: 'SessionPlanner Pro',
      description_en: 'Structure high-impact 1-on-1 coaching sessions that drive breakthroughs.',
      description_es: 'Estructura sesiones de coaching 1-a-1 de alto impacto que generen avances reales.',
      icon: 'Target',
      form_schema: [
        { id: 'nombre_coachee', type: 'text', label_en: 'Coachee Name', label_es: 'Nombre del coachee', required: true },
        { id: 'objetivo_sesion', type: 'textarea', label_en: 'Session Goal', label_es: 'Objetivo de la sesión', required: true },
        { id: 'principales_bloqueos', type: 'textarea', label_en: 'Main Blocks', label_es: 'Principales bloqueos / Desafíos', required: true },
        { id: 'tipo_coaching', type: 'select', label_en: 'Coaching Type', label_es: 'Tipo de coaching', required: true,
          options: [
            { value: 'vida', label_en: 'Life Coaching', label_es: 'Coaching de Vida' },
            { value: 'negocios', label_en: 'Business Coaching', label_es: 'Coaching de Negocios' },
            { value: 'ejecutivo', label_en: 'Executive Coaching', label_es: 'Coaching Ejecutivo' }
          ]
        }
      ],
      prompt_template: `Actúa como un Master Coach (ICF) con 20 años de experiencia. Vas a preparar la sesión de {{nombre_coachee}}.
      
      CONTEXTO:
      - Objetivo: {{objetivo_sesion}}
      - Bloqueos: {{principales_bloqueos}}
      - Especialidad: {{tipo_coaching}}
      
      TAREA:
      Genera una estructura de sesión de 60 minutos:
      1. El Check-in (5 min): Pregunta rompehielo para conectar.
      2. Exploración Profunda (20 min): 3 preguntas poderosas basadas en sus bloqueos.
      3. Cambio de Perspectiva (15 min): Un ejercicio o metáfora para romper el patrón.
      4. Plan de Acción (15 min): Tareas específicas (Baby Steps).
      5. Cierre y Compromiso (5 min).
      
      RECOMENDACIÓN: Da un consejo de "Presencia del Coach" para esta sesión en particular.`
    },
    {
      slug: 'roadmap-creator-ai',
      name_en: 'Business Roadmap AI',
      name_es: 'Roadmap de Negocios AI',
      description_en: 'Create a strategic 90-day roadmap for entrepreneurs and solopreneurs.',
      description_es: 'Crea una hoja de ruta estratégica de 90 días para emprendedores y dueños de negocio.',
      icon: 'Map',
      form_schema: [
        { id: 'nombre_negocio', type: 'text', label_en: 'Business Name', label_es: 'Nombre del negocio', required: true },
        { id: 'situacion_actual', type: 'textarea', label_en: 'Current Situation', label_es: 'Situación actual (Ventas, equipo, etc.)', required: true },
        { id: 'meta_90_dias', type: 'text', label_en: '90-Day Goal', label_es: 'Meta a 90 días', required: true },
        { id: 'recursos_disponibles', type: 'textarea', label_en: 'Available Resources', label_es: 'Recursos disponibles (Capital, tiempo, herramientas)', required: true }
      ],
      prompt_template: `Eres un Consultor de Negocios Senior. Tu meta es la claridad operativa.
      
      NEGOCIO: {{nombre_negocio}}
      SITUACIÓN: {{situacion_actual}}
      META: {{meta_90_dias}}
      RECURSOS: {{recursos_disponibles}}
      
      GENERA EL ROADMAP DE 90 DÍAS:
      1. MES 1: Cimientos y Eliminación de Cuellos de Botella.
      2. MES 2: Ejecución y Crecimiento.
      3. MES 3: Optimización y Escala.
      
      Incluye 3 "Key Results" (KR) medibles para el final del trimestre.`
    },
    {
      slug: 'habit-master-bot',
      name_en: 'High-Performance Habit AI',
      name_es: 'Hábito Maestro AI',
      description_en: 'Design a personalized high-performance routine based on your goals and energy.',
      description_es: 'Diseña una rutina de alto rendimiento personalizada según tus metas y energía.',
      icon: 'Zap',
      form_schema: [
        { id: 'meta_principal', type: 'text', label_en: 'Main Goal', label_es: 'Meta principal', required: true },
        { id: 'horario_despierto', type: 'text', label_en: 'Wake Up Time', label_es: 'Hora de despertar', required: true },
        { id: 'nivel_energia_dia', type: 'select', label_en: 'Daily Energy Peak', label_es: 'Pico de energía en el día', required: true,
          options: [
            { value: 'mañana', label_en: 'Morning', label_es: 'Mañana' },
            { value: 'tarde', label_en: 'Afternoon', label_es: 'Tarde' },
            { value: 'noche', label_en: 'Night', label_es: 'Noche' }
          ]
        },
        { id: 'estresores_comunes', type: 'textarea', label_en: 'Common Stressors', label_es: 'Estresores comunes', required: true }
      ],
      prompt_template: `Actúa como un Coach de Biohacking y Productividad. Vamos a diseñar el día perfecto para lograr: {{meta_principal}}.
      
      DATOS:
      - Despierta a las: {{horario_despierto}}
      - Pico de energía: {{nivel_energia_dia}}
      - Estrés: {{estresores_comunes}}
      
      TAREA:
      1. RITUAL DE MAÑANA (30-60 min): Enfocado en enfoque y claridad.
      2. BLOQUE DE DEEP WORK: Cuándo debe atacar la tarea más difícil basado en su pico de energía.
      3. ESTRATEGIA DE RECARGA: Cómo manejar el estrés de {{estresores_comunes}}.
      4. RITUAL DE APAGADO: Para asegurar descanso de calidad.
      
      MANTRA DEL DÍA: Una frase corta de poder.`
    },
    {
      slug: 'objection-handler-coach',
      name_en: 'Objection Handler Coach',
      name_es: 'Entrenador de Objeciones',
      description_en: 'Master sales calls by generating perfect responses to any coaching objection.',
      description_es: 'Domina tus llamadas de venta generando respuestas perfectas a cualquier objeción.',
      icon: 'MessageCircle',
      form_schema: [
        { id: 'objecion_recibida', type: 'textarea', label_en: 'Objection Received', label_es: 'Objeción recibida (No tengo dinero, tiempo, etc.)', required: true },
        { id: 'precio_programa', type: 'text', label_en: 'Program Price', label_es: 'Precio del programa', required: true },
        { id: 'perfil_prospecto', type: 'text', label_en: 'Prospect Profile', label_es: 'Perfil del prospecto', required: true }
      ],
      prompt_template: `Eres un experto en Ventas de Coaching de Alto Valor (High Ticket). El prospecto dice: "{{objecion_recibida}}".
      
      PROGRAMA: {{precio_programa}}
      PERFIL: {{perfil_prospecto}}
      
      GENERA 3 RESPUESTAS ESTRATÉGICAS:
      1. LA EMPÁTICA: Validar el sentimiento y redirigir a la meta.
      2. LA DE DESAFÍO: Retar su creencia limitante con amor pero firmeza.
      3. LA DE LÓGICA/ROI: Desglosar el costo de NO comprar.
      
      RECOMENDACIÓN: Qué pregunta hacer justo después de responder para mantener el control de la llamada.`
    },
    {
      slug: 'workshop-creator-ai',
      name_en: 'Workshop Architect',
      name_es: 'Arquitecto de Workshops',
      description_en: 'Generate a complete curriculum for your next group coaching workshop.',
      description_es: 'Genera un currículo completo para tu próximo workshop de coaching grupal.',
      icon: 'Layout',
      form_schema: [
        { id: 'tema_workshop', type: 'text', label_en: 'Workshop Topic', label_es: 'Tema del workshop', required: true },
        { id: 'duracion_total', type: 'text', label_en: 'Total Duration', label_es: 'Duración total', required: true },
        { id: 'numero_participantes', type: 'number', label_en: 'Number of Participants', label_es: 'Número de participantes', required: true },
        { id: 'resultado_deseado', type: 'textarea', label_en: 'Desired Outcome', label_es: 'Resultado final deseado', required: true }
      ],
      prompt_template: `Actúa como un Diseñador Instruccional experto en andragogía (aprendizaje de adultos).
      
      TEMA: {{tema_workshop}}
      DURACIÓN: {{duracion_total}}
      PARTICIPANTES: {{numero_participantes}}
      RESULTADO: {{resultado_deseado}}
      
      GENERA LA ESTRUCTURA DEL WORKSHOP:
      1. APERTURA IMPACTANTE: Cómo captar la atención en los primeros 10 minutos.
      2. BLOQUES DE CONTENIDO: Divididos por tiempos.
      3. ACTIVIDADES DINÁMICAS: Una actividad práctica por cada bloque.
      4. CIERRE Y COMPROMISO: Cómo asegurar que apliquen lo aprendido.
      
      LISTA DE MATERIALES: Qué herramientas digitales o físicas necesitarás.`
    },
    {
      slug: 'content-pillar-coach',
      name_en: 'Coaching Content Pillar',
      name_es: 'Pilar de Contenido Coach',
      description_en: 'Transform one core teaching idea into 15 content pieces for social media.',
      description_es: 'Transforma una idea central de enseñanza en 15 piezas de contenido para redes.',
      icon: 'Grid',
      form_schema: [
        { id: 'idea_central', type: 'textarea', label_en: 'Core Teaching/Idea', label_es: 'Idea central o enseñanza', required: true },
        { id: 'audiencia_objetivo', type: 'text', label_en: 'Target Audience', label_es: 'Audiencia objetivo', required: true },
        { id: 'redes_prioritarias', type: 'text', label_en: 'Priority Networks', label_es: 'Redes sociales prioritarias', required: true }
      ],
      prompt_template: `Eres un Estratega de Contenido para Marcas Personales. Queremos autoridad absoluta sobre: {{idea_central}}.
      
      AUDIENCIA: {{audiencia_objetivo}}
      REDES: {{redes_prioritarias}}
      
      GENERA 15 IDEAS DE CONTENIDO:
      - 5 Educativas (Tutoriales, conceptos).
      - 5 De Autoridad (Casos de éxito, opiniones fuertes).
      - 5 De Conexión (Vulnerabilidad, detrás de cámaras).
      
      Para cada idea, da un gancho (hook) sugerido.`
    }
  ]

  // Fetch plans
  const { data: plans, error: planError } = await supabase.from('plans').select('id, slug')
  if (planError) { console.error('Error fetching plans:', planError); return }

  const proPlan = plans.find(p => p.slug === 'professional' || p.slug === 'pro')
  const businessPlan = plans.find(p => p.slug === 'business' || p.slug === 'enterprise')

  for (const app of apps) {
    const appId = crypto.randomUUID()
    console.log(`Inserting app: ${app.slug}...`)

    const { error: appError } = await supabase.from('micro_apps').insert({
      id: appId, slug: app.slug, name_en: app.name_en, name_es: app.name_es,
      description_en: app.description_en, description_es: app.description_es,
      icon: app.icon, form_schema: app.form_schema, prompt_template: app.prompt_template
    })

    if (appError) {
      if (appError.code === '23505') {
        process.stdout.write(`App ${app.slug} duplicate, updating... `)
        const { data: existingApp } = await supabase.from('micro_apps').select('id').eq('slug', app.slug).single()
        if (existingApp) {
          app.id = existingApp.id
          await supabase.from('micro_apps').update({
            name_en: app.name_en, name_es: app.name_es,
            description_en: app.description_en, description_es: app.description_es,
            icon: app.icon, form_schema: app.form_schema, prompt_template: app.prompt_template
          }).eq('id', app.id)
          console.log('Done.')
        }
      } else { console.error(`Error inserting ${app.slug}:`, appError.message); continue }
    } else { app.id = appId }

    let targetPlan = proPlan
    // Roadmap and Workshop are Business
    if (app.slug === 'roadmap-creator-ai' || app.slug === 'workshop-creator-ai') {
      targetPlan = businessPlan || proPlan
    }

    if (targetPlan && app.id) {
      const { data: existingLink } = await supabase.from('plan_apps').select('*')
        .eq('plan_id', targetPlan.id).eq('app_id', app.id).single()
      if (!existingLink) {
        await supabase.from('plan_apps').insert({ plan_id: targetPlan.id, app_id: app.id })
        console.log(`Linked ${app.slug} → plan ${targetPlan.slug}`)
      } else { console.log(`${app.slug} already linked to plan ${targetPlan.slug}`) }
    }
  }

  console.log('\n✅ Micro-Apps de Coaching completadas con éxito.')
}

run()

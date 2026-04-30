import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('🤝 Seeding Micro-Apps para Recursos Humanos (TalentLoop Ecosystem)...')

  const apps = [
    {
      slug: 'reactiva-talent',
      name_en: 'ReactivaTalent',
      name_es: 'ReactivaTalent',
      description_en: 'Reactivate candidates who stopped responding with the perfect follow-up messaging.',
      description_es: 'Reactiva candidatos que dejaron de responder con el mensaje de seguimiento perfecto.',
      icon: 'MessageSquare',
      form_schema: [
        { id: 'nombre_candidato', type: 'text', label_en: 'Candidate Name', label_es: 'Nombre del candidato', required: true },
        { id: 'puesto_aplicado', type: 'text', label_en: 'Applied Position', label_es: 'Puesto aplicado', required: true },
        { id: 'etapa_proceso', type: 'text', label_en: 'Process Stage', label_es: 'Etapa del proceso', required: true, placeholder_es: 'Entrevista técnica, psicometría, etc.' },
        { id: 'ultimo_contacto', type: 'text', label_en: 'Last Contact Date', label_es: 'Último contacto', required: true },
        { id: 'dias_sin_responder', type: 'number', label_en: 'Days without response', label_es: 'Días sin responder', required: true },
        { id: 'canal_preferido', type: 'select', label_en: 'Preferred Channel', label_es: 'Canal preferido', required: true,
          options: [
            { value: 'whatsapp', label_en: 'WhatsApp', label_es: 'WhatsApp' },
            { value: 'email', label_en: 'Email', label_es: 'Email' },
            { value: 'llamada', label_en: 'Phone Call', label_es: 'Llamada' }
          ]
        }
      ],
      prompt_template: `Actúa como un reclutador experto en persuasión y psicología del talento. Un candidato excelente ha dejado de responder.
      
      DATOS:
      - Candidato: {{nombre_candidato}}
      - Puesto: {{puesto_aplicado}}
      - Etapa: {{etapa_proceso}}
      - Días en silencio: {{dias_sin_responder}}
      - Canal: {{canal_preferido}}
      
      TAREA:
      Genera 2 mensajes de seguimiento irresistibles optimizados para {{canal_preferido}}.
      
      1. VERSIÓN AMABLE: Enfocada en "queremos saber si todo está bien" y resaltar el valor del candidato.
      2. VERSIÓN URGENTE/ESCASEZ: Enfocada en que el proceso está cerrando pero queremos que él/ella sea parte.
      
      RECOMENDACIÓN: Indica cuál usar según el perfil y da un consejo de 1 frase para reducir el ghosting en el futuro.`
    },
    {
      slug: 'prioriza-talent',
      name_en: 'PriorizaTalent AI',
      name_es: 'PriorizaTalent AI',
      description_en: 'Instantly rank candidates to focus on the best potential first.',
      description_es: 'Clasifica al instante a tus candidatos para enfocarte primero en el mejor potencial.',
      icon: 'Target',
      form_schema: [
        { id: 'puesto_vacante', type: 'text', label_en: 'Vacant Position', label_es: 'Puesto vacante', required: true },
        { id: 'requisitos_clave', type: 'textarea', label_en: 'Key Requirements', label_es: 'Requisitos clave', required: true },
        { id: 'resumen_cvs', type: 'textarea', label_en: 'Candidate Resumes/Summaries', label_es: 'CVs o resumen de candidatos', required: true, placeholder_es: 'Pega aquí el texto de los perfiles o CVs...' },
        { id: 'nivel_urgencia', type: 'select', label_en: 'Urgency Level', label_es: 'Nivel de urgencia', required: true,
          options: [
            { value: 'alto', label_en: 'High', label_es: 'Alto' },
            { value: 'medio', label_en: 'Medium', label_es: 'Medio' },
            { value: 'bajo', label_en: 'Low', label_es: 'Bajo' }
          ]
        },
        { id: 'tipo_empresa', type: 'text', label_en: 'Company Type/Culture', label_es: 'Tipo de empresa/Cultura', required: true }
      ],
      prompt_template: `Eres un Analista de Talento con IA. Tienes la misión de filtrar el ruido y encontrar el oro para el puesto de {{puesto_vacante}}.
      
      CONTEXTO:
      - Requisitos: {{requisitos_clave}}
      - Perfiles: {{resumen_cvs}}
      - Urgencia: {{nivel_urgencia}}
      - Cultura: {{tipo_empresa}}
      
      ENTREGABLE:
      1. RANKING TOP 3: Lista a los 3 mejores candidatos detectados.
      2. JUSTIFICACIÓN QUIRÚRGICA: Por qué cada uno es prioritario vs. los requisitos.
      3. RED FLAGS: Menciona si hay algún riesgo potencial en los perfiles.
      
      Decisión final: Indica a quién entrevistar HOY mismo.`
    },
    {
      slug: 'agenda-talent',
      name_en: 'AgendaTalent',
      name_es: 'AgendaTalent',
      description_en: 'Convert interviews into a perfectly coordinated operational checklist.',
      description_es: 'Convierte las entrevistas en un checklist operativo perfectamente coordinado.',
      icon: 'Calendar',
      form_schema: [
        { id: 'nombre_candidato', type: 'text', label_en: 'Candidate Name', label_es: 'Nombre del candidato', required: true },
        { id: 'puesto', type: 'text', label_en: 'Position', label_es: 'Puesto', required: true },
        { id: 'fecha_hora', type: 'text', label_en: 'Date and Time', label_es: 'Fecha y hora', required: true },
        { id: 'entrevistador_asignado', type: 'text', label_en: 'Assigned Interviewer', label_es: 'Entrevistador asignado (Jefe/Líder)', required: true },
        { id: 'observaciones_especiales', type: 'textarea', label_en: 'Special Observations', label_es: 'Observaciones especiales', required: false }
      ],
      prompt_template: `Actúa como un Coordinador de Operaciones de RRHH. Evita el caos de las entrevistas mal gestionadas.
      
      DATOS:
      - Candidato: {{nombre_candidato}} para {{puesto}}
      - Fecha: {{fecha_hora}}
      - Jefe a cargo: {{entrevistador_asignado}}
      - Notas: {{observaciones_especiales}}
      
      GENERA UN CHECKLIST OPERATIVO COMPLETO:
      1. PARA RECLUTADOR: (Confirmación, reserva de sala/link, preparación de documentos).
      2. PARA EL JEFE ({{entrevistador_asignado}}): (Aviso de agenda, 3 preguntas clave para este perfil, recordatorio de puntualidad).
      3. PARA EL CANDIDATO (MENSAJE DE CORTESÍA): Lo que debe saber para llegar listo.
      
      Cierra con un "Hack de Experiencia de Candidato" para que la empresa brille aunque no lo contraten.`
    },
    {
      slug: 'decide-talent',
      name_en: 'DecideTalent',
      name_es: 'DecideTalent',
      description_en: 'Transform HR data into actionable business decisions.',
      description_es: 'Transforma datos de RRHH en decisiones de negocio accionables.',
      icon: 'PieChart',
      form_schema: [
        { id: 'reporte_rrhh', type: 'textarea', label_en: 'HR Report Data', label_es: 'Reporte de RRHH (Rotación, ausencias, KPIs)', required: true },
        { id: 'principal_problema', type: 'text', label_en: 'Main Problem', label_es: 'Principal problema detectado', required: true },
        { id: 'area_analizar', type: 'text', label_en: 'Area to Analyze', label_es: 'Área a analizar', required: true },
        { id: 'contexto_relevante', type: 'textarea', label_en: 'Relevant Context', label_es: 'Contexto relevante (cambios, clima laboral)', required: true }
      ],
      prompt_template: `Eres un Chief People Officer (CPO) enfocado en resultados. No quieres reportes, quieres soluciones basadas en datos.
      
      ANÁLISIS DE: {{area_analizar}}
      PROBLEMA: {{principal_problema}}
      DATOS: {{reporte_rrhh}}
      CONTEXTO: {{contexto_relevante}}
      
      ENTREGA:
      1. DIAGNÓSTICO NUMÉRICO: ¿Qué dicen realmente los números sobre el problema?
      2. 3 DECISIONES ACCIONABLES: Qué debe hacer la gerencia hoy para corregir el rumbo.
      3. JUSTIFICACIÓN DE IMPACTO: Cuánto dinero/tiempo se ahorra la empresa con esto.
      
      Tono: Directo, ejecutivo y estratégico.`
    },
    {
      slug: 'pulse-talent',
      name_en: 'PulseTalent',
      name_es: 'PulseTalent',
      description_en: 'Daily operational "traffic light" for owners to know HR status without micromanaging.',
      description_es: 'Semáforo operativo diario para dueños: conoce el estado de RRHH sin perseguir a nadie.',
      icon: 'Activity',
      form_schema: [
        { id: 'reporte_dia', type: 'textarea', label_en: 'Daily Report Summary', label_es: 'Resumen del reporte del día', required: true },
        { id: 'meta_esperada', type: 'text', label_en: 'Expected Goal', label_es: 'Meta esperada/cuota', required: true },
        { id: 'incidencias', type: 'textarea', label_en: 'Incidents/Emergencies', label_es: 'Incidencias u urgencias', required: true },
        { id: 'procesos_activos', type: 'number', label_en: 'Active hiring processes', label_es: 'Procesos de selección activos', required: true },
        { id: 'comentarios_encargado', type: 'textarea', label_en: 'Hiring Manager Comments', label_es: 'Comentarios del encargado', required: false }
      ],
      prompt_template: `Actúa como un VP de Operaciones. El Gerente no tiene tiempo para rodeos. Necesita control total.
      
      ENTREGA EL SEMÁFORO OPERATIVO:
      
      🟢 ESTADO POSITIVO: Qué está funcionando perfectamente.
      🟡 ESTADO DE ATENCIÓN: Procesos lentos o metas en riesgo (Metas: {{meta_esperada}}, Activos: {{procesos_activos}}).
      🔴 ACCIÓN URGENTE: Intervención necesaria por {{incidencias}}.
      
      RESUMEN EJECUTIVO: 3 puntos clave del reporte de {{comentarios_encargado}}.
      
      Acción sugerida para el Gerente: Una sola cosa que debe preguntar en la junta de mañana.`
    },
    {
      slug: 'talent-loop',
      name_en: 'TalentLoop Premium Bundle',
      name_es: 'TalentLoop Premium Bundle',
      description_en: 'The complete hiring cycle automation: from reactivation to retention.',
      description_es: 'El ciclo completo de contratación automatizado: desde reactivación hasta retención.',
      icon: 'Infinity',
      form_schema: [
        { id: 'nombre_empresa', type: 'text', label_en: 'Company Name', label_es: 'Nombre de la empresa', required: true },
        { id: 'mayor_dolor_hoy', type: 'select', label_en: 'Main Pain Point', label_es: 'Mayor dolor hoy', required: true,
          options: [
            { value: 'perdida_candidatos', label_en: 'Losing good candidates', label_es: 'Perdemos candidatos buenos (Reactiva)' },
            { value: 'caos_entrevistas', label_en: 'Interview chaos', label_es: 'Desorden en las entrevistas (Agenda)' },
            { value: 'falta_control', label_en: 'No visibility for management', label_es: 'Falta de visibilidad gerencial (Pulse)' }
          ]
        },
        { id: 'desafio_especifico', type: 'textarea', label_en: 'Specific Challenge', label_es: 'Reto específico de este mes', required: true }
      ],
      prompt_template: `Eres el consultor senior de TalentLoop. Tu objetivo es integrar ReactivaTalent + AgendaTalent + PulseTalent en un solo flujo.
      
      EMPRESA: {{nombre_empresa}}
      ENFOQUE SELECCIONADO: {{mayor_dolor_hoy}}
      RETO: {{desafio_especifico}}
      
      GENERA:
      1. ESTRATEGIA DE FLUJO "TALENTLOOP": Cómo debe moverse un candidato desde el primer mensaje hasta que el Gerente ve el semáforo verde.
      2. 3 TÁCTICAS DE AUTOMATIZACIÓN: Cómo usar estas herramientas para que RRHH trabaje 50% menos en tareas manuales.
      3. PLAN DE CHOQUE: Una hoja de ruta de 7 días para resolver {{desafio_especifico}}.
      
      Frase final: Tu mantra de eficiencia en talento.`
    },
    {
      slug: 'cultura-ai',
      name_en: 'CulturaAI Monitor',
      name_es: 'Monitor CulturaAI',
      description_en: 'Analyze organizational culture and values alignment.',
      description_es: 'Analiza el alineamiento de valores y la cultura organizacional.',
      icon: 'Heart',
      form_schema: [
        { id: 'valores_actuales', type: 'textarea', label_en: 'Current Values', label_es: 'Valores actuales', required: true },
        { id: 'clima_percibido', type: 'textarea', label_en: 'Perceived Climate', label_es: 'Clima laboral percibido', required: true },
        { id: 'desafios_culturales', type: 'textarea', label_en: 'Cultural Challenges', label_es: 'Desafíos culturales', required: true }
      ],
      prompt_template: `Actúa como un Experto en Desarrollo Organizacional. Analiza la cultura de la empresa.
      
      DATOS:
      - Valores: {{valores_actuales}}
      - Clima: {{clima_percibido}}
      - Retos: {{desafios_culturales}}
      
      ENTREGA:
      1. DIAGNÓSTICO DE SALUD CULTURAL: ¿Hay coherencia entre valores y realidad?
      2. 3 RITUALES CULTURALES: Acciones concretas para reforzar la identidad.
      3. SEMÁFORO DE ALINEACIÓN: Dónde está el mayor riesgo de desconexión.`
    },
    {
      slug: 'onboard-flow',
      name_en: 'OnboardFlow AI',
      name_es: 'OnboardFlow AI',
      description_en: 'Automated onboarding plan to integrate new talent in 48 hours.',
      description_es: 'Plan de inducción automatizado para integrar talento en 48 horas.',
      icon: 'Rocket',
      form_schema: [
        { id: 'puesto', type: 'text', label_en: 'Position', label_es: 'Puesto', required: true },
        { id: 'objetivo_primera_semana', type: 'text', label_en: 'First Week Goal', label_es: 'Objetivo primera semana', required: true },
        { id: 'recursos_disponibles', type: 'textarea', label_en: 'Available Resources', label_es: 'Recursos disponibles', required: true }
      ],
      prompt_template: `Eres un Especialista en Onboarding. El objetivo es reducir la curva de aprendizaje al máximo.
      
      PUESTO: {{puesto}}
      META: {{objetivo_primera_semana}}
      RECURSOS: {{recursos_disponibles}}
      
      GENERA UN PLAN DE 48 HORAS:
      1. DÍA 1: Conexión y Contexto (Agenda hora por hora).
      2. DÍA 2: Ejecución y Quick Win (Tarea específica para dar valor inmediato).
      3. CHECKLIST PARA EL LÍDER: Qué debe asegurar el jefe para que no falle.`
    },
    {
      slug: 'performance-review-ai',
      name_en: 'PerformanceReview AI',
      name_es: 'PerformanceReview AI',
      description_en: 'Strategic performance feedback generator based on results.',
      description_es: 'Generador de feedback de desempeño estratégico basado en resultados.',
      icon: 'BarChart2',
      form_schema: [
        { id: 'metas_logradas', type: 'textarea', label_en: 'Goals Achieved', label_es: 'Metas logradas', required: true },
        { id: 'areas_oportunidad', type: 'textarea', label_en: 'Areas for Improvement', label_es: 'Áreas de oportunidad', required: true },
        { id: 'potencial_crecimiento', type: 'select', label_en: 'Growth Potential', label_es: 'Potencial de crecimiento', required: true,
          options: [
            { value: 'alto', label_en: 'High', label_es: 'Alto' },
            { value: 'medio', label_en: 'Medium', label_es: 'Medio' },
            { value: 'estancado', label_en: 'Stagnant', label_es: 'Estancado' }
          ]
        }
      ],
      prompt_template: `Actúa como un Coach de Liderazgo Ejecutivo. Redacta una evaluación de desempeño constructiva y potente.
      
      DATOS:
      - Logros: {{metas_logradas}}
      - Oportunidades: {{areas_oportunidad}}
      - Potencial: {{potencial_crecimiento}}
      
      ENTREGA:
      1. FEEDBACK "SÁNDWICH" REFORZADO: Reconocimiento, corrección, empoderamiento.
      2. 3 OBJETIVOS OKR PARA EL SIGUIENTE TRIMESTRE.
      3. RUTA DE CARRERA SUGERIDA.`
    },
    {
      slug: 'retention-pulse',
      name_en: 'RetentionPulse AI',
      name_es: 'RetentionPulse AI',
      description_en: 'Predict turnover risks and generate retention strategies.',
      description_es: 'Predice riesgos de rotación y genera estrategias de retención.',
      icon: 'Shield',
      form_schema: [
        { id: 'motivos_alerta', type: 'textarea', label_en: 'Alert Signals', label_es: 'Señales de alerta', required: true, placeholder_es: 'Bajo compromiso, falta de retos, ofertas externas...' },
        { id: 'valor_empleado', type: 'select', label_en: 'Employee Value', label_es: 'Valor del empleado', required: true,
          options: [
            { value: 'critico', label_en: 'Critical (Key Talent)', label_es: 'Crítico (Talento Clave)' },
            { value: 'alto', label_en: 'High', label_es: 'Alto' },
            { value: 'reemplazable', label_en: 'Replaceable', label_es: 'Reemplazable' }
          ]
        }
      ],
      prompt_template: `Eres un Estratega de Retención de Talento. No queremos perder a nuestras estrellas.
      
      SITUACIÓN: {{motivos_alerta}}
      VALOR: {{valor_empleado}}
      
      GENERA UN PLAN DE RETENCIÓN DE EMERGENCIA:
      1. ANÁLISIS DE RIESGO: ¿Qué tan probable es que se vaya en 30 días?
      2. PROPUESTA DE VALOR PERSONALIZADA: Más allá del sueldo, ¿qué le ofrecemos?
      3. GUION DE CONVERSACIÓN PARA EL LÍDER: Cómo abordar el tema sin sonar desesperado.`
    },
    {
      slug: 'job-description-ai',
      name_en: 'JobDescription Magnet',
      name_es: 'JobDescription Magnet',
      description_en: 'Generate magnetic job descriptions that attract top-tier talent.',
      description_es: 'Genera descripciones de puesto magnéticas que atraen al mejor talento.',
      icon: 'Magnet',
      form_schema: [
        { id: 'puesto', type: 'text', label_en: 'Position Title', label_es: 'Título del puesto', required: true },
        { id: 'mision_puesto', type: 'textarea', label_en: 'Job Mission', label_es: 'Misión del puesto', required: true },
        { id: 'beneficios_unicos', type: 'textarea', label_en: 'Unique Benefits', label_es: 'Beneficios únicos', required: true }
      ],
      prompt_template: `Actúa como un Copywriter de Employer Branding. Olvida las descripciones aburridas. Queremos atraer a los mejores.
      
      DATOS:
      - Título: {{puesto}}
      - Misión: {{mision_puesto}}
      - Beneficios: {{beneficios_unicos}}
      
      ENTREGA:
      1. TÍTULO GANCHO: 3 opciones disruptivas para el anuncio.
      2. EL "POR QUÉ NOSOTROS": Un párrafo que venda la visión de la empresa.
      3. REQUISITOS ENFOCADOS EN RESULTADOS: En lugar de "5 años de experiencia", pon "Capacidad de lograr X".`
    },
    {
      slug: 'interview-scorecard',
      name_en: 'Interview Scorecard Pro',
      name_es: 'Interview Scorecard Pro',
      description_en: 'Objective matrix to evaluate candidates and avoid bias.',
      description_es: 'Matriz objetiva para evaluar candidatos y evitar sesgos.',
      icon: 'CheckSquare',
      form_schema: [
        { id: 'competencias_clave', type: 'textarea', label_en: 'Key Competencies', label_es: 'Competencias clave', required: true },
        { id: 'preguntas_realizadas', type: 'textarea', label_en: 'Questions Asked', label_es: 'Preguntas realizadas', required: true },
        { id: 'respuestas_candidato', type: 'textarea', label_en: 'Candidate Responses', label_es: 'Respuestas del candidato', required: true }
      ],
      prompt_template: `Eres un Metodólogo de Selección. Queremos una decisión basada en méritos y datos, no en "corazonadas".
      
      ENTRADAS:
      - Competencias: {{competencias_clave}}
      - Entrevista: {{preguntas_realizadas}} / {{respuestas_candidato}}
      
      GENERA LA MATRIZ DE EVALUACIÓN:
      1. PUNTAJE POR COMPETENCIA (1-10) con justificación breve.
      2. ANÁLISIS DE SESGOS: ¿Hay alguna respuesta que pueda estar siendo malinterpretada?
      3. VEREDICTO FINAL: Contratar / No contratar / Segunda entrevista técnica.`
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
    // TalentLoop bundle and Decision apps are Business
    if (app.slug === 'talent-loop' || app.slug === 'decide-talent') {
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

  console.log('\n✅ Micro-Apps de Recursos Humanos completadas con éxito.')
}

run()

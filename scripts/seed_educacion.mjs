import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('🎓 Seeding Micro-Apps para Academias y Centros Educativos...')

  const apps = [
    {
      slug: 'reactiva-alumno',
      name_en: 'ReactivaAlumno',
      name_es: 'ReactivaAlumno',
      description_en: 'That student who dropped out is your easiest enrollment. They already know you.',
      description_es: 'Recupera alumnos que dejaron de estudiar, no renovaron o se fueron a la mitad del curso.',
      icon: 'UserCheck',
      form_schema: [
        { id: 'alumno', type: 'text', label_en: 'Student Name', label_es: 'Nombre del alumno o prospecto', required: true },
        { id: 'curso', type: 'text', label_en: 'Course / Program', label_es: 'Curso o programa que cursó o consultó', required: true, placeholder_es: 'Inglés nivel B1, Diseño gráfico, Preparatoria abierta...' },
        { id: 'tipo_academia', type: 'select', label_en: 'Academy Type', label_es: 'Tipo de academia o centro educativo', required: true,
          options: [
            { value: 'idiomas', label_en: 'Language School', label_es: 'Escuela de idiomas' },
            { value: 'computacion', label_en: 'Tech / Computing', label_es: 'Computación / Tecnología' },
            { value: 'musica_arte', label_en: 'Music / Arts', label_es: 'Música / Artes' },
            { value: 'preparacion_examen', label_en: 'Exam Prep / Tutoring', label_es: 'Preparación de exámenes / Tutoría' },
            { value: 'negocios', label_en: 'Business / Professional Skills', label_es: 'Negocios / Habilidades profesionales' },
            { value: 'fitness_deporte', label_en: 'Fitness / Sports Academy', label_es: 'Fitness / Academia deportiva' },
            { value: 'general', label_en: 'General / Other', label_es: 'General / Otro' }
          ]
        },
        { id: 'motivo_salida', type: 'select', label_en: 'Reason for Dropout / Inactivity', label_es: 'Motivo de abandono o inactividad', required: true,
          options: [
            { value: 'economics', label_en: 'Financial / Affordability', label_es: 'Económico / precio' },
            { value: 'tiempo', label_en: 'Lack of Time', label_es: 'Falta de tiempo' },
            { value: 'motivacion', label_en: 'Lost Motivation', label_es: 'Perdió motivación' },
            { value: 'no_inscribio', label_en: 'Never Enrolled After Inquiry', label_es: 'Nunca se inscribió tras consultar' },
            { value: 'desconocido', label_en: 'Unknown', label_es: 'Desconocido' }
          ]
        },
        { id: 'meses_inactivo', type: 'text', label_en: 'Months Inactive', label_es: 'Meses sin actividad o contacto', required: true }
      ],
      prompt_template: `Actúa como el Director Académico y Estratega de Inscripciones de una academia de {{tipo_academia}} de alta retención.

Alumno: {{alumno}}
Curso: {{curso}}
Inactivo hace: {{meses_inactivo}} meses
Motivo de salida: {{motivo_salida}}

Genera DOS mensajes de reactivación listos para enviar por WhatsApp:

1. "Versión Regreso con Propósito" (emocional, centrada en el progreso del alumno):
Recuérdale a {{alumno}} cuánto avanzó y el costo de no terminar lo que empezó. Si el motivo fue {{motivo_salida}}, abórdalo directamente con una solución específica: plan de pago flexible si fue económico, horario nuevo si fue tiempo, reconexión con el "por qué" original si fue motivación. Cierra con una invitación concreta sin presión.

2. "Versión Oferta de Reincorporación" (práctica, con beneficio tangible):
Ofrece algo concreto para que regresar sea fácil: retomar desde donde lo dejó sin costo extra, una sesión de bienvenida de vuelta gratuita, o descuento especial en la reinscripción si responde antes de una fecha. CTA claro y simple: "¿Retomamos?".

Ambos mensajes: máximo 6 líneas, tono cálido y motivador, nunca condescendiente.`
    },
    {
      slug: 'upsell-academia-ai',
      name_en: 'UpsellAcademia AI',
      name_es: 'UpsellAcademia AI',
      description_en: 'They enrolled in the basic course. Now guide them to the full learning path.',
      description_es: 'Convierte alumnos de cursos básicos en estudiantes de programas completos y certificaciones.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'alumno', type: 'text', label_en: 'Student Name', label_es: 'Nombre del alumno', required: true },
        { id: 'curso_actual', type: 'text', label_en: 'Current / Completed Course', label_es: 'Curso actual o que acaba de terminar', required: true },
        { id: 'nivel_avance', type: 'select', label_en: 'Student Progress Level', label_es: 'Nivel de avance del alumno', required: true,
          options: [
            { value: 'inicio', label_en: 'Just started (first month)', label_es: 'Recién iniciado (primer mes)' },
            { value: 'mitad', label_en: 'Halfway through', label_es: 'A la mitad del curso' },
            { value: 'terminando', label_en: 'About to finish', label_es: 'Próximo a terminar' },
            { value: 'terminado', label_en: 'Just completed', label_es: 'Recién terminó el curso' }
          ]
        },
        { id: 'objetivo_alumno', type: 'text', label_en: "Student's Goal", label_es: 'Objetivo del alumno (laboral, personal, certificación)', required: true, placeholder_es: 'Conseguir empleo en empresa internacional, aprender por hobby, obtener certificación oficial...' },
        { id: 'cursos_siguientes', type: 'textarea', label_en: 'Next Courses / Programs Available', label_es: 'Cursos o programas siguientes disponibles en tu academia', required: true, placeholder_es: 'Nivel avanzado, certificación Cambridge, taller intensivo, mentoring 1:1, programa corporativo...' }
      ],
      prompt_template: `Eres el Coordinador Académico y Asesor de Ruta de Aprendizaje de una academia de alto rendimiento.
El alumno ya confía en la academia. Ahora tu trabajo es guiarle hacia el siguiente nivel que le acerque a {{objetivo_alumno}}.

Alumno: {{alumno}}
Curso actual: {{curso_actual}}
Nivel de avance: {{nivel_avance}}
Objetivo personal: {{objetivo_alumno}}
Cursos disponibles: {{cursos_siguientes}}

Diseña la "Ruta de Crecimiento Académico" personalizada para {{alumno}}:

1. LOS 3 PRÓXIMOS PASOS RECOMENDADOS: Selecciona de {{cursos_siguientes}} la ruta más directa hacia {{objetivo_alumno}}. Para cada paso explica: qué habilidad añade, cuánto tiempo toma y por qué es el momento perfecto dado el {{nivel_avance}} actual.

2. EL ARGUMENTO DE CONTINUIDAD: Por qué parar ahora sería desperdiciar la inversión ya realizada en {{curso_actual}}. Usa el concepto de "momentum de aprendizaje" y la brecha concreta que aún existe entre el nivel actual y {{objetivo_alumno}}.

3. EL GUION DEL ASESOR: Las palabras exactas para que el coordinador presente la ruta en la última clase o sesión de {{curso_actual}}, como una conversación de orientación, no como una venta.

4. LA OFERTA DE CONTINUIDAD: Un beneficio concreto por inscribirse al siguiente nivel sin pausa (precio especial, módulo de transición gratuito, o acceso anticipado a materiales). Que haga decisión fácil.`
    },
    {
      slug: 'plan-clase-ai',
      name_en: 'PlanClase AI',
      name_es: 'PlanClase AI',
      description_en: 'Generate engaging lesson plans and student progress reports in minutes.',
      description_es: 'Crea planes de clase atractivos y reportes de progreso que los padres y alumnos aman recibir.',
      icon: 'BookOpen',
      form_schema: [
        { id: 'materia', type: 'text', label_en: 'Subject / Course', label_es: 'Materia o curso', required: true, placeholder_es: 'Inglés B2, Matemáticas avanzadas, Guitarra eléctrica...' },
        { id: 'tema', type: 'text', label_en: 'Topic / Unit to Plan', label_es: 'Tema o unidad a planificar', required: true, placeholder_es: 'Present Perfect, Ecuaciones cuadráticas, Acordes de jazz...' },
        { id: 'nivel_grupo', type: 'select', label_en: 'Student Level', label_es: 'Nivel del grupo', required: true,
          options: [
            { value: 'principiante', label_en: 'Beginner', label_es: 'Principiante' },
            { value: 'intermedio', label_en: 'Intermediate', label_es: 'Intermedio' },
            { value: 'avanzado', label_en: 'Advanced', label_es: 'Avanzado' },
            { value: 'ninos', label_en: 'Children (5–12)', label_es: 'Niños (5–12 años)' },
            { value: 'adolescentes', label_en: 'Teenagers (13–17)', label_es: 'Adolescentes (13–17 años)' },
            { value: 'adultos', label_en: 'Adults', label_es: 'Adultos' }
          ]
        },
        { id: 'duracion', type: 'text', label_en: 'Class Duration', label_es: 'Duración de la clase (en minutos)', required: true },
        { id: 'objetivo_clase', type: 'text', label_en: 'Class Goal', label_es: 'Objetivo específico de esta clase', required: true, placeholder_es: 'Que el alumno pueda usar el Present Perfect en conversación espontánea' },
        { id: 'modalidad', type: 'select', label_en: 'Class Format', label_es: 'Modalidad de la clase', required: true,
          options: [
            { value: 'presencial', label_en: 'In-Person', label_es: 'Presencial' },
            { value: 'online', label_en: 'Online / Virtual', label_es: 'Online / Virtual' },
            { value: 'hibrida', label_en: 'Hybrid', label_es: 'Híbrida' }
          ]
        }
      ],
      prompt_template: `Actúa como un Diseñador Instruccional experto y maestro con 15 años de aula, especializado en hacer clases que los alumnos recuerdan y que los padres ven como resultados reales.

Materia: {{materia}}
Tema: {{tema}}
Nivel del grupo: {{nivel_grupo}}
Duración: {{duracion}} minutos
Objetivo: {{objetivo_clase}}
Modalidad: {{modalidad}}

Genera el "Plan de Clase Completo" para esta sesión:

1. ESTRUCTURA TEMPORAL (minuto a minuto):
Divide los {{duracion}} minutos en bloques: Apertura/Enganche (10%), Explicación Dinámica (30%), Práctica Guiada (30%), Práctica Independiente (20%), Cierre y Retroalimentación (10%). Para cada bloque describe la actividad exacta adaptada al nivel {{nivel_grupo}} y a la modalidad {{modalidad}}.

2. ACTIVIDAD ESTRELLA: El ejercicio o dinámica más memorable de la clase que garantice que {{objetivo_clase}} se alcance. Que sea retador pero alcanzable para {{nivel_grupo}}.

3. MATERIAL DE APOYO: Los 3 recursos concretos (ejercicios, ejemplos, pregunta de discusión, reto corto) que el maestro puede usar si el grupo avanza rápido o necesita más práctica.

4. REPORTE DE PROGRESO (para enviar a padres/alumnos post-clase):
Un mensaje de WhatsApp de 4-5 líneas que el maestro envía al terminar la clase, describiendo qué se aprendió hoy, qué hizo bien el alumno, y cuál es el reto de práctica hasta la próxima sesión. Cálido, específico, que haga sentir que la academia es seria y el maestro comprometido.`
    },
    {
      slug: 'decide-academia',
      name_en: 'DecideAcademia',
      name_es: 'DecideAcademia',
      description_en: 'Your enrollment data should tell you which courses to grow and which to cut.',
      description_es: 'Analiza inscripciones, deserción y rentabilidad para tomar decisiones que hacen crecer tu academia.',
      icon: 'BarChart2',
      form_schema: [
        { id: 'datos_academia', type: 'textarea', label_en: 'Academy Data (enrollments, revenue, dropout)', label_es: 'Datos de la academia (inscripciones, ingresos, deserción, cursos activos)', required: true },
        { id: 'problema', type: 'text', label_en: 'Main Business Problem', label_es: 'Principal problema o decisión que necesitas tomar', required: true },
        { id: 'area', type: 'select', label_en: 'Focus Area', label_es: 'Área a analizar', required: true,
          options: [
            { value: 'inscripciones', label_en: 'Enrollment & Acquisition', label_es: 'Inscripciones y captación de alumnos' },
            { value: 'retencion', label_en: 'Retention & Dropout Reduction', label_es: 'Retención y reducción de deserción' },
            { value: 'rentabilidad', label_en: 'Course Profitability', label_es: 'Rentabilidad por curso / horario' },
            { value: 'expansion', label_en: 'New Courses / Expansion', label_es: 'Nuevos cursos o expansión de oferta' },
            { value: 'precios', label_en: 'Pricing & Payment Plans', label_es: 'Precios y planes de pago' }
          ]
        },
        { id: 'tipo_academia', type: 'text', label_en: 'Academy Type / Specialty', label_es: 'Tipo de academia o especialidad', required: true },
        { id: 'contexto', type: 'textarea', label_en: 'Context (competition, season)', label_es: 'Contexto relevante (competencia, temporada de inscripciones, zona)', required: true }
      ],
      prompt_template: `Eres un Consultor Estratégico especializado en instituciones educativas privadas y academias de enseñanza.
El error más común: el director académico toma decisiones con el corazón ("este curso me encanta") en lugar de con los números.

Academia: {{tipo_academia}}
Datos: {{datos_academia}}
Problema: {{problema}}
Área: {{area}}
Contexto: {{contexto}}

Entrega 3 Decisiones Estratégicas ejecutables esta semana. Para cada una:
1. LA DECISIÓN: Acción concreta y medible (ej. "Cancelar el grupo de martes 7pm que tiene 3 alumnos y margen negativo", "Lanzar campaña de WhatsApp a los 45 ex-alumnos que dejaron el nivel 2 en los últimos 6 meses", "Ofrecer plan de pago en 3 parcialidades a partir del próximo ciclo").
2. FUNDAMENTO EN DATOS: Cómo los números de {{datos_academia}} justifican esta decisión para el área de {{area}}.
3. EJECUCIÓN EN 48H: El primer paso que el director o coordinador ejecuta mañana para activar la decisión.

Finaliza con el "Semáforo Académico":
🟢 Academia en Crecimiento | 🟡 Estable pero con fuga | 🔴 Deserción o ingresos en caída
Justificado en dos líneas con los datos y el {{problema}} proporcionado.`
    },
    {
      slug: 'pulse-academia',
      name_en: 'PulseAcademia',
      name_es: 'PulseAcademia',
      description_en: 'Know your academy\'s enrollment health in 60 seconds every week.',
      description_es: 'El reporte semanal de tu academia: inscripciones, asistencia, renovaciones y alertas.',
      icon: 'Activity',
      form_schema: [
        { id: 'alumnos_activos', type: 'text', label_en: 'Active Students This Month', label_es: 'Alumnos activos este mes', required: true },
        { id: 'nuevas_inscripciones', type: 'text', label_en: 'New Enrollments This Week', label_es: 'Nuevas inscripciones esta semana', required: true },
        { id: 'bajas_semana', type: 'text', label_en: 'Dropouts This Week', label_es: 'Bajas o cancelaciones esta semana', required: true },
        { id: 'ingresos_semana', type: 'text', label_en: 'Revenue This Week', label_es: 'Ingresos de la semana ($)', required: true },
        { id: 'renovaciones_pendientes', type: 'text', label_en: 'Renewals Due This Month', label_es: 'Alumnos con renovación pendiente este mes', required: true },
        { id: 'incidencias', type: 'textarea', label_en: 'Notable Incidents / Issues', label_es: 'Incidencias o situaciones relevantes de la semana', required: false, placeholder_es: 'Maestro que faltó, queja de padre de familia, grupo con baja asistencia...' },
        { id: 'meta_inscripciones', type: 'text', label_en: 'Monthly Enrollment Goal', label_es: 'Meta de inscripciones del mes', required: false }
      ],
      prompt_template: `Actúa como el Sistema de Inteligencia Académica y Comercial de una academia educativa de alto rendimiento.
El director necesita el panorama completo de la semana en menos de 60 segundos.

- Alumnos activos: {{alumnos_activos}}
- Nuevas inscripciones: {{nuevas_inscripciones}}
- Bajas esta semana: {{bajas_semana}}
- Ingresos de la semana: \${{ingresos_semana}}
- Renovaciones pendientes: {{renovaciones_pendientes}}
- Incidencias: {{incidencias}}
- Meta mensual de inscripciones: {{meta_inscripciones}}

Genera el "PulseAcademia Semanal":

1. SEMÁFORO EJECUTIVO:
🟢 Semana de Crecimiento | 🟡 Retención bajo presión | 🔴 Fuga de alumnos crítica
Basado en el balance: {{nuevas_inscripciones}} entradas vs. {{bajas_semana}} salidas y el ingreso vs. meta.

2. TASA DE RETENCIÓN: Calcula el porcentaje de retención semanal y evalúa si es saludable para una academia. Identifica si hay un patrón de deserción en {{incidencias}} que requiera acción inmediata.

3. ALERTA DE RENOVACIONES: Con {{renovaciones_pendientes}} alumnos por renovar, genera el mensaje de recordatorio que el coordinador envía HOY a los 3 alumnos con mayor riesgo de no renovar (los que llevan más tiempo sin confirmar), de forma personalizada y sin sonar como cobrador.

4. PROYECCIÓN AL CIERRE DEL MES: Si el ritmo de esta semana se mantiene, ¿cuántas inscripciones netas cerrará el mes? ¿Cuántas nuevas inscripciones se necesitan para alcanzar la meta {{meta_inscripciones}}? ¿Qué acción inmediata puede activar el director esta semana para lograrlo?`
    },
    {
      slug: 'edu-loop',
      name_en: 'EduLoop Premium',
      name_es: 'EduLoop Premium',
      description_en: 'From first inquiry to lifelong learner. Full academy growth system.',
      description_es: 'Inscripciones + Retención + Crecimiento académico. El sistema completo de tu academia.',
      icon: 'RefreshCw',
      form_schema: [
        { id: 'academia', type: 'text', label_en: 'Academy Name', label_es: 'Nombre de la academia', required: true },
        { id: 'especialidad', type: 'text', label_en: 'Specialty / Courses Offered', label_es: 'Especialidad y cursos principales que impartes', required: true, placeholder_es: 'Inglés para adultos y niños, Computación, Música...' },
        { id: 'num_alumnos', type: 'text', label_en: 'Current Student Count', label_es: 'Número actual de alumnos inscritos', required: true },
        { id: 'dolor_inscripciones', type: 'textarea', label_en: 'Enrollment Problem', label_es: 'Problema principal para conseguir nuevos alumnos', required: true },
        { id: 'dolor_retencion', type: 'textarea', label_en: 'Retention / Dropout Problem', label_es: 'Problema principal de deserción o falta de renovaciones', required: true },
        { id: 'fase', type: 'select', label_en: 'Priority Phase Today', label_es: 'Módulo donde necesitas más impacto hoy', required: true,
          options: [
            { value: 'captacion', label_en: 'New Student Acquisition', label_es: 'Captación de nuevos alumnos' },
            { value: 'retencion', label_en: 'Student Retention & Renewals', label_es: 'Retención y renovaciones' },
            { value: 'crecimiento', label_en: 'Academic Growth & New Revenue', label_es: 'Crecimiento académico y nuevos ingresos' }
          ]
        }
      ],
      prompt_template: `Eres el Consultor Estratégico de referencia para academias y centros educativos privados, implementando el sistema "EduLoop": el ciclo de crecimiento sin fugas para directores académicos con visión empresarial.

Academia: {{academia}}
Especialidad: {{especialidad}}
Alumnos actuales: {{num_alumnos}}
Problema de captación: {{dolor_inscripciones}}
Problema de retención: {{dolor_retencion}}
Fase prioritaria: {{fase}}

Activa el módulo EduLoop correspondiente:

Si {{fase}} = CAPTACIÓN:
→ Diseña la "Campaña de Inscripciones de Alto Impacto" para {{academia}}. Incluye: (1) el perfil exacto del alumno ideal para {{especialidad}} y dónde encontrarlo, (2) el mensaje de WhatsApp de captación más efectivo (con ganchos emocionales y beneficios concretos), (3) la estrategia de "clase de prueba gratuita" o "tour de bienvenida" que convierte prospectos en inscritos en 48h, y (4) el protocolo de seguimiento de 5 días para prospectos que no responden.

Si {{fase}} = RETENCIÓN:
→ Construye el "Sistema Anti-Deserción de {{academia}}": el mapa de los 3 momentos críticos donde los alumnos de {{especialidad}} tienen más probabilidad de abandonar y la intervención exacta en cada uno (mensaje del maestro, llamada del coordinador, ajuste de plan de pago), el protocolo de "señales de alerta temprana" para detectar al alumno que va a desertar antes de que lo diga, y la política de renovación con beneficio anticipado (descuento, material extra, próximo nivel garantizado).

Si {{fase}} = CRECIMIENTO:
→ Diseña el "Portafolio de Crecimiento de Ingresos de {{academia}}": las 3 nuevas fuentes de ingresos que puede activar sin grandes inversiones (cursos intensivos de fin de semana, grupos corporativos, modalidad online, talleres de vacaciones), la estrategia de alianzas con escuelas o empresas locales para generar grupos cautivos, y el plan de expansión para pasar de {{num_alumnos}} a 2x en 12 meses con las cifras de inversión necesarias.

Cierra siempre con "El Próximo Movimiento de {{academia}}": la única acción de mayor ROI que el director ejecuta esta semana.`
    }
  ]

  // Fetch plans
  const { data: plans, error: planError } = await supabase.from('plans').select('id, slug')
  if (planError) {
    console.error('Error fetching plans:', planError)
    return
  }

  const proPlan = plans.find(p => p.slug === 'professional' || p.slug === 'pro')
  const businessPlan = plans.find(p => p.slug === 'business' || p.slug === 'enterprise')

  for (const app of apps) {
    const appId = crypto.randomUUID()
    console.log(`Inserting app: ${app.slug}...`)

    const { error: appError } = await supabase.from('micro_apps').insert({
      id: appId,
      slug: app.slug,
      name_en: app.name_en,
      name_es: app.name_es,
      description_en: app.description_en,
      description_es: app.description_es,
      icon: app.icon,
      form_schema: app.form_schema,
      prompt_template: app.prompt_template
    })

    if (appError) {
      if (appError.code === '23505') {
        console.log(`App ${app.slug} already exists, updating...`)
        const { data: existingApp } = await supabase
          .from('micro_apps')
          .select('id')
          .eq('slug', app.slug)
          .single()

        if (existingApp) {
          app.id = existingApp.id
          await supabase.from('micro_apps').update({
            name_en: app.name_en,
            name_es: app.name_es,
            description_en: app.description_en,
            description_es: app.description_es,
            icon: app.icon,
            form_schema: app.form_schema,
            prompt_template: app.prompt_template
          }).eq('id', app.id)
          console.log(`Updated ${app.slug}`)
        }
      } else {
        console.error(`Error inserting ${app.slug}:`, appError.message)
        continue
      }
    } else {
      app.id = appId
    }

    // Business plan for premium/analytics apps, Pro for the rest
    let targetPlan = proPlan
    if (app.slug === 'edu-loop' || app.slug === 'decide-academia') {
      targetPlan = businessPlan || proPlan
    }

    if (targetPlan && app.id) {
      const { data: existingLink } = await supabase
        .from('plan_apps')
        .select('*')
        .eq('plan_id', targetPlan.id)
        .eq('app_id', app.id)
        .single()

      if (!existingLink) {
        await supabase.from('plan_apps').insert({
          plan_id: targetPlan.id,
          app_id: app.id
        })
        console.log(`Linked ${app.slug} → plan ${targetPlan.slug}`)
      } else {
        console.log(`${app.slug} already linked to plan ${targetPlan.slug}`)
      }
    }
  }

  console.log('\n✅ Micro-Apps de Educación / Academias completadas.')
  console.log('Apps insertadas:')
  apps.forEach(a => console.log(` - ${a.slug} (${a.name_es})`))
}

run()

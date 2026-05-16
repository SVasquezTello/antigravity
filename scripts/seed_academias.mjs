import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('📚 Seeding Premium Academias & Course Creators Apps...')

  const apps = [
    {
      slug: 'acad-syllabus-creator',
      name_en: 'Syllabus Architect',
      name_es: 'Syllabus Architect',
      description_en: 'Design a comprehensive, highly-structured course syllabus in seconds.',
      description_es: 'Diseña un temario estructurado y pedagógico para tu curso en segundos.',
      icon: 'BookOpen',
      form_schema: [
        { id: 'tema', type: 'text', label_es: 'Tema Principal del Curso', required: true },
        { id: 'audiencia', type: 'text', label_es: 'Nivel/Audiencia (Ej: Principiantes, Avanzados)', required: true },
        { id: 'duracion', type: 'text', label_es: 'Duración (Ej: 4 Semanas, 12 Módulos)', required: true }
      ],
      prompt_template: 'Eres un diseñador instruccional experto. Diseña un temario completo para un curso sobre "{{tema}}" dirigido a "{{audiencia}}". La duración será de "{{duracion}}". El temario debe incluir:\n1. Título atractivo para el curso.\n2. Promesa del curso (qué lograrán al final).\n3. Desglose módulo por módulo con 3 lecciones clave por cada uno.\n4. Una idea de "proyecto final" práctico para los alumnos.'
    },
    {
      slug: 'acad-quiz-generator',
      name_en: 'QuizGen Pro',
      name_es: 'QuizGen Pro',
      description_en: 'Instantly generate multiple-choice quizzes to evaluate your students.',
      description_es: 'Genera instantáneamente cuestionarios de opción múltiple para evaluar a tus alumnos.',
      icon: 'Target',
      form_schema: [
        { id: 'texto_leccion', type: 'textarea', label_es: 'Pega el texto o resumen de tu lección', required: true },
        { id: 'cantidad', type: 'text', label_es: 'Cantidad de preguntas (Ej: 5)', required: true },
        { id: 'dificultad', type: 'text', label_es: 'Nivel de dificultad (Fácil, Medio, Difícil)' }
      ],
      prompt_template: 'Basado en el siguiente contenido de la lección: "{{texto_leccion}}", genera {{cantidad}} preguntas de opción múltiple con nivel de dificultad {{dificultad}}.\nPara cada pregunta, proporciona 4 opciones (A, B, C, D) donde solo una sea correcta. Al final, incluye una "Hoja de Respuestas" indicando la opción correcta y una breve explicación del porqué.'
    },
    {
      slug: 'acad-sales-letter',
      name_en: 'Course Sales Copy',
      name_es: 'Course Sales Copy',
      description_en: 'Write a high-converting sales page specifically for online courses.',
      description_es: 'Redacta una página de ventas de alta conversión diseñada específicamente para cursos online.',
      icon: 'PenTool',
      form_schema: [
        { id: 'nombre_curso', type: 'text', label_es: 'Nombre del Curso', required: true },
        { id: 'beneficio', type: 'text', label_es: 'Beneficio Principal (Ej: Aprende a programar en 30 días)', required: true },
        { id: 'dolor', type: 'text', label_es: 'Dolor que resuelve (Ej: Estás estancado en tu carrera)', required: true },
        { id: 'precio', type: 'text', label_es: 'Precio / Oferta', required: true }
      ],
      prompt_template: 'Eres un copywriter experto en lanzamientos de info-productos. Escribe una página de ventas persuasiva para el curso "{{nombre_curso}}".\nEstructura:\n1. Titular llamativo basado en: {{beneficio}}.\n2. Historia o agitación del problema: {{dolor}}.\n3. Presentación de la solución (el curso).\n4. 3 viñetas de beneficios transformacionales.\n5. Llamado a la acción con urgencia y el precio de {{precio}}.'
    },
    {
      slug: 'acad-webinar-script',
      name_en: 'Webinar Closer Script',
      name_es: 'Webinar Closer Script',
      description_en: 'Create a perfect webinar script (Hook, Content, Pitch) to sell your coaching or course.',
      description_es: 'Crea el guion perfecto para tu webinar o clase gratuita que termine en ventas.',
      icon: 'Video',
      form_schema: [
        { id: 'tema_webinar', type: 'text', label_es: 'Tema de la Clase Gratuita', required: true },
        { id: 'secreto', type: 'text', label_es: 'El "Secreto" que vas a revelar', required: true },
        { id: 'producto_vender', type: 'text', label_es: 'Curso a vender al final', required: true }
      ],
      prompt_template: 'Actúa como Russell Brunson. Escribe el guion para un Webinar (Clase Gratuita) sobre "{{tema_webinar}}".\nSigue la estructura del "Perfect Webinar":\n1. INTRO: Gancho fuerte de los primeros 5 minutos y promesa.\n2. HISTORIA: Tu historia de origen relacionada al tema.\n3. CONTENIDO: Revela el gran secreto: "{{secreto}}".\n4. EL PITCH (Venta): Transición suave para vender "{{producto_vender}}" al final, incluyendo apilamiento de valor (Value Stack).'
    },
    {
      slug: 'acad-student-retention',
      name_en: 'Student Retention Emailer',
      name_es: 'Retención de Alumnos',
      description_en: 'Generate automated email sequences to keep students motivated and reduce drop-off.',
      description_es: 'Genera secuencias de correos para mantener a tus alumnos motivados y reducir el abandono escolar.',
      icon: 'Heart',
      form_schema: [
        { id: 'hito', type: 'text', label_es: 'Momento del alumno (Ej: Bienvenida, 50% completado, Estancado)', required: true },
        { id: 'accion_deseada', type: 'text', label_es: 'Acción que quieres que tomen', required: true }
      ],
      prompt_template: 'Eres un experto en Customer Success para educación online. Escribe un correo empático y motivador para un alumno que está en el momento: "{{hito}}". \nEl objetivo es que el alumno se sienta apoyado y tome la siguiente acción: "{{accion_deseada}}". \nUsa un tono amigable, inspirador y directo. Incluye un Asunto de correo que garantice alta tasa de apertura.'
    },
    {
      slug: 'acad-funnel-hacker-ai',
      name_en: 'AI Funnel Hacker',
      name_es: 'AI Funnel Hacker',
      description_en: 'Replicate Russell Brunson\'s 3-Step AI Framework (Output, Context, Voice) to generate 100+ email sequences or long-form VSLs.',
      description_es: 'Aplica el método de 3 pasos de Russell Brunson (Output, Context, Voice) para clonar embudos, generar VSLs largos y crear secuencias de 100+ emails.',
      icon: 'Cpu',
      form_schema: [
        { id: 'output_ejemplo', type: 'textarea', label_es: 'Output: Pega la transcripción del VSL/Embudo que quieres modelar (No copiar, solo modelar)', required: true },
        { id: 'contexto', type: 'textarea', label_es: 'Contexto: Pega historias, datos, documentales sobre tu curso/nicho', required: true },
        { id: 'voz', type: 'textarea', label_es: 'Voz: Pega un texto escrito por ti para que la IA clone tu estilo', required: true }
      ],
      prompt_template: 'Eres un maestro del "Funnel Hacking" entrenado por Russell Brunson. El usuario te ha dado tres cosas cruciales (La Regla 500:1).\n1. OUTPUT DESEADO (Estructura a modelar): {{output_ejemplo}}.\n2. CONTEXTO (Historia y datos del producto): {{contexto}}.\n3. VOZ (Estilo de escritura del autor): {{voz}}.\n\nInstrucciones:\nCombina el Contexto con la Voz del autor para generar un "Video Sales Letter" (VSL) o un guion de ventas que siga exactamente la misma estructura rítmica y psicológica del Output proporcionado. No copies las palabras del Output, modela su estructura. El resultado debe sonar natural, extremadamente persuasivo y listo para grabar.'
    }
  ]

  const { data: offer } = await supabase.from('offers').select('id').eq('slug', 'professional').single()
  
  for (const app of apps) {
    const { data: newApp } = await supabase.from('micro_apps').upsert(app, { onConflict: 'slug' }).select('id').single()
    if (offer && newApp) {
      await supabase.from('offer_apps').upsert({ offer_id: offer.id, app_id: newApp.id }, { onConflict: 'offer_id,app_id' })
    }
  }

  console.log('✅ 5 Academias & Education Apps Seeded and Linked to Pro Plan.')
}

run()

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🎓 Seeding Micro-Apps para Educación y Academias...')

  const apps = [
    {
      slug: 'lesson-planner-ai',
      name_en: 'LessonPlanner AI',
      name_es: 'LessonPlanner AI',
      description_en: 'Create a complete educational curriculum in seconds.',
      description_es: 'Crea un plan de estudios educativo completo en segundos.',
      icon: 'BookOpen',
      form_schema: [
        { id: 'materia', type: 'text', label_en: 'Subject', label_es: 'Materia/Tema', required: true },
        { id: 'nivel', type: 'select', label_en: 'Student Level', label_es: 'Nivel del estudiante', required: true,
          options: [
            { value: 'basico', label_en: 'Beginner', label_es: 'Básico/Principiante' },
            { value: 'intermedio', label_en: 'Intermediate', label_es: 'Intermedio' },
            { value: 'avanzado', label_en: 'Advanced', label_es: 'Avanzado' }
          ]
        },
        { id: 'objetivo', type: 'textarea', label_en: 'Learning Objective', label_es: 'Objetivo de aprendizaje', required: true }
      ],
      prompt_template: `Actúa como un Diseñador Instruccional experto. Diseña un plan de lección para {{materia}}.
      
      DATOS:
      - Nivel: {{nivel}}
      - Objetivo: {{objetivo}}
      
      GENERA:
      1. Resumen de la lección (50 palabras).
      2. 5 Puntos Clave que deben aprender.
      3. Una Actividad Práctica para reforzar el conocimiento.
      4. 3 Preguntas de Evaluación final.`
    },
    {
      slug: 'course-curriculum-pro',
      name_en: 'Course Architect',
      name_es: 'Arquitecto de Cursos',
      description_en: 'Structure your online course or workshop with professional standards.',
      description_es: 'Estructura tu curso online o workshop con estándares profesionales.',
      icon: 'Layers',
      form_schema: [
        { id: 'nombre_curso', type: 'text', label_en: 'Course Name', label_es: 'Nombre del curso', required: true },
        { id: 'promesa', type: 'textarea', label_en: 'Course Promise', label_es: 'Promesa del curso (¿Qué lograrán?)', required: true },
        { id: 'duracion', type: 'text', label_en: 'Total Duration', label_es: 'Duración total estimada', required: true }
      ],
      prompt_template: `Eres un experto en Creación de Infoproductos. Diseña la estructura para: {{nombre_curso}}.
      
      PROMESA: {{promesa}}
      DURACIÓN: {{duracion}}
      
      ESTRUCTURA SUGERIDA:
      - Módulo 1: Fundamentos y Mentalidad.
      - Módulos 2-4: El Paso a Paso del Método.
      - Módulo 5: Implementación y Escala.
      
      Para cada módulo, define el entregable principal del alumno.`
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

  console.log('\n✅ Vertical de Educación completada.')
}

run()

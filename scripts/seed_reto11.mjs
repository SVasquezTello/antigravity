import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('Seeding Reto 11: 5 Education/Academy Micro-Apps...')

  const apps = [
    {
      slug: 'matricula-rescue',
      name_en: 'Enrollment Rescue',
      name_es: 'MatriculaRescue',
      description_en: 'Recovers incomplete admissions and generates tailored follow-up messages.',
      description_es: 'Recupera cada inscripción perdida antes de que se vaya a la competencia.',
      icon: 'UserPlus',
      form_schema: [
        { id: 'name', type: 'text', label_en: 'Prospect/Family Name', label_es: 'Nombre del prospecto/familia', required: true },
        { id: 'date', type: 'text', label_en: 'Date of inquiry', label_es: 'Fecha en que pidió informes', required: true },
        { id: 'stage', type: 'select', label_en: 'Last completed step', label_es: 'Último paso completado', required: true,
          options: [
            { value: 'info', label_en: 'Asked for info', label_es: 'Pidió informes' },
            { value: 'visit', label_en: 'Visited school', label_es: 'Visitó escuela' },
            { value: 'proposal', label_en: 'Received proposal', label_es: 'Recibió propuesta' },
            { value: 'partial_form', label_en: 'Partial form', label_es: 'Llenó formulario parcial' },
            { value: 'reserved', label_en: 'Paid to reserve', label_es: 'Pagó apartar lugar' }
          ]
        },
        { id: 'channel', type: 'select', label_en: 'Preferred channel', label_es: 'Medio de contacto preferido', required: true,
          options: [
            { value: 'whatsapp', label_en: 'WhatsApp', label_es: 'WhatsApp' },
            { value: 'email', label_en: 'Email', label_es: 'Email' },
            { value: 'call', label_en: 'Phone Call', label_es: 'Llamada' }
          ]
        },
        { id: 'contact_info', type: 'text', label_en: 'Contact Data', label_es: 'Datos de contacto', required: true }
      ],
      prompt_template: `You are an expert sales admissions director for a private academy. 
Please create a highly persuasive and personalized follow-up message for the following prospect:
Family/Prospect: {{name}}
Date of inquiry: {{date}}
Last completed step: {{stage}}
Preferred channel: {{channel}}
Contact Info: {{contact_info}}

Structure the output:
1. Recommended Action (e.g. Call immediately or send message)
2. Message ready to copy/paste in the preferred channel. It should be friendly, solve their specific pain based on the step they reached, and invite them clearly to the next step.
3. Analysis on urgency.`
    },
    {
      slug: 'junta-clara',
      name_en: 'Clear Meetings',
      name_es: 'JuntaClara',
      description_en: 'Turns meeting notes or audio transcripts into structured formal minutes in 60s.',
      description_es: 'De grabación o notas a acta lista en 60 segundos.',
      icon: 'Mic',
      form_schema: [
        { id: 'type', type: 'select', label_en: 'Meeting Type', label_es: 'Tipo de reunión', required: true,
          options: [
            { value: 'teachers', label_en: 'Teachers Meeting', label_es: 'Junta de maestros' },
            { value: 'parents', label_en: 'Parents Meeting', label_es: 'Reunión de padres' },
            { value: 'cte', label_en: 'Technical Council (CTE)', label_es: 'Consejo técnico' },
            { value: 'tutoring', label_en: 'Group Tutoring', label_es: 'Tutoría grupal' },
            { value: 'direction', label_en: 'Direction', label_es: 'Dirección' },
            { value: 'other', label_en: 'Other', label_es: 'Otra' }
          ]
        },
        { id: 'participants', type: 'text', label_en: 'Date and Participants', label_es: 'Fecha y participantes', required: true },
        { id: 'notes', type: 'textarea', label_en: 'Notes or Transcript', label_es: 'Notas o transcripción de la reunión', required: true },
        { id: 'format', type: 'select', label_en: 'Desired Format', label_es: '¿Qué formato necesitas?', required: true,
          options: [
            { value: 'acta', label_en: 'Formal Minutes with Signatures', label_es: 'Acta formal con firmas' },
            { value: 'executive', label_en: 'Executive Summary', label_es: 'Resumen ejecutivo' },
            { value: 'tasks', label_en: 'List of Agreements and Assignees', label_es: 'Lista de acuerdos y responsables' },
            { value: 'email', label_en: 'Email to Parents', label_es: 'Email para enviar a padres' }
          ]
        }
      ],
      prompt_template: `Format these unstructured meeting notes into a highly professional document for an educational institution.
Meeting Type: {{type}}
Date and Participants: {{participants}}
Format required: {{format}}

Notes/Transcript:
{{notes}}

Tasks: Identify the main topics, agreements, deadlines, and responsibilities. Extract this beautifully into the requested format using standard formal Spanish/Latam institutional language unless otherwise requested.`
    },
    {
      slug: 'pasa-lista',
      name_en: 'Student Handoff',
      name_es: 'PasaLista',
      description_en: 'Creates a complete student transfer file for the next teacher.',
      description_es: 'El expediente completo del alumno en manos del maestro correcto.',
      icon: 'FolderOpen',
      form_schema: [
        { id: 'student', type: 'text', label_en: 'Student Name', label_es: 'Nombre del alumno', required: true },
        { id: 'level', type: 'text', label_en: 'Previous Level/Group', label_es: 'Nivel/materia/grupo que dejó', required: true },
        { id: 'old_teacher', type: 'text', label_en: 'Previous Teacher', label_es: 'Maestro anterior', required: true },
        { id: 'new_teacher', type: 'text', label_en: 'New Teacher', label_es: 'Maestro nuevo', required: true },
        { id: 'transfer_notes', type: 'textarea', label_en: 'Transfer Notes', label_es: 'Notas de transferencia', required: true },
        { id: 'start_date', type: 'text', label_en: 'Start Date with New Teacher', label_es: 'Fecha de inicio', required: true }
      ],
      prompt_template: `Act as an academic coordinator. Read the following informal notes from a teacher about a student and create a structured "Transfer Dossier".

Student: {{student}}
Previous Level/Group: {{level}}
From Teacher: {{old_teacher}}
To Teacher: {{new_teacher}}
Start Date: {{start_date}}

Informal Notes:
{{transfer_notes}}

Output a formal 1-page document with the following sections:
1. Current Level
2. Strengths
3. Areas of Attention
4. Agreements with Parents
5. Recommendations for the first 2 weeks.`
    },
    {
      slug: 'maestro-nuevo',
      name_en: 'New Teacher Onboarding',
      name_es: 'MaestroNuevo',
      description_en: 'Generates a complete onboarding manual for new teachers in 5 minutes.',
      description_es: 'El manual de onboarding de tu academia, generado en 5 minutos.',
      icon: 'GraduationCap',
      form_schema: [
        { id: 'academy_name', type: 'text', label_en: 'Academy Name', label_es: 'Nombre de la academia', required: true },
        { id: 'academy_type', type: 'text', label_en: 'Type of Academy', label_es: 'Tipo de academia', required: true },
        { id: 'platforms', type: 'text', label_en: 'Platforms in use', label_es: 'Plataformas que usan', required: true },
        { id: 'methodology', type: 'textarea', label_en: 'Methodology / Approach', label_es: 'Metodología o enfoque', required: true },
        { id: 'policies', type: 'textarea', label_en: 'Key Policies', label_es: 'Políticas clave', required: true },
        { id: 'process', type: 'textarea', label_en: 'Attendance & Grades Process', label_es: 'Proceso de asistencias/calificaciones', required: true },
        { id: 'hard_concepts', type: 'textarea', label_en: 'What is hardest to understand?', label_es: '¿Qué cuesta más entender?', required: true }
      ],
      prompt_template: `You are an HR expert at an educational institution. Take the following information about an academy and generate a comprehensive 'Teacher Onboarding Manual'.

Academy Name: {{academy_name}}
Type: {{academy_type}}
Platforms: {{platforms}}
Methodology: {{methodology}}
Policies: {{policies}}
Reporting Process: {{process}}
Hardest concepts for newcomers: {{hard_concepts}}

Create a 4-6 page structure formatted in Markdown, organized by weeks (Week 1: Urgent, Week 2: Operative, Week 3: Cultural). Include a task checklist, FAQ for the new teacher, and a "Perfect Day 1" step-by-step guide.`
    },
    {
      slug: 'captura-sana',
      name_en: 'Data Capturer',
      name_es: 'CapturaSana',
      description_en: 'Smart form structure generator to standardize data capture from your team.',
      description_es: 'Un formulario inteligente que estandariza cómo tu equipo registra datos.',
      icon: 'Database',
      form_schema: [
        { id: 'academy_name', type: 'text', label_en: 'Academy Name', label_es: 'Nombre de la academia', required: true },
        { id: 'data_type', type: 'select', label_en: 'Data to standardize', label_es: 'Tipo de dato a estandarizar', required: true,
          options: [
            { value: 'students', label_en: 'Student Roster', label_es: 'Registro de alumnos' },
            { value: 'grades', label_en: 'Grades', label_es: 'Calificaciones' },
            { value: 'attendance', label_en: 'Attendance', label_es: 'Asistencias' },
            { value: 'reports', label_en: 'Reports', label_es: 'Reportes a padres' },
            { value: 'payments', label_en: 'Payments', label_es: 'Pagos recibidos' }
          ]
        },
        { id: 'current_capture', type: 'textarea', label_en: 'How is it captured today?', label_es: '¿Cómo lo capturan hoy?', required: true },
        { id: 'inconsistencies', type: 'textarea', label_en: 'Frequent inconsistencies', label_es: 'Inconsistencias frecuentes', required: true },
        { id: 'teachers_count', type: 'text', label_en: 'Number of teachers processing', label_es: '¿Cuántos maestros lo capturan?', required: true }
      ],
      prompt_template: `Act as a Data Standardisation Expert. Analyse the current data capture method and generate a standardised capture protocol.

Academy: {{academy_name}}
Data Type: {{data_type}}
Current Method: {{current_capture}}
Inconsistencies detected: {{inconsistencies}}
Users: {{teachers_count}}

Provide:
1. The exact fields they should use moving forward (Data Dictionary with validation rules).
2. A 1-page quick guide titled 'How we capture data at {{academy_name}}' to share with the team.
3. An equivalence table to clean historical data (Map of the old way to the new uniform way).`
    },
    {
      slug: 'academia-lista',
      name_en: 'Academy Ready Planner',
      name_es: 'AcademiaLista',
      description_en: 'Start-of-year system bridging admissions recovery and staff onboarding.',
      description_es: 'Fusión: Del prospecto perdido al maestro listo el primer día.',
      icon: 'Zap',
      form_schema: [
        { id: 'academy_name', type: 'text', label_en: 'Academy Name', label_es: 'Nombre de la academia', required: true },
        { id: 'academy_type', type: 'text', label_en: 'Academy Type', label_es: 'Tipo de academia', required: true },
        { id: 'start_date', type: 'text', label_en: 'Cycle Start Date', label_es: 'Fecha de inicio del ciclo', required: true },
        { id: 'prospects', type: 'textarea', label_en: 'Incomplete Prospects List', label_es: 'Lista de prospectos', required: true },
        { id: 'new_teachers', type: 'text', label_en: 'Number of new teachers', label_es: 'Número de maestros nuevos', required: true },
        { id: 'methodology', type: 'textarea', label_en: 'Methodology & Platforms', label_es: 'Metodología/Plataformas', required: true },
        { id: 'policies', type: 'textarea', label_en: 'Key Policies', label_es: 'Políticas clave', required: true },
        { id: 'timeline', type: 'select', label_en: 'Time left', label_es: '¿Cuánto falta para el ciclo?', required: true,
          options: [
            { value: '1_week', label_en: 'Less than a week', label_es: 'Menos de 1 semana' },
            { value: '2_weeks', label_en: '1-2 weeks', label_es: '1-2 semanas' },
            { value: '4_weeks', label_en: '3-4 weeks', label_es: '3-4 semanas' },
            { value: 'more', label_en: 'More than a month', label_es: 'Más de un mes' }
          ]
        }
      ],
      prompt_template: `You are the ultimate Educational Director Copilot. Here is the operational reality of the academy:
Name: {{academy_name}} ({{academy_type}})
Start Date: {{start_date}} (Time left: {{timeline}})
New teachers entering: {{new_teachers}}
Methodology & Ecosystem: {{methodology}}
Policies: {{policies}}
Lost/Incomplete Prospects:
{{prospects}}

Process this into a 2-part Start-of-Cycle Master Document:
Part A: Admissions Recovery Plan. Sort prospects by closure likelihood, provide a 14-day follow-up calendar and specific messaging scripts.
Part B: Teacher Onboarding Manual. Create an onboarding guide with a specific section on "How to welcome the recently rescued students / Late enrollers".
Bonus: A "Perfect Cycle Start" checklist.`
    }
  ]

  // 1. Fetch Professional Plan ID
  const { data: plans, error: planError } = await supabase.from('plans').select('id, slug')
  if (planError) {
    console.error('Error fetching plans:', planError)
    return
  }

  const proPlan = plans.find(p => p.slug === 'professional' || p.slug === 'pro')
  if (!proPlan) console.warn('⚠️ Professional plan not found')

  const businessPlan = plans.find(p => p.slug === 'business' || p.slug === 'enterprise')
  if (!businessPlan) console.warn('⚠️ Business plan not found')

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
        console.log(`App ${app.slug} already exists, skipping insert.`)
        
        // Fetch existing app ID
        const { data: existingApp } = await supabase.from('micro_apps')
           .select('id').eq('slug', app.slug).single()
        
        if (existingApp) {
           app.id = existingApp.id
        }
      } else {
        console.error(`Error inserting ${app.slug}:`, appError)
        continue
      }
    } else {
      app.id = appId
    }

    // Link Plan
    let targetPlan = proPlan
    if (app.slug === 'academia-lista') {
      targetPlan = businessPlan || proPlan
    }

    if (targetPlan && app.id) {
      const { data: existingLink } = await supabase.from('plan_apps')
        .select('*')
        .eq('plan_id', targetPlan.id)
        .eq('app_id', app.id)
        .single()
      
      if (!existingLink) {
        await supabase.from('plan_apps').insert({ plan_id: targetPlan.id, app_id: app.id })
        console.log(`Linked ${app.slug} to plan ${targetPlan.slug}`)
      }
    }
  }

  console.log('✅ Reto 11 App insertions complete.')
}

run()

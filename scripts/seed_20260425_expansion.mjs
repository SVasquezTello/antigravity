import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('🚀 Seeding New Industry Vertical Micro-Apps (Expansion)...')

  const apps = [
    {
      slug: 'real-estate-desc',
      name_en: 'Real Estate Describer',
      name_es: 'Descriptor Inmobiliario',
      description_en: 'Generate emotional and persuasive property descriptions for listings.',
      description_es: 'Genera descripciones inmobiliarias emocionales y persuasivas para listados.',
      icon: 'Home',
      form_schema: [
        {"name": "type", "label": {"en": "Property Type", "es": "Tipo de Propiedad"}, "type": "select", "options": [
          {"value": "apartment", "label": {"en": "Apartment", "es": "Apartamento"}},
          {"value": "house", "label": {"en": "House", "es": "Casa"}},
          {"value": "penthouse", "label": {"en": "Penthouse", "es": "Ático"}},
          {"value": "commercial", "label": {"en": "Commercial", "es": "Local Comercial"}}
        ], "required": true},
        {"name": "features", "label": {"en": "Key Features", "es": "Características Clave"}, "type": "textarea", "placeholder": {"en": "3 bedrooms, 2 baths, pool, near beach...", "es": "3 hab, 2 baños, piscina, cerca de la playa..."}, "required": true},
        {"name": "vibe", "label": {"en": "Tone / Vibe", "es": "Tono / Ambiente"}, "type": "select", "options": [
          {"value": "luxury", "label": {"en": "Luxury", "es": "Lujo"}},
          {"value": "cozy", "label": {"en": "Cozy", "es": "Acogedor"}},
          {"value": "modern", "label": {"en": "Modern", "es": "Moderno"}},
          {"value": "investment", "label": {"en": "Investment Opportunity", "es": "Oportunidad de Inversión"}}
        ], "required": true}
      ],
      prompt_template: 'Act as a premium real estate copywriter. Write a high-converting property description for a {{type}}. Features: {{features}}. Tone: {{vibe}}. Include a catchy title, a detailed body focusing on benefits, and a call to action.'
    },
    {
      slug: 'course-architect',
      name_en: 'Course Architect',
      name_es: 'Arquitecto de Cursos',
      description_en: 'Design a comprehensive course curriculum and module structure.',
      description_es: 'Diseña un currículo de curso completo y una estructura de módulos.',
      icon: 'BookOpen',
      form_schema: [
        {"name": "topic", "label": {"en": "Course Topic", "es": "Tema del Curso"}, "type": "text", "placeholder": {"en": "Digital Marketing for Beginners", "es": "Marketing Digital para Principiantes"}, "required": true},
        {"name": "duration", "label": {"en": "Target Duration (Weeks)", "es": "Duración Objetivo (Semanas)"}, "type": "number", "required": true},
        {"name": "level", "label": {"en": "Student Level", "es": "Nivel del Estudiante"}, "type": "select", "options": [
          {"value": "beginner", "label": {"en": "Beginner", "es": "Principiante"}},
          {"value": "intermediate", "label": {"en": "Intermediate", "es": "Intermedio"}},
          {"value": "advanced", "label": {"en": "Advanced", "es": "Avanzado"}}
        ], "required": true}
      ],
      prompt_template: 'Act as an instructional designer. Create a {{duration}}-week course curriculum for "{{topic}}" at a {{level}} level. Provide module names, learning objectives, and a brief description for each week.'
    },
    {
      slug: 'sop-generator',
      name_en: 'SOP Generator',
      name_es: 'Generador de PNT',
      description_en: 'Create standard operating procedures for manufacturing processes.',
      description_es: 'Crea procedimientos normalizados de trabajo para procesos de fabricación.',
      icon: 'Settings',
      form_schema: [
        {"name": "process", "label": {"en": "Process Name", "es": "Nombre del Proceso"}, "type": "text", "placeholder": {"en": "Machine Maintenance", "es": "Mantenimiento de Maquinaria"}, "required": true},
        {"name": "steps", "label": {"en": "Rough Steps", "es": "Pasos Básicos"}, "type": "textarea", "placeholder": {"en": "1. Turn off power, 2. Clean filter...", "es": "1. Apagar corriente, 2. Limpiar filtro..."}, "required": true},
        {"name": "safety", "label": {"en": "Safety Gear Required", "es": "Equipo de Seguridad Requerido"}, "type": "text", "placeholder": {"en": "Gloves, Goggles", "es": "Guantes, Gafas"}, "required": true}
      ],
      prompt_template: 'Act as an operations manager. Write a professional Standard Operating Procedure (SOP) for: {{process}}. Required safety gear: {{safety}}. Rough steps to expand: {{steps}}. Format with clear sections: Scope, Prerequisites, Safety, and Step-by-Step Instructions.'
    },
    {
      slug: 'beauty-planner',
      name_en: 'Treatment Planner',
      name_es: 'Planificador de Tratamientos',
      description_en: 'Design personalized skin or beauty treatment routines.',
      description_es: 'Diseña rutinas de tratamiento de piel o belleza personalizadas.',
      icon: 'Sparkles',
      form_schema: [
        {"name": "skin_type", "label": {"en": "Skin Type", "es": "Tipo de Piel"}, "type": "select", "options": [
          {"value": "oily", "label": {"en": "Oily", "es": "Grasa"}},
          {"value": "dry", "label": {"en": "Dry", "es": "Seca"}},
          {"value": "combination", "label": {"en": "Combination", "es": "Mixta"}}
        ], "required": true},
        {"name": "concerns", "label": {"en": "Primary Concerns", "es": "Preocupaciones Principales"}, "type": "textarea", "placeholder": {"en": "Acne, fine lines, dullness...", "es": "Acné, arrugas, falta de brillo..."}, "required": true}
      ],
      prompt_template: 'Act as a professional aesthetician. Create a personalized treatment plan for a client with {{skin_type}} skin and these concerns: {{concerns}}. Include a morning routine, evening routine, and weekly specialized treatments.'
    },
    {
      slug: 'retail-strategy',
      name_en: 'Inventory Strategy',
      name_es: 'Estrategia de Inventario',
      description_en: 'Generate strategies to move slow-moving stock or prep for seasons.',
      description_es: 'Genera estrategias para mover stock lento o prepararse para temporadas.',
      icon: 'Grid',
      form_schema: [
        {"name": "items", "label": {"en": "Affected Items", "es": "Artículos Afectados"}, "type": "textarea", "required": true},
        {"name": "goal", "label": {"en": "Goal", "es": "Objetivo"}, "type": "select", "options": [
          {"value": "clearance", "label": {"en": "Clearance / Flash Sale", "es": "Liquidación / Venta Flash"}},
          {"value": "seasonal", "label": {"en": "Seasonal Launch", "es": "Lanzamiento de Temporada"}},
          {"value": "restock", "label": {"en": "Restock Optimization", "es": "Optimización de Reabastecimiento"}}
        ], "required": true}
      ],
      prompt_template: 'Act as a retail merchandise manager. Propose a detailed inventory and marketing strategy for these items: {{items}}. The primary goal is {{goal}}. Include pricing suggestions, bundle ideas, and 3 promotional taglines.'
    }
  ]

  // Fetch plans
  const { data: plans, error: planError } = await supabase.from('plans').select('id, slug')
  if (planError) {
    console.error('Error fetching plans:', planError)
    return
  }

  const basicPlan = plans.find(p => p.slug === 'basic' || p.slug === 'free')
  const interPlan = plans.find(p => p.slug === 'intermediary')
  const proPlan = plans.find(p => p.slug === 'professional' || p.slug === 'pro')
  const enterprisePlan = plans.find(p => p.slug === 'enterprise' || p.slug === 'business')

  for (const app of apps) {
    console.log(`Inserting app: ${app.slug}...`)

    const { data: existingApp, error: checkError } = await supabase
      .from('micro_apps')
      .select('id')
      .eq('slug', app.slug)
      .single()

    let appId
    if (existingApp) {
      console.log(`App ${app.slug} exists, updating...`)
      appId = existingApp.id
      const { error: updateError } = await supabase.from('micro_apps').update({
        name_en: app.name_en,
        name_es: app.name_es,
        description_en: app.description_en,
        description_es: app.description_es,
        icon: app.icon,
        form_schema: app.form_schema,
        prompt_template: app.prompt_template
      }).eq('id', appId)
      if (updateError) console.error(`Error updating ${app.slug}:`, updateError.message)
    } else {
      appId = crypto.randomUUID()
      const { error: insertError } = await supabase.from('micro_apps').insert({
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
      if (insertError) {
        console.error(`Error inserting ${app.slug}:`, insertError.message)
        continue
      }
    }

    // Link to plans
    const targetSlugs = ['professional', 'enterprise']
    if (app.slug === 'real-estate-desc' || app.slug === 'beauty-planner') {
      targetSlugs.push('intermediary')
    }

    for (const slug of targetSlugs) {
      const plan = plans.find(p => p.slug === slug)
      if (plan) {
        const { data: existingLink } = await supabase
          .from('plan_apps')
          .select('*')
          .eq('plan_id', plan.id)
          .eq('app_id', appId)
          .single()

        if (!existingLink) {
          await supabase.from('plan_apps').insert({
            plan_id: plan.id,
            app_id: appId
          })
          console.log(`Linked ${app.slug} → ${slug}`)
        }
      }
    }
  }

  console.log('\n✅ Expansion Seeding Complete.')
}

run()

import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('🚀 Seeding Agency Industry Micro-Apps...')

  const apps = [
    {
      slug: 'agency-scope-ai',
      name_en: 'Agency Scope AI',
      name_es: 'Creador de Alcance AI',
      description_en: 'Generate professional SOWs and technical scopes for agency projects.',
      description_es: 'Genera SOWs profesionales y alcances técnicos para proyectos de agencia.',
      icon: 'Layers',
      form_schema: [
        {"name": "project_name", "label": {"en": "Project Name", "es": "Nombre del Proyecto"}, "type": "text", "required": true},
        {"name": "services", "label": {"en": "Services Included", "es": "Servicios Incluidos"}, "type": "textarea", "placeholder": "SEO, Web Design, Paid Ads...", "required": true},
        {"name": "budget", "label": {"en": "Target Budget Range", "es": "Rango de Presupuesto Objetivo"}, "type": "text", "required": true}
      ],
      prompt_template: 'Act as a senior agency project manager. Write a detailed Statement of Work (SOW) for "{{project_name}}". Included services: {{services}}. Budget context: {{budget}}. Outline deliverables, milestones, and technical requirements.'
    },
    {
      slug: 'agency-pitch-ai',
      name_en: 'Pitch Strategist',
      name_es: 'Estratega de Pitch',
      description_en: 'Craft winning pitch narratives and value propositions for new clients.',
      description_es: 'Crea narrativas de pitch ganadoras y propuestas de valor para nuevos clientes.',
      icon: 'Megaphone',
      form_schema: [
        {"name": "client_profile", "label": {"en": "Client Industry / Profile", "es": "Industria / Perfil del Cliente"}, "type": "text", "required": true},
        {"name": "pain_points", "label": {"en": "Main Pain Points", "es": "Principales Puntos de Dolor"}, "type": "textarea", "required": true},
        {"name": "solution", "label": {"en": "Your Agency\'s Solution", "es": "Solución de tu Agencia"}, "type": "textarea", "required": true}
      ],
      prompt_template: 'Act as a senior brand strategist. Create a high-impact pitch narrative for a client in the {{client_profile}} industry. They are struggling with: {{pain_points}}. Your solution: {{solution}}. Focus on ROI, transformation, and why your agency is the only choice.'
    },
    {
      slug: 'agency-brief-ai',
      name_en: 'Creative Brief Automator',
      name_es: 'Automatizador de Briefs',
      description_en: 'Transform vague client requests into precise creative briefs for teams.',
      description_es: 'Transforma solicitudes vagas de clientes en briefs creativos precisos para equipos.',
      icon: 'BarChart3',
      form_schema: [
        {"name": "raw_request", "label": {"en": "Raw Client Request", "es": "Solicitud Vaga del Cliente"}, "type": "textarea", "required": true},
        {"name": "target_audience", "label": {"en": "Target Audience", "es": "Audiencia Objetivo"}, "type": "text", "required": true}
      ],
      prompt_template: 'Act as a creative director. Turn this raw request: "{{raw_request}}" into a professional Creative Brief. Audience: {{target_audience}}. Include: Project Goal, Tone of Voice, Key Deliverables, and Success Metrics.'
    }
  ]

  // Fetch plans
  const { data: plans, error: planError } = await supabase.from('plans').select('id, slug')
  if (planError) {
    console.error('Error fetching plans:', planError)
    return
  }

  const proPlan = plans.find(p => p.slug === 'professional' || p.slug === 'pro')
  const enterprisePlan = plans.find(p => p.slug === 'enterprise' || p.slug === 'business')

  for (const app of apps) {
    console.log(`Inserting app: ${app.slug}...`)

    const { data: existingApp } = await supabase
      .from('micro_apps')
      .select('id')
      .eq('slug', app.slug)
      .single()

    let appId
    if (existingApp) {
      appId = existingApp.id
      await supabase.from('micro_apps').update({
        name_en: app.name_en,
        name_es: app.name_es,
        description_en: app.description_en,
        description_es: app.description_es,
        icon: app.icon,
        form_schema: app.form_schema,
        prompt_template: app.prompt_template
      }).eq('id', appId)
    } else {
      appId = crypto.randomUUID()
      await supabase.from('micro_apps').insert({
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
    }

    // Link to plans (Agency apps are Enterprise/Pro only)
    for (const plan of [proPlan, enterprisePlan]) {
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
          console.log(`Linked ${app.slug} → ${plan.slug}`)
        }
      }
    }
  }

  console.log('\n✅ Agency Seeding Complete.')
}

run()

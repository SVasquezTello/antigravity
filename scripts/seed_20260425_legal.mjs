import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('⚖️ Seeding Legal Industry Micro-Apps...')

  const apps = [
    {
      slug: 'contract-audit-ai',
      name_en: 'Contract Auditor AI',
      name_es: 'Auditor de Contratos AI',
      description_en: 'Scan contracts for loopholes, liabilities, and missing clauses.',
      description_es: 'Escanea contratos en busca de vacíos legales, responsabilidades y cláusulas faltantes.',
      icon: 'Shield',
      form_schema: [
        {"name": "contract_type", "label": {"en": "Contract Type", "es": "Tipo de Contrato"}, "type": "select", "options": [
          {"value": "nda", "label": {"en": "NDA", "es": "Acuerdo de Confidencialidad"}},
          {"value": "employment", "label": {"en": "Employment", "es": "Empleo"}},
          {"value": "service", "label": {"en": "Service Agreement", "es": "Acuerdo de Servicios"}},
          {"value": "realestate", "label": {"en": "Real Estate", "es": "Inmobiliario"}}
        ], "required": true},
        {"name": "text", "label": {"en": "Contract Text / Clauses", "es": "Texto del Contrato / Cláusulas"}, "type": "textarea", "required": true},
        {"name": "jurisdiction", "label": {"en": "Jurisdiction", "es": "Jurisdicción"}, "type": "text", "placeholder": "USA, Spain, Mexico...", "required": true}
      ],
      prompt_template: 'Act as a senior legal counsel. Audit the following {{contract_type}} under the jurisdiction of {{jurisdiction}}. Identify 3 potential risks, 2 missing essential clauses, and provide a summary of the liability exposure. Text: {{text}}'
    },
    {
      slug: 'litigation-drafter-ai',
      name_en: 'Litigation Drafter',
      name_es: 'Redactor de Litigios',
      description_en: 'Generate professional legal drafts for litigation and court filings.',
      description_es: 'Genera borradores legales profesionales para litigios y presentaciones judiciales.',
      icon: 'Gavel',
      form_schema: [
        {"name": "document_type", "label": {"en": "Document Type", "es": "Tipo de Documento"}, "type": "select", "options": [
          {"value": "complaint", "label": {"en": "Complaint", "es": "Demanda"}},
          {"value": "motion", "label": {"en": "Motion", "es": "Moción"}},
          {"value": "response", "label": {"en": "Response", "es": "Respuesta"}},
          {"value": "appeal", "label": {"en": "Appeal", "es": "Apelación"}}
        ], "required": true},
        {"name": "facts", "label": {"en": "Key Facts", "es": "Hechos Clave"}, "type": "textarea", "required": true},
        {"name": "parties", "label": {"en": "Parties Involved", "es": "Partes Involucradas"}, "type": "text", "required": true}
      ],
      prompt_template: 'Act as a litigation expert. Draft a professional {{document_type}} involving these parties: {{parties}}. Base the document on these facts: {{facts}}. Use formal legal language, include standard headings, and ensure a persuasive tone.'
    },
    {
      slug: 'compliance-guard-ai',
      name_en: 'Compliance Guard',
      name_es: 'Guardia de Cumplimiento',
      description_en: 'Verify business operations against local and international regulations.',
      description_es: 'Verifica las operaciones comerciales frente a regulaciones locales e internacionales.',
      icon: 'Lock',
      form_schema: [
        {"name": "regulation", "label": {"en": "Regulation Type", "es": "Tipo de Regulación"}, "type": "select", "options": [
          {"value": "gdpr", "label": {"en": "GDPR / Data Privacy", "es": "RGPD / Privacidad de Datos"}},
          {"value": "tax", "label": {"en": "Tax Compliance", "es": "Cumplimiento Fiscal"}},
          {"value": "labor", "label": {"en": "Labor Laws", "es": "Leyes Laborales"}}
        ], "required": true},
        {"name": "operation_desc", "label": {"en": "Operation Description", "es": "Descripción de la Operación"}, "type": "textarea", "required": true}
      ],
      prompt_template: 'Act as a compliance officer. Evaluate the following operation against {{regulation}} standards: {{operation_desc}}. Provide a "Compliance Score" (0-100), identify 3 red flags, and suggest 2 remediation steps.'
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

    // Link to plans (Legal apps are Enterprise/Pro only)
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

  console.log('\n✅ Legal Seeding Complete.')
}

run()

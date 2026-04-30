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
  console.log('Seeding Imprentas / Print Shops Apps...')

  const apps = [
    {
      slug: 'cotiprint-ai',
      name_en: 'CotiPrint AI',
      name_es: 'CotiPrint AI',
      description_en: 'Turns a vague WhatsApp message into a pro quote in 30 seconds.',
      description_es: 'Convierte cualquier descripción vaga en una cotización lista en 30 segundos.',
      icon: 'FileText',
      form_schema: [
        { id: 'descripcion', type: 'textarea', label_en: 'Client Request', label_es: 'Descripción del cliente', required: true, placeholder_es: 'quiero unos volantes para mi taquería...' },
        { id: 'producto', type: 'select', label_en: 'Product Type', label_es: 'Tipo de producto', required: true,
          options: [
            { value: 'volantes', label_es: 'Volantes / Flyers', label_en: 'Flyers' },
            { value: 'tarjetas', label_es: 'Tarjetas', label_en: 'Business Cards' },
            { value: 'lonas', label_es: 'Lonas / Banners', label_en: 'Banners' },
            { value: 'folders', label_es: 'Folders', label_en: 'Folders' },
            { value: 'etiquetas', label_es: 'Etiquetas', label_en: 'Labels' },
            { value: 'otro', label_es: 'Otro', label_en: 'Other' }
          ]
        },
        { id: 'cantidad', type: 'text', label_en: 'Quantity', label_es: 'Cantidad estimada', required: true },
        { id: 'presupuesto', type: 'text', label_en: 'Max Budget', label_es: 'Presupuesto máximo', required: false },
        { id: 'fecha_entrega', type: 'text', label_en: 'Delivery Date', label_es: 'Fecha solicitada', required: true },
        { id: 'ciudad', type: 'text', label_en: 'City/Area', label_es: 'Ciudad / Zona', required: true }
      ],
      prompt_template: `Act as a master print salesperson.
Client request: {{descripcion}}
Product: {{producto}}
Qty: {{cantidad}}
Budget: {{presupuesto}}
Date: {{fecha_entrega}}
City: {{ciudad}}

1. Infer the logical missing technical specs (paper type, CMYK, finish). 
2. Generate a professional quote structure with 3 pricing tiers (Basic, Standard, Premium) explaining the value of each. 
3. Include standard terms for printing (bleed, color variation). Format the output cleanly in Markdown, ready to print as PDF.`
    },
    {
      slug: 'print-onboard',
      name_en: 'PrintOnboard',
      name_es: 'PrintOnboard',
      description_en: 'Generate the operational induction manual for any new print shop employee.',
      description_es: 'Genera el manual de inducción operativa para tu empleado en 2 minutos.',
      icon: 'BookOpen',
      form_schema: [
        { id: 'puesto', type: 'text', label_en: 'Role', label_es: 'Puesto del nuevo empleado', required: true },
        { id: 'equipo', type: 'textarea', label_en: 'Machines to use', label_es: 'Máquinas o herramientas principales', required: true },
        { id: 'errores', type: 'textarea', label_en: 'Top 3 Errors', label_es: 'Los 3 errores más comunes a evitar', required: true },
        { id: 'proceso', type: 'text', label_en: 'Key Process', label_es: 'Proceso más importante del día 1', required: true },
        { id: 'supervisor', type: 'text', label_en: 'Supervisor Contact', label_es: 'Supervisor y contacto', required: true }
      ],
      prompt_template: `Act as an HR and Operations Manager for a Print Shop.
Role: {{puesto}}
Machines: {{equipo}}
Errors to avoid: {{errores}}
Key Process: {{proceso}}
Supervisor: {{supervisor}}

Generate an onboarding manual containing: 
1. Welcome
2. Role description
3. Day-1 Checklist
4. 5 Key processes overview (including the provided key process)
5. How to avoid the 3 common errors
6. Who to talk to (Supervisor details)
7. Basic printing glossary for a newcomer. Use a friendly yet firm tone.`
    },
    {
      slug: 'brief-print',
      name_en: 'BriefPrint',
      name_es: 'BriefPrint',
      description_en: 'Turns a closed deal into a technical production brief for the operator.',
      description_es: 'Convierte un pedido en una orden de producción técnica sin errores.',
      icon: 'Printer',
      form_schema: [
        { id: 'pedido', type: 'textarea', label_en: 'Closed deal details', label_es: 'Descripción del pedido cerrado', required: true },
        { id: 'cliente', type: 'text', label_en: 'Client Info', label_es: 'Nombre del cliente y teléfono', required: true },
        { id: 'fecha_hora', type: 'text', label_en: 'Deadline', label_es: 'Fecha y hora de entrega', required: true },
        { id: 'arte', type: 'select', label_en: 'Artwork Status', label_es: '¿Tiene arte el cliente?', required: true,
          options: [
            { value: 'si', label_en: 'Yes, attached', label_es: 'Sí - adjunto' },
            { value: 'no', label_en: 'No, design needed', label_es: 'No - hay que diseñar' },
            { value: 'parcial', label_en: 'Partial, needs adjustments', label_es: 'Parcial - requiere ajustes' }
          ]
        },
        { id: 'acabados', type: 'text', label_en: 'Finishes', label_es: 'Acabados especiales', required: true },
        { id: 'vendedor', type: 'text', label_en: 'Sales Rep', label_es: '¿Quién vendió?', required: true },
        { id: 'observaciones', type: 'textarea', label_en: 'Observations', label_es: 'Observaciones del cliente', required: true }
      ],
      prompt_template: `Act as a Production Manager in a printing company.
Deal: {{pedido}}
Client: {{cliente}}
Deadline: {{fecha_hora}}
Artwork: {{arte}}
Finishes: {{acabados}}
Sales Rep: {{vendedor}}
Notes: {{observaciones}}

Create a standardized internal "Production Order" document.
Infer the technical specs (resolution, color profiles, bleeds, exact quantity layout).
Include a Pre-Flight Checklist for the designer/prep-press and final instructions for the press operator. Flag any contradictions or risks.`
    },
    {
      slug: 'insight-print',
      name_en: 'InsightPrint',
      name_es: 'InsightPrint',
      description_en: 'Upload your sales data and get 5 strict business decisions.',
      description_es: 'Sube tu Excel de ventas y recibe 5 decisiones concretas para esta semana.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'datos', type: 'textarea', label_en: 'Sales Data CSV', label_es: 'Pega aquí tus datos CSV o un resumen', required: true },
        { id: 'periodo', type: 'text', label_en: 'Period', label_es: 'Período analizado', required: true },
        { id: 'preocupacion', type: 'text', label_en: 'Main concern', label_es: 'Mayor preocupación actual', required: true },
        { id: 'empleados', type: 'text', label_en: 'Staff Count', label_es: 'Número de empleados', required: true }
      ],
      prompt_template: `Act as a Data Analyst for a Print Shop business.
Data Snippet:
{{datos}}
Period: {{periodo}}
Concern: {{preocupacion}}
Team size: {{empleados}}

Analyze the data block. Identify the most and least profitable products, detect clients at risk of leaving, and notice any seasonality if present. 
Output exactly 5 concrete, actionable business recommendations tailored to a {{empleados}}-person print shop, directly addressing {{preocupacion}} and citing the data backing each recommendation.`
    },
    {
      slug: 'upsell-print',
      name_en: 'UpSellPrint',
      name_es: 'UpSellPrint',
      description_en: 'Generates the perfect cross-sell offer at pickup time.',
      description_es: 'En el momento de entrega, genera la oferta perfecta para el cliente.',
      icon: 'ShoppingBag',
      form_schema: [
        { id: 'producto', type: 'text', label_en: 'Picked up product', label_es: '¿Qué acaba de comprar/recoger?', required: true },
        { id: 'giro', type: 'text', label_en: 'Client Business', label_es: 'Giro del negocio del cliente', required: true },
        { id: 'tipo_cliente', type: 'select', label_en: 'Client Type', label_es: 'Tipo de cliente', required: true,
          options: [
            { value: 'nuevo', label_en: 'First time', label_es: 'Primera vez' },
            { value: 'poco', label_en: '1-3 times', label_es: '1-3 compras' },
            { value: 'frecuente', label_en: 'Frequent', label_es: 'Frecuente' }
          ]
        },
        { id: 'temporada', type: 'text', label_en: 'Season Context', label_es: 'Temporada / Contexto', required: true },
        { id: 'presupuesto', type: 'text', label_en: 'Estimated Budget', label_es: 'Presupuesto histórico', required: true }
      ],
      prompt_template: `Act as a strategic upsell/cross-sell coach for a print shop counter salesperson.
Bought: {{producto}}
Client Business: {{giro}}
Client Type: {{tipo_cliente}}
Season: {{temporada}}
Budget range: {{presupuesto}}

Generate exactly 3 cross-sell suggestions tailored to their business type.
For each suggestion provide: 
1. The Product/Service 
2. A very natural, convincing conversational script on how to offer it right there at the counter.
Make it sound extremely helpful, not pushy.`
    },
    {
      slug: 'cotisell-pro',
      name_en: 'CotiSell Pro',
      name_es: 'CotiSell Pro',
      description_en: 'Quotes instantly whilst embedding smart cross-sell options.',
      description_es: 'El sistema que cotiza Y vende más en el mismo mensaje.',
      icon: 'Zap',
      form_schema: [
        { id: 'descripcion', type: 'textarea', label_en: 'Client Request', label_es: 'Descripción del pedido', required: true },
        { id: 'producto', type: 'text', label_en: 'Product', label_es: 'Tipo de producto', required: true },
        { id: 'cantidad', type: 'text', label_en: 'Qty', label_es: 'Cantidad', required: true },
        { id: 'giro', type: 'text', label_en: 'Client Business', label_es: 'Giro del negocio', required: true },
        { id: 'recurr', type: 'select', label_en: 'New or Recurring', label_es: 'Nuevo o recurrente', required: true,
          options: [
            { value: 'nuevo', label_en: 'New', label_es: 'Nuevo' },
            { value: 'recurrente', label_en: 'Recurring', label_es: 'Recurrente' }
          ]
        },
        { id: 'presupuesto', type: 'text', label_en: 'Budget', label_es: 'Presupuesto máximo', required: false },
        { id: 'entrega', type: 'text', label_en: 'Delivery requested', label_es: 'Fecha de entrega', required: true }
      ],
      prompt_template: `Act as a master print salesperson handling a combined quote and cross-sell.
Request: {{descripcion}}
Product: {{producto}}
Qty: {{cantidad}}
Business: {{giro}}
Client status: {{recurr}}
Budget: {{presupuesto}}
Date: {{entrega}}

Part 1: Generate a professional structured Print Quote with 3 tier options (Basic, Standard, Premium) inferring technical specs and standardizing terms.
Part 2: Immediately follow the quote with an "Also Recommended for You" section tailored to a {{giro}}, featuring 3 complementary print products and a persuasive one-line rationale for each.`
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
    console.log('Inserting app: ' + app.slug + '...')

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
        console.log('App ' + app.slug + ' already exists, skipping insert.')
        const { data: existingApp } = await supabase.from('micro_apps')
           .select('id').eq('slug', app.slug).single()
        if (existingApp) app.id = existingApp.id
      } else {
        console.error('Error inserting ' + app.slug + ':', appError)
        continue
      }
    } else {
      app.id = appId
    }

    // Link Plan
    let targetPlan = proPlan
    if (app.slug === 'cotisell-pro') {
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
        console.log('Linked ' + app.slug + ' to plan ' + targetPlan.slug)
      }
    }
  }

  console.log('✅ Imprentas Apps insertions complete.')
}

run()

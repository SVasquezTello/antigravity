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
  console.log('Seeding Manufactura / Factory Apps...')

  const apps = [
    {
      slug: 'crossfab-ai',
      name_en: 'CrossFab AI',
      name_es: 'CrossFab AI',
      description_en: 'Detects what else your client might buy before they look for another provider.',
      description_es: 'Detecta qué más puede comprarte tu cliente antes de que lo busque con otro proveedor.',
      icon: 'ShoppingCart',
      form_schema: [
        { id: 'cliente', type: 'text', label_en: 'Client Name', label_es: 'Nombre del cliente', required: true },
        { id: 'producto_actual', type: 'text', label_en: 'Current Purchase', label_es: 'Producto(s) que compra hoy', required: true, placeholder_es: 'ej. 500 tornillos M8 x 25mm' },
        { id: 'industria', type: 'text', label_en: 'Client Industry', label_es: 'Industria del cliente', required: true, placeholder_es: 'ej. fabricación de muebles' },
        { id: 'historial', type: 'textarea', label_en: 'Recent History', label_es: 'Historial reciente del cliente', required: true },
        { id: 'catalogo', type: 'textarea', label_en: 'Factory Catalog', label_es: 'Catálogo de la fábrica', required: true }
      ],
      prompt_template: `Act as a B2B Manufacturing Sales Expert.
Client: {{cliente}} (Industry: {{industria}})
Purchasing now: {{producto_actual}}
History: {{historial}}
Our Catalog: {{catalogo}}

Analyze this and identify the 3 most likely complementary products (cross-sell) from our catalog that this client will need soon. Provide a sales pitch for each, and a short message ready to send via WhatsApp/Email to offer these additions naturally.`
    },
    {
      slug: 'decide-fab',
      name_en: 'DecideFab Analyzer',
      name_es: 'DecideFab',
      description_en: 'Turns your production Excel into 3 concrete decisions for this week.',
      description_es: 'Pega tu Excel de producción y recibe 3 decisiones concretas para esta semana.',
      icon: 'BarChart2',
      form_schema: [
        { id: 'reporte', type: 'textarea', label_en: 'Production Report (Text/CSV)', label_es: 'Reporte de producción/datos', required: true },
        { id: 'problema', type: 'text', label_en: 'Main concern', label_es: 'Principal problema que te preocupa', required: true },
        { id: 'area', type: 'select', label_en: 'Area to Analyze', label_es: 'Área a analizar', required: true,
          options: [
            { value: 'produccion', label_en: 'Production', label_es: 'Producción' },
            { value: 'costos', label_en: 'Costs', label_es: 'Costos' },
            { value: 'personal', label_en: 'Staff', label_es: 'Personal' },
            { value: 'desperdicios', label_en: 'Waste', label_es: 'Desperdicios' },
            { value: 'clientes', label_en: 'Clients', label_es: 'Clientes' }
          ]
        },
        { id: 'contexto', type: 'textarea', label_en: 'Relevant Context', label_es: 'Contexto relevante (ej. paros, daños)', required: true }
      ],
      prompt_template: `Act as a Data-Driven Plant Manager.
Concern: {{problema}}
Target Area: {{area}}
Context: {{contexto}}
Data:
{{reporte}}

Process the data to find anomalies and trends. Generate EXACTLY 3 actionable decisions with the numerical justification behind each. Do not output a generic report; output instructions like: "Decisión 1: [Action], Justificación Numérica: [Data], Primer Paso: [Next execution step]."`
    },
    {
      slug: 'orden-fab',
      name_en: 'OrdenFab',
      name_es: 'OrdenFab',
      description_en: 'Translates verbal manager instructions into trackable plant tasks.',
      description_es: 'Lo que dices en el pasillo llega a planta como instrucción verificable.',
      icon: 'ClipboardList',
      form_schema: [
        { id: 'instruccion', type: 'textarea', label_en: 'Manager Instruction', label_es: 'Instrucción (lenguaje natural)', required: true },
        { id: 'area', type: 'text', label_en: 'Production Area', label_es: 'Área/Línea afectada', required: true },
        { id: 'turno', type: 'text', label_en: 'Responsible Shift', label_es: 'Turno(s) responsable(s)', required: true },
        { id: 'fecha_limite', type: 'text', label_en: 'Deadline', label_es: 'Fecha/Hora límite', required: true },
        { id: 'urgencia', type: 'select', label_en: 'Urgency', label_es: 'Nivel de urgencia', required: true,
          options: [
            { value: 'normal', label_en: 'Normal', label_es: 'Normal' },
            { value: 'urgente', label_en: 'Urgent', label_es: 'Urgente' },
            { value: 'critico', label_en: 'Critical', label_es: 'Crítico' }
          ]
        }
      ],
      prompt_template: `Act as a meticulous Operations Coordinator. Turn the following casual instruction into a strict task list.
Instruction: {{instruccion}}
Area: {{area}}
Shift: {{turno}}
Deadline: {{fecha_limite}}
Urgency: {{urgencia}}

Generate a numbered list of tasks assigned by shift. Add a specific "Verification Criteria" (how to know it's done) for each task. Build a ready-to-copy WhatsApp message to alert the shift supervisor.`
    },
    {
      slug: 'recupera-fab',
      name_en: 'RecuperaFab',
      name_es: 'RecuperaFab',
      description_en: 'The perfectly crafted message to reactivate an ignored quote.',
      description_es: 'Tu cotización lleva 5 días en silencio. Aquí está el mensaje que la reactiva.',
      icon: 'FileClock',
      form_schema: [
        { id: 'cliente', type: 'text', label_en: 'Client Name', label_es: 'Nombre del cliente y empresa', required: true },
        { id: 'producto', type: 'text', label_en: 'Quoted Product', label_es: 'Producto o servicio cotizado', required: true },
        { id: 'monto', type: 'text', label_en: 'Quote Value', label_es: 'Monto de la cotización', required: true },
        { id: 'fecha', type: 'text', label_en: 'Date Sent', label_es: 'Fecha en que se envió', required: true },
        { id: 'ultimo_contacto', type: 'textarea', label_en: 'Last contact details', label_es: 'Último contacto con el cliente', required: true },
        { id: 'canal', type: 'select', label_en: 'Channel', label_es: 'Canal preferido', required: true,
          options: [
            { value: 'whatsapp', label_en: 'WhatsApp', label_es: 'WhatsApp' },
            { value: 'email', label_en: 'Email', label_es: 'Email' },
            { value: 'llamar', label_en: 'Call Script', label_es: 'Llamada' }
          ]
        }
      ],
      prompt_template: `You are a top manufacturing B2B closer. A quote is going cold.
Client: {{cliente}}
Product: {{producto}}
Value: {{monto}}
Sent: {{fecha}}
Last contact: {{ultimo_contacto}}
Channel: {{canal}}

Generate 2 customized follow-up messages:
1. Direct and professional, asking for an update without being pushy.
2. Value-driven and soft, leveraging urgency or an open question.
Include advice on which one to pick based on their behavior.`
    },
    {
      slug: 'pulse-fab',
      name_en: 'PulseFab',
      name_es: 'PulseFab',
      description_en: 'Know if your plant is performing well today without having to call anyone.',
      description_es: 'Sabe si tu planta va bien hoy sin tener que llamar a nadie. Reporte en semáforo.',
      icon: 'Activity',
      form_schema: [
        { id: 'turno_fecha', type: 'text', label_en: 'Shift & Date', label_es: 'Nombre del turno y fecha', required: true },
        { id: 'reporte', type: 'textarea', label_en: 'Shift Report', label_es: 'Reporte del encargado (texto libre)', required: true },
        { id: 'meta', type: 'textarea', label_en: 'Daily Goal', label_es: 'Meta del día', required: true },
        { id: 'linea', type: 'text', label_en: 'Area/Line', label_es: 'Área o línea', required: true },
        { id: 'inusual', type: 'textarea', label_en: 'Unusual Events?', label_es: '¿Hubo algo inusual?', required: true }
      ],
      prompt_template: `Act as an automated Manufacturing Execution Assistant.
Shift Details: {{turno_fecha}}
Area: {{linea}}
Goal: {{meta}}
Execution Report: {{reporte}}
Anomalies: {{inusual}}

Compare the execution against the goal. Generate a concise 5-line status report with a Traffic Light emoji (🟢 🟡 🔴). Calculate percentage completion, list any detected alerts/delays, and suggest the absolute most urgent action for the next shift.`
    },
    {
      slug: 'fabloop',
      name_en: 'FabLoop Complete',
      name_es: 'FabLoop',
      description_en: 'Instruction tracking loop: from manager command to end-of-shift automated review.',
      description_es: 'El ciclo completo: instrucción → tarea → reporte → alerta. Sin sorpresas.',
      icon: 'Repeat',
      form_schema: [
        { id: 'instruccion', type: 'textarea', label_en: 'Manager Instruction', label_es: 'Instrucción del gerente', required: true },
        { id: 'area_turno', type: 'text', label_en: 'Area & Shift', label_es: 'Área(s) y turno(s) involucrados', required: true },
        { id: 'limite', type: 'text', label_en: 'Deadline', label_es: 'Fecha y hora límite', required: true },
        { id: 'reporte_cierre', type: 'textarea', label_en: 'End of Shift Report', label_es: 'Reporte del encargado al cierre', required: true },
        { id: 'noplan', type: 'textarea', label_en: 'Unplanned events', label_es: '¿Ocurrió algo no planeado?', required: true },
        { id: 'operarios', type: 'text', label_en: 'Staff Present vs Planned', label_es: 'Asistencia (presentes vs planeados)', required: true },
        { id: 'canal', type: 'select', label_en: 'Alert Channel', label_es: 'Canal de alertas', required: true,
          options: [
            { value: 'whatsapp', label_en: 'WhatsApp', label_es: 'WhatsApp' },
            { value: 'email', label_en: 'Email', label_es: 'Email' }
          ]
        }
      ],
      prompt_template: `Act as a closed-loop operations tracking system (MES).
Given the morning instructions: {{instruccion}}
Area/Shift: {{area_turno}}
Deadline: {{limite}}

And the afternoon actual report:
Report: {{reporte_cierre}}
Issues: {{noplan}}
Attendance: {{operarios}}

Step 1: Translate the instruction into quantifiable tasks.
Step 2: Match the end-of-shift report strictly against those tasks to find gaps.
Output a final compliance summary (Task: status / %). Display a 🔴/🟡/🟢 alert for any failed or partial tasks. Give a short recommendation for tomorrow.`
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
    if (app.slug === 'fabloop') {
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

  console.log('✅ Factory Apps insertions complete.')
}

run()

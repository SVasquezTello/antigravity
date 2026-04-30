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
  console.log('Seeding Inmobiliaria / Real Estate Apps...')

  const apps = [
    {
      slug: 'reactiva-home',
      name_en: 'ReactivaHome',
      name_es: 'ReactivaHome',
      description_en: 'That real estate lead is not gone. They just need the right message.',
      description_es: 'Ese cliente no desapareció. Solo necesita el mensaje correcto para reavivar la venta.',
      icon: 'Home',
      form_schema: [
        { id: 'nombre', type: 'text', label_en: 'Client / Lead Name', label_es: 'Nombre del cliente', required: true },
        { id: 'propiedad', type: 'text', label_en: 'Inquired Property', label_es: 'Propiedad consultada', required: true },
        { id: 'presupuesto', type: 'text', label_en: 'Estimated Budget', label_es: 'Presupuesto estimado', required: false },
        { id: 'fecha', type: 'text', label_en: 'Date of Inquiry', label_es: 'Fecha de la consulta', required: true },
        { id: 'ultimo_mensaje', type: 'textarea', label_en: 'Last Message', label_es: 'Último mensaje recibido', required: true },
        { id: 'dias', type: 'text', label_en: 'Days without reply', label_es: 'Días sin responder', required: true }
      ],
      prompt_template: `Act as a Top Real Estate Broker.
Lead: {{nombre}}
Property: {{propiedad}}
Budget: {{presupuesto}}
Date: {{fecha}}
Last Message: {{ultimo_mensaje}}
Silent for: {{dias}} days.

Generate EXACTLY 2 follow-up WhatsApp messages to reactivate the lead:
1. "Soft Version": Informative, sharing a market update or an update about the property.
2. "Direct Version": Asking a quick yes/no question to spark a response or close their file.
Tell the agent which one to use based on the context.`
    },
    {
      slug: 'upsell-home-ai',
      name_en: 'UpsellHome AI',
      name_es: 'UpsellHome AI',
      description_en: 'If they do not buy that property, discover which one they will.',
      description_es: 'Si no califica para esa propiedad, ofrécele exactamente la que sí puede comprar.',
      icon: 'Key',
      form_schema: [
        { id: 'propiedad', type: 'text', label_en: 'Inquired Property', label_es: 'Propiedad consultada', required: true },
        { id: 'perfil', type: 'text', label_en: 'Client Profile', label_es: 'Perfil del cliente', required: true, placeholder_es: 'Ej. Inversor, familia joven...' },
        { id: 'presupuesto', type: 'text', label_en: 'Real Budget', label_es: 'Presupuesto real comprobado', required: true },
        { id: 'historial', type: 'textarea', label_en: 'Interest History', label_es: 'Historial de interés', required: false },
        { id: 'catalogo', type: 'textarea', label_en: 'Available Portfolio', label_es: 'Catálogo de propiedades disponibles', required: true }
      ],
      prompt_template: `Act as a Strategic Real Estate Matchmaker.
Lead Profile: {{perfil}}
Original Property: {{propiedad}}
Actual Budget: {{presupuesto}}
History: {{historial}}
Portfolio: {{catalogo}}

1. Select the top 3 best matching alternative properties from the portfolio.
2. Provide a compelling "commercial argument" for why these fit them better.
3. Write a natural message to send to the client proposing these alternatives.`
    },
    {
      slug: 'visita-home',
      name_en: 'VisitaHome',
      name_es: 'VisitaHome',
      description_en: 'Never lose a sale because of bad coordination during a showing.',
      description_es: 'Nunca más una visita perdida por llaves equivocadas o mala coordinación.',
      icon: 'MapPin',
      form_schema: [
        { id: 'cliente', type: 'text', label_en: 'Client Name', label_es: 'Nombre del cliente', required: true },
        { id: 'propiedad', type: 'text', label_en: 'Property to Visit', label_es: 'Propiedad a visitar', required: true },
        { id: 'fecha_hora', type: 'text', label_en: 'Date & Time', label_es: 'Fecha y hora', required: true },
        { id: 'asesor', type: 'text', label_en: 'Assigned Agent', label_es: 'Asesor asignado', required: true },
        { id: 'observaciones', type: 'textarea', label_en: 'Special Notes', label_es: 'Observaciones', required: true, placeholder_es: 'Permiso en garita, llaves en portería...' }
      ],
      prompt_template: `Act as a meticulous Real Estate Front-Desk Coordinator.
Client: {{cliente}}
Property: {{propiedad}}
Time: {{fecha_hora}}
Agent: {{asesor}}
Notes: {{observaciones}}

Create a zero-fail 'Showing Checklist':
1. Tasks for the Agent.
2. Tasks for the Owner / Front-desk of the building.
3. Special warnings based on the notes.
Ensure there are no dropped balls before the showing.`
    },
    {
      slug: 'decide-home',
      name_en: 'DecideHome Analyzer',
      name_es: 'DecideHome',
      description_en: 'Your data should tell you where the real estate money is.',
      description_es: 'Tus datos deben decirte dónde está el dinero y qué propiedades destacar.',
      icon: 'BarChart2',
      form_schema: [
        { id: 'reporte', type: 'textarea', label_en: 'Sales/Rentals Report', label_es: 'Reporte de ventas/alquileres', required: true },
        { id: 'problema', type: 'text', label_en: 'Main Problem', label_es: 'Principal problema hoy', required: true },
        { id: 'area', type: 'select', label_en: 'Area to Analyze', label_es: 'Área a analizar', required: true,
          options: [
            { value: 'zonas', label_en: 'Hot Zones', label_es: 'Zonas / Demanda' },
            { value: 'asesores', label_en: 'Agents Performance', label_es: 'Rendimiento de Asesores' },
            { value: 'pauta', label_en: 'Ads & ROI', label_es: 'Pauta / Publicidad' },
            { value: 'inventario', label_en: 'Dead Inventory', label_es: 'Inventario Estancado' }
          ]
        },
        { id: 'contexto', type: 'textarea', label_en: 'Context', label_es: 'Contexto relevante', required: true }
      ],
      prompt_template: `Act as a Senior Real Estate Data Analyst.
Problem: {{problema}}
Target Area: {{area}}
Context: {{contexto}}
Data Snippet:
{{reporte}}

Forget raw numbers. Give me EXACTLY 3 executable business decisions. Justify them using the data. Tell me where to focus marketing or which properties to stop pushing.`
    },
    {
      slug: 'pulse-home',
      name_en: 'PulseHome',
      name_es: 'PulseHome',
      description_en: 'Know how your brokerage is doing today without calling anyone.',
      description_es: 'Control real de tu inmobiliaria con un semáforo diario 🟢🟡🔴.',
      icon: 'Activity',
      form_schema: [
        { id: 'reporte', type: 'textarea', label_en: 'Daily Report', label_es: 'Reporte del día (Visitas, leads)', required: true },
        { id: 'meta', type: 'text', label_en: 'Expected Goal', label_es: 'Meta esperada (Cierres/Firmas)', required: true },
        { id: 'incidencias', type: 'textarea', label_en: 'Issues/Cancellations', label_es: 'Incidencias / Cancelaciones', required: true },
        { id: 'activas', type: 'text', label_en: 'Active Properties', label_es: 'Propiedades activas/mostradas', required: true },
        { id: 'comentarios', type: 'textarea', label_en: 'Team Comments', label_es: 'Comentarios del equipo', required: true }
      ],
      prompt_template: `Act as an automated Brokerage Manager.
Goal: {{meta}}
Daily Report: {{reporte}}
Active Showings: {{activas}}
Issues: {{incidencias}}
Comments: {{comentarios}}

Provide a 30-second Pulse Summary.
Use an emoji Traffic Light (🟢 Healthy pipeline, 🟡 Needs attention, 🔴 Stalled).
List the 2 most urgent actions to follow up tomorrow morning with the agents.`
    },
    {
      slug: 'property-loop',
      name_en: 'PropertyLoop Premium',
      name_es: 'PropertyLoop',
      description_en: 'From the first cold lead message to the final contract signature.',
      description_es: 'Reactiva + Visita + Pulse. El pipeline completo bajo control de IA.',
      icon: 'Briefcase',
      form_schema: [
        { id: 'cliente', type: 'text', label_en: 'Client/Lead', label_es: 'Cliente / Prospecto', required: true },
        { id: 'situacion', type: 'textarea', label_en: 'Current Situation', label_es: 'Situación actual', required: true, placeholder_es: 'Dudando, agendó visita...' },
        { id: 'accion', type: 'select', label_en: 'Required Phase', label_es: 'Fase requerida', required: true,
          options: [
            { value: 'prospeccion', label_en: 'Reactivation & Upsell', label_es: 'Reactivar / Ofrecer opciones' },
            { value: 'visita', label_en: 'Showing Coordination', label_es: 'Coordinar visita' },
            { value: 'cierre', label_en: 'Pulse & Review', label_es: 'Cierre / Evaluar métricas' }
          ]
        },
        { id: 'detalles', type: 'textarea', label_en: 'Details', label_es: 'Detalles (propiedad, dinero)', required: true }
      ],
      prompt_template: `Act as the Ultimate Real Estate Copilot. 
Client: {{cliente}}
Phase: {{accion}}
Details: {{detalles}}
Situation: {{situacion}}

If Phase=Reactivation & Upsell: Generate a highly personal reactivation script recommending matching properties.
If Phase=Showing: Build a solid pre-showing checklist for the agent and a reminder message for the client.
If Phase=Pulse & Review: Generate a pipeline Pulse Traffic Light report evaluating the interaction, with steps to push closing.`
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
    if (app.slug === 'property-loop') {
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

  console.log('✅ Inmobiliarias / Real Estate Apps insertions complete.')
}

run()

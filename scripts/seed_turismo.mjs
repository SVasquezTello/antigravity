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
  console.log('Seeding Tourism / Viajes Apps...')

  const apps = [
    {
      slug: 'reactiva-trip',
      name_en: 'ReactivaTrip',
      name_es: 'ReactivaTrip',
      description_en: 'That client did not ignore you. They just need the right message.',
      description_es: 'Reconecta con prospectos que dejaron de responder tus cotizaciones de viajes.',
      icon: 'Send',
      form_schema: [
        { id: 'nombre', type: 'text', label_en: 'Client Name', label_es: 'Nombre del cliente', required: true },
        { id: 'destino', type: 'text', label_en: 'Destination inquired', label_es: 'Destino consultado', required: true },
        { id: 'presupuesto', type: 'text', label_en: 'Approx Budget', label_es: 'Presupuesto aproximado', required: false },
        { id: 'fecha', type: 'text', label_en: 'Probable Date', label_es: 'Fecha probable de viaje', required: true },
        { id: 'ultimo_mensaje', type: 'textarea', label_en: 'Last Message', label_es: 'Último mensaje del cliente', required: true },
        { id: 'dias', type: 'text', label_en: 'Days without reply', label_es: 'Días sin responder', required: true }
      ],
      prompt_template: `Act as a top-producing travel agent closer.
Client: {{nombre}}
Destination: {{destino}}
Budget: {{presupuesto}}
Date: {{fecha}}
Last Message: {{ultimo_mensaje}}
Silent for: {{dias}} days.

Generate EXACTLY 2 follow-up messages ready to paste into WhatsApp:
1. "Soft Version": Helpful, value-driven, giving them an out or a new piece of info to spark interest.
2. "Direct Version": Creating urgency, asking a simple yes/no question to close the loop.
Provide advice on which one to send today.`
    },
    {
      slug: 'upsell-trip-ai',
      name_en: 'UpsellTrip AI',
      name_es: 'UpsellTrip AI',
      description_en: 'They bought a tour. Now discover what else they will buy.',
      description_es: 'Descubre y ofrece los complementos perfectos (cross-sell/upsell) para cada viaje.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'destino', type: 'text', label_en: 'Bought Destination', label_es: 'Destino comprado', required: true },
        { id: 'perfil', type: 'text', label_en: 'Client Profile', label_es: 'Perfil del cliente (fam/pareja/solo)', required: true },
        { id: 'presupuesto', type: 'text', label_en: 'Estimated Budget', label_es: 'Presupuesto estimado', required: true },
        { id: 'historial', type: 'textarea', label_en: 'Purchase History', label_es: 'Historial de compras', required: false },
        { id: 'catalogo', type: 'textarea', label_en: 'Available Services', label_es: 'Catálogo de servicios extras', required: true, placeholder_es: 'Traslados, upgrade hotel, seguros...' }
      ],
      prompt_template: `Act as a revenue maximizing travel concierge.
Client Profile: {{perfil}}
Destination Booked: {{destino}}
Budget: {{presupuesto}}
History: {{historial}}
Available Services: {{catalogo}}

1. Select the top 3 most probable Upsell/Cross-sell services for this specific client profile.
2. Give a brief psychological rationale of why they need it.
3. Write the exact copy to send to them right now to close the extra sale without sounding pushy.`
    },
    {
      slug: 'opera-trip',
      name_en: 'OperaTrip',
      name_es: 'OperaTrip',
      description_en: 'What you sell must reach the client perfectly. Zero errors.',
      description_es: 'Genera el checklist operativo perfecto y notifica a todos los involucrados.',
      icon: 'ClipboardCheck',
      form_schema: [
        { id: 'cliente', type: 'text', label_en: 'Client Name', label_es: 'Nombre del cliente / Paxs', required: true },
        { id: 'tour', type: 'text', label_en: 'Reserved Tour', label_es: 'Tour reservado', required: true },
        { id: 'fecha_hora', type: 'text', label_en: 'Date & Time', label_es: 'Fecha y hora', required: true },
        { id: 'servicios', type: 'textarea', label_en: 'Included Services', label_es: 'Servicios incluidos', required: true },
        { id: 'observaciones', type: 'textarea', label_en: 'Special Notes', label_es: 'Observaciones especiales', required: true, placeholder_es: 'Alergias, discapacidad, cumpleaños...' }
      ],
      prompt_template: `Act as the Master Operations Coordinator for a travel agency.
Tour: {{tour}}
Client: {{cliente}}
DateTime: {{fecha_hora}}
Services: {{servicios}}
Notes: {{observaciones}}

Create a zero-fail 'Operations Brief'.
1. Checklist for the Guide.
2. Instructions for Transport/Driver.
3. Check-in details for the Hotel/Venue.
4. Internal Coordination checks. 
Highlight the special notes so nobody misses them.`
    },
    {
      slug: 'decide-travel',
      name_en: 'DecideTravel Analyzer',
      name_es: 'DecideTravel',
      description_en: 'Your data should tell you what to do, not just occupy Excel.',
      description_es: 'Sube tu reporte y obtén decisiones estratégicas inmediatas de turismo.',
      icon: 'BarChart',
      form_schema: [
        { id: 'reporte', type: 'textarea', label_en: 'Sales Report', label_es: 'Reporte de ventas / datos', required: true },
        { id: 'problema', type: 'text', label_en: 'Main Problem', label_es: 'Problema principal', required: true },
        { id: 'area', type: 'select', label_en: 'Area to Analyze', label_es: 'Área a analizar', required: true,
          options: [
            { value: 'destinos', label_en: 'Destinations', label_es: 'Destinos/Rutas' },
            { value: 'precios', label_en: 'Pricing', label_es: 'Precios/Márgenes' },
            { value: 'marketing', label_en: 'Marketing', label_es: 'Canales/Promociones' },
            { value: 'operaciones', label_en: 'Operations', label_es: 'Operaciones/Cancelaciones' }
          ]
        },
        { id: 'contexto', type: 'textarea', label_en: 'Context', label_es: 'Contexto relevante', required: true }
      ],
      prompt_template: `Act as a Senior Travel Business Analyst.
Problem: {{problema}}
Target Area: {{area}}
Context: {{contexto}}
Data:
{{reporte}}

Do not give me a generic summary. Give me EXACTLY 3 actionable business decisions justified by the numbers in the data provided. Help me sell more destinations or stop losing money.`
    },
    {
      slug: 'pulse-travel',
      name_en: 'PulseTravel',
      name_es: 'PulseTravel',
      description_en: 'Know if the tour went perfectly without chasing the team.',
      description_es: 'Semáforo operativo 🟢🟡🔴. Monitorea tu agencia sin estar presente.',
      icon: 'Activity',
      form_schema: [
        { id: 'tour_dia', type: 'text', label_en: 'Today\'s Tour', label_es: 'Tour del día', required: true },
        { id: 'meta', type: 'text', label_en: 'Expected Goal', label_es: 'Meta esperada (Paxs / Tiempos)', required: true },
        { id: 'reporte', type: 'textarea', label_en: 'Guide Report', label_es: 'Reporte de campo / guía', required: true },
        { id: 'incidencias', type: 'textarea', label_en: 'Incidents', label_es: 'Incidencias (retrasos, fallas)', required: true },
        { id: 'satisfaccion', type: 'text', label_en: 'Client Satisfaction', label_es: 'Satisfacción percibida del cliente', required: true }
      ],
      prompt_template: `Act as an Automated Tour Supervisor.
Tour: {{tour_dia}}
Goal: {{meta}}
Guide Report: {{reporte}}
Incidents: {{incidencias}}
Satisfaction: {{satisfaccion}}

Provide a 30-second Executive Summary.
Determine the status using an emoji Traffic Light (🟢 All good, 🟡 Minor issues, 🔴 Critical fail).
List the 2 most urgent follow-up actions (e.g. call the client to apologize, pay the driver).`
    },
    {
      slug: 'travel-loop',
      name_en: 'TravelLoop',
      name_es: 'TravelLoop Premium',
      description_en: 'From the first prospect message to the final tourist experience.',
      description_es: 'Reactiva + Opera + Pulse. El ciclo completo de tu agencia en un pantallazo.',
      icon: 'Globe',
      form_schema: [
        { id: 'cliente', type: 'text', label_en: 'Client/Group', label_es: 'Cliente / Grupo', required: true },
        { id: 'situacion', type: 'textarea', label_en: 'Current Situation', label_es: 'Situación actual', required: true, placeholder_es: 'Cotización muerta, tour por salir, problema reportado...' },
        { id: 'accion', type: 'select', label_en: 'Action Phase', label_es: 'Fase requerida', required: true,
          options: [
            { value: 'venta', label_en: 'Sales / Recovery', label_es: 'Venta / Recuperación' },
            { value: 'operacion', label_en: 'Operations', label_es: 'Operación / Logística' },
            { value: 'cierre', label_en: 'Closing / Review', label_es: 'Cierre / Calidad' }
          ]
        },
        { id: 'detalles', type: 'textarea', label_en: 'Core Details', label_es: 'Detalles del paquete/tour', required: true }
      ],
      prompt_template: `Act as the Ultimate Travel Agency Copilot. 
Client: {{cliente}}
Phase: {{accion}}
Details: {{detalles}}
Situation: {{situacion}}

If Phase=Sales: Generate a Reactivation specific to their situation and an Upsell strategy to maximize the ticket.
If Phase=Operations: Build a zero-fail execution checklist for guides/drivers based on the details.
If Phase=Closing: Generate a Daily Pulse Traffic Light report on the events, plus an automated apology/thank-you message for the client.
Always adapt dynamically to the scenario and provide extreme value for the agency owner.`
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
    if (app.slug === 'travel-loop') {
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

  console.log('✅ Viajes & Turismo Apps insertions complete.')
}

run()

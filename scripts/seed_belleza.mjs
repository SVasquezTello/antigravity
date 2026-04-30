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
  console.log('Seeding Belleza / Beauty Apps...')

  const apps = [
    {
      slug: 'reactiva-beauty',
      name_en: 'ReactivaBeauty',
      name_es: 'ReactivaBeauty',
      description_en: 'That client is not gone. They just need the right message to come back.',
      description_es: 'Ese cliente no se fue. Solo necesita el mensaje correcto para volver al salón.',
      icon: 'Heart',
      form_schema: [
        { id: 'nombre', type: 'text', label_en: 'Client Name', label_es: 'Nombre del cliente', required: true },
        { id: 'ultimo_servicio', type: 'text', label_en: 'Last Service', label_es: 'Último servicio realizado', required: true },
        { id: 'fecha_visita', type: 'text', label_en: 'Last Visit Date', label_es: 'Fecha de última visita', required: true },
        { id: 'frecuencia', type: 'select', label_en: 'Usual Frequency', label_es: 'Frecuencia habitual de visita', required: true,
          options: [
            { value: 'semanal', label_en: 'Weekly', label_es: 'Semanal' },
            { value: 'quincenal', label_en: 'Biweekly', label_es: 'Quincenal' },
            { value: 'mensual', label_en: 'Monthly', label_es: 'Mensual' },
            { value: 'esporadico', label_en: 'Rarely', label_es: 'Esporádico' }
          ]
        },
        { id: 'canal', type: 'select', label_en: 'Preferred Channel', label_es: 'Canal preferido', required: true,
          options: [
            { value: 'whatsapp', label_en: 'WhatsApp', label_es: 'WhatsApp' },
            { value: 'instagram', label_en: 'Instagram DM', label_es: 'Instagram' },
            { value: 'sms', label_en: 'SMS', label_es: 'SMS' }
          ]
        }
      ],
      prompt_template: `Act as a Top Salon/Spa Manager and Retention Expert.
Client: {{nombre}}
Last Service: {{ultimo_servicio}}
Last Visit: {{fecha_visita}}
Frequency: {{frecuencia}}
Channel: {{canal}}

Generate EXACTLY 2 perfect reactivation messages ready to copy & paste:
1. "Soft Version": Friendly checking-in, reminding them it's time for maintenance.
2. "Promo Version": Adding a small incentive or complementary mini-service to trigger a booking right now.
Provide a short advice on which one to use.`
    },
    {
      slug: 'upsell-beauty-ai',
      name_en: 'UpsellBeauty AI',
      name_es: 'UpsellBeauty AI',
      description_en: 'They came for a cut. Discover what else they can buy today.',
      description_es: 'Ya vino al salón. Ahora descubre qué más te va a comprar hoy mismo.',
      icon: 'Sparkles',
      form_schema: [
        { id: 'servicio', type: 'text', label_en: 'Booked Service', label_es: 'Servicio reservado', required: true },
        { id: 'historial', type: 'textarea', label_en: 'Client History', label_es: 'Historial del cliente', required: true, placeholder_es: 'Cortes, uñas, coloración previa...' },
        { id: 'presupuesto', type: 'select', label_en: 'Avg Budget', label_es: 'Presupuesto promedio', required: true,
          options: [
            { value: 'bajo', label_en: 'Low', label_es: 'Bajo' },
            { value: 'medio', label_en: 'Medium', label_es: 'Medio' },
            { value: 'alto', label_en: 'High / VIP', label_es: 'Alto (VIP)' }
          ]
        },
        { id: 'perfil', type: 'text', label_en: 'Client Profile', label_es: 'Perfil del cliente', required: true, placeholder_es: 'Ej. Novia, ejecutiva, estudiante...' },
        { id: 'catalogo', type: 'textarea', label_en: 'Available Services', label_es: 'Catálogo de servicios extras', required: true }
      ],
      prompt_template: `Act as a premium Spa & Salon Sales Stylist.
Booked: {{servicio}}
History: {{historial}}
Budget: {{presupuesto}}
Profile: {{perfil}}
Catalog: {{catalogo}}

Identify the 3 most logical and irresistible upsell/cross-sell services from the catalog.
For each, provide the 'Sales Argument' (why they need it today) and a short conversational script to offer it naturally without sounding pushy.`
    },
    {
      slug: 'confirma-beauty',
      name_en: 'ConfirmaBeauty',
      name_es: 'ConfirmaBeauty',
      description_en: 'Reduce cancellations before they empty your schedule.',
      description_es: 'Reduce cancelaciones y ausencias antes de que dejen tu silla vacía.',
      icon: 'CalendarCheck',
      form_schema: [
        { id: 'cliente', type: 'text', label_en: 'Client Name', label_es: 'Nombre del cliente', required: true },
        { id: 'servicio', type: 'text', label_en: 'Booked Service', label_es: 'Servicio reservado', required: true },
        { id: 'fecha_hora', type: 'text', label_en: 'Date & Time', label_es: 'Fecha y hora', required: true },
        { id: 'profesional', type: 'text', label_en: 'Stylist/Pro', label_es: 'Profesional asignado', required: true },
        { id: 'historial_cancela', type: 'select', label_en: 'Cancellation History', label_es: 'Historial de cancelaciones', required: true,
          options: [
            { value: 'nunca', label_en: 'Never cancels', label_es: 'Nunca cancela' },
            { value: 'a_veces', label_en: 'Sometimes', label_es: 'A veces cancela' },
            { value: 'frecuente', label_en: 'Frequent No-Show', label_es: 'Frecuente' }
          ]
        },
        { id: 'canal', type: 'select', label_en: 'Preferred Channel', label_es: 'Canal preferido', required: true,
          options: [
            { value: 'whatsapp', label_en: 'WhatsApp', label_es: 'WhatsApp' },
            { value: 'instagram', label_en: 'Instagram', label_es: 'Instagram' }
          ]
        }
      ],
      prompt_template: `Act as a strict but polite Salon Concierge.
Client: {{cliente}} (History of canceling: {{historial_cancela}})
Service: {{servicio}} with {{profesional}}
Time: {{fecha_hora}}
Channel: {{canal}}

Generate a smart confirmation message. If they are frequent cancellers, politely but firmly remind them of the cancellation policy or deposit rules. If they are reliable, make it warm and welcoming. Optimize for maximum attendance.`
    },
    {
      slug: 'opera-beauty',
      name_en: 'OperaBeauty',
      name_es: 'OperaBeauty',
      description_en: 'What is booked must reach the client perfectly. Zero chaos.',
      description_es: 'Lo que se agenda llega perfecto al cliente. Cero caos entre recepción y estilista.',
      icon: 'Scissors',
      form_schema: [
        { id: 'cliente', type: 'text', label_en: 'Client Name', label_es: 'Nombre del cliente', required: true },
        { id: 'servicio', type: 'text', label_en: 'Booked Service', label_es: 'Servicio reservado', required: true },
        { id: 'fecha_hora', type: 'text', label_en: 'Date & Time', label_es: 'Fecha y hora', required: true },
        { id: 'profesional', type: 'text', label_en: 'Stylist/Pro', label_es: 'Profesional asignado', required: true },
        { id: 'observaciones', type: 'textarea', label_en: 'Special Notes', label_es: 'Observaciones especiales', required: true, placeholder_es: 'Alergias a productos, requiere retoque de raíz...' }
      ],
      prompt_template: `Act as a meticulous Salon Floor Manager.
Client: {{cliente}}
Service: {{servicio}}
Pro: {{profesional}}
Time: {{fecha_hora}}
Notes: {{observaciones}}

Create a fast operational brief/checklist:
1. Reception Tasks (Prep).
2. Professional Tasks (Execution).
3. Follow-up Tasks (Checkout & next booking).
Highlight any special notes so nobody ruins the client's experience.`
    },
    {
      slug: 'pulse-beauty',
      name_en: 'PulseBeauty',
      name_es: 'PulseBeauty',
      description_en: 'Know how your salon is doing today without calling every hour.',
      description_es: 'Sabe cómo va tu salón hoy sin estar ahí.',
      icon: 'Activity',
      form_schema: [
        { id: 'reporte_dia', type: 'textarea', label_en: 'Daily Report', label_es: 'Reporte del día (texto libre)', required: true },
        { id: 'meta', type: 'text', label_en: 'Expected Goal', label_es: 'Meta de caja / clientes esperada', required: true },
        { id: 'servicios', type: 'text', label_en: 'Services Done', label_es: 'Servicios realizados', required: true },
        { id: 'incidencias', type: 'textarea', label_en: 'Incidents/Cancellations', label_es: 'Incidencias / Cancelaciones', required: true },
        { id: 'comentarios', type: 'textarea', label_en: 'Team Comments', label_es: 'Comentarios del equipo', required: true }
      ],
      prompt_template: `Act as an automated Salon Supervisor Assistant.
Goal: {{meta}}
Report: {{reporte_dia}}
Services: {{servicios}}
Incidents: {{incidencias}}
Team Comments: {{comentarios}}

Provide a 30-second Executive Summary.
Determine the status using an emoji Traffic Light (🟢 Great, 🟡 Minor issues, 🔴 Critical fail).
List the 2 most urgent follow-up actions (e.g. check missing inventory, contact angry client).`
    },
    {
      slug: 'beauty-loop',
      name_en: 'BeautyLoop Premium',
      name_es: 'BeautyLoop',
      description_en: 'From the booking to the client return. The complete salon cycle.',
      description_es: 'Reactiva + Confirma + Pulse. El flujo completo desde la agenda hasta el regreso.',
      icon: 'Repeat',
      form_schema: [
        { id: 'cliente', type: 'text', label_en: 'Client', label_es: 'Cliente', required: true },
        { id: 'situacion', type: 'textarea', label_en: 'Current Situation', label_es: 'Situación actual', required: true, placeholder_es: 'No ha venido, agendó y canceló, terminó su cita...' },
        { id: 'accion', type: 'select', label_en: 'Required Action', label_es: 'Acción requerida', required: true,
          options: [
            { value: 'reactivar', label_en: 'Reactivate', label_es: 'Reactivar' },
            { value: 'confirmar', label_en: 'Confirm & Secure', label_es: 'Confirmar / Asegurar Asistencia' },
            { value: 'evaluar', label_en: 'Evaluate & Pulse', label_es: 'Cierre / Evaluar Turno' }
          ]
        },
        { id: 'detalles', type: 'textarea', label_en: 'Details', label_es: 'Detalles (servicios, dinero, quejas)', required: true }
      ],
      prompt_template: `Act as the Ultimate Salon Copilot System. 
Client: {{cliente}}
Phase: {{accion}}
Details: {{detalles}}
Situation: {{situacion}}

If Phase=Reactivate: Generate a highly personal reactivation script and an upsell suggestion.
If Phase=Confirm & Secure: Build a no-show prevention script and an operational checklist for the stylist.
If Phase=Evaluate & Pulse: Generate a Daily Pulse Traffic Light report on the events, plus an automated apology/thank-you message for the client.
Always adapt dynamically and provide premium value.`
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
    if (app.slug === 'beauty-loop') {
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

  console.log('✅ Belleza / Salon Apps insertions complete.')
}

run()

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
  console.log('Seeding Limpieza / Cleaning Apps...')

  const apps = [
    {
      slug: 'limpiobot-247',
      name_en: 'LimpioBot 24/7',
      name_es: 'LimpioBot 24/7',
      description_en: 'Your 24/7 cleaning receptionist. Auto-generates scripts and 15 pre-set answers.',
      description_es: 'Tu recepcionista de limpieza que nunca duerme. Contesta, agenda y retiene clientes 24/7.',
      icon: 'MessageSquareText',
      form_schema: [
        { id: 'empresa', type: 'text', label_en: 'Company Name', label_es: 'Nombre de tu empresa', required: true },
        { id: 'servicios', type: 'text', label_en: 'Services offered', label_es: 'Servicios que ofreces', required: true, placeholder_es: 'ej: limpieza de oficinas, post-obra' },
        { id: 'zona', type: 'text', label_en: 'Coverage Area', label_es: 'Zona de cobertura', required: true },
        { id: 'precios', type: 'textarea', label_en: 'Price Ranges', label_es: 'Precios aproximados o rango', required: true },
        { id: 'tono', type: 'select', label_en: 'Desired Tone', label_es: 'Tono preferido de respuesta', required: true,
          options: [
            { value: 'formal', label_en: 'Formal', label_es: 'Formal' },
            { value: 'friendly', label_en: 'Friendly', label_es: 'Amigable' },
            { value: 'short', label_en: 'Very brief', label_es: 'Muy breve' }
          ]
        }
      ],
      prompt_template: `Act as a specialized chatbot copywriter for a cleaning company. 
Details:
Company: {{empresa}}
Services: {{servicios}}
Area: {{zona}}
Prices: {{precios}}
Tone: {{tono}}

Generate:
1. A master auto-responder script to welcome users and tell them business hours.
2. 15 pre-defined FAQ responses categorized into: Quotes, Complaints, Scheduling Changes, Cancellations. 
Make sure the language matches the requested tone and is ready to copy-paste into WhatsApp Business.`
    },
    {
      slug: 'tarea-limpia',
      name_en: 'TareaLimpia',
      name_es: 'TareaLimpia',
      description_en: 'Turns a quick client call summary into structured operational tasks in 30s.',
      description_es: 'De llamada a tarea asignada en 30 segundos. Que nunca se te olvide lo que prometiste.',
      icon: 'ListTodo',
      form_schema: [
        { id: 'resumen', type: 'textarea', label_en: 'Call Summary', label_es: 'Resumen de la llamada', required: true, placeholder_es: 'Cliente dijo que la limpiadora llegó tarde...' },
        { id: 'involucrados', type: 'text', label_en: 'People involved', label_es: 'Personas involucradas', required: true },
        { id: 'urgencia', type: 'select', label_en: 'Urgency', label_es: 'Urgencia', required: true,
          options: [
            { value: 'hoy', label_en: 'Today', label_es: 'Hoy' },
            { value: 'semana', label_en: 'This week', label_es: 'Esta semana' },
            { value: 'baja', label_en: 'Low urgency', label_es: 'Sin prisa' }
          ]
        },
        { id: 'responsable', type: 'text', label_en: 'Your name/area', label_es: 'Tu nombre o área', required: true }
      ],
      prompt_template: `Act as an Operations Manager for a cleaning service. Analyze this call summary and extract the action items.
Summary: {{resumen}}
People: {{involucrados}}
Urgency: {{urgencia}}
Assigner: {{responsable}}

Identify any risks of losing the client based on the text. 
Then, provide a structured checklist of tasks in this exact format:
✅ Tarea | Responsable sugerido | Fecha límite sugerida | Prioridad | Nota de contexto
Make it ready to paste into a WhatsApp group or task manager.`
    },
    {
      slug: 'manual-limpio',
      name_en: 'ManualLimpio',
      name_es: 'ManualLimpio',
      description_en: 'Your cleaning staff onboarding manual ready in 5 minutes.',
      description_es: 'El manual de entrenamiento de tu empresa de limpieza listo en 5 minutos.',
      icon: 'BookOpenCheck',
      form_schema: [
        { id: 'empresa', type: 'text', label_en: 'Company Name & Services', label_es: 'Nombre de tu empresa y servicios', required: true },
        { id: 'productos', type: 'textarea', label_en: 'Products used', label_es: 'Productos que usa tu equipo', required: true },
        { id: 'reglas', type: 'textarea', label_en: '3 Golden Rules', label_es: '3 reglas de oro de tu empresa', required: true },
        { id: 'proceso', type: 'textarea', label_en: 'Typical Visit Process', label_es: 'Proceso de una visita típica', required: true },
        { id: 'emergencias', type: 'textarea', label_en: 'Emergencies Protocol', label_es: 'Qué hacer si hay un problema', required: true },
        { id: 'tono', type: 'select', label_en: 'Format Tone', label_es: 'Tono deseado del manual', required: true,
          options: [
            { value: 'simple', label_en: 'Very Simple', label_es: 'Muy simple' },
            { value: 'detailed', label_en: 'Detailed', label_es: 'Detallado' },
            { value: 'checklist', label_en: 'Visual Checklist', label_es: 'Con checklist visual' }
          ]
        }
      ],
      prompt_template: `Act as an HR Training Specialist for a cleaning business. Generate an onboarding manual.
Company: {{empresa}}
Products: {{productos}}
Rules: {{reglas}}
Process: {{proceso}}
Emergencies: {{emergencias}}
Tone/Format: {{tono}}

Structure:
1. Welcome
2. Products & how to use them safely
3. Step by step process
4. Company Rules
5. Emergency Protocol
6. Day 1 Checklist for the employee
Keep language accessible, practical, and highly organized.`
    },
    {
      slug: 'reactiva-limpio',
      name_en: 'ReactivaLimpio',
      name_es: 'ReactivaLimpio',
      description_en: 'Recovers lost clients with a personalized message that converts.',
      description_es: 'Recupera clientes perdidos con un mensaje que sí funciona.',
      icon: 'RefreshCcw',
      form_schema: [
        { id: 'cliente', type: 'text', label_en: 'Client / Company Name', label_es: 'Nombre del cliente o empresa', required: true },
        { id: 'ultimo', type: 'text', label_en: 'Last service & date', label_es: 'Último servicio realizado y fecha', required: true },
        { id: 'razon', type: 'select', label_en: 'Likely reason they left', label_es: 'Por qué crees que se fue', required: true,
          options: [
            { value: 'precio', label_en: 'Price', label_es: 'Precio' },
            { value: 'calidad', label_en: 'Quality', label_es: 'Calidad' },
            { value: 'mudo', label_en: 'Moved', label_es: 'Se mudó' },
            { value: 'competencia', label_en: 'Changed provider', label_es: 'Cambió de proveedor' },
            { value: 'nose', label_en: 'I do not know', label_es: 'No sé' }
          ]
        },
        { id: 'personal', type: 'textarea', label_en: 'Personal detail / note', label_es: 'Algo personal o relevante que recuerdes', required: true },
        { id: 'canal', type: 'select', label_en: 'Preferred Channel', label_es: 'Canal de contacto', required: true,
          options: [
            { value: 'whatsapp', label_en: 'WhatsApp', label_es: 'WhatsApp' },
            { value: 'email', label_en: 'Email', label_es: 'Email' },
            { value: 'llamar', label_en: 'Call Script', label_es: 'Llamada' }
          ]
        }
      ],
      prompt_template: `Generate a hyper-personalized reactivation message for a lost cleaning client.
Client: {{cliente}}
Last Service: {{ultimo}}
Probable reason for leaving: {{razon}}
Relevant detail: {{personal}}
Channel: {{canal}}

Provide 3 different versions of the message:
1. Warm and friendly
2. Direct and professional
3. Offer-driven (e.g. discount to return)
Highlight the best one to use depending on context. Ensure the tone is not desperate but genuinely helpful.`
    },
    {
      slug: 'prospecta-limpio',
      name_en: 'ProspectaLimpio',
      name_es: 'ProspectaLimpio',
      description_en: 'Personalized cold outreach messages in 45 seconds for cleaning businesses.',
      description_es: 'Propuestas personalizadas para atraer nuevos contratos sin perder horas.',
      icon: 'Megaphone',
      form_schema: [
        { id: 'prospecto', type: 'text', label_en: 'Prospect Name & Type', label_es: 'Nombre y tipo de prospecto', required: true },
        { id: 'servicios', type: 'textarea', label_en: 'Services to offer', label_es: 'Servicios que quieres ofrecerle', required: true },
        { id: 'observacion', type: 'textarea', label_en: 'Custom observation', label_es: 'Algo que observaste o investigaste', required: true },
        { id: 'diferenciador', type: 'text', label_en: 'Your differentiator', label_es: 'Tu diferenciador principal', required: true },
        { id: 'oferta', type: 'select', label_en: 'Initial Offer', label_es: 'Tipo de oferta inicial', required: true,
          options: [
            { value: 'gratis', label_en: 'Free visit', label_es: 'Visita gratuita' },
            { value: 'descuento', label_en: 'Discounted trial', label_es: 'Servicio de prueba con descuento' },
            { value: 'info', label_en: 'Info only', label_es: 'Solo información' },
            { value: 'cotizacion', label_en: 'Immediate quote', label_es: 'Cotización inmediata' }
          ]
        },
        { id: 'canal', type: 'select', label_en: 'Channel', label_es: 'Canal de envío', required: true,
          options: [
            { value: 'whatsapp', label_en: 'WhatsApp', label_es: 'WhatsApp' },
            { value: 'email', label_en: 'Email', label_es: 'Email' },
            { value: 'linkedin', label_en: 'LinkedIn', label_es: 'LinkedIn' },
            { value: 'carta', label_en: 'Physical Letter', label_es: 'Carta física' }
          ]
        }
      ],
      prompt_template: `Write a cold outreach message for a cleaning business targeting a new prospect.
Prospect: {{prospecto}}
Services: {{servicios}}
Observation: {{observacion}}
Differentiator: {{diferenciador}}
Offer: {{oferta}}
Channel: {{canal}}

Write a punchy, non-salesy message that leverages the observation to show research. Include the differentiator naturally and close with the offer. If email, provide an engaging subject line. Keep it natively adapted to the chosen channel.`
    },
    {
      slug: 'reactiva-prospect',
      name_en: 'ReactivaProspect Planner',
      name_es: 'ReactivaProspect',
      description_en: 'The complete portfolio growth system: recover lost clients and win new ones.',
      description_es: 'El sistema completo de crecimiento: recupera clientes perdidos y prospecta nuevos con inteligencia.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'empresa', type: 'text', label_en: 'Company & Area', label_es: 'Nombre de tu empresa y zona de operación', required: true },
        { id: 'perdidos', type: 'textarea', label_en: 'Lost Clients', label_es: 'Lista de clientes perdidos', required: true },
        { id: 'nuevos', type: 'textarea', label_en: 'New Prospects', label_es: 'Lista de prospectos nuevos', required: true },
        { id: 'diferenciador', type: 'text', label_en: 'Differentiator', label_es: 'Tu diferenciador principal', required: true },
        { id: 'oferta_recuperacion', type: 'text', label_en: 'Reactivation Offer', label_es: 'Oferta de reenganche (perdidos)', required: true },
        { id: 'oferta_nuevos', type: 'text', label_en: 'New Prospect Offer', label_es: 'Oferta de primer contacto (nuevos)', required: true },
        { id: 'canal', type: 'select', label_en: 'Channel', label_es: 'Canal preferido', required: true,
          options: [
            { value: 'whatsapp', label_en: 'WhatsApp', label_es: 'WhatsApp' },
            { value: 'email', label_en: 'Email', label_es: 'Email' },
            { value: 'ambos', label_en: 'Both', label_es: 'Ambos' }
          ]
        }
      ],
      prompt_template: `Act as a Growth Strategist for a Cleaning Company.
Company: {{empresa}}
Differentiator: {{diferenciador}}
Lost Clients Details: {{perdidos}}
New Prospects Details: {{nuevos}}
Offer (Lost): {{oferta_recuperacion}}
Offer (New): {{oferta_nuevos}}
Channel: {{canal}}

Process this into a 4-part Growth Document:
Part A: Reactivation Messages for each lost client based on their specific situation and the offer.
Part B: Cold Outreach Messages for each new prospect incorporating the differentiator and matching the channel format perfectly.
Part C: Ideal Client Profile analysis based on these inputs.
Part D: A suggested 30-day outreach calendar.`
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
    if (app.slug === 'reactiva-prospect') {
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

  console.log('✅ Limpieza Apps insertions complete.')
}

run()

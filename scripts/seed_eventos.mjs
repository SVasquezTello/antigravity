import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('🎉 Seeding Micro-Apps para Eventos (EventLoop Ecosystem)...')

  const apps = [
    {
      slug: 'reactiva-event',
      name_en: 'ReactivaEvent',
      name_es: 'ReactivaEvent',
      description_en: 'Reactivate leads who asked for a quote and went silent with the perfect messaging.',
      description_es: 'Reactiva prospectos que pidieron cotización y desaparecieron con el mensaje perfecto.',
      icon: 'MessageSquare',
      form_schema: [
        { id: 'nombre_cliente', type: 'text', label_en: 'Client Name', label_es: 'Nombre del cliente', required: true },
        { id: 'tipo_evento', type: 'text', label_en: 'Event Type', label_es: 'Tipo de evento', required: true, placeholder_es: 'Boda, XV, Corporativo...' },
        { id: 'presupuesto_estimado', type: 'text', label_en: 'Estimated Budget', label_es: 'Presupuesto estimado', required: true },
        { id: 'fecha_probable', type: 'text', label_en: 'Probable Date', label_es: 'Fecha probable', required: true },
        { id: 'ultimo_mensaje', type: 'textarea', label_en: 'Last Message', label_es: 'Último mensaje recibido', required: true },
        { id: 'dias_sin_responder', type: 'number', label_en: 'Days without response', label_es: 'Días sin responder', required: true }
      ],
      prompt_template: `Actúa como un Senior Event Planner experto en persuasión. Un cliente interesado en {{tipo_evento}} ha dejado de responder hace {{dias_sin_responder}} días.
      
      ÚLTIMO CONTACTO: "{{ultimo_mensaje}}"
      
      TAREA:
      Genera 2 mensajes de seguimiento irresistibles optimizados para WhatsApp.
      1. VERSIÓN SUAVE: Enfocada en aportar valor (ej. "¿Viste esta tendencia para {{tipo_evento}}?") y saber si la fecha del {{fecha_probable}} sigue en pie.
      2. VERSIÓN DIRECTA: Enfocada en la disponibilidad de la fecha (escasez) y el presupuesto de {{presupuesto_estimado}}.
      
      RECOMENDACIÓN: Sugiere cuál usar según el tono del último mensaje.`
    },
    {
      slug: 'upsell-event-ai',
      name_en: 'UpsellEvent AI',
      name_es: 'UpsellEvent AI',
      description_en: 'Maximize your event ticket. Discover and sell high-margin extra services.',
      description_es: 'Maximiza el ticket de cada evento. Descubre y vende servicios extras de alto margen.',
      icon: 'Target',
      form_schema: [
        { id: 'servicio_principal', type: 'text', label_en: 'Main Service Contracted', label_es: 'Servicio principal contratado', required: true },
        { id: 'perfil_cliente', type: 'textarea', label_en: 'Client Profile', label_es: 'Perfil del cliente (Edad, Gustos)', required: true },
        { id: 'presupuesto_disponible', type: 'text', label_en: 'Available Budget', label_es: 'Presupuesto disponible aproximado', required: true },
        { id: 'historial_evento', type: 'textarea', label_en: 'Event History/Details', label_es: 'Historial/Detalles del evento', required: true },
        { id: 'catalogo_servicios', type: 'textarea', label_en: 'Service Catalog', label_es: 'Catálogo de servicios extras', required: true, placeholder_es: 'Catering premium, DJ, Show, Foto...' }
      ],
      prompt_template: `Eres el Master de Ventas de la agencia. El cliente ya reservó {{servicio_principal}}, pero le falta la "magia" extra.
      
      DATOS:
      - Perfil: {{perfil_cliente}}
      - Detalles: {{historial_evento}}
      - Qué podemos ofrecer: {{catalogo_servicios}}
      
      ENTREGA:
      1. TOP 3 UPSELLS PRIORITARIOS: Los 3 servicios de {{catalogo_servicios}} que más encajan con el cliente.
      2. ARGUMENTO DE VALOR: Por qué estas adiciones harán que su evento sea inolvidable.
      3. SCRIPT DE VENTA: Un mensaje directo para ofrecer el paquete premium.
      
      Cierra con: El incremento proyectado en tu utilidad por este evento.`
    },
    {
      slug: 'opera-event',
      name_en: 'OperaEvent',
      name_es: 'OperaEvent',
      description_en: 'Create perfect coordination checklists for providers and team members.',
      description_es: 'Crea checklists de coordinación perfectos para proveedores y equipo.',
      icon: 'ClipboardCheck',
      form_schema: [
        { id: 'evento_confirmado', type: 'text', label_en: 'Confirmed Event', label_es: 'Evento confirmado (Boda Gómez, etc.)', required: true },
        { id: 'fecha_hora', type: 'text', label_en: 'Date and Time', label_es: 'Fecha y hora', required: true },
        { id: 'proveedores_involucrados', type: 'textarea', label_en: 'Providers Involved', label_es: 'Proveedores involucrados', required: true },
        { id: 'cronograma_principal', type: 'textarea', label_en: 'Main Schedule', label_es: 'Cronograma principal', required: true },
        { id: 'observaciones', type: 'textarea', label_en: 'Special Observations', label_es: 'Observaciones especiales', required: false }
      ],
      prompt_template: `Actúa como un Jefe de Operaciones de Eventos. No permitas que el DJ llegue tarde o que el catering falle.
      
      DATOS DEL EVENTO: {{evento_confirmado}} el {{fecha_hora}}
      
      GENERA EL CHECKLIST OPERATIVO:
      1. LOGÍSTICA DE MONTAJE: (Check de mobiliario, flores, iluminación).
      2. COORDINACIÓN DE PROVEEDORES ({{proveedores_involucrados}}): Qué avisarles 24h antes y 4h antes.
      3. CRONOGRAMA DE EJECUCIÓN: (Recepción, Cena, Brindis, Fiesta) basado en {{cronograma_principal}}.
      
      Cierra con: Un "Plan de Contingencia" rápido para {{observaciones}}.`
    },
    {
      slug: 'decide-event',
      name_en: 'DecideEvent',
      name_es: 'DecideEvent',
      description_en: 'Data-driven event management. Discover your most profitable packages and providers.',
      description_es: 'Gestión de eventos basada en datos. Descubre tus paquetes y proveedores más rentables.',
      icon: 'PieChart',
      form_schema: [
        { id: 'reporte_eventos', type: 'textarea', label_en: 'Event Sales Report', label_es: 'Reporte de ventas de eventos', required: true },
        { id: 'principal_problema', type: 'text', label_en: 'Main Problem', label_es: 'Principal problema', required: true },
        { id: 'area_analizar', type: 'text', label_en: 'Area to Analyze', label_es: 'Área a analizar', required: true },
        { id: 'contexto', type: 'textarea', label_en: 'Relevant Context', label_es: 'Contexto relevante', required: true }
      ],
      prompt_template: `Eres el CFO de la agencia de eventos. Tu objetivo es la máxima utilidad por metro cuadrado de fiesta.
      
      DATOS: {{reporte_eventos}}
      RETO: {{principal_problema}} en {{area_analizar}}
      
      ENTREGA:
      1. ANÁLISIS DE RENTABILIDAD: Qué paquetes están dejando más margen y cuáles son pérdida de tiempo.
      2. AUDITORÍA DE PROVEEDORES: Quiénes son confiables y quiénes están arruinando el margen.
      3. 3 DECISIONES ACCIONABLES: Plan para subir precios, optimizar costos o cambiar el catálogo.
      
      Tono: Estratégico y enfocado en billetes.`
    },
    {
      slug: 'pulse-event',
      name_en: 'PulseEvent',
      name_es: 'PulseEvent',
      description_en: 'Daily flash report for the agency owner. Control without micromanaging.',
      description_es: 'Reporte flash diario para el dueño de la agencia. Control total sin micro-gestión.',
      icon: 'Activity',
      form_schema: [
        { id: 'reporte_dia', type: 'textarea', label_en: 'Daily Report', label_es: 'Reporte del día', required: true },
        { id: 'meta_proxima', type: 'text', label_en: 'Next Big Goal', label_es: 'Meta/Evento próximo más grande', required: true },
        { id: 'incidencias', type: 'textarea', label_en: 'Incidents/Issues', label_es: 'Incidencias o retrasos detectados', required: true },
        { id: 'avance_preparacion', type: 'text', label_en: 'Preparation Status %', label_es: 'Avance de preparación (%)', required: true },
        { id: 'comentarios', type: 'textarea', label_en: 'Staff Comments', label_es: 'Comentarios del encargado', required: false }
      ],
      prompt_template: `Eres el Director de Producción. El dueño quiere el "Pulso" de la ejecución sin tener que llamar a mil personas.
      
      RESUMEN OPERATIVO:
      🟢 ESTADO VERDE: Qué hitos se cumplieron perfectamente hoy.
      🟡 ESTADO AMARILLO: Pendientes críticos para {{meta_proxima}}. Avance: {{avance_preparacion}}%.
      🔴 ALERTA ROJA: Incidencias de {{incidencias}}.
      
      Instrucción para mañana: La única cosa que el dueño debe supervisar personalmente para evitar fallos.
      
      Cierra con: El mensaje motivacional para el equipo de producción.`
    },
    {
      slug: 'event-loop',
      name_en: 'EventLoop Premium',
      name_es: 'EventLoop Premium',
      description_en: 'The ultimate event growth ecosystem. From first quote to the last applause.',
      description_es: 'El ecosistema definitivo de crecimiento para eventos: desde la cotización hasta el último aplauso.',
      icon: 'Infinity',
      form_schema: [
        { id: 'nombre_agencia', type: 'text', label_en: 'Agency Name', label_es: 'Nombre de la agencia', required: true },
        { id: 'especialidad', type: 'text', label_en: 'Specialization', label_es: 'Especialidad (Bodas, Corporativos, etc.)', required: true },
        { id: 'desafio_operativo', type: 'textarea', label_en: 'Operational Challenge', label_es: 'Principal desafío operativo actual', required: true }
      ],
      prompt_template: `Eres el consultor master de "EventLoop". Vas a blindar el proceso de {{nombre_agencia}}.
      
      ESPECIALIDAD: {{especialidad}}
      RETO: {{desafio_operativo}}
      
      GENERA:
      1. EL FLUJO "NO-GHOSTING": Cómo conectar ReactivaEvent para cerrar 30% más cotizaciones este mes.
      2. MANUAL DE COORDINACIÓN MAESTRA: Cómo OperaEvent eliminará el estrés del dueño en el sitio del evento.
      3. ESCALADO DE MARGEN: Cómo usar UpsellEvent AI para que cada mini-fiesta se convierta en una inversión premium.
      
      Frase final: El secreto para ser la agencia #1 en {{especialidad}}.`
    }
  ]

  // Fetch plans
  const { data: plans, error: planError } = await supabase.from('plans').select('id, slug')
  if (planError) { console.error('Error fetching plans:', planError); return }

  const proPlan = plans.find(p => p.slug === 'professional' || p.slug === 'pro')
  const businessPlan = plans.find(p => p.slug === 'business' || p.slug === 'enterprise')

  for (const app of apps) {
    const appId = crypto.randomUUID()
    console.log(`Inserting app: ${app.slug}...`)

    const { error: appError } = await supabase.from('micro_apps').insert({
      id: appId, slug: app.slug, name_en: app.name_en, name_es: app.name_es,
      description_en: app.description_en, description_es: app.description_es,
      icon: app.icon, form_schema: app.form_schema, prompt_template: app.prompt_template
    })

    if (appError) {
      if (appError.code === '23505') {
        process.stdout.write(`App ${app.slug} duplicate, updating... `)
        const { data: existingApp } = await supabase.from('micro_apps').select('id').eq('slug', app.slug).single()
        if (existingApp) {
          app.id = existingApp.id
          await supabase.from('micro_apps').update({
            name_en: app.name_en, name_es: app.name_es,
            description_en: app.description_en, description_es: app.description_es,
            icon: app.icon, form_schema: app.form_schema, prompt_template: app.prompt_template
          }).eq('id', app.id)
          console.log('Done.')
        }
      } else { console.error(`Error inserting ${app.slug}:`, appError.message); continue }
    } else { app.id = appId }

    let targetPlan = proPlan
    if (app.slug === 'event-loop' || app.slug === 'decide-event') {
      targetPlan = businessPlan || proPlan
    }

    if (targetPlan && app.id) {
      const { data: existingLink } = await supabase.from('plan_apps').select('*')
        .eq('plan_id', targetPlan.id).eq('app_id', app.id).single()
      if (!existingLink) {
        await supabase.from('plan_apps').insert({ plan_id: targetPlan.id, app_id: app.id })
        console.log(`Linked ${app.slug} → plan ${targetPlan.slug}`)
      } else { console.log(`${app.slug} already linked to plan ${targetPlan.slug}`) }
    }
  }

  console.log('\n✅ Micro-Apps de Eventos completadas con éxito.')
}

run()

import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('💰 Seeding Micro-Apps para Finanzas (FinanceLoop Ecosystem)...')

  const apps = [
    {
      slug: 'reactiva-finance',
      name_en: 'ReactivaFinance',
      name_es: 'ReactivaFinance',
      description_en: 'Reactivate financial leads who went silent with the perfect follow-up strategy.',
      description_es: 'Reactiva prospectos financieros que se enfriaron con la estrategia de seguimiento perfecta.',
      icon: 'MessageSquare',
      form_schema: [
        { id: 'nombre_cliente', type: 'text', label_en: 'Client Name', label_es: 'Nombre del cliente', required: true },
        { id: 'tipo_consulta', type: 'text', label_en: 'Inquiry Type', label_es: 'Tipo de consulta (Inversión, Crédito, etc.)', required: true },
        { id: 'monto_estimado', type: 'text', label_en: 'Estimated Amount', label_es: 'Monto estimado', required: true },
        { id: 'fecha_contacto', type: 'text', label_en: 'Last Contact Date', label_es: 'Fecha del último contacto', required: true },
        { id: 'ultimo_mensaje', type: 'textarea', label_en: 'Last Message Received', label_es: 'Último mensaje recibido', required: true },
        { id: 'dias_sin_responder', type: 'number', label_en: 'Days without response', label_es: 'Días sin responder', required: true }
      ],
      prompt_template: `Eres un Asesor Financiero Senior experto en cierre de ventas. Un cliente interesado en {{tipo_consulta}} por un monto de {{monto_estimado}} ha dejado de responder hace {{dias_sin_responder}} días.
      
      ÚLTIMO MENSAJE DEL CLIENTE: "{{ultimo_mensaje}}"
      
      TAREA:
      Genera 2 mensajes de seguimiento optimizados (WhatsApp/Email).
      1. VERSIÓN SUAVE: Enfocada en resolver dudas y aportar valor (ej. "¿Viste el cambio en la tasa de interés?").
      2. VERSIÓN DIRECTA: Enfocada en la oportunidad perdida por no tomar acción hoy.
      
      RECOMENDACIÓN: Sugiere cuál usar según el perfil y da un tip de 1 frase para aumentar la confianza financiera.`
    },
    {
      slug: 'upsell-finance',
      name_en: 'UpsellFinance AI',
      name_es: 'UpsellFinance AI',
      description_en: 'Discover high-probability cross-sell opportunities for current financial clients.',
      description_es: 'Descubre oportunidades de venta cruzada de alta probabilidad para clientes actuales.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'servicio_contratado', type: 'text', label_en: 'Main Service Contracted', label_es: 'Servicio principal contratado', required: true },
        { id: 'perfil_financiero', type: 'textarea', label_en: 'Client Financial Profile', label_es: 'Perfil financiero del cliente', required: true, placeholder_es: 'Edad, ingresos, tolerancia al riesgo...' },
        { id: 'historial_productos', type: 'textarea', label_en: 'Product History', label_es: 'Historial de productos', required: false },
        { id: 'presupuesto_estimado', type: 'text', label_en: 'Estimated Budget', label_es: 'Presupuesto mensual estimado', required: true },
        { id: 'catalogo_disponible', type: 'textarea', label_en: 'Available Catalog', label_es: 'Servicios disponibles', required: true, placeholder_es: 'Seguros, retiro, optimización fiscal, etc.' }
      ],
      prompt_template: `Eres un Consultor Patrimonial Estratégico. El cliente ya tiene {{servicio_contratado}}, pero estás dejando dinero en la mesa al no ofrecerle más.
      
      DATOS:
      - Perfil: {{perfil_financiero}}
      - Servicios actuales: {{historial_productos}}
      - Qué podemos ofrecer: {{catalogo_disponible}}
      
      ENTREGA:
      1. TOP 3 UPSELLS/CROSS-SELLS: Los productos con mayor probabilidad de cierre hoy.
      2. ARGUMENTO COMERCIAL: Por qué el cliente necesita esto para proteger o crecer su patrimonio.
      3. MENSAJE LISTO PARA VENTA: Un script de apertura para ofrecer el servicio de forma profesional.
      
      Cierra con: El potencial de ingreso adicional estimado por este cliente.`
    },
    {
      slug: 'renueva-finance',
      name_en: 'RenuevaFinance',
      name_es: 'RenuevaFinance',
      description_en: 'Never lose a recurring client again. Automate renewal reminders and retention.',
      description_es: 'No pierdas ni un cliente recurrente. Automatiza avisos de renovación y retención.',
      icon: 'RotateCcw',
      form_schema: [
        { id: 'nombre_cliente', type: 'text', label_en: 'Client Name', label_es: 'Nombre del cliente', required: true },
        { id: 'producto_vencer', type: 'text', label_en: 'Expiring Product', label_es: 'Producto por vencer', required: true },
        { id: 'fecha_vencimiento', type: 'text', label_en: 'Expiration Date', label_es: 'Fecha de vencimiento', required: true },
        { id: 'monto_renovacion', type: 'text', label_en: 'Renewal Amount', label_es: 'Monto de renovación/inversión', required: true },
        { id: 'estado_relacion', type: 'select', label_en: 'Relationship Status', label_es: 'Estado de la relación', required: true,
          options: [
            { value: 'muy_bueno', label_en: 'Very Good', label_es: 'Muy bueno (Satisfecho)' },
            { value: 'neutral', label_en: 'Neutral', label_es: 'Neutral (Sin contacto reciente)' },
            { value: 'en_riesgo', label_en: 'At Risk', label_es: 'En riesgo (Pidió informes a competencia)' }
          ]
        }
      ],
      prompt_template: `Actúa como un Customer Success Manager en el sector financiero. {{nombre_cliente}} tiene su {{producto_vencer}} por vencer el {{fecha_vencimiento}}. 
      
      Estado: {{estado_relacion}}. Monto en juego: {{monto_renovacion}}.
      
      GENERA:
      1. SECUENCIA DE 3 CONTACTOS: (T-15 días, T-5 días, Día V).
      2. TÁCTICA DE RETENCIÓN: Un beneficio exclusivo o "bonus" por renovar anticipadamente.
      3. MENSAJE DE RECUPERACIÓN (SI ES RIESGO): Guion para llamada de 2 minutos para evitar que se lleve su dinero a otro asesor.
      
      Cierra con: El impacto negativo de perder este cliente en el flujo anual.`
    },
    {
      slug: 'decide-finance',
      name_en: 'DecideFinance',
      name_es: 'DecideFinance',
      description_en: 'Financial business intelligence. Know which products and advisors drive profit.',
      description_es: 'Inteligencia financiera de negocio. Sabes qué productos y asesores generan más margen.',
      icon: 'PieChart',
      form_schema: [
        { id: 'reporte_comercial', type: 'textarea', label_en: 'Commercial Report Data', label_es: 'Reporte comercial (Cierres, volumen, comisiones)', required: true },
        { id: 'principal_objetivo', type: 'text', label_en: 'Business Goal', label_es: 'Objetivo de este trimestre', required: true },
        { id: 'margen_productos', type: 'textarea', label_en: 'Product Margins', label_es: 'Margen estimado por producto', required: true },
        { id: 'rendimiento_asesores', type: 'textarea', label_en: 'Advisor Performance', label_es: 'Resumen rendimiento asesores', required: true }
      ],
      prompt_template: `Eres el CFO (Director Financiero) de la firma. Tu misión es maximizar la rentabilidad operativa.
      
      DATOS COMERCIALES: {{reporte_comercial}}
      PRODUCTOS Y MÁRGENES: {{margen_productos}}
      ASESORES: {{rendimiento_asesores}}
      OBJETIVO: {{principal_objetivo}}
      
      ENTREGA:
      1. EL PRODUCTO GANADOR: Dónde debemos poner todo el esfuerzo publicitario para maximizar margen.
      2. AUDITORÍA DE ASESORES: Quién es el MVP y quién necesita capacitación urgente.
      3. 3 DECISIONES ACCIONABLES: "Deja de vender X, potencia Y, ajusta comisión en Z".
      
      Tono: Basado en números, sin filtros, estratégico.`
    },
    {
      slug: 'pulse-finance',
      name_en: 'PulseFinance',
      name_es: 'PulseFinance',
      description_en: 'Daily Flash Report for the firm owner. Cares about results, not excuses.',
      description_es: 'Reporte Flash diario para el dueño de la firma. Resultados, no excusas.',
      icon: 'Zap',
      form_schema: [
        { id: 'cierres_dia', type: 'textarea', label_en: 'Daily Closures/Volume', label_es: 'Cierres del día (Cantidad y monto)', required: true },
        { id: 'oportunidades_abiertas', type: 'number', label_en: 'Open Opportunities', label_es: 'Nuevas oportunidades abiertas', required: true },
        { id: 'renovaciones_pendientes', type: 'number', label_en: 'Pending Renewals', label_es: 'Renovaciones críticas pendientes', required: true },
        { id: 'meta_mensual', type: 'text', label_en: 'Monthly Goal Status', label_es: '% Avance Meta Mensual', required: true },
        { id: 'urgencias_dia', type: 'textarea', label_en: 'Daily Emergencies', label_es: 'Urgencias o incidencias', required: false }
      ],
      prompt_template: `Eres el Chief of Staff. El dueño de la consultora ya se fue a casa y necesita saber el Pulso de hoy en 30 segundos.
      
      RESUMEN FLASH:
      1. EL NÚMERO DEL DÍA: Cierres por {{cierres_dia}}.
      2. SEMÁFORO DE META ({{meta_mensual}}% de avance). ¿Vamos tarde o a tiempo?
      3. LAS 2 ALERTAS CRÍTICAS: Renovaciones pendientes ({{renovaciones_pendientes}}) y incidencias: {{urgencias_dia}}.
      
      Acción rápida para mañana: La instrucción número 1 que el dueño debe dar al equipo al llegar.`
    },
    {
      slug: 'finance-loop',
      name_en: 'FinanceLoop Premium',
      name_es: 'FinanceLoop Premium',
      description_en: 'The ultimate financial growth engine. Reactivation + Upselling + Pulse.',
      description_es: 'El motor de crecimiento financiero definitivo. Reactivación + Upsell + Control.',
      icon: 'Infinity',
      form_schema: [
        { id: 'nombre_firma', type: 'text', label_en: 'Firm Name', label_es: 'Nombre de la firma/Broker', required: true },
        { id: 'nicho_principal', type: 'text', label_en: 'Core Niche', label_es: 'Nicho (Inversiones, Crédito, Seguros)', required: true },
        { id: 'desafio_comercial', type: 'textarea', label_en: 'Current Sales Challenge', label_es: 'Desafío comercial actual', required: true }
      ],
      prompt_template: `Eres el consultor master de "FinanceLoop". Vas a diseñar el sistema de crecimiento para {{nombre_firma}}.
      
      NICHO: {{nicho_principal}}
      RETO: {{desafio_comercial}}
      
      GENERA:
      1. EL EMBUDO RECURRENTE: Cómo conectar ReactivaFinance con UpsellFinance para que cada cliente valga el triple.
      2. ESTRATEGIA DE "RENTA VITALICIA": Cómo estructurar las renovaciones para que el negocio crezca sin buscar clientes nuevos.
      3. SISTEMA DE GESTIÓN: Cómo usar PulseFinance para que el dueño trabaje 4 horas a la semana y el equipo rinda al 100%.
      
      Cierra con: El cálculo potencial de aumento en facturación si se aplican los 3 ejes.`
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
    if (app.slug === 'finance-loop' || app.slug === 'decide-finance') {
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

  console.log('\n✅ Micro-Apps de Finanzas completadas con éxito.')
}

run()

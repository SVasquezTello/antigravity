import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('👓 Sobrescribiendo Micro-Apps para Ópticas con especificaciones de venta...')

  const apps = [
    {
      slug: 'reactiva-optica',
      name_en: 'ReactivaOptic',
      name_es: 'ReactivaÓptica',
      description_en: 'That client didn\'t disappear. They just need the right message.',
      description_es: 'Ese cliente no desapareció. Solo necesita el mensaje correcto.',
      icon: 'MessageSquare',
      form_schema: [
        { id: 'cliente', type: 'text', label_en: 'Client Name', label_es: 'Nombre del cliente', required: true },
        { id: 'tipo_lentes', type: 'text', label_en: 'Lenses Quoted', label_es: 'Tipo de lentes consultados', required: true },
        { id: 'presupuesto', type: 'text', label_en: 'Estimated Budget', label_es: 'Presupuesto estimado', required: true },
        { id: 'fecha_consulta', type: 'text', label_en: 'Consultation Date', label_es: 'Fecha de consulta', required: true },
        { id: 'ultimo_mensaje', type: 'textarea', label_en: 'Last Message Received', label_es: 'Último mensaje recibido', required: true },
        { id: 'dias_sin_responder', type: 'text', label_en: 'Days without response', label_es: 'Días sin responder', required: true }
      ],
      prompt_template: `Actúa como un cerrador experto en ventas para ópticas. Tu cliente {{cliente}} preguntó por {{tipo_lentes}} (Presupuesto aprox: {{presupuesto}}) hace {{dias_sin_responder}} días.
Su último mensaje fue: "{{ultimo_mensaje}}".

Genera dos opciones de seguimiento para enviar por WhatsApp:

1. VERSIÓN SUAVE (Empatía y Salud):
Enfócate en que entendemos que está ocupado pero que su salud visual es prioridad. Mensaje corto, profesional y ligero. Máx 3 líneas.

2. VERSIÓN PROMOCIONAL (Cierre):
"Vimos que dejó pendiente su selección de {{tipo_lentes}}. Si agenda su compra en las próximas 48 horas, le incluimos [Incentivo basado en {{presupuesto}}]. ¿Qué le parece?".

RECOMENDACIÓN: Sugiere cuál de las dos usar según el tono de "{{ultimo_mensaje}}" y por qué.`
    },
    {
      slug: 'upsell-optica-ai',
      name_en: 'UpsellOptic AI',
      name_es: 'UpsellÓptica AI',
      description_en: 'They already came for glasses. Now discover what else they need.',
      description_es: 'Ya vino por unos lentes. Ahora descubre qué más necesita.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'producto_vendido', type: 'text', label_en: 'Main Product Sold', label_es: 'Producto principal vendido', required: true },
        { id: 'perfil_cliente', type: 'text', label_en: 'Client Profile', label_es: 'Perfil del cliente (edad, ocupación)', required: true },
        { id: 'historial', type: 'textarea', label_en: 'Purchase History', label_es: 'Historial de compra', required: false },
        { id: 'presupuesto', type: 'text', label_en: 'Estimated Budget', label_es: 'Presupuesto estimado', required: true },
        { id: 'catalogo', type: 'textarea', label_en: 'Available Catalog', label_es: 'Catálogo/Servicios disponibles (Blue Shield, Sol, etc.)', required: true }
      ],
      prompt_template: `Eres un estratega de Ventas en Ópticas. El cliente compró {{producto_vendido}} y tiene un perfil de {{perfil_cliente}}.

Basado en el catálogo {{catalogo}}:
1. DETECTA LOS 3 UPSELLS PRIORITARIOS: Qué micas o productos adicionales le darían más valor a este perfil específico.
2. ARGUMENTO COMERCIAL: Por qué necesita cada uno (Ej: "Si trabaja en PC, el Blue Shield no es opción, es necesidad").
3. MENSAJE LISTO PARA VENTA: Un guion exacto de lo que el vendedor debe decir antes de cobrar.

Cierra con: Estrategia de ticket familiar.`
    },
    {
      slug: 'opera-optica',
      name_en: 'OperaOptic',
      name_es: 'OperaÓptica',
      description_en: 'No more lost deliveries due to poor coordination.',
      description_es: 'Nunca más una entrega perdida por mala coordinación.',
      icon: 'ClipboardCheck',
      form_schema: [
        { id: 'cliente', type: 'text', label_en: 'Client Name', label_es: 'Nombre del cliente', required: true },
        { id: 'tipo_pedido', type: 'text', label_en: 'Order Type', label_es: 'Tipo de pedido', required: true },
        { id: 'fecha_entrega', type: 'text', label_en: 'Promised Delivery', label_es: 'Fecha de entrega prometida', required: true },
        { id: 'responsable', type: 'text', label_en: 'Person in Charge', label_es: 'Responsable asignado', required: true },
        { id: 'observaciones', type: 'textarea', label_en: 'Special Observations', label_es: 'Observaciones especiales', required: false }
      ],
      prompt_template: `Eres el Director de Operación de una óptica de alta gama.
Pedido de: {{cliente}} ({{tipo_pedido}})
Promesa: {{fecha_entrega}}
Encargado: {{responsable}}

Genera el CHECKLIST OPERATIVO COMPLETO:
- PASO RECEPCIÓN: Qué verificar hoy.
- PASO LABORATORIO: Confirmación de micas y montura.
- PASO ENTREGA: Guion para avisar al cliente que están listos.

Prepara un mensaje de Alerta para {{responsable}} si faltan menos de 24h para la entrega.`
    },
    {
      slug: 'decide-optica',
      name_en: 'OpticDecision',
      name_es: 'DecideÓptica',
      description_en: 'Your numbers should tell you where the profit is.',
      description_es: 'Tus números deben decirte dónde está la ganancia.',
      icon: 'BarChart',
      form_schema: [
        { id: 'reporte', type: 'textarea', label_en: 'Sales Report/Data', label_es: 'Reporte de ventas o datos del periodo', required: true },
        { id: 'problema', type: 'text', label_en: 'Main Problem', label_es: 'Principal problema percibido', required: true },
        { id: 'area', type: 'text', label_en: 'Area to Analyze', label_es: 'Área a analizar', required: true },
        { id: 'contexto', type: 'textarea', label_en: 'Relevant Context', label_es: 'Contexto relevante (competencia, temporada)', required: false }
      ],
      prompt_template: `Eres un Consultor Senior de Negocios para el sector óptico.
Datos: {{reporte}}
Reto: {{problema}} en el área de {{area}}.

Escribe un reporte de DECISIONES RENTABLES:
1. ANÁLISIS NUMÉRICO: ¿Qué dicen realmente los datos sobre {{problema}}?
2. LAS 3 DECISIONES ACCIONABLES: Qué debe cambiar mañana mismo el dueño en su inventario, personal o precios.
3. JUSTIFICACIÓN: Por qué estas decisiones aumentarán el margen.

Tono: Crudo, honesto y orientado a billetes.`
    },
    {
      slug: 'pulse-optica',
      name_en: 'OpticPulse',
      name_es: 'PulseÓptica',
      description_en: 'Know how your optic is doing today without calling anyone.',
      description_es: 'Sabe cómo va tu óptica hoy sin llamar a nadie.',
      icon: 'Activity',
      form_schema: [
        { id: 'reporte_dia', type: 'textarea', label_en: 'Daily Report', label_es: 'Reporte del día (texto libre del encargado)', required: true },
        { id: 'meta', type: 'text', label_en: 'Expected Goal', label_es: 'Meta esperada del día', required: true },
        { id: 'incidencias', type: 'textarea', label_en: 'Incidents', label_es: 'Incidencias o quejas de clientes', required: false },
        { id: 'ventas', type: 'text', label_en: 'Total Sales', label_es: 'Ventas totales realizadas', required: true },
        { id: 'comentarios', type: 'textarea', label_en: 'Staff Comments', label_es: 'Comentarios del encargado', required: false }
      ],
      prompt_template: `Actúa como el Socio Supervisor silencioso de la óptica. El dueño no está presente y quiere el resumen real.

Datos del día:
Ventas: {{ventas}} vs Meta: {{meta}}
Incidencias: {{incidencias}}
Reporte equipo: {{reporte_dia}}

Genera el SEMÁFORO OPERATIVO:
- ESTADO: 🟢 (Meta cumplida, sin reclamos), 🟡 (Bajo meta o retrasos leves), o 🔴 (Pérdidas, quejas graves).
- LOGROS: Qué salió bien hoy.
- ACCIONES URGENTES: Lo que el dueño debe preguntar a su equipo en la llamada de la mañana.

Cierra con: "¿Cómo podemos duplicar las ventas de mañana?".`
    },
    {
      slug: 'vision-loop',
      name_en: 'VisionLoop Premium',
      name_es: 'VisionLoop',
      description_en: 'From the quote to the perfect delivery. The complete optical management system.',
      description_es: 'Desde la cotización hasta la entrega perfecta. El sistema completo de gestión óptica.',
      icon: 'RefreshCw',
      form_schema: [
        { id: 'nombre_negocio', type: 'text', label_en: 'Practice Name', label_es: 'Nombre del negocio', required: true },
        { id: 'fase', type: 'select', label_en: 'Growth Focus', label_es: 'Enfoque de crecimiento', required: true,
          options: [
            { value: 'seguimiento', label_en: 'Quote Recovery (Sales)', label_es: 'Recuperación de Cotizaciones' },
            { value: 'operacion', label_en: 'Ops Excellence (Retention)', label_es: 'Excelencia Operativa' },
            { value: 'fidelizacion', label_en: 'Referrals & Family Plans', label_es: 'Fidelización y Planes Familiares' }
          ]
        }
      ],
      prompt_template: `Eres el estratega de "VisionLoop", el sistema definitivo para ópticas de alto rendimiento.

Óptica: {{nombre_negocio}}
Enfoque: {{fase}}

Desarrolla el plan maestro VisionLoop:
- ESTRATEGIA DE FLUJO: Cómo unir ReactivaÓptica + OperaÓptica + PulseÓptica en una sola rutina diaria.
- EL SECRETO DE VENTA: Una técnica avanzada para que cada examen de vista se convierta en una venta de kit premium.
- MÉTRICA ESTRELLA: Cuál es el número único que {{nombre_negocio}} debe cuidar para escalar.

"Desde la cotización hasta la entrega perfecta".`
    }
  ]

  // Fetch plans
  const { data: plans, error: planError } = await supabase.from('plans').select('id, slug')
  if (planError) { console.error('Error fetching plans:', planError); return }

  const proPlan = plans.find(p => p.slug === 'professional' || p.slug === 'pro')
  const businessPlan = plans.find(p => p.slug === 'business' || p.slug === 'enterprise')

  for (const app of apps) {
    const appId = crypto.randomUUID()
    console.log(`Inserting/Updating app: ${app.slug}...`)

    const { error: appError } = await supabase.from('micro_apps').upsert({
      slug: app.slug, name_en: app.name_en, name_es: app.name_es,
      description_en: app.description_en, description_es: app.description_es,
      icon: app.icon, form_schema: app.form_schema, prompt_template: app.prompt_template
    }, { onConflict: 'slug' })

    if (appError) { console.error(`Error in ${app.slug}:`, appError.message); continue }

    // Get the ID (whether created or updated)
    const { data: currentApp } = await supabase.from('micro_apps').select('id').eq('slug', app.slug).single()

    let targetPlan = proPlan
    if (app.slug === 'vision-loop' || app.slug === 'decide-optica') targetPlan = businessPlan || proPlan

    if (targetPlan && currentApp) {
      const { data: existingLink } = await supabase.from('plan_apps').select('*')
        .eq('plan_id', targetPlan.id).eq('app_id', currentApp.id).single()
      if (!existingLink) {
        await supabase.from('plan_apps').insert({ plan_id: targetPlan.id, app_id: currentApp.id })
      }
    }
  }

  console.log('\n✅ Vertical de Ópticas REFINADA y lista para vender.')
}

run()

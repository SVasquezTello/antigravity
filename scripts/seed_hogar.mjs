import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('🔧 Seeding Micro-Apps para Servicios del Hogar (Electricistas, Plomeros, Gasfiteros)...')

  const apps = [
    {
      slug: 'reactiva-servicio-hogar',
      name_en: 'ReactivaServicio',
      name_es: 'ReactivaServicio',
      description_en: 'Your past clients are your warmest new leads. Remind them you exist.',
      description_es: 'Reactiva clientes anteriores: mantenimientos pendientes, revisiones anuales y urgencias nuevas.',
      icon: 'Home',
      form_schema: [
        { id: 'cliente', type: 'text', label_en: 'Client Name', label_es: 'Nombre del cliente', required: true },
        { id: 'servicio_previo', type: 'text', label_en: 'Previous Service Done', label_es: 'Servicio que se realizó anteriormente', required: true, placeholder_es: 'Instalación eléctrica, reparación de fuga, cambio de calentador...' },
        { id: 'especialidad', type: 'select', label_en: 'Your Specialty', label_es: 'Tu especialidad', required: true,
          options: [
            { value: 'electricista', label_en: 'Electrician', label_es: 'Electricista' },
            { value: 'plomero', label_en: 'Plumber', label_es: 'Plomero / Fontanero' },
            { value: 'gasfitero', label_en: 'Gas Technician', label_es: 'Gasfitero / Gas LP y Natural' },
            { value: 'albanil', label_en: 'Mason / General Construction', label_es: 'Albañil / Construcción general' },
            { value: 'pintor', label_en: 'Painter', label_es: 'Pintor' },
            { value: 'multi', label_en: 'Multi-service / Handyman', label_es: 'Multiservicios / Handyman' }
          ]
        },
        { id: 'meses_sin_contacto', type: 'text', label_en: 'Months Without Contact', label_es: 'Meses sin contacto con el cliente', required: true },
        { id: 'motivo_reactivacion', type: 'select', label_en: 'Reason to Contact', label_es: 'Motivo de reactivación', required: true,
          options: [
            { value: 'mantenimiento', label_en: 'Annual Maintenance Reminder', label_es: 'Recordatorio de mantenimiento anual' },
            { value: 'revision', label_en: 'Safety Inspection Due', label_es: 'Revisión de seguridad pendiente (gas, eléctrica)' },
            { value: 'temporada', label_en: 'Seasonal Service (A/C, heating)', label_es: 'Servicio de temporada (A/C, calefacción)' },
            { value: 'nuevo_servicio', label_en: 'New Service Offered', label_es: 'Nuevo servicio disponible' },
            { value: 'cotizacion_fria', label_en: 'Cold Quote Follow-up', label_es: 'Cotización fría sin respuesta' }
          ]
        }
      ],
      prompt_template: `Actúa como el mejor técnico-empresario de servicios del hogar de la ciudad: experto en su oficio Y en conseguir clientes sin gastar en publicidad.

Especialidad: {{especialidad}}
Cliente: {{cliente}}
Servicio previo: {{servicio_previo}}
Sin contacto hace: {{meses_sin_contacto}} meses
Motivo de reactivación: {{motivo_reactivacion}}

Genera DOS mensajes de reactivación listos para enviar HOY por WhatsApp:

1. "Versión Cuidado Preventivo" (genera urgencia legítima basada en el tiempo):
Recuérdale a {{cliente}} que después de {{meses_sin_contacto}} meses, su {{servicio_previo}} está próximo a necesitar revisión. Incluye un dato técnico real sobre por qué el mantenimiento de {{especialidad}} es crítico en este período (ej. "las instalaciones eléctricas sin revisión bianual representan el 30% de los incendios domésticos", "los calentadores de gas sin mantenimiento anual pierden hasta 20% de eficiencia"). Cierra con CTA directo para agendar.

2. "Versión Oferta de Cliente Frecuente" (reconocimiento + beneficio):
Trata a {{cliente}} como el cliente especial que es. Ofrece algo concreto por ser cliente recurrente: 10% de descuento en su próximo servicio, revisión gratuita de 15 min incluida, o prioridad en agenda. Haz que se sienta recordado, no bombardeado.

Ambos mensajes máximo 5 líneas. Tono: profesional y cercano, como un técnico de confianza.`
    },
    {
      slug: 'upsell-hogar-ai',
      name_en: 'UpsellHogar AI',
      name_es: 'UpsellHogar AI',
      description_en: 'They called you for one fix. Leave with an annual maintenance contract.',
      description_es: 'Convierte cada visita en un contrato de mantenimiento o servicio adicional de mayor valor.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'cliente', type: 'text', label_en: 'Client Name', label_es: 'Nombre del cliente', required: true },
        { id: 'servicio_contratado', type: 'text', label_en: 'Service Being Done', label_es: 'Servicio que estás realizando hoy', required: true },
        { id: 'especialidad', type: 'select', label_en: 'Your Specialty', label_es: 'Tu especialidad', required: true,
          options: [
            { value: 'electricista', label_en: 'Electrician', label_es: 'Electricista' },
            { value: 'plomero', label_en: 'Plumber', label_es: 'Plomero / Fontanero' },
            { value: 'gasfitero', label_en: 'Gas Technician', label_es: 'Gasfitero / Gas LP y Natural' },
            { value: 'albanil', label_en: 'Mason / General Construction', label_es: 'Albañil / Construcción general' },
            { value: 'pintor', label_en: 'Painter', label_es: 'Pintor' },
            { value: 'multi', label_en: 'Multi-service / Handyman', label_es: 'Multiservicios / Handyman' }
          ]
        },
        { id: 'tipo_inmueble', type: 'select', label_en: 'Property Type', label_es: 'Tipo de inmueble', required: true,
          options: [
            { value: 'casa_habitacion', label_en: 'House / Apartment', label_es: 'Casa habitación / Departamento' },
            { value: 'oficina', label_en: 'Office / Commercial Space', label_es: 'Oficina / Local comercial' },
            { value: 'edificio', label_en: 'Building / Complex', label_es: 'Edificio / Conjunto' },
            { value: 'industria', label_en: 'Industrial / Warehouse', label_es: 'Industrial / Bodega' }
          ]
        },
        { id: 'servicios_ofrezco', type: 'textarea', label_en: 'Additional Services You Offer', label_es: 'Servicios adicionales que puedes ofrecer al cliente', required: true, placeholder_es: 'Contrato de mantenimiento anual, revisión de tablero, detección de fugas, pintura, impermeabilización...' }
      ],
      prompt_template: `Eres el Estratega de Ventas más efectivo para técnicos de servicios del hogar. Sabes que el cliente ya confía en ti porque pagó por tu trabajo HOY. Eso vale más que cualquier anuncio.

Especialidad: {{especialidad}}
Cliente: {{cliente}}
Servicio de hoy: {{servicio_contratado}}
Tipo de inmueble: {{tipo_inmueble}}
Servicios adicionales disponibles: {{servicios_ofrezco}}

Identifica los 3 upsells más rentables y naturales para este momento. Para cada uno:

1. QUÉ OFRECER: El servicio adicional de {{servicios_ofrezco}} más relevante para alguien con {{tipo_inmueble}} que acaba de tener el problema de {{servicio_contratado}}. Justifica la relación técnica entre ambos.

2. EL ARGUMENTO DE PREVENCIÓN: Por qué NO contratar este servicio ahora (mientras el técnico ya está en casa) le costará al cliente 2-3 veces más en el futuro. Usa cifras concretas y realistas.

3. EL GUION EN OBRA: Las frases exactas que el técnico dice de forma natural mientras termina el trabajo de hoy para introducir el servicio adicional. Que suene a consejo profesional, no a venta forzada.

Cierra con el "Paquete de Mantenimiento Anual": cómo presentar un contrato de servicio recurrente (visitas mensuales/trimestrales) con precio fijo y los beneficios que hacen que {{cliente}} lo firme hoy mismo.`
    },
    {
      slug: 'cotiza-rapido-ai',
      name_en: 'CotizaRápido AI',
      name_es: 'CotizaRápido AI',
      description_en: 'Generate a professional quote in 2 minutes instead of 2 hours.',
      description_es: 'Genera cotizaciones profesionales que justifican tu precio y cierran más trabajos.',
      icon: 'FileText',
      form_schema: [
        { id: 'tipo_trabajo', type: 'text', label_en: 'Job Description', label_es: 'Descripción del trabajo a cotizar', required: true, placeholder_es: 'Cambio de tablero eléctrico, reparación de fuga en cocina, instalación de calentador...' },
        { id: 'especialidad', type: 'select', label_en: 'Your Specialty', label_es: 'Tu especialidad', required: true,
          options: [
            { value: 'electricista', label_en: 'Electrician', label_es: 'Electricista' },
            { value: 'plomero', label_en: 'Plumber', label_es: 'Plomero / Fontanero' },
            { value: 'gasfitero', label_en: 'Gas Technician', label_es: 'Gasfitero / Gas LP y Natural' },
            { value: 'albanil', label_en: 'Mason / General Construction', label_es: 'Albañil / Construcción general' },
            { value: 'pintor', label_en: 'Painter', label_es: 'Pintor' },
            { value: 'multi', label_en: 'Multi-service / Handyman', label_es: 'Multiservicios / Handyman' }
          ]
        },
        { id: 'materiales', type: 'textarea', label_en: 'Materials / Equipment Needed', label_es: 'Materiales o equipos requeridos (si se conocen)', required: false, placeholder_es: 'Tablero CUTLER 20 circuitos, cable calibre 12, cinta, interruptores...' },
        { id: 'tiempo_estimado', type: 'text', label_en: 'Estimated Working Time', label_es: 'Tiempo estimado de trabajo (horas/días)', required: true },
        { id: 'precio_objetivo', type: 'text', label_en: 'Target Price Range', label_es: 'Rango de precio que quieres cobrar (aproximado)', required: true, placeholder_es: 'Entre $1,500 y $2,000 MXN, o $200-$300 USD...' },
        { id: 'competencia', type: 'select', label_en: 'Competitive Position', label_es: '¿Cómo es tu precio vs. la competencia?', required: true,
          options: [
            { value: 'economico', label_en: 'Lower than market', label_es: 'Más económico que el mercado' },
            { value: 'mercado', label_en: 'At market rate', label_es: 'Al precio del mercado' },
            { value: 'premium', label_en: 'Premium / Higher than average', label_es: 'Premium / Más caro que el promedio' }
          ]
        }
      ],
      prompt_template: `Actúa como un técnico-empresario profesional que cobra lo que vale y cierra el 80% de sus cotizaciones porque sabe presentar su precio con confianza.

Especialidad: {{especialidad}}
Trabajo: {{tipo_trabajo}}
Materiales: {{materiales}}
Tiempo: {{tiempo_estimado}}
Precio objetivo: {{precio_objetivo}}
Posición de precio: {{competencia}}

Genera el "Kit de Cotización Profesional" completo:

1. COTIZACIÓN ESTRUCTURADA (lista para enviarse por WhatsApp o imprimir):
Formato profesional con: descripción del trabajo, desglose de materiales y mano de obra, tiempo estimado, precio total, vigencia de la cotización (48h) y garantía incluida. Usa el rango de {{precio_objetivo}} como referencia y presenta el precio con seguridad.

2. MENSAJE DE PRESENTACIÓN (para acompañar la cotización):
El texto que el técnico envía con la cotización. Que comunique valor, experiencia y confianza. Si el precio es {{competencia}}, incluye el argumento específico de por qué vale ese precio (años de experiencia, materiales de calidad, garantía, rapidez).

3. RESPUESTA A LA OBJECIÓN "ESTÁ MUY CARO":
El guion exacto para cuando el cliente diga que encontró otro técnico más barato. Sin bajar el precio, sin perder el trabajo. Apela a riesgos de contratar mano de obra barata en {{especialidad}} (accidentes, trabajos mal hechos, sin garantía) de forma diplomática pero contundente.`
    },
    {
      slug: 'decide-contratista',
      name_en: 'DecideContratista',
      name_es: 'DecideContratista',
      description_en: 'Your service business data should drive what jobs to take and what to drop.',
      description_es: 'Analiza tu negocio de servicios y toma decisiones que aumentan tu margen y reducen el caos.',
      icon: 'BarChart2',
      form_schema: [
        { id: 'datos_negocio', type: 'textarea', label_en: 'Business Data (jobs, revenue, costs)', label_es: 'Datos del negocio (trabajos del mes, ingresos, costos de materiales, horas trabajadas)', required: true },
        { id: 'problema', type: 'text', label_en: 'Main Business Problem', label_es: 'Principal problema o dolor del negocio ahora mismo', required: true },
        { id: 'area', type: 'select', label_en: 'Focus Area', label_es: 'Área a analizar', required: true,
          options: [
            { value: 'rentabilidad', label_en: 'Job Profitability', label_es: 'Rentabilidad por tipo de trabajo' },
            { value: 'cobranza', label_en: 'Collections & Unpaid Jobs', label_es: 'Cobranza y clientes que no pagan' },
            { value: 'tiempo', label_en: 'Time & Capacity Management', label_es: 'Gestión del tiempo y capacidad' },
            { value: 'crecimiento', label_en: 'Growth & Hiring Helpers', label_es: 'Crecimiento y contratación de ayudantes' },
            { value: 'precios', label_en: 'Pricing Strategy', label_es: 'Estrategia de precios y tarifas' }
          ]
        },
        { id: 'especialidad', type: 'text', label_en: 'Your Specialty', label_es: 'Tu especialidad / tipo de servicios que ofreces', required: true },
        { id: 'contexto', type: 'textarea', label_en: 'Context (zone, seasonality)', label_es: 'Contexto relevante (zona, temporada, competencia local)', required: true }
      ],
      prompt_template: `Eres el Consultor de Negocios de referencia para técnicos independientes y empresas de servicios del hogar.
El mayor error de un técnico brillante: trabaja 12 horas al día y gana como si trabajara 6.

Especialidad: {{especialidad}}
Datos del negocio: {{datos_negocio}}
Problema principal: {{problema}}
Área de análisis: {{area}}
Contexto: {{contexto}}

Entrega 3 Decisiones de Negocio Ejecutables esta semana. Para cada una:
1. LA DECISIÓN: Acción específica y medible (ej. "Eliminar los trabajos de tipo X porque tu margen es negativo", "Subir tu tarifa de mano de obra un 15% empezando el lunes con este argumento", "Cobrar anticipo del 50% a partir de ahora con este mensaje").
2. FUNDAMENTO EN NÚMEROS: Cómo los datos de {{datos_negocio}} justifican esta decisión para el área de {{area}}.
3. EJECUCIÓN MAÑANA: El primer paso concreto que el técnico ejecuta mañana para activar esta decisión.

Finaliza con el "Diagnóstico del Negocio":
🟢 Negocio Saludable y Escalable | 🟡 Trabajo mucho, gano poco | 🔴 Autoempleado disfrazado de empresario
Justificado en dos líneas con los datos proporcionados y el {{problema}} detectado.`
    },
    {
      slug: 'pulse-contratista',
      name_en: 'PulseContratista',
      name_es: 'PulseContratista',
      description_en: 'Know in 60 seconds if today\'s jobs were worth your time.',
      description_es: 'El cierre diario del técnico: trabajos, cobros, cotizaciones pendientes y agenda de mañana.',
      icon: 'Activity',
      form_schema: [
        { id: 'trabajos_dia', type: 'textarea', label_en: "Today's Jobs", label_es: 'Trabajos realizados hoy (tipo y cliente)', required: true, placeholder_es: 'Reparación fuga cocina – Casa Martínez, Revisión tablero – Oficina García...' },
        { id: 'cobrado_dia', type: 'text', label_en: 'Amount Collected Today', label_es: 'Total cobrado hoy ($)', required: true },
        { id: 'pendiente_cobrar', type: 'text', label_en: 'Pending Collections', label_es: 'Trabajos terminados y sin cobrar ($)', required: true },
        { id: 'cotizaciones_enviadas', type: 'text', label_en: 'Quotes Sent (Pending Response)', label_es: 'Cotizaciones enviadas sin respuesta', required: true },
        { id: 'trabajos_manana', type: 'textarea', label_en: "Tomorrow's Scheduled Jobs", label_es: 'Trabajos confirmados para mañana', required: false, placeholder_es: 'Instalación A/C casa López 9am, Revisión gas edificio Robles 11am...' },
        { id: 'gastos_dia', type: 'text', label_en: "Today's Expenses (materials, gas, etc.)", label_es: 'Gastos del día (materiales, gasolina, ayudante)', required: false }
      ],
      prompt_template: `Actúa como el Sistema de Control Financiero y Operativo de un técnico de servicios del hogar exitoso.
El técnico necesita saber en 60 segundos si el día fue rentable y qué hacer mañana para ganar más.

- Trabajos del día: {{trabajos_dia}}
- Cobrado hoy: \${{cobrado_dia}}
- Pendiente por cobrar: \${{pendiente_cobrar}}
- Cotizaciones sin respuesta: {{cotizaciones_enviadas}}
- Agenda mañana: {{trabajos_manana}}
- Gastos del día: \${{gastos_dia}}

Genera el "PulseContratista del Día":

1. SEMÁFORO DE RENTABILIDAD:
🟢 Día Rentable | 🟡 Cubrí gastos pero poco margen | 🔴 Trabajé de gracias
Basado en: ingresos \${{cobrado_dia}} menos gastos \${{gastos_dia}} = margen real del día.

2. ALERTA DE COBRANZA: Con \${{pendiente_cobrar}} sin cobrar, indica cuántos días puede sostenerse el negocio sin ese dinero. Genera el mensaje exacto que el técnico debe enviar HOY para recuperar el cobro más antiguo, de forma firme pero sin perder al cliente.

3. SEGUIMIENTO DE COTIZACIONES: Para las {{cotizaciones_enviadas}} cotizaciones sin respuesta, proporciona el mensaje de seguimiento de 48h que tiene mayor probabilidad de reabrirlas. Urgente pero no desesperado.

4. PLAN DE MAÑANA: Basado en {{trabajos_manana}}, estima el ingreso potencial del día siguiente y si hay ventana para agendar un trabajo adicional. Sugiere a qué hora salir para optimizar traslados y tiempo productivo.`
    },
    {
      slug: 'hogar-loop',
      name_en: 'HogarLoop Premium',
      name_es: 'HogarLoop Premium',
      description_en: 'From first service call to annual maintenance contract. Full contractor growth cycle.',
      description_es: 'Reactivación + Contratos recurrentes + Control financiero. El sistema completo del técnico-empresario.',
      icon: 'RefreshCw',
      form_schema: [
        { id: 'negocio', type: 'text', label_en: 'Business / Brand Name', label_es: 'Nombre del negocio o marca personal', required: true },
        { id: 'especialidad', type: 'text', label_en: 'Specialty / Services Offered', label_es: 'Especialidad y servicios que ofreces', required: true, placeholder_es: 'Electricista residencial y comercial, plomero general, multiservicios...' },
        { id: 'num_tecnicos', type: 'text', label_en: 'Number of Technicians / Staff', label_es: 'Número de técnicos o ayudantes en el equipo', required: true },
        { id: 'dolor_clientes', type: 'textarea', label_en: 'Client Acquisition / Retention Problem', label_es: 'Problema principal: conseguir o retener clientes', required: true },
        { id: 'dolor_financiero', type: 'textarea', label_en: 'Financial / Operational Problem', label_es: 'Problema financiero u operativo más urgente (cobros, precios, agenda caótica)', required: true },
        { id: 'fase', type: 'select', label_en: 'Priority Phase Today', label_es: 'Módulo donde necesitas más impacto hoy', required: true,
          options: [
            { value: 'clientes', label_en: 'Client Reactivation & Recurring Contracts', label_es: 'Reactivación de clientes y contratos recurrentes' },
            { value: 'ventas', label_en: 'Quoting & Closing More Jobs', label_es: 'Cotizar mejor y cerrar más trabajos' },
            { value: 'finanzas', label_en: 'Financial Control & Growth', label_es: 'Control financiero y crecimiento del negocio' }
          ]
        }
      ],
      prompt_template: `Eres el Consultor Estratégico más efectivo para técnicos de servicios del hogar que quieren dejar de ser autoempleados y convertirse en empresarios, implementando el sistema "HogarLoop": el ciclo de crecimiento sin caos para electricistas, plomeros y gasfiteros con ambición.

Negocio: {{negocio}}
Especialidad: {{especialidad}}
Equipo: {{num_tecnicos}} técnicos
Problema de clientes: {{dolor_clientes}}
Problema financiero/operativo: {{dolor_financiero}}
Fase prioritaria: {{fase}}

Activa el módulo HogarLoop correspondiente:

Si {{fase}} = CLIENTES:
→ Diseña la "Máquina de Clientes Recurrentes" para {{negocio}}. Incluye: (1) la campaña de reactivación de los últimos 20 clientes con 2 mensajes de WhatsApp listos para usar, (2) el modelo de "Contrato de Mantenimiento Anual" para {{especialidad}} con lo que incluye, el precio sugerido y el argumento de venta de 3 oraciones, (3) la estrategia de referidos: cómo {{negocio}} consigue que cada cliente satisfecho traiga 2 más con un incentivo sencillo y sin costo.

Si {{fase}} = VENTAS:
→ Construye el "Sistema de Cotización Ganadora" de {{negocio}}: la estructura de cotización que justifica precios premium para {{especialidad}} sin que el cliente compare con técnicos baratos, el protocolo de seguimiento en 3 pasos antes de dar el trabajo por perdido, y las 5 objeciones más comunes al precio con el guion exacto para responder cada una sin bajar tarifas.

Si {{fase}} = FINANZAS:
→ Diseña el "Tablero Financiero del Técnico-Empresario": la fórmula para calcular tu tarifa mínima rentable por hora trabajada en {{especialidad}} (considerando materiales, traslados, herramientas, impuestos), el sistema de anticipos del 50% que elimina el riesgo de no pago, y las 3 palancas para doblar ingresos en 90 días sin trabajar más horas: subir precios, cobrar más rápido, o agregar un servicio de mantenimiento recurrente.

Cierra con "El Próximo Movimiento de {{negocio}}": la única acción de mayor ROI que el técnico ejecuta mañana antes de salir al primer trabajo del día.`
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
    console.log(`Inserting app: ${app.slug}...`)

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
        console.log(`App ${app.slug} already exists, updating...`)
        const { data: existingApp } = await supabase
          .from('micro_apps')
          .select('id')
          .eq('slug', app.slug)
          .single()

        if (existingApp) {
          app.id = existingApp.id
          await supabase.from('micro_apps').update({
            name_en: app.name_en,
            name_es: app.name_es,
            description_en: app.description_en,
            description_es: app.description_es,
            icon: app.icon,
            form_schema: app.form_schema,
            prompt_template: app.prompt_template
          }).eq('id', app.id)
          console.log(`Updated ${app.slug}`)
        }
      } else {
        console.error(`Error inserting ${app.slug}:`, appError.message)
        continue
      }
    } else {
      app.id = appId
    }

    // Business plan for premium/analytics apps, Pro for the rest
    let targetPlan = proPlan
    if (app.slug === 'hogar-loop' || app.slug === 'decide-contratista') {
      targetPlan = businessPlan || proPlan
    }

    if (targetPlan && app.id) {
      const { data: existingLink } = await supabase
        .from('plan_apps')
        .select('*')
        .eq('plan_id', targetPlan.id)
        .eq('app_id', app.id)
        .single()

      if (!existingLink) {
        await supabase.from('plan_apps').insert({
          plan_id: targetPlan.id,
          app_id: app.id
        })
        console.log(`Linked ${app.slug} → plan ${targetPlan.slug}`)
      } else {
        console.log(`${app.slug} already linked to plan ${targetPlan.slug}`)
      }
    }
  }

  console.log('\n✅ Micro-Apps de Servicios del Hogar completadas.')
  console.log('Apps insertadas:')
  apps.forEach(a => console.log(` - ${a.slug} (${a.name_es})`))
}

run()

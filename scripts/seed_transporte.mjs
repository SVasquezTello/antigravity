import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('🚛 Seeding Micro-Apps para Empresas de Transporte y Logística...')

  const apps = [
    {
      slug: 'reactiva-carga',
      name_en: 'ReactivaCarga',
      name_es: 'ReactivaCarga',
      description_en: 'That cold freight quote is still money on the table. Go get it.',
      description_es: 'Rescata cotizaciones de flete frías o clientes que dejaron de enviarte carga.',
      icon: 'Truck',
      category: 'transporte',
      form_schema: [
        { id: 'cliente', type: 'text', label_en: 'Client / Company Name', label_es: 'Nombre del cliente / empresa', required: true },
        { id: 'tipo_servicio', type: 'select', label_en: 'Service Type', label_es: 'Tipo de servicio cotizado', required: true,
          options: [
            { value: 'carga_terrestre', label_en: 'Land Freight', label_es: 'Carga Terrestre' },
            { value: 'paqueteria', label_en: 'Parcel / Last Mile', label_es: 'Paquetería / Última Milla' },
            { value: 'mudanza', label_en: 'Moving Service', label_es: 'Mudanza' },
            { value: 'refrigerado', label_en: 'Refrigerated Transport', label_es: 'Transporte Refrigerado' },
            { value: 'carga_especial', label_en: 'Special/Oversize Load', label_es: 'Carga Especial / Sobredimensionada' }
          ]
        },
        { id: 'dias_frio', type: 'text', label_en: 'Days Without Response', label_es: 'Días sin respuesta del cliente', required: true },
        { id: 'objecion', type: 'select', label_en: 'Assumed Objection', label_es: 'Objeción que pausó la negociación', required: true,
          options: [
            { value: 'precio', label_en: 'Price too high', label_es: 'Precio muy alto' },
            { value: 'ya_tienen_proveedor', label_en: 'Already have a carrier', label_es: 'Ya tienen transportista' },
            { value: 'volumen_bajo', label_en: 'Low volume / not worth it', label_es: 'Volumen bajo / no les conviene' },
            { value: 'desconocida', label_en: 'Unknown', label_es: 'Desconocida' }
          ]
        },
        { id: 'canal', type: 'select', label_en: 'Contact Channel', label_es: 'Canal de contacto preferido', required: true,
          options: [
            { value: 'whatsapp', label_en: 'WhatsApp', label_es: 'WhatsApp' },
            { value: 'email', label_en: 'Email', label_es: 'Email' },
            { value: 'llamada', label_en: 'Phone Call', label_es: 'Llamada Telefónica' }
          ]
        }
      ],
      prompt_template: `Actúa como Director Comercial de una Empresa de Transporte líder del mercado.
Tienes una cotización de flete que se enfrió o un cliente que dejó de enviarte carga.
Tu misión es recuperar ese contrato o reactivar ese flujo de negocio.

- Cliente / Empresa: {{cliente}}
- Servicio cotizado: {{tipo_servicio}}
- Días sin respuesta: {{dias_frio}}
- Objeción asumida: {{objecion}}
- Canal: {{canal}}

Genera DOS mensajes de seguimiento de alto impacto para enviar HOY por {{canal}}:

1. "Versión Consultor de Logística": Abre el diálogo ofreciendo un insight de valor gratuito (ej. cambio en regulación de pesos, nuevo corredor aduanal activo, reducción en tiempos de entrega a esa ruta). Toca sutilmente la objeción {{objecion}} sin mencionarla directamente.

2. "Versión Propuesta Urgente": Ofrece una condición especial concreta (primera ruta con descuento, seguro de carga sin costo extra el primer mes, GPS tracking premium gratuito) con fecha de expiración real para crear urgencia legítima.

Ambos mensajes deben sonar como aliados estratégicos, NO como vendedores desesperados. Adaptados al tono profesional de la industria de {{tipo_servicio}}.`
    },
    {
      slug: 'upsell-flete-ai',
      name_en: 'UpsellFlete AI',
      name_es: 'UpsellFlete AI',
      description_en: 'They hired you for the route. Sell them the full logistics ecosystem.',
      description_es: 'El cliente ya confía en tu flota. Ahora véndele seguro, rastreo y servicios premium.',
      icon: 'TrendingUp',
      category: 'transporte',
      form_schema: [
        { id: 'cliente', type: 'text', label_en: 'Client Name', label_es: 'Nombre del cliente', required: true },
        { id: 'servicio_actual', type: 'text', label_en: 'Current Contracted Service', label_es: 'Servicio actualmente contratado', required: true },
        { id: 'frecuencia', type: 'select', label_en: 'Shipment Frequency', label_es: 'Frecuencia de envíos', required: true,
          options: [
            { value: 'diario', label_en: 'Daily', label_es: 'Diario' },
            { value: 'semanal', label_en: 'Weekly', label_es: 'Semanal' },
            { value: 'quincenal', label_en: 'Bi-weekly', label_es: 'Quincenal' },
            { value: 'mensual', label_en: 'Monthly', label_es: 'Mensual' },
            { value: 'esporadico', label_en: 'Sporadic', label_es: 'Esporádico' }
          ]
        },
        { id: 'tipo_carga', type: 'text', label_en: 'Type of Cargo', label_es: 'Tipo de mercancía que transporta', required: true },
        { id: 'servicios_disponibles', type: 'textarea', label_en: 'Available Premium Services', label_es: 'Servicios premium que puedo ofrecer', required: true, placeholder_es: 'Seguro de carga, rastreo GPS en tiempo real, almacenaje, cross-docking, empaque...' }
      ],
      prompt_template: `Eres un Estratega de Monetización para Empresas de Transporte y Logística.
El cliente ya confía en tu servicio, ese es tu mayor activo. Es momento de maximizar el valor por cliente (LTV).

- Cliente: {{cliente}}
- Servicio actual: {{servicio_actual}}
- Frecuencia: {{frecuencia}}
- Tipo de carga: {{tipo_carga}}
- Servicios Premium disponibles: {{servicios_disponibles}}

Selecciona los 3 servicios adicionales (upsell/cross-sell) con mayor probabilidad de cierre para ESTE cliente específico.

Para cada uno entrega:
1. Qué servicio ofrecer y por qué es ideal para alguien que envía {{tipo_carga}} con frecuencia {{frecuencia}}.
2. Argumento de "Costo del NO": Cuánto dinero/riesgo real pierde el cliente cada mes al NO tener este servicio (usa cifras hipotéticas pero realistas).
3. El mensaje exacto (WhatsApp o Email) para presentárselo como una "recomendación de tu asesor de logística", no como una venta.

Cierra con una estrategia de bundling: cómo empaquetar los 3 servicios en un "Plan Logístico Total" más atractivo que venderlos por separado.`
    },
    {
      slug: 'despacho-ruta-ai',
      name_en: 'DespachoRuta AI',
      name_es: 'DespachoRuta AI',
      description_en: 'Every idle truck minute is money bleeding. Stop it now.',
      description_es: 'Genera el plan de ruta y briefing del conductor sin desperdicio de tiempo ni combustible.',
      icon: 'MapPin',
      category: 'transporte',
      form_schema: [
        { id: 'conductor', type: 'text', label_en: "Driver's Name", label_es: 'Nombre del conductor', required: true },
        { id: 'unidad', type: 'text', label_en: 'Vehicle / Unit', label_es: 'Unidad / tipo de vehículo', required: true },
        { id: 'origen', type: 'text', label_en: 'Origin Point', label_es: 'Punto de origen', required: true },
        { id: 'paradas', type: 'textarea', label_en: 'Stops & Deliveries', label_es: 'Paradas / entregas del día (dirección y hora)', required: true },
        { id: 'tipo_carga', type: 'text', label_en: 'Cargo Details', label_es: 'Descripción de la carga', required: true },
        { id: 'condiciones', type: 'textarea', label_en: 'Special Conditions', label_es: 'Condiciones especiales (clima, obras, horarios restringidos)', required: false, placeholder_es: 'Lluvia, cierre de carretera, horarios de descarga...' }
      ],
      prompt_template: `Actúa como Jefe de Despacho y Planificador Logístico de élite.
Cada kilómetro sin optimizar y cada hora de retraso es pérdida directa de dinero para la empresa.

- Conductor: {{conductor}}
- Unidad: {{unidad}}
- Salida desde: {{origen}}
- Paradas del día: {{paradas}}
- Carga: {{tipo_carga}}
- Condiciones: {{condiciones}}

Genera el "Briefing Maestro de Ruta" para hoy:

1. ORDEN ÓPTIMO DE PARADAS: Reorganiza las paradas de {{paradas}} en el orden más eficiente de tiempo y combustible, justificando brevemente por qué ese orden.

2. ALERTAS CRÍTICAS DE RUTA: Basado en {{condiciones}}, identifica los 2-3 riesgos de retraso más probables y el protocolo exacto para que {{conductor}} los maneje en campo sin necesidad de llamarte.

3. PROTOCOLO DE ENTREGA: El procedimiento de confirmación que {{conductor}} debe seguir en cada parada (evidencia foto, firma digital, hora de salida) para proteger a la empresa de reclamaciones.

4. MENSAJE DE BRIEFING: El texto completo y profesional que le debes enviar por WhatsApp a {{conductor}} a primera hora para que tenga todo claro, sin preguntas adicionales.`
    },
    {
      slug: 'decide-flota',
      name_en: 'DecideFlota',
      name_es: 'DecideFlota',
      description_en: 'Your fleet data should drive decisions, not just fill spreadsheets.',
      description_es: 'Analiza tus costos de flota y genera decisiones financieras que salvan tu margen.',
      icon: 'BarChart2',
      category: 'transporte',
      form_schema: [
        { id: 'datos_operativos', type: 'textarea', label_en: 'Operational Data (costs, KM, fuel)', label_es: 'Datos operativos (costos, km recorridos, combustible, mantenimiento)', required: true },
        { id: 'problema_principal', type: 'text', label_en: 'Main Financial Pain', label_es: 'Principal problema o sangrado financiero actual', required: true },
        { id: 'area_analisis', type: 'select', label_en: 'Focus Area', label_es: 'Área a analizar', required: true,
          options: [
            { value: 'combustible', label_en: 'Fuel Efficiency', label_es: 'Eficiencia de Combustible' },
            { value: 'mantenimiento', label_en: 'Maintenance Costs', label_es: 'Costos de Mantenimiento' },
            { value: 'rentabilidad_ruta', label_en: 'Route Profitability', label_es: 'Rentabilidad por Ruta' },
            { value: 'conductores', label_en: 'Driver Performance', label_es: 'Desempeño de Conductores' },
            { value: 'clientes', label_en: 'Client Profitability', label_es: 'Rentabilidad por Cliente' }
          ]
        },
        { id: 'contexto', type: 'textarea', label_en: 'Market Context', label_es: 'Contexto del mercado (precio diésel, competencia, temporada)', required: true }
      ],
      prompt_template: `Eres un CFO especialista en empresas de transporte y flota vehicular.
Las empresas de transporte quiebran no por falta de clientes, sino por costos de flota fuera de control.

- Datos operativos: {{datos_operativos}}
- Problema principal: {{problema_principal}}
- Foco de análisis: {{area_analisis}}
- Contexto: {{contexto}}

Entrega 3 Decisiones Financieras Ejecutivas de alto impacto. Para cada una:
1. LA DECISIÓN: Acción concreta (ej. renegociar contrato de diésel en volumen, retirar la unidad X del servicio, cambiar conductor en ruta Y).
2. JUSTIFICACIÓN MATEMÁTICA: Basada estrictamente en los datos de {{datos_operativos}}. Sin matemáticas vagas.
3. EL MENSAJE LISTO PARA ENVIAR: El borrador exacto que el dueño debe enviar HOY a su proveedor, cliente o empleado para ejecutar esta decisión.

Finaliza con el "Semáforo Financiero de Flota": clasifica el estado actual de la empresa en 🟢 Rentable / 🟡 En Riesgo / 🔴 Hemorragia y explica en una sola línea por qué.`
    },
    {
      slug: 'pulse-flota',
      name_en: 'PulseFlota',
      name_es: 'PulseFlota',
      description_en: 'Know the real status of every truck without riding along.',
      description_es: 'El semáforo de tu flota completa. Sabe si todo va bien sin llamar a cada conductor.',
      icon: 'Activity',
      category: 'transporte',
      form_schema: [
        { id: 'reporte_dia', type: 'textarea', label_en: "Driver's Daily Report", label_es: 'Reporte del conductor / operador del día', required: true, placeholder_es: 'Km recorridos, entregas completadas, pendientes...' },
        { id: 'incidencias', type: 'textarea', label_en: 'Incidents or Delays', label_es: 'Incidencias, retrasos o problemas reportados', required: true, placeholder_es: 'Accidentes, unidad averiada, cliente cerrado, tráfico...' },
        { id: 'estado_unidad', type: 'select', label_en: 'Vehicle Status', label_es: 'Estado de la unidad al cierre del día', required: true,
          options: [
            { value: 'optima', label_en: 'Optimal - Ready Tomorrow', label_es: 'Óptima – Lista para mañana' },
            { value: 'revision_menor', label_en: 'Minor Checkup Needed', label_es: 'Revisión menor pendiente' },
            { value: 'taller_urgente', label_en: 'Urgent Workshop Needed', label_es: 'Taller urgente – No puede salir mañana' }
          ]
        },
        { id: 'entregas_pendientes', type: 'text', label_en: 'Pending Deliveries', label_es: 'Entregas pendientes o reprogramadas', required: true },
        { id: 'nota_conductor', type: 'textarea', label_en: "Driver's Request / Note", label_es: 'Solicitud o nota del conductor al dueño', required: false }
      ],
      prompt_template: `Eres el Sistema de Control Operativo Inteligente de una Empresa de Transporte.
El dueño no puede ir en cada camión. Dale un reporte que valga más que verlo con sus propios ojos.

- Reporte del conductor: {{reporte_dia}}
- Incidencias: {{incidencias}}
- Estado de la unidad: {{estado_unidad}}
- Entregas pendientes: {{entregas_pendientes}}
- Nota del conductor: {{nota_conductor}}

Genera el "Pulse de Flota" del día:

1. SEMÁFORO EJECUTIVO (una línea):
   🟢 Operación impecable | 🟡 Atención requerida | 🔴 Alerta crítica – acción inmediata
   Fundamentado en {{incidencias}} y {{estado_unidad}}.

2. EFICIENCIA DEL DÍA: Análisis rápido de si el número de entregas completadas justifica el costo operativo del día. ¿Fue rentable esta unidad hoy?

3. ACCIÓN PRIORITARIA PARA MAÑANA: La única cosa más urgente que el dueño debe coordinar esta noche o primera hora mañana para evitar que el problema de hoy impacte la operación de mañana.

4. RESPUESTA AL CONDUCTOR: Un mensaje directo, profesional y motivador para responder a {{nota_conductor}} (o un cierre positivo de jornada si no hay nota). Debe reforzar la cultura de reportes puntuales.`
    },
    {
      slug: 'trans-loop',
      name_en: 'TransLoop Premium',
      name_es: 'TransLoop Premium',
      description_en: 'From the first freight quote to the last-mile delivery. Full cycle, zero leaks.',
      description_es: 'Ventas + Operación + Control de Flota. El sistema completo de tu empresa de transporte.',
      icon: 'RefreshCw',
      category: 'transporte',
      form_schema: [
        { id: 'empresa', type: 'text', label_en: 'Transport Company Name', label_es: 'Nombre de la empresa de transporte', required: true },
        { id: 'especialidad', type: 'text', label_en: 'Market Niche / Specialty', label_es: 'Nicho de mercado / especialidad', required: true, placeholder_es: 'Carga seca, última milla, mudanzas corporativas, temperatura controlada...' },
        { id: 'tamano_flota', type: 'text', label_en: 'Fleet Size', label_es: 'Número de unidades en flota', required: true },
        { id: 'dolor_ventas', type: 'textarea', label_en: 'Sales Pain Point', label_es: 'Problema principal en ventas / captación de clientes', required: true },
        { id: 'dolor_operacion', type: 'textarea', label_en: 'Operational Pain Point', label_es: 'Problema operativo más frecuente (conducto, ruta, carga)', required: true },
        { id: 'fase', type: 'select', label_en: 'Priority Phase Right Now', label_es: 'Fase de prioridad hoy', required: true,
          options: [
            { value: 'ventas', label_en: 'Sales / Client Recovery', label_es: 'Ventas / Recuperación de clientes' },
            { value: 'operacion', label_en: 'Route Operations & Dispatch', label_es: 'Operación / Despacho de rutas' },
            { value: 'control', label_en: 'Fleet Monitoring & Finance', label_es: 'Control de flota / Finanzas' }
          ]
        }
      ],
      prompt_template: `Eres el Consultor Estratégico número uno de empresas de Transporte y Logística, implementando el sistema "TransLoop" – el ciclo de crecimiento sin fugas para flotas.

- Empresa: {{empresa}}
- Especialidad: {{especialidad}}
- Flota: {{tamano_flota}} unidades
- Dolor en Ventas: {{dolor_ventas}}
- Dolor Operativo: {{dolor_operacion}}
- Fase de Prioridad: {{fase}}

Según la fase seleccionada, activa el módulo correspondiente:

Si {{fase}} = VENTAS:
→ Diseña la estrategia de Reactivación de Clientes Inactivos más efectiva para una empresa de {{especialidad}}. Incluye el script de recuperación listo para usar, el argumento diferenciador y una oferta de "puerta de entrada" irresistible.

Si {{fase}} = OPERACIÓN:
→ Construye el "Protocolo Diario Cero Errores" para una flota de {{tamano_flota}} unidades: el briefing de despacho matutino, el sistema de confirmación de entregas en tiempo real y el protocolo de contingencia para incidentes de ruta.

Si {{fase}} = CONTROL:
→ Diseña el "Dashboard Mental del Dueño": los 5 KPIs de flota que debe revisar cada viernes, la fórmula exacta para calcular la rentabilidad real por ruta/conductor, y la política de corte de unidades no rentables sin conflictos laborales.

Siempre cierra con el "Próximo Movimiento": la única acción más valiosa que el dueño de {{empresa}} debe ejecutar en las próximas 24 horas para crecer sin apagar incendios.`
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

    // Business plan for premium app, Pro for the rest
    let targetPlan = proPlan
    if (app.slug === 'trans-loop' || app.slug === 'decide-flota') {
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

  console.log('\n✅ Micro-Apps de Transporte y Logística completadas.')
  console.log('Apps insertadas:')
  apps.forEach(a => console.log(` - ${a.slug} (${a.name_es})`))
}

run()

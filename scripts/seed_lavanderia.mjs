import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('👕 Seeding Micro-Apps para Lavanderías y Tintorerías...')

  const apps = [
    {
      slug: 'reactiva-ropa',
      name_en: 'ReactivaRopa',
      name_es: 'ReactivaRopa',
      description_en: 'Your customer hasn\'t brought their clothes in weeks. One message brings the basket back.',
      description_es: 'Tu cliente no ha traído su ropa en semanas. Un mensaje trae la canasta de vuelta.',
      icon: 'Shirt',
      form_schema: [
        { id: 'cliente', type: 'text', label_en: 'Customer Name', label_es: 'Nombre del cliente', required: true },
        { id: 'ultimo_servicio', type: 'text', label_en: 'Last Service Used', label_es: 'Último servicio utilizado', required: true, placeholder_es: 'Lavado por kilo, Tintorería de trajes, Lavado de edredones...' },
        { id: 'semanas_ausente', type: 'text', label_en: 'Weeks Without Visiting', label_es: 'Semanas desde la última visita', required: true },
        { id: 'tipo_cliente', type: 'select', label_en: 'Customer Type', label_es: 'Tipo de cliente', required: true,
          options: [
            { value: 'frecuente', label_en: 'Frequent (Weekly)', label_es: 'Frecuente (Semanal)' },
            { value: 'ocasional', label_en: 'Occasional (Monthly)', label_es: 'Ocasional (Mensual)' },
            { value: 'estacional', label_en: 'Seasonal (Quilts/Winter)', label_es: 'Estacional (Edredones/Invierno)' }
          ]
        },
        { id: 'promo_gancho', type: 'text', label_en: 'Special Offer / Hook', label_es: 'Oferta especial de gancho', required: false, placeholder_es: '10% de descuento esta semana, Recolección gratis, 2x1 en edredones...' }
      ],
      prompt_template: `Actúa como el Gerente de Fidelización de una lavandería moderna que entiende que la ropa sucia es una constante, pero la lealtad hay que ganarla.

Cliente: {{cliente}}
Último servicio: {{ultimo_servicio}}
Días/Semanas ausente: {{semanas_ausente}}
Tipo de cliente: {{tipo_cliente}}
Oferta: {{promo_gancho}}

Genera DOS mensajes de reactivación irresistibles para WhatsApp:

1. "VERSIÓN CONVENIENCIA" (Enfocada en quitarle la carga del hogar):
Dile a {{cliente}} que sabemos que su tiempo es valioso y que nosotros nos encargamos de que su ropa esté perfecta. Si es {{tipo_cliente}} frecuente, recuérdale lo bien que se siente tener la canasta vacía. Menciona {{promo_gancho}} como el empujón final. Tono: servicial y ligero. Máx. 4 líneas.

2. "VERSIÓN TEMPORADA / CUIDADO" (Especializada):
Si el último servicio fue {{ultimo_servicio}}, enfócate en el cuidado de esas prendas específicas o en la necesidad actual (Ej: "Es momento de guardar el invierno"). Usa {{promo_gancho}} para incentivar la visita esta misma semana. CTA: "¿Te agendamos recolección?". Máx. 4 líneas.

Al final sugiere: El mejor día de la semana para enviar este mensaje según el flujo típico de una lavandería.`
    },
    {
      slug: 'upsell-lav-ai',
      name_en: 'UpsellLav AI',
      name_es: 'UpsellLav AI',
      description_en: 'They brought basics. Offer the premium care their best clothes deserve.',
      description_es: 'Trajeron básicos. Ofrece el cuidado premium que sus mejores prendas merecen.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'cliente', type: 'text', label_en: 'Customer Name', label_es: 'Nombre del cliente', required: true },
        { id: 'servicio_actual', type: 'text', label_en: 'Current Service Requested', label_es: 'Servicio solicitado actualmente', required: true, placeholder_es: 'Lavado por kilo normal, Secado...' },
        { id: 'prendas_observadas', type: 'text', label_en: 'Observed Items in Registry', label_es: 'Prendas observadas en el pedido (traje, seda, edredón, tenis)', required: true },
        { id: 'servicios_premium', type: 'textarea', label_en: 'Premium Services Available', label_es: 'Servicios premium disponibles', required: true, placeholder_es: 'Planchado a mano, Tintorería ecológica, Lavado de tenis profesional, Tratamiento de manchas difícil, Almidonado, Doblado premium...' }
      ],
      prompt_template: `Eres el Experto en Cuidado Textil de una lavandería de alta gama. Tu objetivo es convertir un ticket de "lavado básico" en uno de "especialidad" protegiendo las prendas del cliente.

Cliente: {{cliente}}
Hoy trajo: {{servicio_actual}}
Vimos en su bolsa: {{prendas_observadas}}
Servicios extra: {{servicios_premium}}

Genera la estrategia de Upsell:

1. EL DIAGNÓSTICO (Por qué importa):
Explica por qué {{prendas_observadas}} no debería lavarse con el proceso de {{servicio_actual}}. Usa un argumento técnico pero sencillo (fibras, color, deformación). 

2. LA RECOMENDACIÓN DE VALOR:
Elige el servicio de {{servicios_premium}} que mejor encaja. No lo vendas como "más caro", sino como "inversión en durabilidad".

3. EL GUION DE MOSTRADOR (Lo que dice el empleado):
Las palabras exactas para decirle a {{cliente}} al momento de recibir la ropa. "Sr/Sra {{cliente}}, notamos que trae esta prenda de {{prendas_observadas}}. Para evitar que [riesgo], le recomendamos nuestro servicio de [servicio de {{servicios_premium}}]. ¿Le gustaría que le demos ese tratamiento especial?".

Cierra con: El "Combo Cuidado Total" — Cómo agrupar el pedido actual para que el cliente sienta que por una pequeña diferencia su ropa durará años más.`
    },
    {
      slug: 'promo-lav-ai',
      name_en: 'PromoLav AI',
      name_es: 'PromoLav AI',
      description_en: 'Fill your machines on slow Tuesdays. Campaigns for quilts, curtains, and rainy days.',
      description_es: 'Llena tus máquinas los martes lentos. Campañas para edredones, cortinas y días de lluvia.',
      icon: 'Zap',
      form_schema: [
        { id: 'nombre_lavanderia', type: 'text', label_en: 'Laundry Name', label_es: 'Nombre de la lavandería', required: true },
        { id: 'temporada_clima', type: 'select', label_en: 'Season / Weather Context', label_es: 'Contexto de temporada o clima', required: true,
          options: [
            { value: 'lluvia', label_en: 'Rainy Season (Dryer focus)', label_es: 'Temporada de lluvias (Foco en secado)' },
            { value: 'cambio_estacion', label_en: 'Season Change (Quilts/Coats)', label_es: 'Cambio de estación (Edredones/Abrigos)' },
            { value: 'regreso_clases', label_en: 'Back to School (Uniforms)', label_es: 'Regreso a clases (Uniformes)' },
            { value: 'semana_lenta', label_en: 'Mid-week Slump (Tue/Wed)', label_es: 'Días lentos (Mar/Mie)' },
            { value: 'fiestas', label_en: 'Holidays (Suits/Dresses)', label_es: 'Fiestas/Eventos (Trajes/Vestidos)' }
          ]
        },
        { id: 'detalle_promo', type: 'textarea', label_en: 'Promo Details', label_es: 'Detalle de la promoción', required: true, placeholder_es: '3x2 en edredones, 15% desc en secado los días lluviosos, lavado de tenis $99...' },
        { id: 'canal', type: 'select', label_en: 'Channel', label_es: 'Canal de difusión', required: true,
          options: [
            { value: 'whatsapp', label_en: 'WhatsApp Status/Broadcast', label_es: 'Estado/Difusión WhatsApp' },
            { value: 'facebook_ig', label_en: 'Social Media Post', label_es: 'Post Redes Sociales' },
            { value: 'volante', label_en: 'Flyer / Physical Banner', label_es: 'Volante / Lona exterior' }
          ]
        }
      ],
      prompt_template: `Eres el encargado de marketing de {{nombre_lavanderia}}. Tu misión es generar tráfico cuando las máquinas están paradas.

Contexto: {{temporada_clima}}
Promoción: {{detalle_promo}}
Canal: {{canal}}

Genera el contenido de la campaña:

1. TITULAR GANCHO: Una frase que conecte con el problema del cliente según {{temporada_clima}} (Ej: "¿Ropa que no se seca por la lluvia?").
2. EL CUERPO DEL MENSAJE (según {{canal}}):
   - Si es WhatsApp: Corto, con emojis, directo al punto y con CTA a reservar recolección.
   - Si es Redes: Enfocado en el beneficio visual de ropa limpia y suave.
   - Si es Físico: Titular grande y beneficio claro.
3. POR QUÉ ESTA PROMO ES RENTABLE: Breve explicación para el dueño de por qué lanzar {{detalle_promo}} en {{temporada_clima}} ayuda al flujo de caja sin canibalizar ganancias de fin de semana.

Incluye una sugerencia de "Nombre de la Campaña" que sea pegajoso.`
    },
    {
      slug: 'decide-lav',
      name_en: 'DecideLav',
      name_es: 'DecideLav',
      description_en: 'Optimize your laundry operations. Utilities vs. service speed analysis.',
      description_es: 'Optimiza tus operaciones: análisis de insumos, servicios y velocidad de entrega.',
      icon: 'BarChart2',
      form_schema: [
        { id: 'datos_lavanderia', type: 'textarea', label_en: 'Operational Data', label_es: 'Datos de la lavandería (servicios/mes, costos gas/luz, detergentes, empleados)', required: true, placeholder_es: 'Tiket promedio: $120, Servicios/día: 25, Gasto gas: $5,000, 2 empleados...' },
        { id: 'objetivo', type: 'select', label_en: 'Primary Goal', label_es: 'Objetivo principal', required: true,
          options: [
            { value: 'ahorro', label_en: 'Reduce Costs (Supplies/Energy)', label_es: 'Reducir costos (Insumos/Servicios)' },
            { value: 'velocidad', label_en: 'Increase Service Speed', label_es: 'Aumentar velocidad de entrega' },
            { value: 'nuevos_servicios', label_en: 'Add New Services (Delivery/Specialty)', label_es: 'Añadir nuevos servicios' },
            { value: 'eficiencia_personal', label_en: 'Staff Efficiency', label_es: 'Eficiencia del personal' }
          ]
        },
        { id: 'problema_actual', type: 'text', label_en: 'Current Bottleneck', label_es: 'Principal cuello de botella', required: true }
      ],
      prompt_template: `Eres un consultor de eficiencia para negocios de lavandería. Conoces los márgenes reales y dónde se escapa el dinero en este sector.

Datos: {{datos_lavanderia}}
Objetivo: {{objetivo}}
Cuello de botella: {{problema_actual}}

Propón 3 decisiones de negocio accionables:
1. CAMBIO OPERATIVO: Una modificación en cómo se procesa la ropa o se usan los insumos para mejorar {{objetivo}}.
2. ESTRATEGIA DE PRECIOS: ¿Deberían subir precios, cobrar extra por "express" o empaquetar servicios?
3. ACCIÓN DE ESTA SEMANA: La prioridad número 1 para resolver {{problema_actual}}.

Basa tus recomendaciones en maximizar el margen de utilidad por máquina-hora.`
    },
    {
      slug: 'pulse-lav',
      name_en: 'PulseLav',
      name_es: 'PulseLav',
      description_en: 'Daily check on orders, pending items, and equipment status.',
      description_es: 'Control diario de pedidos, prendas pendientes y estado de maquinaria.',
      icon: 'Activity',
      form_schema: [
        { id: 'pedidos_hoy', type: 'text', label_en: 'Orders Taken Today', label_es: 'Pedidos recibidos hoy', required: true },
        { id: 'entregas_hoy', type: 'text', label_en: 'Orders Delivered Today', label_es: 'Pedidos entregados hoy', required: true },
        { id: 'pendientes_retraso', type: 'text', label_en: 'Orders Delayed / Pending', label_es: 'Pedidos pendientes o con retraso', required: true },
        { id: 'incidencias_maquinas', type: 'textarea', label_en: 'Machine / Staff Incidents', label_es: 'Incidencias en máquinas o personal', required: false, placeholder_es: 'Secadora 2 hace ruido, falta detergente de color...' },
        { id: 'ingreso_estimado', type: 'text', label_en: 'Estimated Daily Revenue', label_es: 'Ingreso estimado del día', required: true }
      ],
      prompt_template: `Actúa como el Supervisor de Planta de {{pedidos_hoy}} pedidos por día.
Tu meta es asegurar que no se acumule ropa y que las máquinas sigan girando.

- Recibidos: {{pedidos_hoy}}
- Entregados: {{entregas_hoy}}
- Retrasos: {{pendientes_retraso}}
- Problemas técnicos: {{incidencias_maquinas}}
- Ingresos: \${{ingreso_estimado}}

Dashboard de Salud del Día:
1. RATIO DE PRODUCTIVIDAD: ¿Estamos sacando más ropa de la que entra o se está acumulando cuello de botella? (Basado en {{pedidos_hoy}} vs {{entregas_hoy}}).
2. ANÁLISIS DE RETRASOS: Plan de acción para los {{pendientes_retraso}} pedidos para que el cliente no se queje.
3. ALERTA DE MANTENIMIENTO: Basado en {{incidencias_maquinas}}, nivel de urgencia de reparación.
4. META MAÑANA: Qué debería priorizar el equipo al abrir la cortina.

Tono: Directo, operativo y enfocado en no quedar mal con el cliente.`
    },
    {
      slug: 'lavanderia-loop',
      name_en: 'LavLoop Premium',
      name_es: 'LavLoop Premium',
      description_en: 'Total growth system for laundry businesses. Delivery and subscription models.',
      description_es: 'Sistema de crecimiento total: modelos de suscripción y convenios.',
      icon: 'RefreshCw',
      form_schema: [
        { id: 'nombre_negocio', type: 'text', label_en: 'Business Name', label_es: 'Nombre del negocio', required: true },
        { id: 'capacidad_instalada', type: 'text', label_en: 'Number of machines', label_es: 'Número de lavadoras/secadoras', required: true },
        { id: 'servicio_domicilio', type: 'select', label_en: 'Delivery Service', label_es: '¿Cuenta con servicio a domicilio?', required: true,
          options: [
            { value: 'si', label_en: 'Yes', label_es: 'Sí' },
            { value: 'no', label_en: 'No', label_es: 'No' },
            { value: 'planeando', label_en: 'Planning to add', label_es: 'Planeando añadirlo' }
          ]
        },
        { id: 'fase', type: 'select', label_en: 'Priority Growth Module', label_es: 'Módulo de crecimiento prioritario', required: true,
          options: [
            { value: 'fidelizacion', label_en: 'Retention & Subscriptions', label_es: 'Fidelización y Suscripciones' },
            { value: 'convenios', label_en: 'Corporate/Hotel Partnerships', label_es: 'Convenios Corporativos' },
            { value: 'delivery', label_en: 'Delivery Optimization', label_es: 'Optimización de Domicilios' }
          ]
        }
      ],
      prompt_template: `Eres el estratega senior de "LavLoop", el sistema de escalado para lavanderías que pasan de ser "negocio de barrio" a "cadena o servicio premium".

Negocio: {{nombre_negocio}}
Capacidad: {{capacidad_instalada}} máquinas
Domicilio: {{servicio_domicilio}}
Enfoque: {{fase}}

Desarrolla el plan LabLoop:

Si {{fase}} = FIDELIZACIÓN:
- Crea el "Plan de Suscripción Mensual": Diseña 3 paquetes (Soltero, Pareja, Familiar) con precio fijo al mes, número de kilos incluidos y recolección programada. Esto da flujo de caja estable.
- Plan de referidos: "Trae a un vecino y tu próximo edredón es gratis".

Si {{fase}} = CONVENIOS:
- Identifica 3 nichos locales para convenios B2B (Airbnb, Restaurantes, Clínicas estéticas).
- Genera el guion de propuesta: "Cómo {{nombre_negocio}} reduce su gasto de blancos en 20%".

Si {{fase}} = DELIVERY:
- Logística: Cómo optimizar rutas si {{servicio_domicilio}} es clave.
- Upsell digital: Cómo vender "lavado de tenis" por WhatsApp justo antes de recoger el pedido de ropa normal.

Cierra con la "Métrica Estrella" que deben cuidar esta semana para duplicar su tamaño en 6 meses.`
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
        console.log(`App ${app.slug} already exists, updating...`)
        const { data: existingApp } = await supabase.from('micro_apps').select('id').eq('slug', app.slug).single()
        if (existingApp) {
          app.id = existingApp.id
          await supabase.from('micro_apps').update({
            name_en: app.name_en, name_es: app.name_es,
            description_en: app.description_en, description_es: app.description_es,
            icon: app.icon, form_schema: app.form_schema, prompt_template: app.prompt_template
          }).eq('id', app.id)
          console.log(`Updated ${app.slug}`)
        }
      } else { console.error(`Error inserting ${app.slug}:`, appError.message); continue }
    } else { app.id = appId }

    let targetPlan = proPlan
    if (app.slug === 'lavanderia-loop' || app.slug === 'decide-lav') targetPlan = businessPlan || proPlan

    if (targetPlan && app.id) {
      const { data: existingLink } = await supabase.from('plan_apps').select('*')
        .eq('plan_id', targetPlan.id).eq('app_id', app.id).single()
      if (!existingLink) {
        await supabase.from('plan_apps').insert({ plan_id: targetPlan.id, app_id: app.id })
        console.log(`Linked ${app.slug} → plan ${targetPlan.slug}`)
      } else { console.log(`${app.slug} already linked to plan ${targetPlan.slug}`) }
    }
  }

  console.log('\n✅ Micro-Apps de Lavanderías completadas.')
}

run()

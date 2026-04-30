import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('🛒 Seeding Micro-Apps para Retail / Tiendas...')

  const apps = [
    {
      slug: 'reactiva-comprador',
      name_en: 'ReactivaComprador',
      name_es: 'ReactivaComprador',
      description_en: 'Your best customer hasn\'t bought in 60 days. One message changes that.',
      description_es: 'Recupera clientes que dejaron de comprar con mensajes que realmente generan recompra.',
      icon: 'ShoppingBag',
      form_schema: [
        { id: 'cliente', type: 'text', label_en: 'Customer Name', label_es: 'Nombre del cliente', required: true },
        { id: 'dias_ausente', type: 'text', label_en: 'Days Since Last Purchase', label_es: 'Días sin comprar en la tienda', required: true },
        { id: 'categoria_compra', type: 'select', label_en: 'Category They Usually Buy', label_es: 'Categoría que normalmente compra', required: true,
          options: [
            { value: 'ropa_calzado', label_en: 'Clothing & Footwear', label_es: 'Ropa y calzado' },
            { value: 'electronica', label_en: 'Electronics & Tech', label_es: 'Electrónica y tecnología' },
            { value: 'hogar_deco', label_en: 'Home & Decor', label_es: 'Hogar y decoración' },
            { value: 'alimentos', label_en: 'Food & Groceries', label_es: 'Alimentos y abarrotes' },
            { value: 'salud_belleza', label_en: 'Health & Beauty', label_es: 'Salud y belleza' },
            { value: 'ferreteria', label_en: 'Hardware & Tools', label_es: 'Ferretería y herramientas' },
            { value: 'juguetes', label_en: 'Toys & Kids', label_es: 'Juguetes e infantil' },
            { value: 'otros', label_en: 'Other', label_es: 'Otros' }
          ]
        },
        { id: 'oferta_disponible', type: 'textarea', label_en: 'Current Offer / Promotion', label_es: 'Oferta o promoción disponible para reactivar (si hay)', required: false,
          placeholder_es: '15% de descuento en su categoría, 2x1 en selección, envío gratis...'
        },
        { id: 'canal', type: 'select', label_en: 'Contact Channel', label_es: 'Canal de contacto', required: true,
          options: [
            { value: 'whatsapp', label_en: 'WhatsApp', label_es: 'WhatsApp' },
            { value: 'sms', label_en: 'SMS', label_es: 'SMS' },
            { value: 'email', label_en: 'Email', label_es: 'Email' }
          ]
        }
      ],
      prompt_template: `Actúa como el Director de Marketing de una tienda retail líder, especialista en reactivación de clientes con cero presupuesto publicitario.

Cliente: {{cliente}}
Sin comprar hace: {{dias_ausente}} días
Categoría habitual: {{categoria_compra}}
Oferta disponible: {{oferta_disponible}}
Canal: {{canal}}

Genera DOS mensajes de reactivación listos para enviar HOY por {{canal}}:

1. "Versión Nostalgia + Valor" (emocional):
Hazle sentir a {{cliente}} que la tienda lo recuerda de forma auténtica. Menciona su categoría favorita {{categoria_compra}} y ofrece algo concreto relacionado (nueva llegada, stock limitado, producto que "le encantaría"). Si hay oferta {{oferta_disponible}}, preséntala como exclusiva para él. Máx. 5 líneas. Cálido, no robótico.

2. "Versión Urgencia Real" (directa y con fecha límite):
Un mensaje breve con una razón concreta para regresar HOY: liquidación de temporada en {{categoria_compra}}, stock por agotarse, oferta que vence en 48h. CTA claro: "Respóndeme y te aparto el tuyo" o "Visítanos antes del viernes". Máx. 4 líneas.

Proporciona también el momento ideal del día para enviar cada mensaje y por qué.`
    },
    {
      slug: 'upsell-retail-ai',
      name_en: 'UpsellRetail AI',
      name_es: 'UpsellRetail AI',
      description_en: 'They came for one product. Leave with a full cart.',
      description_es: 'Maximiza el ticket promedio con cross-sell y upsell irresistibles en cada venta.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'producto_comprado', type: 'text', label_en: 'Product Being Purchased', label_es: 'Producto que el cliente está comprando o acaba de comprar', required: true },
        { id: 'perfil_cliente', type: 'select', label_en: 'Customer Profile', label_es: 'Perfil del comprador', required: true,
          options: [
            { value: 'regalo', label_en: 'Buying as a gift', label_es: 'Comprando para regalo' },
            { value: 'uso_personal', label_en: 'Personal use', label_es: 'Uso personal' },
            { value: 'negocio', label_en: 'For their business', label_es: 'Para su negocio o trabajo' },
            { value: 'hogar', label_en: 'For home / family', label_es: 'Para el hogar o familia' }
          ]
        },
        { id: 'ticket_actual', type: 'text', label_en: 'Current Purchase Amount', label_es: 'Monto de compra actual ($)', required: true },
        { id: 'inventario_relacionado', type: 'textarea', label_en: 'Related Products in Stock', label_es: 'Productos complementarios disponibles en tu tienda', required: true,
          placeholder_es: 'Accesorios, garantía extendida, producto de mantenimiento, versión premium, kit completo...'
        }
      ],
      prompt_template: `Eres el Maestro del Merchandising y Estratega de Ventas Retail. Tu misión: aumentar el ticket promedio de cada transacción sin que el cliente sienta que le están "vendiendo de más".

Producto en compra: {{producto_comprado}}
Perfil del comprador: {{perfil_cliente}}
Ticket actual: \${{ticket_actual}}
Inventario complementario: {{inventario_relacionado}}

Diseña la estrategia de Upsell / Cross-sell perfecta para este momento:

1. TOP 3 PRODUCTOS COMPLEMENTARIOS: Selecciona los 3 productos de {{inventario_relacionado}} con mayor probabilidad de que {{perfil_cliente}} los compre junto con {{producto_comprado}}. Para cada uno incluye el porcentaje de aumento de ticket y por qué encaja perfectamente con este cliente.

2. EL GUION DEL VENDEDOR: Las frases exactas (2-3 oraciones por producto) que el vendedor dice de forma natural en el momento del cobro. Que suenen como recomendación experta, no como presión de venta. Adapta el tono al perfil {{perfil_cliente}}.

3. EL BUNDLE IRRESISTIBLE: Cómo empaquetar {{producto_comprado}} con el complemento más vendible en un "kit" o "combo" con nombre atractivo y precio que justifique la compra conjunta (aunque sea solo 5% de descuento versus compra individual).

Meta: que el ticket final sea al menos 30% mayor que \${{ticket_actual}}.`
    },
    {
      slug: 'promo-retail-ai',
      name_en: 'PromoRetail AI',
      name_es: 'PromoRetail AI',
      description_en: 'Generate high-converting promotional campaigns in minutes, not days.',
      description_es: 'Crea campañas promocionales de alto impacto para WhatsApp, redes e in-store en minutos.',
      icon: 'Megaphone',
      form_schema: [
        { id: 'tipo_tienda', type: 'text', label_en: 'Store Type / Category', label_es: 'Tipo de tienda o categoría principal', required: true,
          placeholder_es: 'Tienda de ropa, ferretería, abarrotes, electrónica...'
        },
        { id: 'tipo_promo', type: 'select', label_en: 'Promotion Type', label_es: 'Tipo de promoción a comunicar', required: true,
          options: [
            { value: 'temporada', label_en: 'Seasonal Sale', label_es: 'Liquidación / Venta de temporada' },
            { value: 'nueva_llegada', label_en: 'New Arrivals', label_es: 'Nueva llegada de productos' },
            { value: 'descuento', label_en: 'Discount / Coupon', label_es: 'Descuento o cupón especial' },
            { value: 'fecha_especial', label_en: 'Special Date (Mothers Day, Christmas...)', label_es: 'Fecha especial (Día de Madres, Navidad, Buen Fin...)' },
            { value: 'liquidacion', label_en: 'Stock Clearance', label_es: 'Liquidación de inventario' },
            { value: 'lanzamiento', label_en: 'New Product Launch', label_es: 'Lanzamiento de producto nuevo' }
          ]
        },
        { id: 'producto_estrella', type: 'text', label_en: 'Star Product / Main Offer', label_es: 'Producto estrella o detalle principal de la promoción', required: true },
        { id: 'vigencia', type: 'text', label_en: 'Promotion Validity', label_es: 'Vigencia de la promoción (fechas o "hasta agotar stock")', required: true },
        { id: 'canales', type: 'select', label_en: 'Channels to Publish', label_es: 'Canales donde publicarás la promo', required: true,
          options: [
            { value: 'whatsapp', label_en: 'WhatsApp Broadcast', label_es: 'WhatsApp Broadcast / Grupos' },
            { value: 'instagram', label_en: 'Instagram / Facebook', label_es: 'Instagram / Facebook' },
            { value: 'todo', label_en: 'All Channels', label_es: 'Todos los canales' }
          ]
        }
      ],
      prompt_template: `Eres el Director Creativo de una agencia de marketing especializada en retail y tiendas físicas.
Las promotoras mediocres dicen "Tenemos descuentos". Las que venden 3x más tienen una HISTORIA que vender.

Tienda: {{tipo_tienda}}
Tipo de promo: {{tipo_promo}}
Producto/oferta estrella: {{producto_estrella}}
Vigencia: {{vigencia}}
Canales: {{canales}}

Genera el "Kit de Campaña Completo" para esta promoción:

1. GANCHO PRINCIPAL (el headline que para el scroll):
3 opciones de frase de apertura para {{tipo_promo}}, adaptadas al tono de {{tipo_tienda}}. Que generen curiosidad o urgencia inmediata.

2. MENSAJES POR CANAL:
- WhatsApp Broadcast: Mensaje de 5-7 líneas para lista de difusión. Incluye emojis estratégicos, el beneficio principal, urgencia con {{vigencia}} y CTA directo ("Responde QUIERO para apartarlo").
- Instagram/Facebook: Caption con copy emotivo + hashtags relevantes + llamada a la acción para guardarlo o compartirlo.
- Cartel in-store (si aplica): El texto del letrero en 10 palabras máximo que detenga a quien pase frente a la tienda.

3. SECUENCIA DE 3 MENSAJES (para extender la campaña):
Día 1 – Lanzamiento: Genera expectativa.
Día 3 – Mitad: Muestra evidencia social (vendidos, comentarios).
Último día – Cierre: Urgencia real de últimas piezas antes de {{vigencia}}.`
    },
    {
      slug: 'decide-tienda',
      name_en: 'DecideTienda',
      name_es: 'DecideTienda',
      description_en: 'Your store data should tell you what to buy, what to drop and what to push.',
      description_es: 'Analiza tus ventas e inventario y toma decisiones que eliminan stock muerto y aumentan ganancias.',
      icon: 'BarChart2',
      form_schema: [
        { id: 'datos_ventas', type: 'textarea', label_en: 'Sales & Inventory Data', label_es: 'Datos de ventas e inventario (productos más/menos vendidos, stock actual)', required: true },
        { id: 'problema', type: 'text', label_en: 'Main Business Problem', label_es: 'Problema o decisión principal que necesitas resolver', required: true },
        { id: 'area', type: 'select', label_en: 'Focus Area', label_es: 'Área a analizar', required: true,
          options: [
            { value: 'inventario', label_en: 'Inventory & Dead Stock', label_es: 'Inventario y productos sin rotación' },
            { value: 'rentabilidad', label_en: 'Product Profitability', label_es: 'Rentabilidad por producto / categoría' },
            { value: 'compras', label_en: 'Purchasing Decisions', label_es: 'Decisiones de compra a proveedores' },
            { value: 'precios', label_en: 'Pricing Strategy', label_es: 'Estrategia de precios y márgenes' },
            { value: 'temporada', label_en: 'Seasonal Planning', label_es: 'Planeación por temporada' }
          ]
        },
        { id: 'contexto', type: 'textarea', label_en: 'Context (competition, season, location)', label_es: 'Contexto relevante (competencia, temporada, zona geográfica)', required: true }
      ],
      prompt_template: `Eres un Consultor de Retail Management con experiencia en optimización de tiendas pequeñas y medianas.
El mayor error en retail: comprar con el corazón, vender sin estrategia y descontinuar tarde.

Datos de ventas e inventario: {{datos_ventas}}
Problema a resolver: {{problema}}
Área de análisis: {{area}}
Contexto: {{contexto}}

Entrega 3 Decisiones Comerciales Ejecutables esta semana. Para cada una:
1. LA DECISIÓN: Acción concreta y medible (ej. "Liquidar las 47 unidades de X al 40% de descuento esta semana", "Aumentar el precio de Y un 12% porque el mercado lo aguanta", "Reordenar solo el producto Z en cantidad mínima").
2. FUNDAMENTO EN DATOS: Cómo los números de {{datos_ventas}} justifican esta decisión para el área de {{area}}.
3. EJECUCIÓN INMEDIATA: Lo primero que el dueño de la tienda hace mañana a las 9am para activar esta decisión.

Finaliza con el "Semáforo de Salud Comercial":
🟢 Tienda Rentable y en Crecimiento | 🟡 Rentable pero con riesgos | 🔴 Stock muerto y márgenes en peligro
Justificado en dos líneas con los datos proporcionados.`
    },
    {
      slug: 'pulse-tienda',
      name_en: 'PulseTienda',
      name_es: 'PulseTienda',
      description_en: 'Know if today was a profitable day before closing the register.',
      description_es: 'El cierre diario de tu tienda: ventas, ticket promedio, alertas de inventario y meta del día.',
      icon: 'Activity',
      form_schema: [
        { id: 'ventas_dia', type: 'text', label_en: "Today's Total Sales", label_es: 'Ventas totales del día ($)', required: true },
        { id: 'num_transacciones', type: 'text', label_en: 'Number of Transactions', label_es: 'Número de transacciones o clientes atendidos', required: true },
        { id: 'producto_top', type: 'text', label_en: 'Best-Selling Product Today', label_es: 'Producto más vendido del día', required: true },
        { id: 'alertas_inventario', type: 'textarea', label_en: 'Low Stock Alerts', label_es: 'Productos con stock bajo o agotado hoy', required: false,
          placeholder_es: 'Producto A: últimas 3 piezas, Producto B: agotado...'
        },
        { id: 'meta_dia', type: 'text', label_en: "Today's Sales Goal", label_es: 'Meta de ventas del día ($)', required: false },
        { id: 'incidencias', type: 'textarea', label_en: 'Incidents / Notable Events', label_es: 'Incidencias o eventos relevantes del día', required: false,
          placeholder_es: 'Queja de cliente, falla de punto de venta, proveedor no llegó...'
        }
      ],
      prompt_template: `Actúa como el Sistema de Business Intelligence de una Tienda Retail de alto rendimiento.
El dueño necesita saber en 45 segundos si el día fue bueno y qué hacer mañana para vender más.

- Ventas del día: \${{ventas_dia}}
- Transacciones: {{num_transacciones}}
- Producto top: {{producto_top}}
- Alertas de inventario: {{alertas_inventario}}
- Meta del día: \${{meta_dia}}
- Incidencias: {{incidencias}}

Genera el "PulseTienda del Día":

1. SEMÁFORO DE RENDIMIENTO:
🟢 Día Exitoso | 🟡 Día Regular | 🔴 Día Bajo
Basado en: ticket promedio ({{ventas_dia}} / {{num_transacciones}}), cumplimiento de meta {{meta_dia}} y contexto de {{incidencias}}.

2. RADIOGRAFÍA DEL DÍA:
- Ticket promedio calculado vs. ticket ideal para una tienda saludable
- ¿El producto top {{producto_top}} está generando dependencia peligrosa o es una fortaleza? 
- Costo estimado de las alertas de inventario {{alertas_inventario}} (ventas perdidas por stock cero)

3. ACCIÓN PRIORITARIA PARA MAÑANA: La única cosa que el dueño debe hacer mañana a primera hora para superar el resultado de hoy (reordenar producto, activar promo, hablar con proveedor, contactar cliente potencial).

4. PROYECCIÓN SEMANAL: Si sigue este ritmo, ¿cerrará la semana por encima o debajo de la meta? ¿Cuánto necesita vender los próximos días para compensar?`
    },
    {
      slug: 'retail-loop',
      name_en: 'RetailLoop Premium',
      name_es: 'RetailLoop Premium',
      description_en: 'From first purchase to lifetime loyal customer. Full retail growth system.',
      description_es: 'Reactivación + Upsell + Promociones + Control. El sistema completo de tu tienda.',
      icon: 'RefreshCw',
      form_schema: [
        { id: 'tienda', type: 'text', label_en: 'Store Name', label_es: 'Nombre de la tienda', required: true },
        { id: 'categoria', type: 'text', label_en: 'Main Product Category', label_es: 'Categoría principal de productos', required: true },
        { id: 'canal_venta', type: 'select', label_en: 'Sales Channel', label_es: 'Canal de venta principal', required: true,
          options: [
            { value: 'fisica', label_en: 'Physical Store Only', label_es: 'Tienda física únicamente' },
            { value: 'online', label_en: 'Online / E-commerce', label_es: 'Online / E-commerce' },
            { value: 'hibrido', label_en: 'Physical + Online (Hybrid)', label_es: 'Física + Online (Híbrido)' }
          ]
        },
        { id: 'dolor_ventas', type: 'textarea', label_en: 'Main Sales Problem', label_es: 'Problema principal en ventas o tráfico de clientes', required: true },
        { id: 'dolor_inventario', type: 'textarea', label_en: 'Main Inventory / Margin Problem', label_es: 'Problema principal de inventario o márgenes', required: true },
        { id: 'fase', type: 'select', label_en: 'Priority Phase Today', label_es: 'Módulo donde necesitas más impacto hoy', required: true,
          options: [
            { value: 'clientes', label_en: 'Customer Reactivation & Loyalty', label_es: 'Reactivación de clientes y fidelización' },
            { value: 'ventas', label_en: 'Sales Increase & Promotions', label_es: 'Aumento de ventas y promociones' },
            { value: 'operacion', label_en: 'Inventory & Margin Control', label_es: 'Control de inventario y márgenes' }
          ]
        }
      ],
      prompt_template: `Eres el Consultor Estratégico de Retail más efectivo para tiendas pequeñas y medianas, implementando el sistema "RetailLoop": el ciclo de crecimiento sin fugas para comerciantes con visión empresarial.

Tienda: {{tienda}}
Categoría: {{categoria}}
Canal: {{canal_venta}}
Problema en ventas: {{dolor_ventas}}
Problema en inventario/márgenes: {{dolor_inventario}}
Fase prioritaria: {{fase}}

Activa el módulo RetailLoop correspondiente:

Si {{fase}} = CLIENTES:
→ Diseña el "Sistema de Fidelización de 90 Días" para {{tienda}}. Incluye: (1) la campaña de reactivación de los últimos 30 clientes inactivos con 3 mensajes de WhatsApp listos para usar en días distintos, (2) el programa de puntos o beneficio recurrente más sencillo de implementar sin tecnología cara, (3) la política de "cliente VIP" con criterios claros y beneficios que hacen que hablen de {{tienda}} con sus amigos.

Si {{fase}} = VENTAS:
→ Construye el "Plan de Ventas de los Próximos 30 Días" para {{tienda}} en {{categoria}}: las 2 promociones más poderosas para el canal {{canal_venta}} con calendario de ejecución, los guiones de venta para aumentar el ticket promedio al menos un 25%, y la estrategia de "fecha especial" que {{tienda}} puede usar este mes (aunque no sea temporada alta) para crear un momento de compra artificial.

Si {{fase}} = OPERACIÓN:
→ Diseña el "Sistema de Inventario Inteligente" para {{tienda}}: la fórmula para calcular el punto de reorden de los 10 productos más importantes, la política de liquidación de stock muerto (cuándo, cómo y a qué precio bajar productos sin rotar), y 3 acciones concretas para mejorar los márgenes en {{categoria}} sin cambiar de proveedor.

Cierra siempre con "El Próximo Movimiento de {{tienda}}": la única acción que el dueño ejecuta mañana para ver resultados en menos de 7 días.`
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
    if (app.slug === 'retail-loop' || app.slug === 'decide-tienda') {
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

  console.log('\n✅ Micro-Apps de Retail / Tiendas completadas.')
  console.log('Apps insertadas:')
  apps.forEach(a => console.log(` - ${a.slug} (${a.name_es})`))
}

run()

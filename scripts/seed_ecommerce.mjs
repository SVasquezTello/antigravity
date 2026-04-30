import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('🛒 Seeding Micro-Apps para E-commerce (CommerceLoop Ecosystem)...')

  const apps = [
    {
      slug: 'recover-cart-ai',
      name_en: 'RecoverCart AI',
      name_es: 'RecoverCart AI',
      description_en: 'Recover abandoned carts with high-conversion messaging that bring customers back.',
      description_es: 'Recupera carritos abandonados con mensajes de alta conversión que traen a los clientes de vuelta.',
      icon: 'ShoppingCart',
      form_schema: [
        { id: 'nombre_cliente', type: 'text', label_en: 'Customer Name', label_es: 'Nombre del cliente', required: true },
        { id: 'productos_abandonados', type: 'textarea', label_en: 'Abandoned Products', label_es: 'Productos abandonados', required: true },
        { id: 'valor_carrito', type: 'text', label_en: 'Cart Value', label_es: 'Valor del carrito', required: true },
        { id: 'fecha_abandono', type: 'text', label_en: 'Abandonment Date', label_es: 'Fecha del abandono', required: true },
        { id: 'ultimo_contacto', type: 'text', label_en: 'Last Contact', label_es: 'Último contacto', required: false },
        { id: 'canal_preferido', type: 'select', label_en: 'Preferred Channel', label_es: 'Canal preferido', required: true,
          options: [
            { value: 'whatsapp', label_en: 'WhatsApp', label_es: 'WhatsApp' },
            { value: 'email', label_en: 'Email', label_es: 'Email' },
            { value: 'instagram', label_en: 'Instagram', label_es: 'Instagram' }
          ]
        }
      ],
      prompt_template: `Actúa como un experto en recuperación de ingresos para e-commerce. Un cliente dejó estos productos: {{productos_abandonados}} valorados en {{valor_carrito}}.
      
      TAREA:
      Genera 2 mensajes de recuperación irresistibles para {{canal_preferido}}.
      1. VERSIÓN SUAVE: Recordatorio amable, con enfoque en "te guardamos tus favoritos".
      2. VERSIÓN URGENTE CON INCENTIVO: Enfoque en escasez de stock y un incentivo (ej. cupón de envío gratis o 10%) para cerrar hoy.
      
      RECOMENDACIÓN: Sugiere cuál es más efectivo para ticket de {{valor_carrito}} y un tip para el checkout.`
    },
    {
      slug: 'upsell-commerce-ai',
      name_en: 'UpsellCommerce AI',
      name_es: 'UpsellCommerce AI',
      description_en: 'Increase your average order value (AOV) by offering the perfect product matches.',
      description_es: 'Aumenta tu ticket promedio (AOV) ofreciendo los complementos perfectos para cada compra.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'producto_comprado', type: 'text', label_en: 'Product Purchased', label_es: 'Producto comprado', required: true },
        { id: 'historial_cliente', type: 'textarea', label_en: 'Customer History', label_es: 'Historial del cliente', required: false },
        { id: 'ticket_promedio', type: 'text', label_en: 'Average Ticket', label_es: 'Ticket promedio', required: true },
        { id: 'perfil_compra', type: 'textarea', label_en: 'Purchase Profile', label_es: 'Perfil de compra', required: true, placeholder_es: 'Comprador impulsivo, busca ofertas, premium...' },
        { id: 'catalogo_disponible', type: 'textarea', label_en: 'Available Catalog', label_es: 'Catálogo disponible', required: true }
      ],
      prompt_template: `Eres el estratega de Merchandising. El cliente acaba de comprar {{producto_comprado}}. No puedes dejar que se vaya sin ver el complemento ideal.
      
      DATOS:
      - Compró: {{producto_comprado}}
      - Perfil: {{perfil_compra}}
      - Catálogo: {{catalogo_disponible}}
      
      ENTREGA:
      1. LOS 3 UPSELLS PRIORITARIOS: Qué productos de {{catalogo_disponible}} tienen mayor lógica de compra.
      2. ARGUMENTO COMERCIAL: La frase para convencer al cliente de que el combo es mejor.
      3. MENSAJE LISTO PARA VENTA: Guion para WhatsApp/Email.
      
      Cierra con: El potencial de aumento de AOV con este cliente.`
    },
    {
      slug: 'order-flow',
      name_en: 'OrderFlow',
      name_es: 'OrderFlow',
      description_en: 'A perfect checklist to coordinate storage, sales, and delivery without errors.',
      description_es: 'Checklist perfecto para coordinar almacén, ventas y despacho sin errores.',
      icon: 'Package',
      form_schema: [
        { id: 'pedido_confirmado', type: 'text', label_en: 'Order ID/Reference', label_es: 'Pedido confirmado (ID)', required: true },
        { id: 'productos_comprados', type: 'textarea', label_en: 'Products', label_es: 'Productos comprados', required: true },
        { id: 'fecha_entrega_prometida', type: 'text', label_en: 'Delivery Date', label_es: 'Fecha de entrega prometida', required: true },
        { id: 'responsable_asignado', type: 'text', label_en: 'Assigned Responsible', label_es: 'Responsable asignado', required: true },
        { id: 'observaciones_especiales', type: 'textarea', label_en: 'Special Observations', label_es: 'Observaciones especiales', required: false }
      ],
      prompt_template: `Eres el Jefe de Fulfillment. Tu meta es entrega perfecta de {{productos_comprados}}.
      
      GENERA EL CHECKLIST OPERATIVO:
      1. PARA VENTAS: Validación de pago y datos de envío.
      2. PARA ALMACÉN: Control de stock, picking y empaque (Packaging premium).
      3. PARA DESPACHO: Ruta prioritaria y aviso de guía al cliente.
      
      Cierra con una acción de fidelización (ej. incluir un regalo o tarjeta de agradecimiento personalizada).`
    },
    {
      slug: 'decide-commerce',
      name_en: 'DecideCommerce',
      name_es: 'DecideCommerce',
      description_en: 'Get 3 actionable decisions from your store data to boost profit.',
      description_es: 'Obtén 3 decisiones accionables de los datos de tu tienda para potenciar la ganancia.',
      icon: 'BarChart',
      form_schema: [
        { id: 'reporte_ventas', type: 'textarea', label_en: 'Sales & Metrics Report', label_es: 'Reporte de ventas y métricas', required: true },
        { id: 'principal_problema', type: 'text', label_en: 'Main Problem', label_es: 'Principal problema', required: true },
        { id: 'area_analizar', type: 'text', label_en: 'Area to Analyze', label_es: 'Área a analizar (Pads, Shopify, etc)', required: true },
        { id: 'contexto_relevante', type: 'textarea', label_en: 'Relevant Context', label_es: 'Contexto relevante', required: true }
      ],
      prompt_template: `Eres un Consultor Senior de E-commerce. El dueño no quiere ver números, quiere saber qué hacer con ellos.
      
      REPORTE: {{reporte_ventas}}
      ÁREA: {{area_analizar}}
      PROBLEMA: {{principal_problema}}
      
      ENTREGA:
      1. EL DIAGNÓSTICO: Por qué está pasando el problema basado en {{reporte_ventas}}.
      2. 3 DECISIONES ACCIONABLES: Decisiones de "Cortar", "Escalar" o "Pivotar".
      3. JUSTIFICACIÓN NUMÉRICA: El impacto en el bolsillo si se aplican.
      
      Tono: Ejecutivo y orientado a beneficios.`
    },
    {
      slug: 'pulse-commerce',
      name_en: 'PulseCommerce',
      name_es: 'PulseCommerce',
      description_en: 'Daily operational traffic light for owners. Control without micromanagement.',
      description_es: 'Semáforo operativo diario para dueños. Control total sin micropresentismo.',
      icon: 'Zap',
      form_schema: [
        { id: 'reporte_dia', type: 'textarea', label_en: 'Daily Summary', label_es: 'Reporte resumen del día', required: true },
        { id: 'meta_esperada', type: 'text', label_en: 'Daily Sales Goal', label_es: 'Meta ventas esperada', required: true },
        { id: 'incidencias', type: 'textarea', label_en: 'Incidents/Issues', label_es: 'Incidencias o reclamos', required: true },
        { id: 'ventas_realizadas', type: 'text', label_en: 'Total Sales Today', label_es: 'Ventas totales de hoy', required: true },
        { id: 'comentarios_encargado', type: 'textarea', label_en: 'Manager Comments', label_es: 'Comentarios del encargado', required: false }
      ],
      prompt_template: `Eres el Director de Operaciones Virtual. El dueño necesita saber si puede dormir tranquilo hoy.
      
      ENTREGA EL SEMÁFORO OPERATIVO:
      🟢 TODO OK: Qué salió bien (Ventas: {{ventas_realizadas}}).
      🟡 CUIDADO: Dónde estamos fallando respecto a la meta ({{meta_esperada}}).
      🔴 CRÍTICO: Incidencias urgentes ({{incidencias}}) que requieren respuesta inmediata.
      
      Resumen para el dueño: Una sola cosa importante que debe saber de {{comentarios_encargado}}.`
    },
    {
      slug: 'commerce-loop',
      name_en: 'CommerceLoop Premium',
      name_es: 'CommerceLoop Premium',
      description_en: 'The complete e-commerce ecosystem: from abandoned cart to global scale.',
      description_es: 'El ecosistema completo de e-commerce: desde el carrito abandonado hasta la escala global.',
      icon: 'Infinity',
      form_schema: [
        { id: 'nombre_tienda', type: 'text', label_en: 'Store Name', label_es: 'Nombre de la tienda', required: true },
        { id: 'nicho', type: 'text', label_en: 'Niche', label_es: 'Nicho/Categoría', required: true },
        { id: 'desafio_actual', type: 'textarea', label_en: 'Main Challenge', label_es: 'Principal desafío comercial hoy', required: true }
      ],
      prompt_template: `Eres el consultor master de "CommerceLoop". Vas a diseñar la máquina de ventas definitiva para {{nombre_tienda}}.
      
      NICHO: {{nicho}}
      DESAFÍO: {{desafio_actual}}
      
      ENTREGA:
      1. ESTRATEGIA DE REGENERACIÓN: Cómo usar RecoverCart AI para que el ROAS suba inmediatamente.
      2. FLUJO LOGÍSTICO "ZERO ERRORS": Cómo OrderFlow va a eliminar las quejas de los clientes.
      3. ESCALADO ESTRATÉGICO: Sugiere cómo debería verse el Dashboard de PulseCommerce cuando la tienda facture el triple.
      
      Frase final: El mantra del e-commerce rentable.`
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
    if (app.slug === 'commerce-loop' || app.slug === 'decide-commerce') {
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

  console.log('\n✅ Micro-Apps de E-commerce completadas con éxito.')
}

run()

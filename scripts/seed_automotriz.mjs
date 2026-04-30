import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('🚗 Seeding Micro-Apps para Concesionarias y Venta Automotriz...')

  const apps = [
    {
      slug: 'test-drive-closer',
      name_en: 'TestDrive Closer',
      name_es: 'TestDrive Closer',
      description_en: 'The ride is over. Now, let\'s close the sale before they leave the parking lot.',
      description_es: 'El viaje terminó. Ahora, cerremos la venta antes de que salgan del estacionamiento.',
      icon: 'Key',
      form_schema: [
        { id: 'client_name', type: 'text', label_en: 'Client Name', label_es: 'Nombre del prospecto', required: true },
        { id: 'car_model', type: 'text', label_en: 'Car Model Tested', label_es: 'Modelo de auto probado', required: true },
        { id: 'client_objection', type: 'textarea', label_en: 'Main Objection during drive', label_es: 'Principal objeción durante el manejo', required: true },
        { id: 'enthusiasm', type: 'select', label_en: 'Enthusiasm Level', label_es: 'Nivel de entusiasmo', required: true,
          options: [
            { value: 'alto', label_en: 'High (Ready to buy)', label_es: 'Alto (Listo para comprar)' },
            { value: 'medio', label_en: 'Medium (Needs to think)', label_es: 'Medio (Tiene dudas)' },
            { value: 'bajo', label_en: 'Low (Not convinced)', label_es: 'Bajo (No convencido)' }
          ]
        }
      ],
      prompt_template: `Actúa como un Gerente de Ventas de una concesionaria de lujo.
El cliente {{client_name}} acaba de probar el {{car_model}}.
- Objeción: {{client_objection}}
- Entusiasmo: {{enthusiasm}}

Genera:
1. El "Ancla de Emoción": Cómo recordarle al cliente la sensación de manejo para minimizar su objeción.
2. Manejo Quirúrgico de Objeción: Cómo responder a "{{client_objection}}" usando psicología de ventas inversa.
3. Script de Seguimiento 1h Después: Un mensaje de WhatsApp personalizado que incluya una "ventaja exclusiva" que acaba de surgir solo para ese modelo.
4. Plan de Cierre en 24h: Tareas críticas para el vendedor para no dejar enfriar al prospecto.`
    },
    {
      slug: 'upsell-service',
      name_en: 'UpsellService AI',
      name_es: 'UpsellService AI',
      description_en: 'They bought the car. Sell them the peace of mind of maintenance and protection.',
      description_es: 'Compraron el auto. Véndeles la tranquilidad del mantenimiento y protección.',
      icon: 'Settings',
      form_schema: [
        { id: 'client_name', type: 'text', label_en: 'Client Name', label_es: 'Nombre del cliente', required: true },
        { id: 'purchase_date', type: 'text', label_en: 'Purchase Date', label_es: 'Fecha de compra', required: true },
        { id: 'services_available', type: 'textarea', label_en: 'Services to offer', label_es: 'Servicios/Productos adicionales', required: true, placeholder_es: 'Seguro premium, Plan de mantenimiento 3 años, Garantía extendida, Accesorios...' }
      ],
      prompt_template: `Eres un Asesor de Post-Venta Automotriz.
El cliente {{client_name}} compró su auto el {{purchase_date}}.
Es el momento de asegurar su lealtad y el ingreso recurrente del taller/seguros.

Genera:
1. "El Valor del Respaldo": Cómo explicar que contratar {{services_available}} protege el valor de reventa de su vehículo.
2. Análisis de Escasez: Por qué es mejor contratarlo ahora (al momento de la compra) que después.
3. Script de Email/WhatsApp: Una propuesta elegante que no parezca una venta, sino un "beneficio de bienvenida" por su compra.
4. El Paquete "Dueño VIP": Cómo agrupar tus servicios para que el cliente sienta que está ahorrando.`
    },
    {
      slug: 'copy-speed',
      name_en: 'CopySpeed AI',
      name_es: 'CopySpeed AI',
      description_en: 'Captions that evoke speed, luxury, and the desire to drive.',
      description_es: 'Captions que evocan velocidad, lujo y el deseo de conducir.',
      icon: 'Rocket',
      form_schema: [
        { id: 'car_specs', type: 'textarea', label_en: 'Car Specs/Features', label_es: 'Ficha técnica / Atributos del auto', required: true },
        { id: 'vibe', type: 'select', label_en: 'Vibe', label_es: 'Vibe', required: true,
          options: [
            { value: 'lujo', label_en: 'Luxury & Elegance', label_es: 'Lujo y Elegancia' },
            { value: 'potencia', label_en: 'Power & Speed', label_es: 'Potencia y Velocidad' },
            { value: 'familia', label_en: 'Safety & Family', label_es: 'Seguridad y Familia' },
            { value: 'aventura', label_en: 'Adventure / Off-road', label_es: 'Aventura / Off-road' }
          ]
        }
      ],
      prompt_template: `Actúa como un Copywriter especializado en la industria automotriz (estilo Top Gear).
Escribe un caption de alto impacto para redes sociales sobre este vehículo.
- Atributos: {{car_specs}}
- Vibe: {{vibe}}

Genera:
1. El Gancho de 0 a 100: Una primera línea que detenga el scroll con adrenalina o deseo.
2. El Cuerpo del Copy: No vendas "hierros", vende la experiencia de estar al volante.
3. Call to Action: Incentiva a agendar un test drive o a consultar por financiamiento.
4. Hashtags del Sector: 5-8 hashtags que atraigan a entusiastas y compradores reales.`
    },
    {
      slug: 'decide-stock',
      name_en: 'DecideStock AI',
      name_es: 'DecideStock AI',
      description_en: 'Identify which car models will sell faster this month based on data.',
      description_es: 'Identifica qué modelos se venderán más rápido este mes según tus datos.',
      icon: 'PieChart',
      form_schema: [
        { id: 'current_inventory', type: 'textarea', label_en: 'Current Stock', label_es: 'Inventario actual (modelos y antigüedad)', required: true },
        { id: 'market_trends', type: 'textarea', label_en: 'Market/News context', label_es: 'Contexto del mercado (precios, gasolina, temporada)', required: true },
        { id: 'leads_count', type: 'text', label_en: 'Monthly leads by model', label_es: 'Leads mensuales por modelo', required: true }
      ],
      prompt_template: `Eres un Analista de Inventario Inteligente para Concesionarias.
- Inventario: {{current_inventory}}
- Contexto: {{market_trends}}
- Interés: {{leads_count}}

Analiza:
1. "Los Inmóviles": Detecta qué modelos en tu stock se están volviendo un "agujero financiero" por llevar mucho tiempo parados.
2. "La Estrella del Mes": Predice qué modelo de {{current_inventory}} tendrá mayor demanda basado en {{market_trends}}.
3. Decisión de Compra: Qué debería pedir el gerente de compras a la fábrica o al mercado de usados hoy mismo.
4. Táctica de Liquidación: Una oferta creativa para mover el stock que no se vende rápido.`
    },
    {
      slug: 'pulse-showroom',
      name_en: 'PulseShowroom AI',
      name_es: 'PulseShowroom AI',
      description_en: 'Is your showroom a ghost town or a closing machine today?',
      description_es: '¿Tu showroom es un pueblo fantasma o una máquina de cierres hoy? Pulso operacional.',
      icon: 'Activity',
      form_schema: [
        { id: 'visits_today', type: 'text', label_en: 'Walk-ins / Visits today', label_es: 'Visitas físicas hoy', required: true },
        { id: 'test_drives', type: 'text', label_en: 'Test drives conducted', label_es: 'Pruebas de manejo realizadas', required: true },
        { id: 'quotes_delivered', type: 'text', label_en: 'New quotes delivered', label_es: 'Cotizaciones entregadas', required: true },
        { id: 'bottleneck', type: 'textarea', label_en: 'Main issue today', label_es: 'Problema principal detectado (ej. no hay bancos aprobando)', required: true }
      ],
      prompt_template: `Eres el Auditor de Showrooms Automotrices.
Evaluemos el desempeño del piso de venta hoy:
- Visitas: {{visits_today}}
- Pruebas: {{test_drives}}
- Cotizaciones: {{quotes_delivered}}
- Problema: {{bottleneck}}

Genera:
1. Tasa de Conversión Diaria: Ratio Visitas vs Pruebas de Manejo.
2. Semáforo de Ventas: 🟢 Showroom Caliente | 🟡 Operación Tiba | 🔴 Piso Frío.
3. Acción de Rescate Nocturno: Una tarea para que los vendedores realicen ahora mismo con los leads que NO vinieron hoy.
4. Nota Crítica: Basado en {{bottleneck}}, qué debe hablar el gerente con su equipo mañana temprano.`
    },
    {
      slug: 'auto-loop',
      name_en: 'AutoLoop Premium',
      name_es: 'AutoLoop Premium',
      description_en: 'The total cycle: from lead capture to secondary market trade-in.',
      description_es: 'El ciclo total: desde el prospecto digital hasta el "trade-in" de su auto usado.',
      icon: 'RefreshCw',
      form_schema: [
        { id: 'brand_name', type: 'text', label_en: 'Dealership Name', label_es: 'Nombre de la Concesionaria', required: true },
        { id: 'specialty', type: 'text', label_en: 'Market Specialty (New/Used)', label_es: 'Especialidad (ej. Seminuevos certificados)', required: true },
        { id: 'pain_point', type: 'textarea', label_en: 'Biggest business challenge', label_es: 'Mayor reto de negocio actualmente', required: true },
        { id: 'inventory_size', type: 'text', label_en: 'Monthly sales volume', label_es: 'Volumen de ventas mensual', required: true }
      ],
      prompt_template: `Eres el Estratega Maestro del sector Automotriz. Implementamos el "AutoLoop" para {{brand_name}}.
- Nicho: {{specialty}}
- Reto: {{pain_point}}
- Volumen: {{inventory_size}}

Diseña el Plan de 3 Pilares:
1. El Motor de Prospectos Digitales: Cómo llenar el showroom usando contenido educativo sobre {{specialty}} que detone el deseo de cambio de auto.
2. El Protocolo de Cierre "Key-in-Hand": Pasos para reducir la fricción en el papeleo y financiamiento, solucionando {{pain_point}}.
3. El Ciclo de Renovación (Trade-in): Un sistema para asegurar que el cliente vuelva en 3 años a entregarte ese auto y comprar el siguiente.
Cierra con una visión de liderazgo regional para {{brand_name}}.`
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
        console.log(`App ${app.slug} already exists, updating it.`)
        const { data: existingApp } = await supabase.from('micro_apps').select('id').eq('slug', app.slug).single()
        
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
        }
      } else {
        console.error(`Error inserting ${app.slug}:`, appError.message)
        continue
      }
    } else {
      app.id = appId
    }

    // Link Plan
    let targetPlan = proPlan
    if (app.slug === 'auto-loop' || app.slug === 'decide-stock') {
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
        console.log(`Linked ${app.slug} to plan ${targetPlan.slug}`)
      }
    }
  }

  console.log('✅ Micro-Apps Automotriz (Seed) completado.')
}

run()

import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('🚀 Seeding Micro-Apps para Agencias de Marketing y Creativas...')

  const apps = [
    {
      slug: 'pitch-deck-ai',
      name_en: 'PitchDeck AI',
      name_es: 'PitchDeck AI',
      description_en: 'Generate a high-converting pitch deck structure for new clients.',
      description_es: 'Genera una estructura de pitch deck de alta conversión para nuevos clientes.',
      icon: 'Presentation',
      form_schema: [
        { id: 'cliente_objetivo', type: 'text', label_en: 'Target Client', label_es: 'Cliente objetivo', required: true },
        { id: 'industria', type: 'text', label_en: 'Industry', label_es: 'Industria', required: true },
        { id: 'presupuesto_estimado', type: 'text', label_en: 'Estimated Budget', label_es: 'Presupuesto estimado', required: true },
        { id: 'principales_dolores', type: 'textarea', label_en: 'Main Pain Points', label_es: 'Principales dolores del cliente', required: true },
        { id: 'nuestra_solucion', type: 'textarea', label_en: 'Our Solution/Unique Angle', label_es: 'Nuestra solución / Ángulo único', required: true }
      ],
      prompt_template: `Actúa como un Director Creativo Senior especializado en ventas. Debemos ganar esta cuenta de {{cliente_objetivo}}.
      
      CONTEXTO:
      - Industria: {{industria}}
      - Presupuesto: {{presupuesto_estimado}}
      - Dolores: {{principales_dolores}}
      - Nuestra propuesta: {{nuestra_solucion}}
      
      TAREA:
      Genera una estructura de 10 diapositivas para el Pitch Deck:
      1. El Gancho: Un inicio impactante basado en sus dolores.
      2. El Gran Problema: Magnifica el costo de no actuar hoy.
      3. Nuestra Visión: Cómo se ve el éxito con nosotros.
      4. La Estrategia (3 pasos clave).
      5. El ROI esperado: Por qué somos una inversión, no un gasto.
      ... (diapositivas restantes)
      
      RECOMENDACIÓN: Da un "Consejo Pro" para cerrar la venta en la misma reunión.`
    },
    {
      slug: 'creative-brief-ai',
      name_en: 'CreativeBrief AI',
      name_es: 'BriefCreativo AI',
      description_en: 'Turn chaotic client requests into a perfect creative brief for your team.',
      description_es: 'Convierte pedidos caóticos de clientes en un brief creativo perfecto para tu equipo.',
      icon: 'ClipboardList',
      form_schema: [
        { id: 'nombre_proyecto', type: 'text', label_en: 'Project Name', label_es: 'Nombre del proyecto', required: true },
        { id: 'objetivo_campaña', type: 'textarea', label_en: 'Campaign Goal', label_es: 'Objetivo de la campaña', required: true },
        { id: 'publico_objetivo', type: 'text', label_en: 'Target Audience', label_es: 'Público objetivo', required: true },
        { id: 'entregables_requeridos', type: 'textarea', label_en: 'Required Deliverables', label_es: 'Entregables requeridos', required: true },
        { id: 'tono_marca', type: 'text', label_en: 'Brand Tone', label_es: 'Tono de marca', required: true }
      ],
      prompt_template: `Eres un Planner Estratégico. Tu equipo necesita claridad absoluta para no perder tiempo en revisiones infinitas.
      
      DATOS DEL PROYECTO: {{nombre_proyecto}}
      OBJETIVO: {{objetivo_campaña}}
      AUDIENCIA: {{publico_objetivo}}
      ENTREGABLES: {{entregables_requeridos}}
      TONO: {{tono_marca}}
      
      GENERA EL BRIEF CREATIVO:
      1. THE BIG IDEA: El concepto central en una sola frase.
      2. INSIGHT DE AUDIENCIA: Qué sienten realmente sus clientes.
      3. MANDATORIOS: Lo que NO puede faltar.
      4. KPI DE ÉXITO: Cómo sabremos que funcionó.
      
      Cierra con un "Mindset Tip" para el diseñador/copywriter.`
    },
    {
      slug: 'ad-copy-loop',
      name_en: 'AdCopy Loop',
      name_es: 'AdCopy Loop',
      description_en: 'Generate 5 high-performing variants for Meta, Google, and TikTok ads.',
      description_es: 'Genera 5 variantes de alto rendimiento para anuncios de Meta, Google y TikTok.',
      icon: 'Copy',
      form_schema: [
        { id: 'producto_servicio', type: 'text', label_en: 'Product/Service', label_es: 'Producto o servicio', required: true },
        { id: 'beneficio_principal', type: 'text', label_en: 'Main Benefit', label_es: 'Beneficio principal', required: true },
        { id: 'oferta_irresistible', type: 'text', label_en: 'Irresistible Offer', label_es: 'Oferta irresistible', required: true },
        { id: 'plataforma', type: 'select', label_en: 'Target Platform', label_es: 'Plataforma objetivo', required: true,
          options: [
            { value: 'meta', label_en: 'Meta (FB/IG)', label_es: 'Meta (FB/IG)' },
            { value: 'google', label_en: 'Google Search', label_es: 'Google Search' },
            { value: 'tiktok', label_en: 'TikTok Ads', label_es: 'TikTok Ads' }
          ]
        }
      ],
      prompt_template: `Actúa como un Media Buyer experto en Copywriting de Respuesta Directa.
      
      PRODUCTO: {{producto_servicio}}
      BENEFICIO: {{beneficio_principal}}
      OFERTA: {{oferta_irresistible}}
      PLATAFORMA: {{plataforma}}
      
      GENERA 5 VARIANTES DE COPY:
      1. DIRECTA: Directo al grano, oferta primero.
      2. BASADA EN EL DOLOR: "Cansado de X...".
      3. BASADA EN EL PLACER: "Imagina lograr Y...".
      4. PRUEBA SOCIAL / AUTORIDAD.
      5. ESCASEZ / URGENCIA.
      
      Para cada variante incluye: Headline + Cuerpo del mensaje + CTA.`
    },
    {
      slug: 'agency-roi-bot',
      name_en: 'Agency ROI Predictor',
      name_es: 'Predictor de ROI para Agencias',
      description_en: 'Calculate and justify the financial impact of your marketing services.',
      description_es: 'Calcula y justifica el impacto financiero de tus servicios de marketing.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'inversion_publicitaria', type: 'number', label_en: 'Ad Spend', label_es: 'Inversión publicitaria (USD)', required: true },
        { id: 'valor_vida_cliente', type: 'number', label_en: 'Customer LTV', label_es: 'Valor de vida del cliente (LTV)', required: true },
        { id: 'tasa_conversion_esperada', type: 'text', label_en: 'Expected Conversion Rate', label_es: 'Tasa de conversión esperada', required: true },
        { id: 'costo_agencia', type: 'number', label_en: 'Agency Fees', label_es: 'Honorarios de la agencia', required: true }
      ],
      prompt_template: `Eres un Analista Financiero de Marketing. Debes demostrarle al cliente que trabajar con nosotros es la mejor decisión financiera.
      
      DATOS:
      - Ad Spend: {{inversion_publicitaria}}
      - LTV: {{valor_vida_cliente}}
      - Conv. Rate: {{tasa_conversion_esperada}}
      - Agency Fee: {{costo_agencia}}
      
      ENTREGA:
      1. PROYECCIÓN DE RETORNO: Escenario Pesimista, Realista y Optimista.
      2. ROAS ESTIMADO.
      3. COSTO DE OPORTUNIDAD: Qué pierde el cliente si no invierte este dinero hoy.
      
      Formato: Tabla ejecutiva clara.`
    },
    {
      slug: 'retention-agency-bot',
      name_en: 'Agency Retention Master',
      name_es: 'Master de Retención para Agencias',
      description_en: 'Prevent churn by generating a high-impact monthly report strategy.',
      description_es: 'Evita el churn generando una estrategia de reporte mensual de alto impacto.',
      icon: 'ShieldCheck',
      form_schema: [
        { id: 'resultados_mes', type: 'textarea', label_en: 'Monthly Results', label_es: 'Resultados del mes (KPIs)', required: true },
        { id: 'principales_obstaculos', type: 'textarea', label_en: 'Main Obstacles', label_es: 'Principales obstáculos encontrados', required: true },
        { id: 'nivel_satisfaccion_cliente', type: 'select', label_en: 'Client Satisfaction', label_es: 'Nivel de satisfacción percibida', required: true,
          options: [
            { value: 'feliz', label_en: 'Happy', label_es: 'Feliz' },
            { value: 'neutro', label_en: 'Neutral', label_es: 'Neutro' },
            { value: 'en_riesgo', label_en: 'At Risk / Unhappy', label_es: 'En Riesgo / Insatisfecho' }
          ]
        }
      ],
      prompt_template: `Eres un Key Account Manager (KAM) con experiencia en retención. El cliente está en estado: {{nivel_satisfaccion_cliente}}.
      
      KPIs: {{resultados_mes}}
      OBSTÁCULOS: {{principales_obstaculos}}
      
      TAREA:
      1. GUION DE LA REUNIÓN DE REPORTE: Cómo presentar los datos para que el cliente se sienta seguro.
      2. "QUICK WIN" PARA EL PRÓXIMO MES: Una acción rápida que demuestre proactividad.
      3. ESTRATEGIA DE UPSELL: Cómo ofrecer un servicio adicional basado en estos resultados.
      
      Tono: Profesional, transparente y orientado a largo plazo.`
    },
    {
      slug: 'script-master-ai',
      name_en: 'ScriptMaster AI',
      name_es: 'ScriptMaster AI',
      description_en: 'Generate viral video scripts for Reels, TikToks, and Shorts.',
      description_es: 'Genera guiones de video virales para Reels, TikToks y Shorts.',
      icon: 'Video',
      form_schema: [
        { id: 'tema_video', type: 'text', label_en: 'Video Topic', label_es: 'Tema del video', required: true },
        { id: 'gancho_inicial', type: 'text', label_en: 'Initial Hook (Optional)', label_es: 'Gancho inicial (Opcional)', required: false },
        { id: 'duracion_estimada', type: 'select', label_en: 'Duration', label_es: 'Duración', required: true,
          options: [
            { value: '15s', label_en: '15 seconds', label_es: '15 segundos' },
            { value: '30s', label_en: '30 seconds', label_es: '30 segundos' },
            { value: '60s', label_en: '60 seconds', label_es: '60 segundos' }
          ]
        },
        { id: 'estilo_video', type: 'text', label_en: 'Video Style', label_es: 'Estilo (Humor, Educativo, Directo)', required: true }
      ],
      prompt_template: `Actúa como un Guionista Viral de TikTok/Reels. Sabemos que los primeros 3 segundos lo son TODO.
      
      TEMA: {{tema_video}}
      GANCHO: {{gancho_inicial}}
      DURACIÓN: {{duracion_estimada}}
      ESTILO: {{estilo_video}}
      
      GENERA EL GUION:
      1. HOOK (0-3s): 3 opciones de ganchos visuales y de audio irresistibles.
      2. CUERPO: El contenido dividido por escenas/tiempos.
      3. CTA (Call to Action): Qué debe hacer el usuario al final.
      
      RECOMENDACIÓN: Sugiere qué música o tendencia actual encaja mejor con este guion.`
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
    // Pitch Deck and ROI Predictor are Business
    if (app.slug === 'pitch-deck-ai' || app.slug === 'agency-roi-bot') {
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

  console.log('\n✅ Micro-Apps de Agencias completadas con éxito.')
}

run()

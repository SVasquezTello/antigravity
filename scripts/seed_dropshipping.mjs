import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('📦 Seeding Premium Dropshipping & E-commerce Apps...')

  const apps = [
    {
      slug: 'drop-copy-killer',
      name_en: 'CopyKiller E-com',
      name_es: 'CopyKiller E-com',
      description_en: 'Generate high-converting product descriptions focusing on benefits and pain points.',
      description_es: 'Genera descripciones de producto de alta conversión enfocadas en beneficios y dolor del cliente.',
      icon: 'PenTool',
      form_schema: [
        { id: 'producto', type: 'text', label_es: 'Nombre del Producto', required: true },
        { id: 'caracteristicas', type: 'textarea', label_es: 'Características principales', required: true },
        { id: 'audiencia', type: 'text', label_es: 'Público objetivo (Ej: Madres, Deportistas)', required: true },
        { id: 'tono', type: 'text', label_es: 'Tono (Urgencia, Emocional, Lujoso)' }
      ],
      prompt_template: 'Eres un copywriter experto en E-commerce de respuesta directa. Crea una descripción de producto para {{producto}} dirigido a {{audiencia}}. Usa un tono {{tono}}. Incluye un título atractivo, 3 viñetas enfocadas en beneficios (basado en {{caracteristicas}}) y un llamado a la acción claro. No te centres solo en las características, céntrate en cómo mejora la vida del cliente.'
    },
    {
      slug: 'drop-ad-scripts',
      name_en: 'ViralAd Scripts',
      name_es: 'ViralAd Scripts',
      description_en: 'Generate viral video scripts for TikTok, Reels, and Facebook Ads.',
      description_es: 'Genera guiones de video virales para TikTok, Reels y Facebook Ads.',
      icon: 'Video',
      form_schema: [
        { id: 'producto', type: 'text', label_es: 'Producto a vender', required: true },
        { id: 'gancho', type: 'text', label_es: 'Ángulo/Gancho (Ej: Ahorra tiempo, Sorprende a todos)', required: true },
        { id: 'plataforma', type: 'text', label_es: 'Plataforma (TikTok, FB, Reels)', required: true }
      ],
      prompt_template: 'Actúa como un Media Buyer experto. Genera un guion para un anuncio de video de 30-45 segundos para {{plataforma}} vendiendo {{producto}} con el ángulo: {{gancho}}. El formato debe incluir:\n1. Un gancho visual y verbal para los primeros 3 segundos.\n2. Presentación del problema.\n3. El producto como solución.\n4. Call to Action fuerte. Especifica qué debe mostrarse en pantalla y qué debe decir el locutor.'
    },
    {
      slug: 'drop-supplier-nego',
      name_en: 'Supplier Negotiator',
      name_es: 'Supplier Negotiator',
      description_en: 'Professional English emails to negotiate with Chinese suppliers.',
      description_es: 'Correos en inglés profesional para negociar precios o resolver problemas con proveedores chinos.',
      icon: 'Globe2',
      form_schema: [
        { id: 'asunto', type: 'text', label_es: 'Asunto/Problema (Ej: Bajar MOQ, Retraso en envío)', required: true },
        { id: 'contexto', type: 'textarea', label_es: 'Contexto de la situación', required: true },
        { id: 'objetivo', type: 'text', label_es: 'Objetivo deseado', required: true }
      ],
      prompt_template: 'Eres un agente de importación y compras internacionales experto. Escribe un correo en inglés claro, directo y profesional dirigido a un proveedor asiático sobre el siguiente asunto: {{asunto}}. Contexto: {{contexto}}. El objetivo principal es: {{objetivo}}. Asegúrate de que el inglés sea fácil de entender para hablantes no nativos (sin modismos complicados), pero que transmita seriedad y profesionalismo. Incluye la versión en español al final.'
    },
    {
      slug: 'drop-competitor-x',
      name_en: 'CompetitorX',
      name_es: 'CompetitorX',
      description_en: 'Analyze competitor reviews to find marketing angles.',
      description_es: 'Analiza reseñas de la competencia para encontrar ángulos de venta únicos.',
      icon: 'Crosshair',
      form_schema: [
        { id: 'resenas_negativas', type: 'textarea', label_es: 'Pegar reseñas negativas de la competencia', required: true },
        { id: 'tu_producto', type: 'text', label_es: 'Tu producto/diferenciador', required: true }
      ],
      prompt_template: 'Analiza estas quejas de clientes de la competencia: {{resenas_negativas}}. Yo vendo {{tu_producto}}. Extrae los 3 dolores más grandes que la competencia no está resolviendo y propón 3 titulares (hooks) para mis anuncios que ataquen directamente esas debilidades, posicionando mi producto como la solución superior.'
    },
    {
      slug: 'drop-seo-pro',
      name_en: 'SEO Pro E-com',
      name_es: 'SEO Pro E-com',
      description_en: 'Optimize product titles, meta descriptions, and tags for Google Shopping/Search.',
      description_es: 'Optimiza títulos, meta descripciones y etiquetas para Shopify y Google Shopping.',
      icon: 'Search',
      form_schema: [
        { id: 'producto', type: 'text', label_es: 'Nombre base del producto', required: true },
        { id: 'keywords', type: 'text', label_es: 'Palabras clave principales', required: true }
      ],
      prompt_template: 'Actúa como un experto SEO en comercio electrónico. Para el producto "{{producto}}" con las palabras clave "{{keywords}}", genera:\n1. Un título de producto optimizado para SEO (máx 60 caracteres) que aumente el CTR.\n2. Una Meta Descripción persuasiva (máx 155 caracteres) que incluya un call to action.\n3. Una lista de 10 etiquetas (tags) relevantes para Shopify/WooCommerce.'
    },
    {
      slug: 'drop-tilbury-method',
      name_en: 'Tilbury Challenge Simulator',
      name_es: 'Tilbury Challenge Simulator',
      description_en: 'Execute the exact 7-day Mark Tilbury dropshipping challenge workflow using AI.',
      description_es: 'Ejecuta el flujo exacto de 7 días del reto dropshipping de Mark Tilbury guiado por IA.',
      icon: 'Target',
      form_schema: [
        { id: 'presupuesto', type: 'text', label_es: 'Presupuesto Inicial (Ej: $250)', required: true },
        { id: 'intereses', type: 'text', label_es: 'Tus Intereses/Nicho sugerido (Ej: Mascotas, Tecnología)', required: true },
        { id: 'paso_actual', type: 'text', label_es: 'Paso del reto (Ej: 1. Encontrar Nicho, 2. Marca, 3. Ads)', required: true }
      ],
      prompt_template: 'Eres un estratega de dropshipping experto, entrenado exactamente en el Método de 7 Días de Mark Tilbury. El usuario tiene un presupuesto de {{presupuesto}} y le interesa el nicho de {{intereses}}. Actualmente está en el paso: {{paso_actual}}. \n\nInstrucciones:\nSi el paso es "Encontrar Nicho": Usa el método "dummy scroll" e indica 3 ideas de productos rentables.\nSi el paso es "Marca": Sugiere 3 nombres de dominio .store y un prompt para generar el logo en Midjourney/Nanobanana.\nSi el paso es "Ads": Genera un guion UGC de 30s enfocado en el problema/solución.\nMantén un tono directo, motivador y puramente enfocado en rentabilidad rápida y bajo costo, tal como Mark Tilbury.'
    },
    {
      slug: 'drop-saenz-organic',
      name_en: 'Organic Dropship Strategist',
      name_es: 'Estratega Orgánico (Sáenz)',
      description_en: 'Generate organic TikTok strategies and viral hooks to sell products without ad spend.',
      description_es: 'Genera estrategias orgánicas para TikTok y ganchos virales para vender sin gastar en publicidad.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'producto', type: 'text', label_es: 'Producto a vender', required: true },
        { id: 'plataforma', type: 'text', label_es: 'Plataforma Principal (Ej: TikTok, Reels)', required: true },
        { id: 'presupuesto', type: 'text', label_es: 'Presupuesto Ads (Poner $0 para Orgánico)', required: true }
      ],
      prompt_template: 'Eres un experto en dropshipping orgánico, entrenado con el método de Adrián Sáenz. El usuario quiere vender {{producto}} en {{plataforma}} con un presupuesto de {{presupuesto}}. \nTu objetivo es darle una estrategia de contenido orgánico para hacerse viral sin pagar publicidad.\nGenera:\n1. 3 ideas de videos tipo "TikTok made me buy it" o "POV" para el producto.\n2. 3 ganchos (hooks) visuales y verbales para los primeros 3 segundos del video.\n3. Qué CTA (Call to Action) usar para llevar tráfico al link en la biografía.\nEnfócate en la consistencia y en crear contenido que la gente genuinamente quiera ver (no anuncios aburridos).'
    },
    {
      slug: 'drop-saenz-ads-scaler',
      name_en: 'Ad Metrics Analyzer',
      name_es: 'Analizador de Métricas Ads',
      description_en: 'Analyze your 48-hour testing metrics to decide whether to kill, tweak, or scale a product.',
      description_es: 'Analiza tus métricas tras 48 horas de prueba para decidir si apagar, ajustar o escalar una campaña.',
      icon: 'BarChart3',
      form_schema: [
        { id: 'presupuesto_gastado', type: 'text', label_es: 'Presupuesto gastado (Ej: $30)', required: true },
        { id: 'ctr', type: 'text', label_es: 'CTR (Click-Through Rate) en %', required: true },
        { id: 'cpa', type: 'text', label_es: 'CPA (Costo por Compra) / Ventas logradas', required: true }
      ],
      prompt_template: 'Eres un Media Buyer experto entrenado con las reglas de escalado de la academia de Adrián Sáenz. El usuario ha testeado un producto por 2 días. Gastó: {{presupuesto_gastado}}, tuvo un CTR de: {{ctr}}, y su resultado en ventas/CPA fue: {{cpa}}.\nRegla de oro: Si el CTR es > 1% y hay ventas rentables, se mantiene/escala. Si el CTR es < 1%, el anuncio falla. Si hay clics pero no ventas, la tienda falla.\nAnaliza fríamente estas métricas y dile al usuario exactamente qué hacer: 1) Matar la campaña, 2) Cambiar el creativo (video), o 3) Optimizar la tienda. Sé directo y analítico.'
    }
  ]

  const { data: offer } = await supabase.from('offers').select('id').eq('slug', 'professional').single()
  
  for (const app of apps) {
    const { data: newApp } = await supabase.from('micro_apps').upsert(app, { onConflict: 'slug' }).select('id').single()
    if (offer && newApp) {
      await supabase.from('offer_apps').upsert({ offer_id: offer.id, app_id: newApp.id }, { onConflict: 'offer_id,app_id' })
    }
  }

  console.log('✅ 5 Dropshipping & E-commerce Apps Seeded and Linked to Pro Plan.')
}

run()

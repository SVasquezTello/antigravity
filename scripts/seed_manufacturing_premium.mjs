import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🏭 Seeding Premium Manufacturing Apps...')

  const apps = [
    {
      slug: 'reactiva-factory-whatsapp',
      name_en: 'ReactivaFactory',
      name_es: 'ReactivaFactory',
      description_en: 'Reactivate customers who asked for a production quote and never confirmed.',
      description_es: 'Reactiva clientes que preguntaron por una cotización y nunca confirmaron.',
      icon: 'MessageSquare',
      form_schema: [
        { id: 'cliente', type: 'text', label_es: 'Nombre del cliente', required: true },
        { id: 'producto', type: 'text', label_es: 'Producto consultado', required: true },
        { id: 'volumen', type: 'text', label_es: 'Volumen estimado' },
        { id: 'dias', type: 'number', label_es: 'Días sin responder', required: true }
      ],
      prompt_template: 'Eres un experto en ventas industriales. El cliente {{cliente}} preguntó por la fabricación de {{producto}} (Volumen: {{volumen}}) hace {{dias}} días. Genera un mensaje suave y uno directo para cerrar la venta.'
    },
    {
      slug: 'upsell-factory-ia',
      name_en: 'UpsellFactory IA',
      name_es: 'UpsellFactory IA',
      description_en: 'Discover what else your customers need beyond the main production.',
      description_es: 'Descubre qué más necesita tu cliente además de la fabricación principal.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'producto_principal', type: 'text', label_es: 'Producto principal', required: true },
        { id: 'perfil', type: 'textarea', label_es: 'Perfil del cliente', required: true },
        { id: 'catalogo', type: 'textarea', label_es: 'Catálogo de servicios', required: true }
      ],
      prompt_template: 'Analiza el perfil {{perfil}} y el producto principal {{producto_principal}}. Basado en el catálogo {{catalogo}}, propón 3 oportunidades de venta adicional (mantenimiento, repuestos, empaque) y el guion comercial.'
    },
    {
      slug: 'opera-factory-checklist',
      name_en: 'OperaFactory',
      name_es: 'OperaFactory',
      description_en: 'Eliminate production chaos with coordinated operational checklists.',
      description_es: 'Elimina el caos en producción con checklists operativos coordinados.',
      icon: 'ClipboardCheck',
      form_schema: [
        { id: 'orden', type: 'text', label_es: 'Orden confirmada', required: true },
        { id: 'producto', type: 'text', label_es: 'Producto solicitado', required: true },
        { id: 'entrega', type: 'text', label_es: 'Fecha de entrega', required: true }
      ],
      prompt_template: 'Genera un checklist operativo completo para la orden {{orden}} de {{producto}} con fecha de entrega {{entrega}}. Incluye pasos para ventas, producción, almacén y despacho.'
    },
    {
      slug: 'decide-factory-analytics',
      name_en: 'DecideFactory',
      name_es: 'DecideFactory',
      description_en: 'Actionable operational decisions based on your plant numbers.',
      description_es: 'Toma decisiones operativas basadas en los números de tu planta.',
      icon: 'BarChart3',
      form_schema: [
        { id: 'reporte', type: 'textarea', label_es: 'Reporte operativo', required: true },
        { id: 'problema', type: 'text', label_es: 'Problema principal a analizar', required: true }
      ],
      prompt_template: 'Analiza el reporte {{reporte}} enfocado en {{problema}}. Entrega 3 decisiones accionables con justificación clara sobre utilidad y procesos.'
    },
    {
      slug: 'pulse-factory-dashboard',
      name_en: 'PulseFactory',
      name_es: 'PulseFactory',
      description_en: 'Know your plant status today without chasing everyone down.',
      description_es: 'Conoce el estado de tu planta hoy mismo mediante un semáforo operativo.',
      icon: 'Activity',
      form_schema: [
        { id: 'reporte_dia', type: 'textarea', label_es: 'Reporte del día', required: true },
        { id: 'meta', type: 'text', label_es: 'Meta esperada', required: true }
      ],
      prompt_template: 'Basado en el reporte {{reporte_dia}} y la meta {{meta}}, genera un semáforo operativo (Verde/Amarillo/Rojo) y las 3 acciones urgentes del día para la planta.'
    }
  ]

  const { data: plan } = await supabase.from('plans').select('id').eq('slug', 'professional').single()
  
  for (const app of apps) {
    const { data: newApp } = await supabase.from('micro_apps').upsert(app, { onConflict: 'slug' }).select('id').single()
    if (plan && newApp) {
      await supabase.from('plan_apps').upsert({ plan_id: plan.id, app_id: newApp.id }, { onConflict: 'plan_id,app_id' })
    }
  }

  console.log('✅ 5 Manufacturing Apps Seeded and Linked to Pro Plan.')
}

run()

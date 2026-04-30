import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const pymeApps = [
  {
    slug: 'reactiva-pyme',
    name_es: 'ReactivaPyme',
    name_en: 'ReactivaPyme',
    description_es: 'Reactiva clientes que dejaron de responder con el mensaje perfecto.',
    description_en: 'Reactivate leads that stopped responding with the perfect message.',
    icon: 'MessageCircle',
    form_schema: [
      { name: 'client_name', label_es: 'Nombre del cliente', label_en: 'Client Name', type: 'text', placeholder_es: 'Ej: Juan Pérez', placeholder_en: 'e.g. John Doe', required: true },
      { name: 'product', label_es: 'Servicio o producto consultado', label_en: 'Product/Service', type: 'text', placeholder_es: 'Ej: Diseño Web', placeholder_en: 'e.g. Web Design', required: true },
      { name: 'last_message', label_es: 'Último mensaje recibido', label_en: 'Last Message Received', type: 'textarea', placeholder_es: 'Pega aquí lo último que dijo...', placeholder_en: 'Paste the last thing they said...', required: true },
      { name: 'days_inactive', label_es: 'Días sin responder', label_en: 'Days Inactive', type: 'text', placeholder_es: 'Ej: 5', placeholder_en: 'e.g. 5', required: true },
      { name: 'budget', label_es: 'Presupuesto estimado', label_en: 'Estimated Budget', type: 'text', placeholder_es: 'Ej: $500', placeholder_en: 'e.g. $500', required: false }
    ],
    prompt_template: `Actúa como un experto en ventas y psicología del consumidor para PYMES. Tu objetivo es reactivar a un cliente potencial que ha dejado de responder.
    
    CLIENTE: {{client_name}}
    PRODUCTO: {{product}}
    DÍAS INACTIVO: {{days_inactive}}
    ÚLTIMO CONTACTO: {{last_message}}
    
    Genera 3 opciones de respuesta:
    1. MENSAJE SUAVE: Enfocado en servicio y curiosidad.
    2. MENSAJE DIRECTO: Enfocado en escasez o resolución de dudas.
    3. RECOMENDACIÓN: Explica por qué elegirías uno sobre el otro basado en el contexto.
    
    Formato: Markdown profesional con negritas.`
  },
  {
    slug: 'upsell-pyme',
    name_es: 'UpsellPyme IA',
    name_en: 'UpsellPyme AI',
    description_es: 'Descubre oportunidades de venta adicional para clientes que ya te compraron.',
    description_en: 'Discover upsell opportunities for customers who already bought from you.',
    icon: 'Target',
    form_schema: [
      { name: 'main_product', label_es: 'Producto principal que compró', label_en: 'Main Product Bought', type: 'text', placeholder_es: 'Ej: Curso básico', required: true },
      { name: 'client_profile', label_es: 'Perfil del cliente', label_en: 'Client Profile', type: 'textarea', placeholder_es: 'Ej: Empresa de logística pequeña', required: true },
      { name: 'history', label_es: 'Historial de compras', label_en: 'Purchase History', type: 'textarea', placeholder_es: '¿Qué más ha comprado?', required: false },
      { name: 'catalog', label_es: 'Catálogo disponible', label_en: 'Available Catalog', type: 'textarea', placeholder_es: 'Lista de otros servicios/productos', required: true }
    ],
    prompt_template: `Eres un consultor estratégico de crecimiento (Growth Hacker) para PYMES. Analiza el perfil del cliente y lo que ya compró para maximizar el LTV (Life Time Value).
    
    PRODUCTO COMPRADO: {{main_product}}
    PERFIL: {{client_profile}}
    CATÁLOGO DISPONIBLE: {{catalog}}
    
    Entrega:
    - 3 OPORTUNIDADES DE VENTA: (Cross-sell o Upsell) justificando por qué le sirven ahora.
    - ARGUMENTO COMERCIAL: Cómo presentarlo para que no parezca una venta forzada.
    - MENSAJE LISTO: Un script de WhatsApp/Email persuasivo.`
  },
  {
    slug: 'opera-pyme',
    name_es: 'OperaPyme',
    name_en: 'OperaPyme',
    description_es: 'Checklist operativo inteligente para que nada falle tras la venta.',
    description_en: 'Smart operational checklist to ensure zero post-sale failures.',
    icon: 'ClipboardList',
    form_schema: [
      { name: 'order_info', label_es: 'Pedido / Servicio confirmado', label_en: 'Order / Service Info', type: 'text', required: true },
      { name: 'deadline', label_es: 'Fecha prometida de entrega', label_en: 'Deadline', type: 'text', required: true },
      { name: 'responsible', label_es: 'Responsable asignado', label_en: 'Responsible Person', type: 'text', required: true },
      { name: 'notes', label_es: 'Observaciones especiales', label_en: 'Special Notes', type: 'textarea', required: false }
    ],
    prompt_template: `Eres un experto en procesos y Customer Success. El cliente ya pagó, ahora la ejecución debe ser impecable.
    
    PEDIDO: {{order_info}}
    FECHA: {{deadline}}
    NOTAS: {{notes}}
    
    Genera un CHECKLIST OPERATIVO dividido en:
    1. VENTAS: (Confirmación y bienvenida).
    2. ATENCIÓN: (Comunicación de progreso).
    3. OPERACIÓN: (Pasos técnicos críticos).
    4. ENTREGA: (Control de calidad y cierre).`
  },
  {
    slug: 'decide-pyme',
    name_es: 'DecidePyme',
    name_en: 'DecidePyme',
    description_es: 'Transforma reportes aburridos en decisiones de negocio que dan dinero.',
    description_en: 'Transform boring reports into business decisions that make money.',
    icon: 'TrendingUp',
    form_schema: [
      { name: 'report', label_es: 'Resumen del reporte comercial', label_en: 'Commercial Report Summary', type: 'textarea', placeholder_es: 'Pega aquí tus números...', required: true },
      { name: 'main_problem', label_es: 'Problema principal que percibes', label_en: 'Main Perceived Problem', type: 'text', required: true },
      { name: 'area', label_es: 'Área a analizar', label_en: 'Area to Analyze', type: 'select', options: [
        { value: 'ventas', label_es: 'Ventas', label_en: 'Sales' },
        { value: 'marketing', label_es: 'Marketing', label_en: 'Marketing' },
        { value: 'costos', label_es: 'Costos/Margen', label_en: 'Costs/Margin' }
      ], required: true }
    ],
    prompt_template: `Actúa como un CFO y Director Comercial. No quiero más datos, quiero DECISIONES.
    
    REPORTE: {{report}}
    PROBLEMA: {{main_problem}}
    ÁREA: {{area}}
    
    Genera:
    - 3 DECISIONES ACCIONABLES: Qué hacer mañana mismo.
    - JUSTIFICACIÓN: Por qué esta decisión basándote en los datos.
    - RIESGO: Qué pasa si no se hace.`
  },
  {
    slug: 'pulse-pyme',
    name_es: 'PulsePyme',
    name_en: 'PulsePyme',
    description_es: 'Semáforo operativo diario para el dueño del negocio.',
    description_en: 'Daily operational traffic light for the business owner.',
    icon: 'Zap',
    form_schema: [
      { name: 'daily_report', label_es: 'Reporte del día', label_en: 'Daily Report', type: 'textarea', required: true },
      { name: 'goal', label_es: 'Meta esperada', label_en: 'Expected Goal', type: 'text', required: true },
      { name: 'incidents', label_es: 'Incidencias / Problemas', label_en: 'Incidents/Problems', type: 'textarea', required: false },
      { name: 'manager_comments', label_es: 'Comentarios del encargado', label_en: 'Manager Comments', type: 'textarea', required: false }
    ],
    prompt_template: `Eres el Asistente Ejecutivo del Dueño. Resume el pulso del negocio hoy.
    
    REPORTE: {{daily_report}}
    META: {{goal}}
    INCIDENCIAS: {{incidents}}
    
    Genera:
    - SEMÁFORO OPERATIVO: (🟢 TODO BIEN, 🟡 ATENCIÓN, 🔴 URGENTE).
    - RESUMEN EJECUTIVO: (3 puntos clave).
    - ACCIONES URGENTES: Qué debe revisar el dueño ahora mismo.`
  }
]

async function seed() {
  console.log('🚀 Corrigiendo y re-cargando PYME Apps...')

  for (const app of pymeApps) {
    console.log(`Processing ${app.name_es}...`)
    
    const { data: inserted, error } = await supabase.from('micro_apps').upsert(app, { onConflict: 'slug' }).select().single()
    
    if (error) {
       console.error(`Error upserting ${app.slug}:`, error.message)
       continue
    }

    // Link to Professional and Enterprise offers
    const { data: offers } = await supabase.from('offers').select('id').in('slug', ['professional', 'enterprise'])
    if (offers) {
      for (const offer of offers) {
        const { error: linkError } = await supabase.from('offer_apps').upsert({ offer_id: offer.id, app_id: inserted.id }, { onConflict: 'offer_id, app_id' })
        if (linkError) console.error(`Error linking ${app.slug} to ${offer.id}:`, linkError.message)
      }
    }
  }

  console.log('✅ Seeding corregido y completado.')
}

seed()

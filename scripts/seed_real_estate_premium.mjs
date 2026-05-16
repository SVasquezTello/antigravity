import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🏠 Seeding Premium Real Estate (Inmobiliaria) Apps...')

  const apps = [
    {
      slug: 'reactiva-inmo-whatsapp',
      name_en: 'ReactivaInmo',
      name_es: 'ReactivaInmo',
      description_en: 'Reactivate leads who inquired about a property and disappeared.',
      description_es: 'Reactiva prospectos que preguntaron por una propiedad y desaparecieron.',
      icon: 'MessageSquare',
      form_schema: [
        { id: 'prospecto', type: 'text', label_es: 'Nombre del interesado', required: true },
        { id: 'propiedad', type: 'text', label_es: 'Propiedad consultada', required: true },
        { id: 'presupuesto', type: 'text', label_es: 'Presupuesto/Perfil' },
        { id: 'dias', type: 'number', label_es: 'Días sin responder', required: true }
      ],
      prompt_template: 'Eres un Closer Inmobiliario de lujo. El interesado {{prospecto}} preguntó por {{propiedad}} hace {{dias}} días. Genera un mensaje de WhatsApp elegante que despierte el interés de nuevo, enfocándote en la escasez o en una propiedad similar que acaba de entrar.'
    },
    {
      slug: 'upsell-inmo-ia',
      name_en: 'UpsellInmo IA',
      name_es: 'UpsellInmo IA',
      description_en: 'Offer extra services or premium upgrades to your property clients.',
      description_es: 'Ofrece servicios extra o mejoras premium a tus clientes inmobiliarios.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'operacion_principal', type: 'text', label_es: 'Operación principal (Venta/Alquiler)', required: true },
        { id: 'perfil', type: 'textarea', label_es: 'Perfil del cliente', required: true },
        { id: 'catalogo', type: 'textarea', label_es: 'Servicios extra (Seguros, Reformas, Gestión)', required: true }
      ],
      prompt_template: 'Analiza el perfil {{perfil}} y la operación {{operacion_principal}}. Basado en el catálogo {{catalogo}}, propón 3 oportunidades de venta adicional (seguros de impago, gestión de reformas, mudanza) y el guion de venta.'
    },
    {
      slug: 'opera-inmo-checklist',
      name_en: 'OperaInmo',
      name_es: 'OperaInmo',
      description_en: 'Never lose a closing due to lack of documentation or coordination.',
      description_es: 'Nunca pierdas un cierre por falta de documentos o coordinación.',
      icon: 'ClipboardCheck',
      form_schema: [
        { id: 'operacion', type: 'text', label_es: 'Tipo de cierre (Reserva/Arras/Contrato)', required: true },
        { id: 'propiedad', type: 'text', label_es: 'Propiedad', required: true },
        { id: 'fecha', type: 'text', label_es: 'Fecha objetivo', required: true }
      ],
      prompt_template: 'Genera un checklist operativo completo para el cierre de {{operacion}} de la propiedad {{propiedad}} con fecha {{fecha}}. Incluye pasos para captación, legal, financiero y entrega de llaves.'
    },
    {
      slug: 'decide-inmo-analytics',
      name_en: 'DecideInmo',
      name_es: 'DecideInmo',
      description_en: 'Actionable investment decisions based on property yields and market data.',
      description_es: 'Toma decisiones de inversión basadas en rentabilidad y datos de mercado.',
      icon: 'BarChart3',
      form_schema: [
        { id: 'reporte', type: 'textarea', label_es: 'Reporte de cartera/zona', required: true },
        { id: 'objetivo', type: 'text', label_es: 'Objetivo (Venta rápida/Alta rentabilidad)', required: true }
      ],
      prompt_template: 'Analiza el reporte {{reporte}} enfocado en {{objetivo}}. Entrega 3 decisiones accionables con justificación clara sobre precios de cierre, demanda en la zona y rentabilidad estimada.'
    },
    {
      slug: 'pulse-inmo-dashboard',
      name_en: 'PulseInmo',
      name_es: 'PulseInmo',
      description_en: 'Know your agency health in seconds without chasing agents.',
      description_es: 'Conoce el estado de tu agencia hoy mismo mediante un semáforo operativo.',
      icon: 'Activity',
      form_schema: [
        { id: 'reporte_dia', type: 'textarea', label_es: 'Reporte del día (Visitas, Reservas, Leads)', required: true },
        { id: 'meta', type: 'text', label_es: 'Meta mensual', required: true }
      ],
      prompt_template: 'Basado en el reporte {{reporte_dia}} y la meta {{meta}}, genera un semáforo operativo (Verde/Amarillo/Rojo) y las 3 acciones urgentes del día para la inmobiliaria (ej: llamar a X leads, cerrar X reserva).'
    }
  ]

  const { data: offer } = await supabase.from('offers').select('id').eq('slug', 'professional').single()
  
  for (const app of apps) {
    const { data: newApp } = await supabase.from('micro_apps').upsert(app, { onConflict: 'slug' }).select('id').single()
    if (offer && newApp) {
      await supabase.from('offer_apps').upsert({ offer_id: offer.id, app_id: newApp.id }, { onConflict: 'offer_id,app_id' })
    }
  }

  console.log('✅ 5 Real Estate Apps Seeded and Linked to Pro Plan.')
}

run()

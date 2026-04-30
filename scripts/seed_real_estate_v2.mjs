import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🏠 Cargando Ecosistema Inmobiliario: PropertyLoop & Co...')

  const apps = [
    {
      slug: 'reactiva-home',
      name_es: 'ReactivaHome',
      name_en: 'ReactivaHome',
      description_es: 'Ese cliente no desapareció. Solo necesita el mensaje correcto.',
      description_en: 'That client didn\'t disappear. They just need the right message.',
      icon: 'MessageSquare',
      form_schema: [
        { id: 'nombre_cliente', type: 'text', label_es: 'Nombre del cliente', label_en: 'Client Name', required: true },
        { id: 'propiedad', type: 'text', label_es: 'Propiedad consultada', label_en: 'Property viewed', required: true },
        { id: 'presupuesto', type: 'text', label_es: 'Presupuesto estimado', label_en: 'Estimated Budget', required: true },
        { id: 'fecha_consulta', type: 'text', label_es: 'Fecha de consulta', label_en: 'Query Date', required: true },
        { id: 'ultimo_mensaje', type: 'textarea', label_es: 'Último mensaje recibido', label_en: 'Last message received', required: true },
        { id: 'dias_inactivo', type: 'text', label_es: 'Días sin responder', label_en: 'Days inactive', required: true }
      ],
      prompt_template: `Actúa como especialista en reactivación de leads inmobiliarios.
      Datos del lead: {{nombre_cliente}}
      Consulta: {{propiedad}}
      Días en silencio: {{dias_inactivo}}
      Último contacto: {{ultimo_mensaje}}
      
      Genera exactamente:
      1. MENSAJE SUAVE: Enfocado en servicio y ayuda técnica.
      2. MENSAJE DIRECTO: Enfocado en urgencia o nueva propiedad similar.
      3. RECOMENDACIÓN: Explica cuál usar según el tono del último mensaje.`
    },
    {
      slug: 'upsell-home',
      name_es: 'UpsellHome IA',
      name_en: 'UpsellHome IA',
      description_es: 'Si no compra esa propiedad, descubre cuál sí.',
      description_en: 'If they don\'t buy that property, find out which one will.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'propiedad_base', type: 'text', label_es: 'Propiedad consultada', label_en: 'Consulted Property', required: true },
        { id: 'perfil', type: 'text', label_es: 'Perfil del cliente', label_en: 'Client Profile', required: true },
        { id: 'presupuesto_real', type: 'text', label_es: 'Presupuesto real', label_en: 'Real Budget', required: true },
        { id: 'historial', type: 'textarea', label_es: 'Historial de interés', label_en: 'Interest History', required: true },
        { id: 'catalogo', type: 'textarea', label_es: 'Catálogo disponible', label_en: 'Available Catalog', required: true }
      ],
      prompt_template: `Eres el estratega de ventas inmobiliarias. Analiza al cliente {{perfil}} con presupuesto {{presupuesto_real}}.
      Sugiere las 3 mejores opciones del catálogo: {{catalogo}} que superen o complementen a {{propiedad_base}}.
      Para cada una entrega: 
      - Por qué le conviene.
      - Argumento comercial demoledor.
      - Guion para enviar por WhatsApp.`
    },
    {
      slug: 'visita-home',
      name_es: 'VisitaHome',
      name_en: 'VisitaHome',
      description_es: 'Nunca más una visita perdida.',
      description_en: 'Never lose a property visit again.',
      icon: 'Calendar',
      form_schema: [
        { id: 'cliente', type: 'text', label_es: 'Nombre del cliente', label_en: 'Client Name', required: true },
        { id: 'propiedad', type: 'text', label_es: 'Propiedad a visitar', label_en: 'Property to visit', required: true },
        { id: 'fecha_hora', type: 'text', label_es: 'Fecha y hora', label_en: 'Date and Time', required: true },
        { id: 'asesor', type: 'text', label_es: 'Asesor asignado', label_en: 'Assigned Agent', required: true },
        { id: 'notas', type: 'textarea', label_es: 'Observaciones especiales', label_en: 'Special Notes', required: false }
      ],
      prompt_template: `Genera un protocolo de visita infalible para {{propiedad}}.
      1. CHECKLIST ASESOR: 5 cosas que debe traer y saber {{asesor}}.
      2. MENSAJE PROPIETARIO: Texto para confirmar acceso y evitar fricciones.
      3. MENSAJE CLIENTE: Recordatorio elegante con ubicación y beneficios de la zona.`
    },
    {
      slug: 'decide-home',
      name_es: 'DecideHome',
      name_en: 'DecideHome',
      description_es: 'Tus números deben decirte dónde está el dinero.',
      description_en: 'Your numbers should tell you where the money is.',
      icon: 'BarChart2',
      form_schema: [
        { id: 'reporte', type: 'textarea', label_es: 'Reporte comercial', label_en: 'Sales Report', required: true },
        { id: 'problema', type: 'text', label_es: 'Problema principal', label_en: 'Main problem', required: true },
        { id: 'area', type: 'select', label_es: 'Área a analizar', label_en: 'Analysis area', options_es: ['Publicidad', 'Inversión', 'Ventas', 'Alquileres'], options_en: ['Ads', 'Investment', 'Sales', 'Rentals'], required: true },
        { id: 'contexto', type: 'textarea', label_es: 'Contexto relevante', label_en: 'Relevant context', required: true }
      ],
      prompt_template: `Actúa como Consultor de Inversión Inmobiliaria. Analiza: {{reporte}}.
      Presenta 3 decisiones accionables basadas en datos. 
      Cada una con: Decisión, Justificación Numérica y Primer paso (48h).`
    },
    {
      slug: 'pulse-home',
      name_es: 'PulseHome',
      name_en: 'PulseHome',
      description_es: 'Sabe cómo va tu inmobiliaria hoy sin llamar a nadie.',
      description_en: 'Know how your real estate is doing today without calling anyone.',
      icon: 'Activity',
      form_schema: [
        { id: 'reporte_dia', type: 'textarea', label_es: 'Reporte del día', label_en: 'Daily Report', required: true },
        { id: 'meta', type: 'text', label_es: 'Meta esperada', label_en: 'Expected Goal', required: true },
        { id: 'incidencias', type: 'textarea', label_es: 'Incidencias', label_en: 'Incidents', required: true }
      ],
      prompt_template: `Genera el SEMÁFORO OPERATIVO de la inmobiliaria.
      Datos: {{reporte_dia}} vs Meta: {{meta}}.
      - Estatus: 🟢, 🟡 o 🔴.
      - Alerta Crítica: Lo que el dueño debe saber ya.
      - Acción Urgente: Qué corregir antes de cerrar el día.`
    },
    {
      slug: 'property-loop',
      name_es: 'PropertyLoop',
      name_en: 'PropertyLoop',
      description_es: 'Desde el primer mensaje hasta la firma del contrato. El ecosistema inmobiliario definitivo.',
      description_en: 'From the first message to the signing of the contract. The ultimate real estate ecosystem.',
      icon: 'RefreshCw',
      form_schema: [
        { id: 'nombre_inmo', type: 'text', label_es: 'Inmobiliaria', label_en: 'Real Estate Name', required: true },
        { id: 'retos', type: 'textarea', label_es: 'Retos principales (leads fríos, visitas vacías)', label_en: 'Main challenges', required: true }
      ],
      prompt_template: `Diseña la estrategia maestra PropertyLoop para {{nombre_inmo}}.
      Enfócate en resolver estos dolores: {{retos}}.
      Crea un flujo de 3 etapas: 
      1. Captación y Reactivación.
      2. Optimización de Visitas.
      3. Control de Cierre por Agentic AI.`
    }
  ]

  const { data: plans } = await supabase.from('plans').select('id, slug')
  const proPlan = plans.find(p => p.slug === 'professional' || p.slug === 'pro')
  const multiPlan = proPlan || plans[0]

  for (const app of apps) {
    console.log(`> Cargando ${app.slug}...`)
    const { data: inserted, error } = await supabase.from('micro_apps').upsert(app, { onConflict: 'slug' }).select('id').single()
    if (!error && inserted && multiPlan) {
      await supabase.from('plan_apps').upsert({ plan_id: multiPlan.id, app_id: inserted.id }, { onConflict: 'plan_id,app_id' })
    }
  }

  console.log('✅ Sector Inmobiliario PropertyLoop cargado con éxito.')
}

run()

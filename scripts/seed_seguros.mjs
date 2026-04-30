import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('🛡️ Sobrescribiendo Micro-Apps para Seguros con especificaciones de venta...')

  const apps = [
    {
      slug: 'reactiva-seguro',
      name_en: 'ReactivaInsurance',
      name_es: 'ReactivaSeguro',
      description_en: 'That client didn\'t disappear. They just need the right message.',
      description_es: 'Ese cliente no desapareció. Solo necesita el mensaje correcto.',
      icon: 'MessageSquare',
      form_schema: [
        { id: 'cliente', type: 'text', label_en: 'Client Name', label_es: 'Nombre del cliente', required: true },
        { id: 'tipo_seguro', type: 'text', label_en: 'Insurance Type Quoted', label_es: 'Tipo de seguro consultado', required: true },
        { id: 'presupuesto', type: 'text', label_en: 'Estimated Budget', label_es: 'Presupuesto estimado', required: true },
        { id: 'fecha_cotizacion', type: 'text', label_en: 'Quote Date', label_es: 'Fecha de cotización', required: true },
        { id: 'ultimo_mensaje', type: 'textarea', label_en: 'Last Message Received', label_es: 'Último mensaje recibido', required: true },
        { id: 'dias_sin_responder', type: 'text', label_en: 'Days without response', label_es: 'Días sin responder', required: true }
      ],
      prompt_template: `Actúa como un cerrador experto de seguros. Tu cliente {{cliente}} cotizó un {{tipo_seguro}} hace {{dias_sin_responder}} días.
Su último mensaje fue: "{{ultimo_mensaje}}".

Genera dos opciones de seguimiento para WhatsApp:

1. VERSIÓN SUAVE (Protección y Cuidado):
Enfocada en que el seguro no es un gasto, sino la tranquilidad de su familia. No vendas precio, vende "dormir tranquilo".

2. VERSIÓN DIRECTA (Urgencia/Vencimiento):
"Vimos que su cotización de {{tipo_seguro}} sigue pendiente. Las tarifas cambian mensualmente y queremos respetarle el precio de \${{presupuesto}}. ¿Le ayudamos con la emisión hoy?".

RECOMENDACIÓN: Sugiere cuál de las dos usar según "{{ultimo_mensaje}}".`
    },
    {
      slug: 'upsell-seguro-ai',
      name_en: 'UpsellInsurance AI',
      name_es: 'UpsellSeguro AI',
      description_en: 'They already bought a policy. Now discover what else they need.',
      description_es: 'Ya compró una póliza. Ahora descubre qué más necesita.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'poliza_vendida', type: 'text', label_en: 'Main Policy Sold', label_es: 'Póliza principal vendida', required: true },
        { id: 'perfil_cliente', type: 'text', label_en: 'Client Profile', label_es: 'Perfil del cliente', required: true },
        { id: 'historial', type: 'textarea', label_en: 'Insurance History', label_es: 'Historial de seguros', required: false },
        { id: 'presupuesto', type: 'text', label_en: 'Estimated Budget', label_es: 'Presupuesto estimado', required: true },
        { id: 'catalogo', type: 'textarea', label_en: 'Available Catalog', label_es: 'Catálogo de productos disponibles', required: true }
      ],
      prompt_template: `Eres un estratega de Cross-Selling en Seguros. El cliente tiene {{poliza_vendida}} y es {{perfil_cliente}}.

Basado en el catálogo {{catalogo}}:
1. DETECTA LOS 3 UPSELLS MAS PROBABLES: Qué pólizas complementan su estilo de vida.
2. ARGUMENTO COMERCIAL: El "Por qué ahora".
3. MENSAJE LISTO PARA VENTA: Guion para enviarle por WhatsApp o decirle en llamada.

"Usted ya protege su auto, pero ¿quién protege su fuente de ingresos?".`
    },
    {
      slug: 'renueva-seguro',
      name_en: 'RenewInsurance',
      name_es: 'RenuevaSeguro',
      description_en: 'Never again a policy expired by oversight.',
      description_es: 'Nunca más una póliza vencida por olvido.',
      icon: 'RefreshCw',
      form_schema: [
        { id: 'cliente', type: 'text', label_en: 'Client Name', label_es: 'Nombre del cliente', required: true },
        { id: 'tipo_poliza', type: 'text', label_en: 'Policy Type', label_es: 'Tipo de póliza', required: true },
        { id: 'fecha_vencimiento', type: 'text', label_en: 'Expiry Date', label_es: 'Fecha de vencimiento', required: true },
        { id: 'ultima_renovacion', type: 'text', label_en: 'Last Renewal', label_es: 'Último renovación', required: true },
        { id: 'historial', type: 'textarea', label_en: 'Customer History', label_es: 'Historial del cliente', required: false },
        { id: 'canal', type: 'text', label_en: 'Preferred Channel', label_es: 'Canal preferido', required: true }
      ],
      prompt_template: `Actúa como un Especialista en Retención de Seguros. La póliza de {{tipo_poliza}} de {{cliente}} vence el {{fecha_vencimiento}}.

Genera una ESTRATEGIA DE RENOVACIÓN AUTOMÁTICA:
1. MENSAJE PREVENTIVO (30 días antes): Enfocado en la continuidad de la protección.
2. MENSAJE URGENTE (7 días antes): Enfocado en el riesgo de quedar descubierto.
3. MEJOR MOMENTO PARA CONTACTAR: Basado en el perfil.

Asegura que el cliente sienta que el corredor está cuidando su espalda.`
    },
    {
      slug: 'decide-seguro',
      name_en: 'InsuranceDecision',
      name_es: 'DecideSeguro',
      description_en: 'Your numbers should tell you where the commission is.',
      description_es: 'Tus números deben decirte dónde está la comisión.',
      icon: 'BarChart',
      form_schema: [
        { id: 'reporte', type: 'textarea', label_en: 'Commercial Report', label_es: 'Reporte comercial', required: true },
        { id: 'problema', type: 'text', label_en: 'Main Problem', label_es: 'Principal problema', required: true },
        { id: 'area', type: 'text', label_en: 'Area to Analyze', label_es: 'Área a analizar', required: true },
        { id: 'contexto', type: 'textarea', label_en: 'Relevant Context', label_es: 'Contexto relevante', required: false }
      ],
      prompt_template: `Eres un Analista de Negocios para Agencias de Seguros.
Reporte: {{reporte}}
Problema: {{problema}} en {{area}}.

Entrega un reporte de DECISIONES RENTABLES:
1. ANÁLISIS NUMÉRICO: Dónde está la fuga de dinero o comisiones.
2. 3 DECISIONES ACCIONABLES: Qué debe hacer el dueño (Ej: "Cambiar de ramo", "Reentrenar al asesor X").
3. JUSTIFICACIÓN: Por qué esta decisión mejora el margen del negocio.

Tono: Profesional, directo y orientado a comisiones.`
    },
    {
      slug: 'pulse-seguro',
      name_en: 'InsurancePulse',
      name_es: 'PulseSeguro',
      description_en: 'Know how your agency is doing today without calling anyone.',
      description_es: 'Sabe cómo va tu agencia hoy sin llamar a nadie.',
      icon: 'Activity',
      form_schema: [
        { id: 'reporte_dia', type: 'textarea', label_en: 'Daily Report', label_es: 'Reporte del día', required: true },
        { id: 'meta', type: 'text', label_en: 'Expected Goal', label_es: 'Meta esperada', required: true },
        { id: 'incidencias', type: 'textarea', label_en: 'Incidents', label_es: 'Incidencias', required: false },
        { id: 'ventas', type: 'text', label_en: 'Total Sales', label_es: 'Ventas realizadas', required: true },
        { id: 'comentarios', type: 'textarea', label_en: 'Staff Comments', label_es: 'Comentarios del encargado', required: false }
      ],
      prompt_template: `Eres el Auditor Senior de la agencia de seguros.

Ventas: {{ventas}} vs Meta: {{meta}}
Incidencias: {{incidencias}}
Reporte día: {{reporte_dia}}

Genera el SEMÁFORO OPERATIVO:
- ESTADO: 🟢, 🟡 o 🔴.
- ACCIONES URGENTES: Pólizas que se van a vencer hoy, reclamos de siniestros sin atender.
- RESUMEN EJECUTIVO: Lo que el dueño necesita saber en 30 segundos.`
    },
    {
      slug: 'secure-loop',
      name_en: 'SecureLoop Premium',
      name_es: 'SecureLoop',
      description_en: 'From the quote to the automatic renewal. The complete insurance management system.',
      description_es: 'Desde la cotización hasta la renovación automática. El sistema completo de gestión de seguros.',
      icon: 'Shield',
      form_schema: [
        { id: 'agencia_nombre', type: 'text', label_en: 'Agency Name', label_es: 'Nombre de la agencia', required: true },
        { id: 'fase', type: 'select', label_en: 'Growth Focus', label_es: 'Enfoque de crecimiento', required: true,
          options: [
            { value: 'cotizacion', label_en: 'Quote Recovery', label_es: 'Recuperación de Cotizaciones' },
            { value: 'renovacion', label_en: 'Renewal Retention', label_es: 'Retención de Renovaciones' },
            { value: 'ventas_nuevas', label_en: 'New Sales Scaling', label_es: 'Escalado de Ventas Nuevas' }
          ]
        }
      ],
      prompt_template: `Eres el estratega de "SecureLoop".

Agencia: {{agencia_nombre}}
Enfoque: {{fase}}

Desarrolla el plan SecureLoop:
- ESTRATEGIA DE FLUJO: Cómo integrar las micro-apps en la rutina semanal.
- TÉCNICA DE REFERIDOS: Método para obtener 3 referidos por cada póliza emitida.
- MÉTRICA ESTRELLA: El número que dictará si la agencia crece en residuales.

"Desde la cotización hasta la renovación automática."`
    }
  ]

  // Fetch plans
  const { data: plans, error: planError } = await supabase.from('plans').select('id, slug')
  if (planError) { console.error('Error fetching plans:', planError); return }

  const proPlan = plans.find(p => p.slug === 'professional' || p.slug === 'pro')
  const businessPlan = plans.find(p => p.slug === 'business' || p.slug === 'enterprise')

  for (const app of apps) {
    const appId = crypto.randomUUID()
    console.log(`Inserting/Updating app: ${app.slug}...`)

    const { error: appError } = await supabase.from('micro_apps').upsert({
      slug: app.slug, name_en: app.name_en, name_es: app.name_es,
      description_en: app.description_en, description_es: app.description_es,
      icon: app.icon, form_schema: app.form_schema, prompt_template: app.prompt_template
    }, { onConflict: 'slug' })

    if (appError) { console.error(`Error in ${app.slug}:`, appError.message); continue }

    const { data: currentApp } = await supabase.from('micro_apps').select('id').eq('slug', app.slug).single()

    let targetPlan = proPlan
    if (app.slug === 'secure-loop' || app.slug === 'decide-seguro') targetPlan = businessPlan || proPlan

    if (targetPlan && currentApp) {
      const { data: existingLink } = await supabase.from('plan_apps').select('*')
        .eq('plan_id', targetPlan.id).eq('app_id', currentApp.id).single()
      if (!existingLink) {
        await supabase.from('plan_apps').insert({ plan_id: targetPlan.id, app_id: currentApp.id })
      }
    }
  }

  console.log('\n✅ Vertical de Seguros REFINADA y lista para vender.')
}

run()

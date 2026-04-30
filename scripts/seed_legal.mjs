import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('⚖️ Seeding Micro-Apps para Despachos de Abogados y Firmas Legales...')

  const apps = [
    {
      slug: 'reactiva-cliente-legal',
      name_en: 'ReactivaCliente Legal',
      name_es: 'ReactivaCliente Legal',
      description_en: 'That prospect who ghosted you after the consultation is still your best lead.',
      description_es: 'Reactiva prospectos que pidieron consulta pero no contrataron y clientes con casos nuevos.',
      icon: 'UserCheck',
      form_schema: [
        { id: 'nombre', type: 'text', label_en: 'Client / Prospect Name', label_es: 'Nombre del cliente o prospecto', required: true },
        { id: 'area_legal', type: 'select', label_en: 'Legal Area', label_es: 'Área legal del asunto', required: true,
          options: [
            { value: 'civil', label_en: 'Civil Law', label_es: 'Derecho Civil (contratos, deudas, daños)' },
            { value: 'familiar', label_en: 'Family Law', label_es: 'Derecho Familiar (divorcio, custodia, herencia)' },
            { value: 'laboral', label_en: 'Labor Law', label_es: 'Derecho Laboral (despido, liquidación, acoso)' },
            { value: 'penal', label_en: 'Criminal Law', label_es: 'Derecho Penal (defensa, denuncia)' },
            { value: 'corporativo', label_en: 'Corporate / Business Law', label_es: 'Derecho Corporativo / Empresarial' },
            { value: 'inmobiliario', label_en: 'Real Estate Law', label_es: 'Derecho Inmobiliario / copropiedades' },
            { value: 'migratorio', label_en: 'Immigration Law', label_es: 'Derecho Migratorio' }
          ]
        },
        { id: 'dias_frio', type: 'text', label_en: 'Days Without Response', label_es: 'Días sin respuesta desde el contacto inicial', required: true },
        { id: 'situacion', type: 'textarea', label_en: 'Summary of Their Legal Situation', label_es: 'Resumen breve de la situación legal del prospecto', required: true,
          placeholder_es: 'Ej: Fue despedido sin liquidación, tiene audiencia próxima, firmó contrato con cláusulas abusivas...'
        },
        { id: 'objecion', type: 'select', label_en: 'Assumed Objection', label_es: 'Objeción que pausó la contratación', required: true,
          options: [
            { value: 'honorarios', label_en: 'Fees too high', label_es: 'Honorarios muy altos' },
            { value: 'ya_resolvio', label_en: 'Thinks they resolved it alone', label_es: 'Cree que ya se resolvió solo' },
            { value: 'otro_abogado', label_en: 'Looking at other attorneys', label_es: 'Está evaluando otros abogados' },
            { value: 'desconfianza', label_en: 'Trust issue', label_es: 'Desconfianza o miedo al proceso' },
            { value: 'desconocida', label_en: 'Unknown', label_es: 'Desconocida' }
          ]
        }
      ],
      prompt_template: `Actúa como el Socio Director de un despacho de abogados de alto perfil, experto en convertir prospectos indecisos en clientes leales.

Cliente/Prospecto: {{nombre}}
Área legal: {{area_legal}}
Situación: {{situacion}}
Días sin respuesta: {{dias_frio}}
Objeción asumida: {{objecion}}

Genera DOS mensajes de seguimiento de alto impacto para recuperar a este prospecto. Tono: autoridad legal con empatía humana. NUNCA sonar desesperado.

1. "Versión Riesgo Legal" (basada en urgencia real):
Explica de forma concreta y específica el riesgo que {{nombre}} está asumiendo al NO actuar en su caso de {{area_legal}} en este momento. Usa términos legales reales pero comprensibles (prescripción, caducidad de derechos, evidencia que se pierde, plazo de audiencia). Termina con una invitación clara a una llamada de 15 minutos sin compromiso.

2. "Versión Valor Diferencial" (basada en propuesta única):
Aborda sutilmente la objeción {{objecion}} ofreciendo algo concreto: primera hora de asesoría descontada, pago por etapas del caso, o un análisis breve de su situación por escrito antes de comprometerse. Que {{nombre}} sienta que contratar a este despacho es la decisión más inteligente que puede tomar hoy.

Ambos mensajes listos para enviar por WhatsApp. Máximo 6 líneas cada uno.`
    },
    {
      slug: 'upsell-legal-ai',
      name_en: 'UpsellLegal AI',
      name_es: 'UpsellLegal AI',
      description_en: 'They hired you for one case. Discover the 3 other legal needs they don\'t know they have.',
      description_es: 'Convierte cada caso cerrado en la puerta de entrada a más servicios legales que el cliente necesita.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'cliente', type: 'text', label_en: 'Client Name', label_es: 'Nombre del cliente', required: true },
        { id: 'caso_actual', type: 'text', label_en: 'Current / Recently Closed Case', label_es: 'Caso actual o recientemente cerrado', required: true },
        { id: 'perfil_cliente', type: 'select', label_en: 'Client Profile', label_es: 'Perfil del cliente', required: true,
          options: [
            { value: 'persona_fisica', label_en: 'Individual / Person', label_es: 'Persona física / particular' },
            { value: 'empresario_pyme', label_en: 'SME Business Owner', label_es: 'Empresario / PyME' },
            { value: 'corporativo', label_en: 'Corporate / Large Company', label_es: 'Corporativo / empresa grande' },
            { value: 'familia', label_en: 'Family (divorce, inheritance)', label_es: 'Familia (divorcio, herencia, tutela)' }
          ]
        },
        { id: 'areas_despacho', type: 'textarea', label_en: 'Law Firm Practice Areas', label_es: 'Áreas de práctica de tu despacho', required: true,
          placeholder_es: 'Civil, laboral, corporativo, fiscal, inmobiliario, penal, migratorio...'
        }
      ],
      prompt_template: `Eres el Estratega de Desarrollo de Negocios de un despacho jurídico de élite.
El cliente {{cliente}} acaba de cerrar o está por cerrar el caso {{caso_actual}}. Este es el momento de mayor confianza: úsalo.

Perfil del cliente: {{perfil_cliente}}
Áreas del despacho: {{areas_despacho}}

Analiza el caso {{caso_actual}} y el perfil {{perfil_cliente}} para identificar las 3 necesidades legales más probables que este cliente tiene y AÚN NO SABE que necesita atender.

Para cada necesidad:
1. LA NECESIDAD LEGAL: Qué área o situación legal está en riesgo para alguien con el perfil {{perfil_cliente}} que acaba de pasar por {{caso_actual}}.
2. EL ARGUMENTO PREVENTIVO: Por qué es mejor resolverlo AHORA (antes de que se convierta en un problema mayor). Incluye una consecuencia concreta de no actuar.
3. EL GUION DE CONVERSACIÓN: Las palabras exactas que el abogado puede usar al cierre del caso actual para presentar esta nueva necesidad como un consejo profesional, no como una venta.

Cierra con el "Paquete de Acompañamiento Legal": cómo presentar a {{cliente}} un servicio de asesoría legal recurrente (retainer mensual) que cubra sus necesidades futuras con un precio fijo mensual, incluyendo qué servicios abarca.`
    },
    {
      slug: 'brief-caso-ai',
      name_en: 'BriefCaso AI',
      name_es: 'BriefCaso AI',
      description_en: 'Turn chaotic client stories into structured, actionable case summaries.',
      description_es: 'Convierte el relato caótico del cliente en un expediente estructurado y estrategia inicial.',
      icon: 'FileText',
      form_schema: [
        { id: 'cliente', type: 'text', label_en: 'Client Name', label_es: 'Nombre del cliente', required: true },
        { id: 'relato', type: 'textarea', label_en: 'Client\'s Raw Story (as told)', label_es: 'Relato libre del cliente tal como lo narró', required: true,
          placeholder_es: 'Pega aquí el relato completo del cliente con todos sus detalles, emociones y contexto...'
        },
        { id: 'area_legal', type: 'select', label_en: 'Legal Area', label_es: 'Área legal del asunto', required: true,
          options: [
            { value: 'civil', label_en: 'Civil Law', label_es: 'Civil' },
            { value: 'familiar', label_en: 'Family Law', label_es: 'Familiar' },
            { value: 'laboral', label_en: 'Labor Law', label_es: 'Laboral' },
            { value: 'penal', label_en: 'Criminal Law', label_es: 'Penal' },
            { value: 'corporativo', label_en: 'Corporate Law', label_es: 'Corporativo' },
            { value: 'inmobiliario', label_en: 'Real Estate Law', label_es: 'Inmobiliario' },
            { value: 'migratorio', label_en: 'Immigration Law', label_es: 'Migratorio' }
          ]
        },
        { id: 'objetivo_cliente', type: 'text', label_en: 'Client\'s Primary Goal', label_es: '¿Qué quiere lograr el cliente con este caso?', required: true,
          placeholder_es: 'Recuperar su dinero, ganar la custodia, que no lo despidan, regularizar su empresa...'
        }
      ],
      prompt_template: `Actúa como un Abogado Litigante Senior con 20 años de experiencia estructurando casos complejos.
Has escuchado el siguiente relato de tu cliente {{cliente}} para un asunto de derecho {{area_legal}}.

RELATO DEL CLIENTE:
{{relato}}

OBJETIVO DEL CLIENTE: {{objetivo_cliente}}

Genera el "Brief Jurídico Ejecutivo" del caso:

1. SÍNTESIS DE HECHOS (orden cronológico):
Extrae y organiza los hechos jurídicamente relevantes del relato. Elimina el ruido emocional y quédate con lo que un juez o contraparte necesitaría saber. Máximo 10 puntos.

2. ANÁLISIS JURÍDICO PRELIMINAR:
- Tipo de acción legal más viable para alcanzar {{objetivo_cliente}}
- Derechos del cliente claramente vulnerados (o por demostrar)
- Riesgos identificados en el relato (evidencia débil, plazos, contradicciones)

3. DOCUMENTOS CRÍTICOS A SOLICITAR AL CLIENTE:
Lista los 5 documentos, pruebas o evidencias más importantes que el abogado debe pedir en la próxima reunión para fortalecer el caso.

4. ESTRATEGIA INICIAL RECOMENDADA:
El camino legal de menor costo y mayor probabilidad de éxito para lograr {{objetivo_cliente}}, con 3 pasos concretos y el timeframe estimado de cada uno.`
    },
    {
      slug: 'decide-despacho',
      name_en: 'DecideDespacho',
      name_es: 'DecideDespacho',
      description_en: 'Your law firm data should drive strategy, not just fill spreadsheets.',
      description_es: 'Analiza los números de tu despacho y toma decisiones que multiplican la facturación.',
      icon: 'BarChart2',
      form_schema: [
        { id: 'datos_despacho', type: 'textarea', label_en: 'Firm Data (cases, billing, areas)', label_es: 'Datos del despacho (casos activos, facturación, áreas más activas)', required: true },
        { id: 'problema', type: 'text', label_en: 'Main Business Problem', label_es: 'Principal problema o cuello de botella del despacho', required: true },
        { id: 'area_analisis', type: 'select', label_en: 'Focus Area', label_es: 'Área a analizar', required: true,
          options: [
            { value: 'facturacion', label_en: 'Billing & Collectability', label_es: 'Facturación y cobranza de honorarios' },
            { value: 'casos', label_en: 'Case Portfolio & Profitability', label_es: 'Cartera de casos y rentabilidad por área' },
            { value: 'clientes', label_en: 'Client Acquisition & Retention', label_es: 'Captación y retención de clientes' },
            { value: 'equipo', label_en: 'Team Productivity', label_es: 'Productividad del equipo / asociados' }
          ]
        },
        { id: 'contexto', type: 'textarea', label_en: 'Context (market, competition, seasonality)', label_es: 'Contexto relevante (mercado, competencia, temporada legal)', required: true }
      ],
      prompt_template: `Eres un Consultor de Gestión Estratégica especializado en despachos de abogados y firmas legales.
El mayor error de los abogados exitosos: son brillantes en derecho pero administran el despacho con intuición.

Datos del despacho: {{datos_despacho}}
Problema principal: {{problema}}
Área de análisis: {{area_analisis}}
Contexto: {{contexto}}

Entrega 3 Decisiones Estratégicas concretas para ejecutar esta semana. Para cada una:
1. LA DECISIÓN: Acción específica y sin ambigüedades. No "mejorar procesos", sino "establecer retainer mensual a los 5 clientes corporativos con estos honorarios y este alcance...".
2. FUNDAMENTO EN NÚMEROS: Cómo los datos de {{datos_despacho}} justifican exactamente esta decisión en el área de {{area_analisis}}.
3. EJECUCIÓN EN 48H: El primer paso concreto que el socio director ejecuta mañana para activar esta decisión.

Finaliza con el "Diagnóstico de Salud del Despacho":
🟢 Despacho en Crecimiento | 🟡 Estancamiento Estratégico | 🔴 Hemorragia Financiera
Justificado en dos líneas con los datos proporcionados y el {{problema}} detectado.`
    },
    {
      slug: 'pulse-despacho',
      name_en: 'PulseDespacho',
      name_es: 'PulseDespacho',
      description_en: 'Know the real status of your active cases and deadlines in 60 seconds.',
      description_es: 'El semáforo semanal de tu despacho: casos críticos, cobranza y vencimientos.',
      icon: 'Activity',
      form_schema: [
        { id: 'casos_activos', type: 'text', label_en: 'Number of Active Cases', label_es: 'Número de casos activos esta semana', required: true },
        { id: 'vencimientos', type: 'textarea', label_en: 'Upcoming Deadlines / Hearings', label_es: 'Vencimientos o audiencias en los próximos 7 días', required: true,
          placeholder_es: 'Audiencia caso García el jueves 24/04, escrito de demanda caso López vence el 26/04...'
        },
        { id: 'cobranza_pendiente', type: 'text', label_en: 'Pending Collections', label_es: 'Honorarios pendientes de cobrar (monto aproximado)', required: true },
        { id: 'casos_criticos', type: 'textarea', label_en: 'Critical / At-Risk Cases', label_es: 'Casos con riesgo de perderse o con cliente conflictivo', required: false },
        { id: 'nuevos_prospectos', type: 'text', label_en: 'New Leads This Week', label_es: 'Nuevos prospectos o consultas recibidas esta semana', required: true }
      ],
      prompt_template: `Actúa como el Sistema de Inteligencia Operativa de un Despacho Jurídico de Alto Rendimiento.
El socio director necesita el panorama completo de la firma en menos de 60 segundos.

- Casos activos: {{casos_activos}}
- Vencimientos próximos: {{vencimientos}}
- Cobranza pendiente: {{cobranza_pendiente}}
- Casos críticos: {{casos_criticos}}
- Nuevos prospectos: {{nuevos_prospectos}}

Genera el "PulseDespacho Semanal":

1. SEMÁFORO EJECUTIVO:
🟢 Semana Controlada | 🟡 Presión Operativa | 🔴 Semana de Crisis
Basado en la densidad de {{vencimientos}} y el estado de {{casos_criticos}}.

2. PRIORIDAD #1 HOY: El único vencimiento o caso de {{vencimientos}} que, si se descuida, puede tener consecuencias irreversibles para el cliente o el despacho. Explica el impacto en una línea.

3. ALERTA DE COBRANZA: Con {{cobranza_pendiente}} pendiente, identifica si hay un patrón de mora y sugiere el mensaje exacto que el asistente debe enviarle HOY al cliente con mayor deuda, de forma profesional y sin dañar la relación.

4. CONVERSIÓN DE PROSPECTOS: De los {{nuevos_prospectos}} recibidos esta semana, proporciona el guion de seguimiento de 48h para convertir al más prometedor en cliente, basado en el perfil de casos más rentables del despacho.`
    },
    {
      slug: 'legal-loop',
      name_en: 'LegalLoop Premium',
      name_es: 'LegalLoop Premium',
      description_en: 'From first consultation to lifetime legal partner. Full firm growth cycle.',
      description_es: 'Captación + Casos + Cobranza + Crecimiento. El sistema completo de tu despacho.',
      icon: 'RefreshCw',
      form_schema: [
        { id: 'despacho', type: 'text', label_en: 'Law Firm Name', label_es: 'Nombre del despacho o firma', required: true },
        { id: 'especialidades', type: 'text', label_en: 'Main Practice Areas', label_es: 'Áreas de práctica principales', required: true,
          placeholder_es: 'Civil y familiar, corporativo, penal...'
        },
        { id: 'num_abogados', type: 'text', label_en: 'Number of Attorneys & Staff', label_es: 'Número de abogados y personal', required: true },
        { id: 'dolor_captacion', type: 'textarea', label_en: 'Client Acquisition Problem', label_es: 'Problema principal en captación de nuevos clientes', required: true },
        { id: 'dolor_operativo', type: 'textarea', label_en: 'Operational / Financial Problem', label_es: 'Problema operativo o financiero más urgente (cobranza, carga de trabajo, etc.)', required: true },
        { id: 'fase', type: 'select', label_en: 'Priority Phase Today', label_es: 'Módulo donde necesitas más impacto ahora', required: true,
          options: [
            { value: 'captacion', label_en: 'Client Acquisition & Reactivation', label_es: 'Captación y reactivación de clientes' },
            { value: 'casos', label_en: 'Case Management & Strategy', label_es: 'Gestión de casos y estrategia' },
            { value: 'negocio', label_en: 'Firm Growth & Financial Control', label_es: 'Crecimiento del despacho y control financiero' }
          ]
        }
      ],
      prompt_template: `Eres el Consultor Estratégico de referencia para despachos jurídicos de alto crecimiento, implementando el sistema "LegalLoop": el ciclo de prosperidad para abogados con mentalidad empresarial.

Despacho: {{despacho}}
Especialidades: {{especialidades}}
Equipo: {{num_abogados}} personas
Problema de captación: {{dolor_captacion}}
Problema operativo: {{dolor_operativo}}
Fase prioritaria: {{fase}}

Activa el módulo LegalLoop correspondiente:

Si {{fase}} = CAPTACIÓN:
→ Diseña la Estrategia de Captación y Reactivación de Clientes para {{despacho}} especializado en {{especialidades}}. Incluye: (1) el perfil exacto del cliente ideal por área de práctica, (2) los 3 canales de captación más efectivos para ese perfil con acción concreta en cada uno, (3) el mensaje de reactivación listo para enviar a los últimos 10 clientes inactivos y (4) la oferta de enganche irresistible que convierte la primera consulta en contratación.

Si {{fase}} = CASOS:
→ Construye el "Protocolo de Gestión de Casos {{despacho}}": el sistema de onboarding del cliente (qué documentos pedir en la primera reunión, cómo establecer expectativas reales desde el día 1), el checklist de seguimiento quincenal para mantener al cliente informado sin llamadas innecesarias, y el protocolo de manejo de clientes difíciles o casos sin avance.

Si {{fase}} = NEGOCIO:
→ Diseña el "Modelo Financiero Sostenible de {{despacho}}": la fórmula para calcular el honorario mínimo rentable por tipo de caso en {{especialidades}}, el sistema de retainer mensual para clientes recurrentes (qué incluye, cómo presentarlo, precio sugerido), y la política de cobranza en 3 etapas que reduce la mora sin dañar la relación con el cliente.

Cierra siempre con el "Próximo Movimiento": la única acción de mayor ROI que el socio director de {{despacho}} ejecuta esta semana.`
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

    // Business plan for premium apps, Pro for the rest
    let targetPlan = proPlan
    if (app.slug === 'legal-loop' || app.slug === 'decide-despacho') {
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

  console.log('\n✅ Micro-Apps de Legal / Despachos completadas.')
  console.log('Apps insertadas:')
  apps.forEach(a => console.log(` - ${a.slug} (${a.name_es})`))
}

run()

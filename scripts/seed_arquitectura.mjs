import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('📐 Seeding Micro-Apps para Arquitectura...')

  const apps = [
    {
      slug: 'reactiva-prospecto-vivienda',
      name_en: 'ArchiLead AI',
      name_es: 'ArchiLead AI',
      description_en: 'Nurture potential clients who asked for a quote but haven\'t signed yet.',
      description_es: 'Nutre a clientes potenciales que pidieron cotización pero aún no firman.',
      icon: 'Home',
      form_schema: [
        { id: 'cliente', type: 'text', label_en: 'Client Name', label_es: 'Nombre del cliente', required: true },
        { id: 'tipo_proyecto', type: 'text', label_en: 'Project Type', label_es: 'Tipo de proyecto', required: true, placeholder_es: 'Remodelación cocina, Casa habitación, Oficina...' },
        { id: 'objecion_principal', type: 'text', label_en: 'Main Objection', label_es: 'Principal objeción o duda', required: false, placeholder_es: 'Presupuesto elevado, tiempo de obra, incertidumbre diseño...' }
      ],
      prompt_template: `Actúa como un Arquitecto Senior con gran capacidad comercial. Tu cliente {{cliente}} está interesado en un proyecto de {{tipo_proyecto}}. Su principal barrera es {{objecion_principal}}.

Genera dos mensajes de seguimiento estratégicos:

1. ENFOQUE EN PLUSVALÍA Y VALOR:
Explica cómo la inversión en {{tipo_proyecto}} no es un gasto, sino un aumento inmediato del valor de su propiedad. Aborda {{objecion_principal}} con elegancia técnica.
2. ENFOQUE EN EXCLUSIVIDAD:
"Hemos reservado un espacio en nuestro calendario de obra para iniciar con su visión". Menciona que el diseño es la base de la tranquilidad en la construcción.

Incluye: Una "Pregunta de Poder" para que el cliente revele qué es lo que realmente le preocupa.`
    },
    {
      slug: 'upsell-acabados-pro',
      name_en: 'FinishPlus AI',
      name_es: 'AcabadosPlus AI',
      description_en: 'Help clients understand the value of premium materials over basic options.',
      description_es: 'Ayuda a los clientes a entender el valor de materiales premium sobre opciones básicas.',
      icon: 'Sparkles',
      form_schema: [
        { id: 'material_basico', type: 'text', label_en: 'Basic Material', label_es: 'Material básico elegido', required: true },
        { id: 'material_premium', type: 'text', label_en: 'Premium Material', label_es: 'Material premium propuesto', required: true },
        { id: 'beneficio_durabilidad', type: 'text', label_en: 'Durability Benefit', label_es: 'Beneficio de durabilidad/estética', required: true, placeholder_es: 'No se raya, fácil limpieza, look de lujo, dura 20 años...' }
      ],
      prompt_template: `Eres un diseñador de interiores experto en psicología del lujo. El cliente quiere poner {{material_basico}}, pero tú sabes que {{material_premium}} es la opción correcta.

Genera:
1. LA COMPARACIÓN DE "COSTO POR DÍA":
Explica que la diferencia de precio entre {{material_basico}} y {{material_premium}} es mínima si se divide entre los 15-20 años que durará el proyecto.
2. EL DISCURSO SENSORIAL:
Describe cómo se sentirá estar en ese espacio con {{material_premium}} (Luz, textura, prestigio). Menciona: {{beneficio_durabilidad}}.
3. EL CIERRE: "Usted merece un espacio que no solo use, sino que lo inspire".

Cierra con: Un consejo sobre cómo usar muestras físicas para cerrar la venta del upgrade.`
    },
    {
      slug: 'decide-arquitectura',
      name_en: 'ArchiDecide',
      name_es: 'ArchiDecide',
      description_en: 'Analyze project profitability vs. billable hours. Optimize your studio operations.',
      description_es: 'Analiza la rentabilidad del proyecto vs horas hombre. Optimiza tu estudio.',
      icon: 'Scale',
      form_schema: [
        { id: 'presupuesto_total', type: 'text', label_en: 'Total Budget', label_es: 'Presupuesto total del proyecto', required: true },
        { id: 'horas_estimadas', type: 'text', label_en: 'Estimated Hours', label_es: 'Horas estimadas de diseño/supervisión', required: true },
        { id: 'costo_materiales', type: 'text', label_en: 'Supplies/Sub-contractor costs', label_es: 'Costo de materiales/contratistas', required: true }
      ],
      prompt_template: `Eres un consultor de gestión para estudios de arquitectura. 
Presupuesto: {{presupuesto_total}}
Horas: {{horas_estimadas}}
Costos externos: {{costo_materiales}}

Análisis de Rentabilidad:
1. MARGEN REAL: Calcula cuánto está ganando realmente el arquitecto por hora después de gastos.
2. ALERTA DE RIESGO: Si las horas {{horas_estimadas}} se exceden en un 20%, ¿en qué punto el proyecto deja de ser negocio?
3. OPTIMIZACIÓN: Cómo cobrar por "Fases de Diseño" independientes para asegurar flujo de caja.

Tono: Ejecutivo, matemático y estratégico.`
    },
    {
      slug: 'pulse-obra',
      name_en: 'BuildPulse',
      name_es: 'PulsoObra',
      description_en: 'Daily check on project progress, contractor status, and materials arrival.',
      description_es: 'Control diario de avance de obra, estatus de contratistas y llegada de materiales.',
      icon: 'Activity',
      form_schema: [
        { id: 'proyecto', type: 'text', label_en: 'Project Name', label_es: 'Nombre del proyecto/obra', required: true },
        { id: 'avance_hoy', type: 'text', label_en: 'Progress today', label_es: 'Avance realizado hoy', required: true },
        { id: 'pendiente_manana', type: 'text', label_en: 'Pending for tomorrow', label_es: 'Pendiente para mañana', required: true },
        { id: 'alertas', type: 'textarea', label_en: 'Alerts/Delays', label_es: 'Alertas o retrasos críticos', required: false }
      ],
      prompt_template: `Actúa como el Gerente de Obra / Project Manager.

Proyecto: {{proyecto}}
Logros Hoy: {{avance_hoy}}
Meta Mañana: {{pendiente_manana}}
Riesgos: {{alertas}}

Instrucciones para el cliente (Reporte visual):
1. RESUMEN DE PAZ: Dile al cliente que {{avance_hoy}} va conforme al plan o cómo estamos mitigando {{alertas}}. 
2. PRÓXIMO HITO: Por qué el trabajo de {{pendiente_manana}} es crucial para la entrega final.
3. ESTADO FINANCIERO: Recordatorio suave si se acerca un pago de hito.

Cierra con: Una frase que reafirme la calidad técnica de la construcción.`
    },
    {
      slug: 'archiloop-growth',
      name_en: 'ArchiLoop Elite',
      name_es: 'ArchiLoop Élite',
      description_en: 'Scaling system for architecture firms. Getting high-ticket clients via partnerships.',
      description_es: 'Sistema de escalado para estudios de arquitectura: consiguiendo clientes high-ticket.',
      icon: 'Repeat',
      form_schema: [
        { id: 'estudio_nombre', type: 'text', label_en: 'Studio Name', label_es: 'Nombre del estudio', required: true },
        { id: 'especialidad', type: 'text', label_en: 'Specialty', label_es: 'Especialidad (Residencial, Comercial, Paisajismo)', required: true },
        { id: 'objetivo', type: 'select', label_en: 'Growth Goal', label_es: 'Objetivo de crecimiento', required: true,
          options: [
            { value: 'alianzas', label_en: 'Real Estate Partnerships', label_es: 'Alianzas con Inmobiliarias' },
            { value: 'monetizar_diseno', label_en: 'Monetize Design only', label_es: 'Vender solo diseño (Consultoría)' },
            { value: 'obras_grandes', label_en: 'Big Contracts', label_es: 'Contratos de Gran Escala' }
          ]
        }
      ],
      prompt_template: `Eres el estratega de "ArchiLoop", especializado en transformar arquitectos en dueños de empresas de diseño rentables.

Estudio: {{estudio_nombre}}
Enfoque: {{especialidad}}
Meta: {{objetivo}}

Desarrolla el plan de crecimiento:
Si {{objetivo}} = ALIANZAS:
- Cómo presentarte ante Inmobiliarias para ser su "Arquitecto de cabecera" en preventas.
- El guion: "Diseñamos para que ellos vendan más rápido".

Si {{objetivo}} = MONETIZAR_DISENO:
- Cómo cobrar un "Fee de Concepto" que el cliente pague con gusto antes de cualquier plano técnico.

Si {{objetivo}} = OBRAS_GRANDES:
- El portafolio emocional: Cómo contar la historia de un proyecto para atraer inversionistas.

Cierra con: El consejo para dejar de ser auto-empleado y empezar a dirigir un staff creativo.`
    },
    {
      slug: 'brief-diseno-rapido',
      name_en: 'InstantBrief AI',
      name_es: 'ArchiBrief AI',
      description_en: 'Generate professional project briefs from initial client meetings in minutes.',
      description_es: 'Genera briefs profesionales de proyectos a partir de las primeras reuniones en minutos.',
      icon: 'FileText',
      form_schema: [
        { id: 'cliente', type: 'text', label_en: 'Client Name', label_es: 'Nombre del cliente', required: true },
        { id: 'necesidades', type: 'textarea', label_en: 'Needs and Dreams', label_es: 'Necesidades y sueños (estilo, espacios, paleta)', required: true, placeholder_es: 'Quiere algo minimalista, mucha luz natural, cocina abierta, prefiere tonos grises...' },
        { id: 'limitantes', type: 'text', label_en: 'Constraints', label_es: 'Limitantes (terreno chico, poco tiempo, ruido)', required: false }
      ],
      prompt_template: `Eres un Programador Arquitectónico. Tu tarea es traducir los deseos vagos de {{cliente}} en un Brief Técnico y Conceptual profesional.

Entrada: {{necesidades}}
Retos: {{limitantes}}

Genera el Documento de Visión:
1. EL CONCEPTO CENTRAL: Dale un nombre sofisticado al estilo (Ej: "Minimalismo Funcional con Énfasis Lumínico").
2. LISTA DE REQUERIMIENTOS: Traduce {{necesidades}} en una lista de espacios con funciones específicas.
3. SOLUCIONES TÉCNICAS: Cómo abordarás {{limitantes}} desde el diseño.

Efecto WOW: Este documento se le entrega al cliente antes de la propuesta económica para demostrar que entendiste su alma.`
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
        console.log(`App ${app.slug} already exists, updating...`)
        const { data: existingApp } = await supabase.from('micro_apps').select('id').eq('slug', app.slug).single()
        if (existingApp) {
          app.id = existingApp.id
          await supabase.from('micro_apps').update({
            name_en: app.name_en, name_es: app.name_es,
            description_en: app.description_en, description_es: app.description_es,
            icon: app.icon, form_schema: app.form_schema, prompt_template: app.prompt_template
          }).eq('id', app.id)
          console.log(`Updated ${app.slug}`)
        }
      } else { console.error(`Error inserting ${app.slug}:`, appError.message); continue }
    } else { app.id = appId }

    let targetPlan = proPlan
    if (app.slug === 'archiloop-growth' || app.slug === 'decide-arquitectura') targetPlan = businessPlan || proPlan

    if (targetPlan && app.id) {
      const { data: existingLink } = await supabase.from('plan_apps').select('*')
        .eq('plan_id', targetPlan.id).eq('app_id', app.id).single()
      if (!existingLink) {
        await supabase.from('plan_apps').insert({ plan_id: targetPlan.id, app_id: app.id })
        console.log(`Linked ${app.slug} → plan ${targetPlan.slug}`)
      } else { console.log(`${app.slug} already linked to plan ${targetPlan.slug}`) }
    }
  }

  console.log('\n✅ Micro-Apps de Arquitectura completadas.')
}

run()

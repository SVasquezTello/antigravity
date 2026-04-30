import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('🛡️ Seeding Micro-Apps para Seguridad Privada y Vigilancia...')

  const apps = [
    {
      slug: 'patrol-brief',
      name_en: 'PatrolBrief AI',
      name_es: 'PatrolBrief AI',
      description_en: 'Turns verbal instructions into a strict, trackable patrol manual for guards.',
      description_es: 'Convierte instrucciones verbales en un manual de patrullaje estricto y rastreable.',
      icon: 'ShieldAlert',
      form_schema: [
        { id: 'area_to_protect', type: 'text', label_en: 'Facility/Area', label_es: 'Instalación / Área a proteger', required: true, placeholder_es: 'ej. Almacén Central, Condominio Los Pinos' },
        { id: 'shift', type: 'select', label_en: 'Shift', label_es: 'Turno', required: true,
          options: [
            { value: 'dia', label_en: 'Day Shift', label_es: 'Turno de Día' },
            { value: 'noche', label_en: 'Night Shift', label_es: 'Turno de Noche' },
            { value: 'especial', label_en: 'Special Event', label_es: 'Evento Especial' }
          ]
        },
        { id: 'risk_level', type: 'select', label_en: 'Risk Level', label_es: 'Nivel de Riesgo', required: true,
          options: [
            { value: 'bajo', label_en: 'Low', label_es: 'Bajo' },
            { value: 'medio', label_en: 'Medium', label_es: 'Medio' },
            { value: 'alto', label_en: 'High / Critical', label_es: 'Alto / Crítico' }
          ]
        },
        { id: 'recent_incidents', type: 'textarea', label_en: 'Recent Incidents/Alerts', label_es: 'Incidentes o alertas recientes', required: false }
      ],
      prompt_template: `Actúa como un Jefe de Operaciones de Seguridad Privada con 20 años de experiencia.
Tu misión es generar el "Briefing de Instrucciones" para el personal en sitio.
- Ubicación: {{area_to_protect}}
- Turno: {{shift}}
- Riesgo: {{risk_level}}
- Alertas: {{recent_incidents}}

Genera:
1. "Puntos de Control Críticos": Identifica 5 lugares o momentos donde la guardia debe ser máxima.
2. "Protocolo de Patrullaje": Una rutina paso a paso para el turno {{shift}}.
3. "Escalera de Fuerza / Respuesta": Qué hacer exactamente ante una intrusión según el riesgo {{risk_level}}.
4. "Palabra Clave y Alertas": Sugiere una palabra clave táctica y un formato de reporte rápido para WhatsApp.`
    },
    {
      slug: 'upsell-safe',
      name_en: 'UpsellSafe AI',
      name_es: 'UpsellSafe AI',
      description_en: 'The client has guards. Sell them the full monitoring ecosystem for total peace of mind.',
      description_es: 'El cliente tiene guardias. Véndele el ecosistema de monitoreo para su tranquilidad total.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'client_name', type: 'text', label_en: 'Client Name', label_es: 'Nombre del cliente', required: true },
        { id: 'current_service', type: 'textarea', label_en: 'Current Service (Security Staff)', label_es: 'Servicio actual (Nro guardias, turnos)', required: true },
        { id: 'detected_gap', type: 'textarea', label_en: 'Vulnerability Detected', label_es: 'Vulnerabilidad detectada (ej. puntos ciegos sin cámara)', required: true },
        { id: 'tech_options', type: 'textarea', label_en: 'Tech/Monitoring Options', label_es: 'Opciones de tecnología que ofreces', required: true }
      ],
      prompt_template: `Eres un Consultor de Riesgos y Seguridad Electrónica.
El cliente {{client_name}} ya tiene guardias físicos, pero su seguridad está incompleta.
Debes convencerlo de añadir tecnología de {{tech_options}}.

Genera:
1. "El Análisis de Punto Ciego": Explica cómo el factor humano solo no puede cubrir {{detected_gap}}.
2. "Comparativa Costo-Beneficio": Muéstrale que añadir tecnología de {{tech_options}} es más barato que añadir otro guardia a largo plazo.
3. Script de "Tranquilidad Preventiva": Un mensaje para el CEO o Dueño enfocándote en la reducción de riesgos y la evidencia grabada.
4. Oferta de Diagnóstico: Una propuesta para hacer un "audit de seguridad" gratuito para cerrar la venta.`
    },
    {
      slug: 'copy-secure',
      name_en: 'CopySecure AI',
      name_es: 'CopySecure AI',
      description_en: 'Write content that inspires trust, not fear. Professional security copy.',
      description_es: 'Escribe contenido que inspire confianza, no miedo. Copy profesional de seguridad.',
      icon: 'PenTool',
      form_schema: [
        { id: 'service', type: 'text', label_en: 'Service to promote', label_es: 'Servicio a promocionar', required: true },
        { id: 'target', type: 'text', label_en: 'Target Audience', label_es: 'A quién va dirigido', required: true, placeholder_es: 'ej. Familias en barrios cerrados, Dueños de joyerías' },
        { id: 'tone', type: 'select', label_en: 'Tone', label_es: 'Tono', required: true,
          options: [
            { value: 'autoridad', label_en: 'Authoritative & Strong', label_es: 'Autoridad y Fortaleza' },
            { value: 'confianza', label_en: 'Empathetic & Trusted', label_es: 'Empatía y Confianza' },
            { value: 'alerta', label_en: 'Urgency / Awareness', label_es: 'Alerta / Concientización' }
          ]
        }
      ],
      prompt_template: `Actúa como un Copywriter especializado en Industrias de Defensa y Seguridad.
Debes escribir una pieza de marketing para {{service}}.
- Audiencia: {{target}}
- Tono: {{tone}}

Genera:
1. El Titular "Escudo": Una frase que capture la sensación de protección inmediata.
2. El Cuerpo del Copy: Enfócate en el beneficio de "no tener que preocuparse" en lugar de "los peligros de afuera".
3. Las 3 Garantías: Tres puntos que demuestren por qué su agencia es la mejor opción.
4. Hashtags de Seguridad: 5 hashtags profesionales e institucionales.`
    },
    {
      slug: 'decide-shield',
      name_en: 'DecideShield AI',
      name_es: 'DecideShield AI',
      description_en: 'More guards or more cameras? Data-driven analysis for security budgets.',
      description_es: '¿Más guardias o más cámaras? Análisis basado en datos para presupuestos de seguridad.',
      icon: 'PieChart',
      form_schema: [
        { id: 'guard_cost', type: 'text', label_en: 'Cost per Guard (Monthly)', label_es: 'Costo por guardia (Mensual)', required: true },
        { id: 'tech_cost', type: 'text', label_en: 'Tech/Audit Project Cost', label_es: 'Costo proyecto de tecnología', required: true },
        { id: 'maintenance_audit', type: 'text', label_en: 'Monthly monitoring fee', label_es: 'Fee de monitoreo mensual', required: true },
        { id: 'incident_history', type: 'textarea', label_en: 'Incident History', label_es: 'Historial de incidentes recientes', required: true }
      ],
      prompt_template: `Eres un Consultor de Finanzas Operativas para Empresas de Seguridad.
Tu cliente debe decidir dónde invertir su próximo presupuesto.
- Guardia: {{guard_cost}}/mes.
- Proyecto Tech: {{tech_cost}}.
- Mantenimiento Tech: {{maintenance_audit}}/mes.
- Pasado: {{incident_history}}

Analiza:
1. "ROI de Automatización": En cuántos meses la tecnología se paga sola al reducir la necesidad de guardias extra.
2. "Factor de Eficiencia": ¿Qué opción reduce más la probabilidad de {{incident_history}}? 
3. La Estrategia Híbrida: Propón un mix óptimo (ej. 1 guardia menos + 4 cámaras más) que mantenga el nivel de seguridad bajando el costo mensual.
4. Recomendación Ejecutiva: Justificación numérica para presentar al comité de finanzas.`
    },
    {
      slug: 'pulse-alert',
      name_en: 'PulseAlert AI',
      name_es: 'PulseAlert AI',
      description_en: 'Check the real status of your units in the field without calling 50 radios.',
      description_es: 'Sabe el estado real de tus unidades en campo sin llamar por 50 radios.',
      icon: 'Activity',
      form_schema: [
        { id: 'daily_incidents', type: 'textarea', label_en: 'Incidents/Novelties reported', label_es: 'Incidentes / Novedades reportadas', required: true },
        { id: 'attendance_report', type: 'text', label_en: 'Absence/Tardiness count', label_es: 'Cantidad de faltas o tardanzas', required: true },
        { id: 'critical_alerts', type: 'textarea', label_en: 'Critical system alerts (alarms triggered)', label_es: 'Alertas críticas de sistema (alarmas disparadas)', required: true },
        { id: 'manager_notes', type: 'textarea', label_en: 'Site Manager Notes', label_es: 'Notas del supervisor de zona', required: false }
      ],
      prompt_template: `Eres un Analista de Riesgo Operativo en tiempo real.
Evaluemos el "Pulso de Seguridad" de hoy:
- Novedades: {{daily_incidents}}
- Personal: {{attendance_report}}
- Alarmas: {{critical_alerts}}
- Supervisor: {{manager_notes}}

Genera:
1. Semáforo de Operación: 🟢 Bajo Control | 🟡 Alerta Operativa | 🔴 Crisis en curso.
2. Índice de Vulnerabilidad: ¿Cómo afecta el nivel de faltas ({{attendance_report}}) a la seguridad de los clientes?
3. Acción Táctica Inmediata: La única cosa que el dueño debe coordinar ahora mismo para cubrir huecos o responder a incidentes.
4. Resumen Ejecutivo de 1 Párrafo: Para enviar por WhatsApp al dueño del negocio ahora mismo.`
    },
    {
      slug: 'shield-loop',
      name_en: 'ShieldLoop Premium',
      name_es: 'ShieldLoop Premium',
      description_en: 'The closing-the-gap machine. From incident alert to sales recovery.',
      description_es: 'La máquina de cerrar brechas. Del incidente a la recuperación de ventas.',
      icon: 'RefreshCw',
      form_schema: [
        { id: 'agency_name', type: 'text', label_en: 'Security Agency Name', label_es: 'Nombre de la Agencia', required: true },
        { id: 'clients_type', type: 'text', label_en: 'Main Client Industry', label_es: 'Tipo de clientes (ej. Industrial, Residencial)', required: true },
        { id: 'biggest_pain', type: 'textarea', label_en: 'Biggest operational pain', label_es: 'Mayor reto operativo hoy', required: true },
        { id: 'market_competition', type: 'textarea', label_en: 'Primary competitors activity', label_es: 'Actividad de la competencia directa', required: true }
      ],
      prompt_template: `Eres el Estratega Maestro de Empresas de Seguridad. Vamos a implementar el "ShieldLoop" en {{agency_name}}.
- Nicho: {{clients_type}}
- Reto: {{biggest_pain}}
- Competencia: {{market_competition}}

Diseña el Plan de 3 Pilares:
1. El Sistema de Reclutamiento y Retención: Cómo solucionar {{biggest_pain}} mediante un sistema de incentivos y cultura que reduzca la rotación del personal.
2. El Protocolo "Vigilancia de Valor": Cómo demostrarle a tus clientes que estás trabajando aunque no haya incidentes (reportes de valor añadido).
3. Ciclo de Crecimiento por Referral: Un proceso para que tus clientes {{clients_type}} te recomienden con otros directores de seguridad de su nivel.
Cierra con una visión de autoridad nacional para {{agency_name}}.`
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
    if (app.slug === 'shield-loop' || app.slug === 'decide-shield') {
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

  console.log('✅ Micro-Apps de Seguridad (Seed) completado.')
}

run()

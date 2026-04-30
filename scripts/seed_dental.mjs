import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('Seeding Micro-Apps para Clínicas Dentales...')

  const apps = [
    {
      slug: 'reactiva-dental',
      name_en: 'ReactivaDental',
      name_es: 'ReactivaDental',
      description_en: 'That patient didn\'t leave. They just forgot their next cleaning. Remind them gently.',
      description_es: 'Ese paciente no se fue. Solo olvidó su próxima limpieza o control de brackets. ¡Recuérdaselo!',
      icon: 'HeartPulse',
      form_schema: [
        { id: 'patient_name', type: 'text', label_en: 'Patient Name', label_es: 'Nombre del paciente', required: true },
        { id: 'last_treatment', type: 'text', label_en: 'Last Treatment', label_es: 'Último tratamiento realizado', required: true },
        { id: 'months_passed', type: 'text', label_en: 'Months Since Last Visit', label_es: 'Meses desde última visita', required: true },
        { id: 'pending_treatment', type: 'text', label_en: 'Pending/Suggested Treatment', label_es: 'Tratamiento pendiente sugerido (ej. Caries, Profilaxis)', required: true },
        { id: 'channel', type: 'select', label_en: 'Preferred Channel', label_es: 'Canal de contacto', required: true,
          options_es: ['WhatsApp', 'SMS', 'Llamada Telefónica'],
          options_en: ['WhatsApp', 'SMS', 'Phone Call']
        }
      ],
      prompt_template: `Actúa como Coordinador de Pacientes de Alta Gama para una Clínica Dental. 
Deberás reactivar al siguiente paciente para asegurar que retome su salud bucal sin sonar desesperado por agendar.
- Paciente: {{patient_name}}
- Último tratamiento: {{last_treatment}}
- Tiempo ausente: {{months_passed}} meses
- Tratamiento que dejó pendiente: {{pending_treatment}}
- Vía de comunicación: {{channel}}

Genera 2 mensajes de seguimiento sumamente empáticos listos para enviar por {{channel}}:
1. "Versión Salud/Prevención": Fomenta la urgencia enfocándote en las consecuencias dolorosas o costosas de posponer el {{pending_treatment}}.
2. "Versión Promocional": Ofrece un diagnóstico gratuito o un paquete preventivo si asiste esta semana.
Ambos mensajes deben denotar cuidado genuino por la salud del paciente.`
    },
    {
      slug: 'upsell-dental',
      name_en: 'UpsellDental AI',
      name_es: 'UpsellDental AI',
      description_en: 'They came for a filling. Discover what aesthetic treatments to offer them.',
      description_es: 'Vinieron por una resina. Descubre cómo venderles un blanqueamiento.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'main_reason', type: 'text', label_en: 'Reason for Visit', label_es: 'Motivo principal de visita', required: true },
        { id: 'patient_profile', type: 'select', label_en: 'Patient Profile', label_es: 'Perfil del paciente', required: true,
          options_es: ['Joven/Estética', 'Adulto/Funcional', 'Alto Presupuesto/VIP'],
          options_en: ['Youth/Aesthetics', 'Adult/Functional', 'High Budget/VIP']
        },
        { id: 'detected_issues', type: 'textarea', label_en: 'Issues Detected During Checkup', label_es: 'Problemas dentales detectados (manchas, sarro, etc)', required: true },
        { id: 'available_treatments', type: 'textarea', label_en: 'Treatments Available', label_es: 'Tratamientos estéticos disponibles en clínica', required: true }
      ],
      prompt_template: `Eres el Odontólogo más persuasivo y ético del país. Tienes a un paciente en el sillón de atención primario.
- Vino hoy por: {{main_reason}}
- Al revisar su boca notaste: {{detected_issues}}
- Su perfil es: {{patient_profile}}
- Mis opciones a vender son: {{available_treatments}}

Detecta las 3 opciones de 'upsell' (ventas cruzadas estéticas o de mayor nivel) más lógicas según lo que le encontraste y su perfil.
Ojo: la ética dental es clave. Para cada opción genera:
1. Qué tratamiento sugerir.
2. La "Semilla Psicológica": Cómo hacerle notar el problema con un espejo sutilmente, para que EL CLIENTE pida la solución.
3. El guion de cierre sin presión: "Mira, noté esto... no pasa nada hoy, pero si lo arreglamos ahora te ahorrarás X o lucirás Y".`
    },
    {
      slug: 'reserva-dental',
      name_en: 'ReservaDental',
      name_es: 'ReservaDental',
      description_en: 'Turn appointments into flawless preparation checklists.',
      description_es: 'Convierte el agendamiento en un checklist pre-operatorio a prueba de fallos.',
      icon: 'CalendarCheck',
      form_schema: [
        { id: 'patient_name', type: 'text', label_en: 'Patient Name', label_es: 'Nombre del paciente', required: true },
        { id: 'treatment', type: 'text', label_en: 'Scheduled Treatment', label_es: 'Tratamiento agendado (ej. Exodoncia, Endodoncia)', required: true },
        { id: 'date_time', type: 'text', label_en: 'Date and Time', label_es: 'Fecha y hora', required: true },
        { id: 'anxiety_level', type: 'select', label_en: 'Patient Anxiety Level', label_es: 'Nivel de miedo/ansiedad del paciente', required: true,
          options_es: ['Normal', 'Ansioso', 'Fobia Dental Severa'],
          options_en: ['Normal', 'Anxious', 'Severe Dental Phobia']
        },
        { id: 'allergies', type: 'textarea', label_en: 'Medical Info/Allergies', label_es: 'Alergias o Condiciones Médicas', required: true }
      ],
      prompt_template: `Actúa como Gerente de Clínica y Asistente Dental en Jefe.
Recibimos esta cita y debes estructurar el ambiente para máxima eficiencia quirúrgica y cero estrés:
- Paciente: {{patient_name}} (Nivel de ansiedad: {{anxiety_level}})
- Procedimiento programado: {{treatment}}
- Fecha y Hora: {{date_time}}
- Notas Médicas Críticas: {{allergies}}

Crea un Protocolo de Preparación Inmediata con:
1. Checklist Técnico para el Asistente: Qué instrumental, anestesias o fresas específicas DEBEN estar listas en charola 15 min antes, según el tipo de tratamiento.
2. Alerta Médica Urgente (en MAYÚSCULAS) relacionada a {{allergies}}.
3. Protocolo de Experiencia al Paciente (Reception): Guion específico para recibirlo y calmarlo, adaptado a su nivel de ansiedad ({{anxiety_level}}).`
    },
    {
      slug: 'decide-dental',
      name_en: 'DecideDental',
      name_es: 'DecideDental',
      description_en: 'Your numbers must tell you which treatment leaves the most money.',
      description_es: 'Tus números deben decirte qué especialista o servicio te deja más dinero.',
      icon: 'PieChart',
      form_schema: [
        { id: 'sales_report', type: 'textarea', label_en: 'Monthly Report', label_es: 'Reporte del mes (Ingresos, Gastos, Pacientes)', required: true },
        { id: 'problem', type: 'text', label_en: 'Main Problem', label_es: 'Principal problema financiero', required: true },
        { id: 'area', type: 'select', label_en: 'Area to Analyze', label_es: 'Área a analizar', required: true,
          options_es: ['Costos de Materiales', 'Rendimiento de Odontólogos', 'Adquisición de Pacientes'],
          options_en: ['Material Costs', 'Dentist Performance', 'Patient Acquisition']
        },
        { id: 'context', type: 'textarea', label_en: 'Context', label_es: 'Contexto relevante del mercado', required: true }
      ],
      prompt_template: `Eres un Consultor Especialista en Rentabilidad de Clínicas Odontológicas.
El dueño de la clínica te presenta la situación actual. Elimina la paja y ve directo a decisiones de negocio duras:
- Números crudos: {{sales_report}}
- Síntoma financiero que le duele: {{problem}}
- Área afectada: {{area}}
- Contexto: {{context}}

Entrégale exactamente 3 decisiones directas aplicables hoy.
Requisito imperativo para cada una:
1. El "QUÉ": Decisión drástica sobre estructura de costos, comisiones, o marketing.
2. El "POR QUÉ": Justificación matemática/estratégica usando heurísticas comprobadas del negocio dental (ej. "La endodoncia atrae pero la ortodoncia retiene y te paga la renta").
3. "ACCIÓN INMEDIATA": Tarea para ejecutar en los próximos 10 minutos.`
    },
    {
      slug: 'pulse-dental',
      name_en: 'PulseDental',
      name_es: 'PulseDental',
      description_en: 'Know how your clinic is doing today without interrupting the dentists.',
      description_es: 'Sabe cómo va tu clínica hoy sin interrumpir a los odontólogos.',
      icon: 'Activity',
      form_schema: [
        { id: 'daily_report', type: 'textarea', label_en: 'Daily Report', label_es: 'Reporte del turno (corte preliminar)', required: true },
        { id: 'budget', type: 'text', label_en: 'Daily Goal', label_es: 'Meta financiera del día', required: true },
        { id: 'incidents', type: 'textarea', label_en: 'Incidents/Delays', label_es: 'Tardanzas de pacientes o fallos en equipos', required: true },
        { id: 'sales', type: 'textarea', label_en: 'Actual Revenue', label_es: 'Cobros realizados al momento', required: true },
        { id: 'manager_comments', type: 'textarea', label_en: 'Front Desk Comments', label_es: 'Comentarios de recepción', required: true }
      ],
      prompt_template: `Eres un Auditor Operativo en la nube para Clínicas Médicas/Dentales.
El Director Médico NO está en la clínica y pide un resumen implacable y al grano:
- Datos del Turno: {{daily_report}}
- Meta del día: {{budget}}
- Cobrado hasta ahora: {{sales}}
- Retrasos/Incidencias en sillones: {{incidents}}
- Reporta la recepcionista: {{manager_comments}}

Genera el "Semáforo Operativo" de la clínica:
1. Semáforo: 🟢 (Óptimo), 🟡 (Peligro Leve), o 🔴 (Caos/Pérdida Crítica). Justifícalo en 1 oración.
2. Brecha vs. Meta: ¿Llegamos al punto de equilibrio hoy?
3. Lista Ágora: Los 3 puntos ciegos urgentes basados en el reporte que la Recepcionista tal vez esté minimizando (y que el Dueño debe preguntar al llamar ahora mismo).`
    },
    {
      slug: 'denta-loop',
      name_en: 'DentaLoop Premium',
      name_es: 'DentaLoop',
      description_en: 'From the waiting room to the 6-month checkup. The total ecosystem.',
      description_es: 'Desde la sala de espera hasta la profilaxis a los 6 meses. El ecosistema premium.',
      icon: 'RefreshCw',
      form_schema: [
        { id: 'clinic_name', type: 'text', label_en: 'Clinic Name', label_es: 'Nombre de la Clínica', required: true },
        { id: 'niche', type: 'text', label_en: 'Specialty Niche', label_es: 'Especialidades principales (ej. Implantes, Ortodoncia, Estética)', required: true },
        { id: 'operation_report', type: 'textarea', label_en: 'Operational Pain', label_es: 'Desafíos operativos recientes (ej. sillones vacíos, cancelaciones)', required: true },
        { id: 'inactive_clients', type: 'textarea', label_en: 'Patient Drain', label_es: 'Problema principal de pérdida de pacientes', required: true }
      ],
      prompt_template: `Eres el Director Operativo Supremo desarrollando el 'DentaLoop' para clínicas.
- Clínica: {{clinic_name}}
- Fuerte Comercial: {{niche}}
- Reto Operativo Crudo: {{operation_report}}
- Sangrado de Pacientes: {{inactive_clients}}

Diseña un Master-Plan 'DentaLoop' de 3 pilares accionables en 72 horas:
1. SISTEMA 6-MESES INELUDIBLE: Define un proceso paso a paso para que cada paciente que hoy se va con el alta médica, pague o deje asegurada su cita a 6 meses.
2. VENA DE ORO INTERNA: Teniendo como fuerte "{{niche}}", cómo entrenar al personal para que TODOS recomienden o canalicen pacientes existentes hacia ese rubro (Técnicas de Cross-Selling médico).
3. PROTOCOLO CERO AUSENCIAS: Una regla draconiana pero empática de 3 pasos para lidiar con el reto de cancelaciones o el desafío de {{operation_report}}, para nunca más tener el sillón principal improductivo.`
    }
  ]

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
    if (app.slug === 'denta-loop' || app.slug === 'decide-dental') {
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

  console.log('✅ Micro-Apps Dentales (Seed) completado.')
}

run()

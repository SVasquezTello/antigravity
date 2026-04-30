import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('🏥 Seeding Micro-Apps para Clínicas Médicas y de Salud...')

  const apps = [
    {
      slug: 'reactiva-paciente',
      name_en: 'ReactivaPaciente',
      name_es: 'ReactivaPaciente',
      description_en: 'Your inactive patients are not gone. They just need the right reminder.',
      description_es: 'Reactiva pacientes inactivos con chequeos pendientes o seguimientos olvidados.',
      icon: 'UserCheck',
      form_schema: [
        { id: 'paciente', type: 'text', label_en: 'Patient Name', label_es: 'Nombre del paciente', required: true },
        { id: 'meses_ausente', type: 'text', label_en: 'Months Without Visit', label_es: 'Meses sin visitar la clínica', required: true },
        { id: 'motivo_pendiente', type: 'select', label_en: 'Pending Reason', label_es: 'Motivo de visita pendiente', required: true,
          options: [
            { value: 'chequeo_anual', label_en: 'Annual Checkup', label_es: 'Chequeo médico anual' },
            { value: 'seguimiento', label_en: 'Treatment Follow-up', label_es: 'Seguimiento de tratamiento o estudio' },
            { value: 'laboratorios', label_en: 'Pending Lab Results', label_es: 'Laboratorios o estudios pendientes' },
            { value: 'cronica', label_en: 'Chronic Condition Control', label_es: 'Control de condición crónica (diabetes, HTA...)' },
            { value: 'vacuna', label_en: 'Pending Vaccine / Booster', label_es: 'Vacuna o refuerzo pendiente' },
            { value: 'sin_razon', label_en: 'No Specific Reason', label_es: 'Sin razón específica registrada' }
          ]
        },
        { id: 'especialidad', type: 'text', label_en: 'Medical Specialty', label_es: 'Especialidad médica de la clínica', required: true, placeholder_es: 'Medicina general, cardiología, ginecología...' },
        { id: 'canal', type: 'select', label_en: 'Contact Channel', label_es: 'Canal de contacto', required: true,
          options: [
            { value: 'whatsapp', label_en: 'WhatsApp', label_es: 'WhatsApp' },
            { value: 'sms', label_en: 'SMS', label_es: 'SMS' },
            { value: 'email', label_en: 'Email', label_es: 'Email' },
            { value: 'llamada', label_en: 'Phone Call Script', label_es: 'Guion para llamada telefónica' }
          ]
        }
      ],
      prompt_template: `Actúa como el Director Médico de una clínica de {{especialidad}} redactando el mensaje de reactivación más efectivo y ético de la historia.

Paciente: {{paciente}}
Tiempo de ausencia: {{meses_ausente}} meses
Motivo pendiente: {{motivo_pendiente}}
Canal: {{canal}}

Genera DOS mensajes para recuperar a este paciente a través de {{canal}}:

1. "Versión Preventiva" (basada en salud y cuidado genuino):
Usa el contexto médico real de {{motivo_pendiente}} para crear urgencia clínica legítima. Ejemplo: si es control de diabetes, menciona que los estudios de HbA1c sin control por más de 3 meses pueden alterar el ajuste del tratamiento. Que suene como el médico que realmente se preocupa por {{paciente}}, no como una campaña de marketing.

2. "Versión Beneficio" (práctica, centrada en facilidad):
Ofrece algo concreto: horario extendido, cita exprés sin espera, recordatorio de que sus estudios anteriores ya están en el expediente y solo toma 20 minutos. Haz que volver sea el camino de menor resistencia.

Ambos mensajes máximo 6 líneas, tono cálido y profesional, adaptados al estilo comunicativo de {{canal}}.`
    },
    {
      slug: 'upsell-salud-ai',
      name_en: 'UpsellSalud AI',
      name_es: 'UpsellSalud AI',
      description_en: 'They came for a consultation. Leave with a full preventive health plan.',
      description_es: 'Transforma cada consulta en un plan de salud preventiva que el paciente realmente quiere.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'paciente', type: 'text', label_en: 'Patient Name & Age', label_es: 'Nombre y edad del paciente', required: true },
        { id: 'motivo_consulta', type: 'text', label_en: 'Main Reason for Visit', label_es: 'Motivo de consulta de hoy', required: true },
        { id: 'perfil_riesgo', type: 'select', label_en: 'Health Risk Profile', label_es: 'Perfil de riesgo del paciente', required: true,
          options: [
            { value: 'joven_sano', label_en: 'Young & Healthy (under 35)', label_es: 'Joven y sano (menos de 35 años)' },
            { value: 'adulto_medio', label_en: 'Middle Age (35–55)', label_es: 'Adulto medio (35–55 años)' },
            { value: 'adulto_mayor', label_en: 'Senior (55+)', label_es: 'Adulto mayor (55+)' },
            { value: 'cronico', label_en: 'Chronic Condition', label_es: 'Paciente con condición crónica' }
          ]
        },
        { id: 'servicios_clinica', type: 'textarea', label_en: 'Available Services / Packages', label_es: 'Servicios y paquetes disponibles en tu clínica', required: true,
          placeholder_es: 'Panel metabólico completo, ultrasonido abdominal, paquete ejecutivo, medicina preventiva, vacunas...'
        }
      ],
      prompt_template: `Eres un Asesor de Medicina Preventiva y Estratega de Crecimiento para clínicas médicas.
El paciente {{paciente}} (perfil: {{perfil_riesgo}}) llegó por {{motivo_consulta}}. Esta consulta es tu mejor momento para agregar valor real y aumentar el ticket.

Servicios disponibles: {{servicios_clinica}}

Selecciona los 3 servicios o estudios adicionales más relevantes para {{paciente}} según su perfil {{perfil_riesgo}}.

Para cada uno entrega:
1. QUÉ RECOMENDAR: El servicio exacto, enmarcado como "recomendación médica preventiva", con base clínica real (ej. "A partir de los 40 años, el riesgo cardiovascular...").
2. EL ARGUMENTO COSTO-BENEFICIO: Cuánto puede costarle al paciente NO hacerlo ahora vs. el costo del estudio hoy. Usa cifras realistas.
3. EL GUION MÉDICO: Las palabras exactas que el médico debe decir de forma natural al final de la consulta para presentar la recomendación sin que suene a venta.

Cierra con el "Paquete Salud {{paciente}}": cómo agrupar los 3 servicios bajo un nombre atractivo (ej. "Paquete Ejecutivo 40+") con precio combinado y la frase de presentación que el recepcionista usará al dar el resumen de la cita.`
    },
    {
      slug: 'alta-medica-ai',
      name_en: 'AltaMédica AI',
      name_es: 'AltaMédica AI',
      description_en: 'Post-consultation summaries that patients actually read and follow.',
      description_es: 'Genera resúmenes de alta médica claros que los pacientes entienden y realmente siguen.',
      icon: 'FileText',
      form_schema: [
        { id: 'paciente', type: 'text', label_en: 'Patient Name', label_es: 'Nombre del paciente', required: true },
        { id: 'diagnostico', type: 'text', label_en: 'Diagnosis', label_es: 'Diagnóstico principal', required: true },
        { id: 'indicaciones', type: 'textarea', label_en: 'Medications & Treatment', label_es: 'Medicamentos y tratamiento indicado', required: true,
          placeholder_es: 'Amoxicilina 500mg cada 8h por 7 días, reposo relativo, dieta blanda...'
        },
        { id: 'restricciones', type: 'textarea', label_en: 'Restrictions & Red Flags', label_es: 'Restricciones y señales de alarma para volver urgente', required: false,
          placeholder_es: 'No alcohol con el tratamiento, regresar si: fiebre mayor a 38.5°C, dolor que no cede...'
        },
        { id: 'proxima_cita', type: 'text', label_en: 'Next Appointment', label_es: 'Fecha de próxima cita o control', required: true },
        { id: 'estudios_pendientes', type: 'text', label_en: 'Pending Studies / Labs', label_es: 'Estudios o laboratorios pendientes', required: false }
      ],
      prompt_template: `Actúa como el mejor comunicador médico del país. Tu trabajo es traducir el lenguaje clínico a instrucciones humanas claras que un paciente sin formación médica pueda seguir al pie de la letra.

Paciente: {{paciente}}
Diagnóstico: {{diagnostico}}
Tratamiento: {{indicaciones}}
Restricciones y alarmas: {{restricciones}}
Próxima cita: {{proxima_cita}}
Estudios pendientes: {{estudios_pendientes}}

Genera DOS documentos listos para entregar:

1. RESUMEN PARA EL PACIENTE (formato WhatsApp / impreso):
Escrito en primera persona del médico, como si le hablara directamente a {{paciente}}. Usa ✅ para indicaciones, ❌ para lo que no debe hacer, y 🚨 para señales de alarma de emergencia. Incluye recordatorio amigable de la cita {{proxima_cita}} y de los estudios pendientes {{estudios_pendientes}}. Máximo 15 líneas, escaneable.

2. NOTA MÉDICA DE ALTA (formato expediente clínico):
Redacción clínica formal con: motivo de consulta, hallazgos relevantes, diagnóstico, plan terapéutico, indicaciones de seguimiento y fecha de revisión. Estilo SOAP resumido. Máximo 10 líneas.`
    },
    {
      slug: 'decide-clinica-med',
      name_en: 'DecideClínica Med',
      name_es: 'DecideClínica Med',
      description_en: 'Your clinic financials should prescribe business decisions, not just fill reports.',
      description_es: 'Analiza tus números de clínica y recibe decisiones estratégicas de alto impacto.',
      icon: 'PieChart',
      form_schema: [
        { id: 'datos_clinica', type: 'textarea', label_en: 'Clinic Data (revenue, services, appointments)', label_es: 'Datos de la clínica (consultas, ingresos, servicios más/menos vendidos)', required: true },
        { id: 'problema', type: 'text', label_en: 'Main Business Pain', label_es: 'Principal problema que quieres resolver', required: true },
        { id: 'area', type: 'select', label_en: 'Focus Area', label_es: 'Área a analizar', required: true,
          options: [
            { value: 'ingresos', label_en: 'Revenue & Most Profitable Services', label_es: 'Ingresos / Servicios más rentables' },
            { value: 'retencion', label_en: 'Patient Retention & No-shows', label_es: 'Retención de pacientes y ausentismo' },
            { value: 'costos', label_en: 'Cost Control (staff, supplies)', label_es: 'Control de costos (personal, insumos)' },
            { value: 'crecimiento', label_en: 'Growth & New Services', label_es: 'Crecimiento / Nuevos servicios o especialidades' }
          ]
        },
        { id: 'especialidad', type: 'text', label_en: 'Clinic Specialty', label_es: 'Especialidad o tipo de clínica', required: true },
        { id: 'contexto', type: 'textarea', label_en: 'Market Context', label_es: 'Contexto relevante (competencia, temporada, zona)', required: true }
      ],
      prompt_template: `Eres un Consultor de Gestión Hospitalaria y Negocios de Salud con 20 años de experiencia reestructurando clínicas privadas.
Las clínicas con excelencia médica pero gestión débil pierden hasta el 40% de su potencial de ingresos.

Datos de la clínica: {{datos_clinica}}
Especialidad: {{especialidad}}
Problema a resolver: {{problema}}
Área de análisis: {{area}}
Contexto: {{contexto}}

Entrega 3 Decisiones Estratégicas ejecutables esta semana. Para cada una:
1. LA DECISIÓN: Acción concreta, específica y sin ambigüedades. No "mejorar la comunicación", sino "llamar a los 15 pacientes con cita cancelada en los últimos 30 días con este guion...".
2. FUNDAMENTO EN DATOS: Cómo los números de {{datos_clinica}} justifican esta decisión para el área de {{area}}.
3. PRIMEROS 48H: El movimiento exacto que el director o administrador de la clínica ejecuta mañana para poner en marcha esta decisión.

Finaliza con el "Diagnóstico Financiero de la Clínica":
🟢 Clínica Saludable | 🟡 Síntomas de Alerta | 🔴 Hemorragia Operativa
Justificado en dos líneas con los datos proporcionados.`
    },
    {
      slug: 'pulse-clinica',
      name_en: 'PulseClínica',
      name_es: 'PulseClínica',
      description_en: 'Know in 30 seconds if your clinic had a good day.',
      description_es: 'El cierre diario de tu clínica: citas, ingresos, alertas y plan para mañana.',
      icon: 'Activity',
      form_schema: [
        { id: 'citas_programadas', type: 'text', label_en: 'Scheduled Appointments', label_es: 'Citas programadas hoy', required: true },
        { id: 'citas_atendidas', type: 'text', label_en: 'Completed Appointments', label_es: 'Citas efectivamente atendidas', required: true },
        { id: 'ingresos_dia', type: 'text', label_en: "Today's Revenue (approx.)", label_es: 'Ingresos del día (aproximado)', required: true },
        { id: 'cancelaciones_motivo', type: 'textarea', label_en: 'Cancellations & Reasons', label_es: 'Cancelaciones o no-shows y motivo (si se conocen)', required: true },
        { id: 'incidencias', type: 'textarea', label_en: 'Incidents / Notable Cases', label_es: 'Incidencias clínicas u operativas del día', required: false,
          placeholder_es: 'Urgencia fuera de horario, queja de paciente, falla de equipo, insumo agotado...'
        },
        { id: 'meta_semanal', type: 'text', label_en: 'Weekly Revenue Goal', label_es: 'Meta de ingresos de la semana', required: false }
      ],
      prompt_template: `Eres el Sistema de Inteligencia Operativa de una Clínica Médica de Alto Desempeño.
El director necesita saber en menos de un minuto si el día fue productivo y qué debe hacer mañana.

- Citas programadas: {{citas_programadas}}
- Citas atendidas: {{citas_atendidas}}
- Ingresos del día: {{ingresos_dia}}
- Cancelaciones: {{cancelaciones_motivo}}
- Incidencias: {{incidencias}}
- Meta semanal: {{meta_semanal}}

Genera el "PulseClínica del Día":

1. SEMÁFORO EJECUTIVO (una línea):
🟢 Día Productivo | 🟡 Bajo el Potencial | 🔴 Día Crítico
Basado en ratio de asistencia ({{citas_atendidas}}/{{citas_programadas}}) e ingreso vs. meta.

2. ANÁLISIS DE FUGA: ¿Cuánto dinero se perdió por las cancelaciones de hoy? Estima el ingreso potencial no capturado y si el patrón de {{cancelaciones_motivo}} sugiere un problema sistémico.

3. AVANCE HACIA META: Si se tiene meta semanal {{meta_semanal}}, ¿cuánto falta y qué número de consultas diarias se necesitan para llegar? Ajusta la proyección según el ritmo de hoy.

4. ÚNICA PRIORIDAD PARA MAÑANA: La acción más crítica que el administrador debe ejecutar la primera hora del día (recuperar cancelaciones, confirmar citas, reponer insumo, etc.).`
    },
    {
      slug: 'salud-loop',
      name_en: 'SaludLoop Premium',
      name_es: 'SaludLoop Premium',
      description_en: 'From first appointment to lifetime patient loyalty. Full practice cycle.',
      description_es: 'Reactivación + Upsell preventivo + Control operativo. El sistema completo de tu clínica.',
      icon: 'RefreshCw',
      form_schema: [
        { id: 'clinica', type: 'text', label_en: 'Clinic / Practice Name', label_es: 'Nombre de la clínica o consultorio', required: true },
        { id: 'especialidad', type: 'text', label_en: 'Medical Specialty', label_es: 'Especialidad médica o tipo de clínica', required: true,
          placeholder_es: 'Medicina general, cardiología, ginecología, clínica familiar...'
        },
        { id: 'num_medicos', type: 'text', label_en: 'Number of Doctors / Staff', label_es: 'Número de médicos y personal', required: true },
        { id: 'dolor_retencion', type: 'textarea', label_en: 'Patient Retention Problem', label_es: 'Problema principal: pacientes que no regresan o cancelan mucho', required: true },
        { id: 'dolor_ingresos', type: 'textarea', label_en: 'Revenue Problem', label_es: 'Problema principal de ingresos (temporadas bajas, servicios poco usados)', required: true },
        { id: 'fase', type: 'select', label_en: 'Priority Phase Today', label_es: 'Fase donde necesitas más impacto hoy', required: true,
          options: [
            { value: 'reactivacion', label_en: 'Patient Reactivation Campaign', label_es: 'Campaña de reactivación de pacientes' },
            { value: 'upsell', label_en: 'Preventive Health Upsell', label_es: 'Upsell de servicios preventivos' },
            { value: 'operacion', label_en: 'Clinic Operations & KPIs', label_es: 'Operación y control de indicadores' }
          ]
        }
      ],
      prompt_template: `Eres el Consultor Estratégico de referencia para clínicas médicas privadas, implementando el sistema "SaludLoop": el ciclo de crecimiento sin fugas para médicos con visión empresarial.

Clínica: {{clinica}}
Especialidad: {{especialidad}}
Equipo: {{num_medicos}} médicos/personal
Problema de retención: {{dolor_retencion}}
Problema de ingresos: {{dolor_ingresos}}
Fase prioritaria: {{fase}}

Activa el módulo SaludLoop correspondiente:

Si {{fase}} = REACTIVACIÓN:
→ Diseña la Campaña de Reactivación de Pacientes Inactivos para {{clinica}}. Incluye: el mensaje de WhatsApp/email listo para usar (tono médico, no comercial), el argumento de salud preventiva específico para {{especialidad}}, la oferta de "puerta de entrada" (consulta express, descuento en estudios, etc.) y el calendario de seguimiento en 3 toques (día 1 – día 5 – día 12).

Si {{fase}} = UPSELL:
→ Construye el "Portafolio de Salud Preventiva {{clinica}}": 3 paquetes escalonados (Esencial / Completo / Premium) con los servicios incluidos en cada nivel, precio sugerido y el guion de 3 oraciones que el médico dice al final de la consulta para presentarlos como recomendación clínica.

Si {{fase}} = OPERACIÓN:
→ Crea el "Tablero Semanal del Director Médico": los 5 KPIs que el director revisa cada lunes (tasa de asistencia, ticket promedio, tasa de recompra, citas canceladas recuperadas, margen de servicios premium), la fórmula de cálculo de cada uno con los datos del sistema y la política para reducir el ausentismo descrito en {{dolor_retencion}}.

Siempre cierra con "El Próximo Movimiento de {{clinica}}": la única acción de mayor ROI que el director médico ejecuta mañana por la mañana.`
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

    // Business plan for premium/analytics apps, Pro for the rest
    let targetPlan = proPlan
    if (app.slug === 'salud-loop' || app.slug === 'decide-clinica-med') {
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

  console.log('\n✅ Micro-Apps de Salud / Clínicas Médicas completadas.')
  console.log('Apps insertadas:')
  apps.forEach(a => console.log(` - ${a.slug} (${a.name_es})`))
}

run()

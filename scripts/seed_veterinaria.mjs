import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('🐾 Seeding Micro-Apps para Clínicas Veterinarias...')

  const apps = [
    {
      slug: 'reactiva-mascota',
      name_en: 'ReactivaMascota',
      name_es: 'ReactivaMascota',
      description_en: 'That pet owner hasn\'t come back in months. Their pet needs you.',
      description_es: 'Reactiva mascotas con vacunas vencidas y dueños que dejaron de venir.',
      icon: 'Heart',
      form_schema: [
        { id: 'dueno', type: 'text', label_en: 'Owner Name', label_es: 'Nombre del dueño', required: true },
        { id: 'mascota', type: 'text', label_en: 'Pet Name & Species', label_es: 'Nombre y especie de la mascota', required: true },
        { id: 'meses_ausente', type: 'text', label_en: 'Months Without Visit', label_es: 'Meses sin visitar la clínica', required: true },
        { id: 'motivo_pendiente', type: 'select', label_en: 'Pending Reason', label_es: 'Motivo de visita pendiente', required: true,
          options: [
            { value: 'vacuna', label_en: 'Overdue Vaccine', label_es: 'Vacuna vencida o próxima a vencer' },
            { value: 'desparasitacion', label_en: 'Deworming', label_es: 'Desparasitación pendiente' },
            { value: 'revision_anual', label_en: 'Annual Checkup', label_es: 'Revisión anual de salud' },
            { value: 'seguimiento', label_en: 'Post-treatment Follow-up', label_es: 'Seguimiento de tratamiento anterior' },
            { value: 'sin_contacto', label_en: 'No Specific Reason', label_es: 'Sin razón específica registrada' }
          ]
        },
        { id: 'canal', type: 'select', label_en: 'Contact Channel', label_es: 'Canal de contacto', required: true,
          options: [
            { value: 'whatsapp', label_en: 'WhatsApp', label_es: 'WhatsApp' },
            { value: 'email', label_en: 'Email', label_es: 'Email' },
            { value: 'sms', label_en: 'SMS', label_es: 'SMS' }
          ]
        }
      ],
      prompt_template: `Actúa como el Médico Veterinario más empático y persuasivo de la ciudad.
Tienes un cliente que no ha regresado a la clínica en {{meses_ausente}} meses. Su mascota {{mascota}} tiene pendiente: {{motivo_pendiente}}.
Dueño: {{dueno}}

Genera DOS mensajes de reactivación para enviar por {{canal}}:

1. "Versión Salud" (emocional, centrada en el bienestar de {{mascota}}): 
Usa el apego emocional del dueño a su mascota. Menciona el riesgo real pero gentil de NO atender {{motivo_pendiente}}. Incluye un dato médico específico que genere urgencia real (ejemplo: el parvovirus persiste en suelo 7 años, las vacunas de moquillo pierden efectividad después de X meses). Termina con un CTA claro para agendar.

2. "Versión Beneficio" (práctica, centrada en comodidad):
Ofrece algo concreto: descuento del 10% esta semana, recordatorio de que pueden llegar sin cita, paquete de salud preventiva a precio especial. Hazlo irresistible sin sonar desesperado.

Ambos mensajes deben sentirse escritos por el propio veterinario, cálidos y profesionales. Máximo 5 líneas cada uno. Listos para pegar en {{canal}}.`
    },
    {
      slug: 'upsell-vet-ai',
      name_en: 'UpsellVet AI',
      name_es: 'UpsellVet AI',
      description_en: 'They came for a vaccine. Leave with a full preventive health plan.',
      description_es: 'Convierte cada consulta en una venta de servicios premium de bienestar animal.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'mascota', type: 'text', label_en: 'Pet Name, Age & Species', label_es: 'Nombre, edad y especie de la mascota', required: true },
        { id: 'motivo_consulta', type: 'text', label_en: 'Reason for Visit', label_es: 'Motivo de la consulta actual', required: true },
        { id: 'perfil_dueno', type: 'select', label_en: "Owner's Investment Profile", label_es: 'Perfil de inversión del dueño', required: true,
          options: [
            { value: 'economico', label_en: 'Budget-conscious', label_es: 'Económico / cuida cada peso' },
            { value: 'moderado', label_en: 'Moderate / open to recommendations', label_es: 'Moderado / abierto a recomendaciones' },
            { value: 'premium', label_en: 'Premium / best for my pet', label_es: 'Premium / lo mejor para su mascota sin importar el costo' }
          ]
        },
        { id: 'servicios_disponibles', type: 'textarea', label_en: 'Available Services / Products', label_es: 'Servicios y productos disponibles en tu clínica', required: true,
          placeholder_es: 'Limpieza dental, ultrasonido, plan de salud anual, alimento premium, seguro mascota, grooming...'
        }
      ],
      prompt_template: `Eres un Asesor de Bienestar Animal y Estratega de Ventas para Clínicas Veterinarias.
El cliente llegó por {{motivo_consulta}} para su mascota {{mascota}}. Esta es tu ventana de oro.

Perfil económico del dueño: {{perfil_dueno}}
Servicios disponibles en la clínica: {{servicios_disponibles}}

Selecciona los 3 upsells más irresistibles y apropiados para {{mascota}} con perfil {{perfil_dueno}}.

Para cada uno entrega:
1. QUÉ OFRECER: El servicio o producto exacto, presentado como "recomendación médica", no venta.
2. EL ARGUMENTO EMOCIONAL-MÉDICO: Por qué {{mascota}} necesita eso AHORA. Usa la edad/especie para personalizar (ej. "A partir de los 5 años en perros medianos, la placa dental se convierte en...").
3. EL GUION: Las palabras exactas que el veterinario o recepcionista debe decir en ese momento de la consulta para presentarlo de forma natural.

Cierra con un "Paquete Salud {{mascota}}": cómo combinar los 3 servicios en una propuesta única con nombre y precio estimado que se pueda imprimir y entregar al dueño antes de salir.`
    },
    {
      slug: 'consulta-vet-ai',
      name_en: 'ConsultaVet AI',
      name_es: 'ConsultaVet AI',
      description_en: 'Generate post-consultation care instructions that actually get followed.',
      description_es: 'Genera instrucciones de cuidado post-consulta personalizadas que los dueños realmente siguen.',
      icon: 'FileText',
      form_schema: [
        { id: 'mascota', type: 'text', label_en: 'Pet Name, Species & Age', label_es: 'Nombre, especie y edad de la mascota', required: true },
        { id: 'diagnostico', type: 'text', label_en: 'Diagnosis / Condition Treated', label_es: 'Diagnóstico o condición tratada hoy', required: true },
        { id: 'tratamiento', type: 'textarea', label_en: 'Treatment / Medications Prescribed', label_es: 'Tratamiento o medicamentos recetados', required: true },
        { id: 'restricciones', type: 'textarea', label_en: 'Restrictions / Warnings', label_es: 'Restricciones o señales de alarma', required: false,
          placeholder_es: 'No bañar por 3 días, no dejar correr, señales de alerta: vómito, fiebre...'
        },
        { id: 'seguimiento', type: 'text', label_en: 'Follow-up Date', label_es: 'Fecha de seguimiento o próxima cita', required: true }
      ],
      prompt_template: `Actúa como el Veterinario titular redactando las instrucciones post-consulta más claras y empáticas que un dueño de mascota ha recibido en su vida.

Mascota: {{mascota}}
Diagnóstico: {{diagnostico}}
Tratamiento: {{tratamiento}}
Restricciones: {{restricciones}}
Próxima cita: {{seguimiento}}

Genera DOS documentos listos para compartir:

1. INSTRUCCIONES DE CUIDADO EN CASA (WhatsApp-friendly):
Escrito como si el veterinario le hablara directamente al dueño. Usa emojis con moderación para hacer el texto escaneable. Incluye:
- Medicamentos: nombre, dosis, horario y con qué darlos (con o sin comida)
- Lo QUE SÍ puede hacer {{mascota}} estos días
- Lo que NUNCA debe hacer (señales de alarma para ir de urgencia)
- Recordatorio amigable de la cita {{seguimiento}}

2. RESUMEN MÉDICO FORMAL (para el expediente o enviar a otro especialista):
Formato clínico conciso: motivo de consulta, hallazgos, diagnóstico, plan de tratamiento y fecha de revisión. Máximo 10 líneas.`
    },
    {
      slug: 'decide-clinica',
      name_en: 'DecideClínica',
      name_es: 'DecideClínica',
      description_en: 'Your clinic data should prescribe business decisions, not just fill reports.',
      description_es: 'Analiza los números de tu clínica y recibe decisiones estratégicas accionables.',
      icon: 'BarChart2',
      form_schema: [
        { id: 'datos_clinica', type: 'textarea', label_en: 'Clinic Financial/Operational Data', label_es: 'Datos de la clínica (consultas, ingresos, servicios más/menos vendidos)', required: true },
        { id: 'problema', type: 'text', label_en: 'Main Business Problem', label_es: 'Problema principal que quieres resolver', required: true },
        { id: 'area', type: 'select', label_en: 'Analysis Area', label_es: 'Área de análisis', required: true,
          options: [
            { value: 'ingresos', label_en: 'Revenue & Services', label_es: 'Ingresos / Servicios más rentables' },
            { value: 'retencion', label_en: 'Patient Retention', label_es: 'Retención de pacientes' },
            { value: 'costos', label_en: 'Cost Control', label_es: 'Control de costos (medicamentos, personal)' },
            { value: 'crecimiento', label_en: 'Growth & Marketing', label_es: 'Crecimiento / Marketing' }
          ]
        },
        { id: 'contexto', type: 'textarea', label_en: 'Context (season, competition, location)', label_es: 'Contexto (temporada, competencia, zona geográfica)', required: true }
      ],
      prompt_template: `Eres un Consultor de Gestión Empresarial especializado en clínicas veterinarias y negocios de salud animal.
Las clínicas vet con gran corazón pero sin estrategia financiera terminan cerrando. Evitemos eso.

Datos de la clínica: {{datos_clinica}}
Problema a resolver: {{problema}}
Área de análisis: {{area}}
Contexto: {{contexto}}

Entrega 3 Decisiones Estratégicas accionables esta semana. Para cada una:
1. LA DECISIÓN: Acción concreta y específica (no consejos genéricos).
2. FUNDAMENTO EN DATOS: Cómo los números de {{datos_clinica}} justifican exactamente esta decisión para el área de {{area}}.
3. IMPLEMENTACIÓN EN 48H: El primer movimiento que el dueño de la clínica puede ejecutar mañana mismo para activar esta decisión.

Finaliza con el "Semáforo de Clínica": 🟢 Clínica Saludable / 🟡 Diagnóstico Preventivo / 🔴 Urgencia Financiera — y explica el diagnóstico en dos líneas.`
    },
    {
      slug: 'pulse-vet',
      name_en: 'PulseVet',
      name_es: 'PulseVet',
      description_en: 'Know if today was a good clinic day in 30 seconds.',
      description_es: 'El reporte diario de tu clínica en 30 segundos. Citas, ingresos y alertas del día.',
      icon: 'Activity',
      form_schema: [
        { id: 'citas_programadas', type: 'text', label_en: 'Scheduled Appointments', label_es: 'Citas programadas hoy', required: true },
        { id: 'citas_atendidas', type: 'text', label_en: 'Completed Appointments', label_es: 'Citas efectivamente atendidas', required: true },
        { id: 'ingresos_dia', type: 'text', label_en: "Today's Revenue", label_es: 'Ingresos del día (aproximado)', required: true },
        { id: 'incidencias', type: 'textarea', label_en: 'Incidents or Notable Cases', label_es: 'Incidencias o casos relevantes del día', required: true,
          placeholder_es: 'Urgencias, cancelaciones, quejas, caso complicado, paciente nuevo...'
        },
        { id: 'inventario_alerta', type: 'textarea', label_en: 'Low Stock Alerts', label_es: 'Medicamentos o insumos con stock bajo', required: false,
          placeholder_es: 'Vacuna antirrábica (últimas 3 dosis), amoxicilina infantil...'
        }
      ],
      prompt_template: `Actúa como el Sistema de Inteligencia Operativa de una Clínica Veterinaria de alto desempeño.
El veterinario dueño necesita saber en 30 segundos si el día fue bueno, regular o crítico.

- Citas programadas: {{citas_programadas}}
- Citas atendidas: {{citas_atendidas}}
- Ingresos del día: {{ingresos_dia}}
- Incidencias: {{incidencias}}
- Alertas de inventario: {{inventario_alerta}}

Genera el "PulseVet del Día":

1. SEMÁFORO EJECUTIVO:
🟢 Día Productivo | 🟡 Por debajo del potencial | 🔴 Día Crítico
Justificado en una línea con el ratio de citas atendidas vs. programadas y los ingresos.

2. ANÁLISIS DE EFICIENCIA: ¿El ingreso de {{ingresos_dia}} es consistente con {{citas_atendidas}} consultas? Estima si se aprovechó el potencial de upsell del día o si se dejó dinero sobre la mesa.

3. ALERTA PRIORITARIA: La única cosa más urgente que el dueño debe resolver mañana a primera hora (puede ser inventario crítico, paciente de seguimiento, o estrategia de recuperación si el día fue bajo).

4. META MÍNIMA MAÑANA: Basado en los datos de hoy, cuál es el número de citas y el ingreso mínimo que la clínica debería alcanzar mañana para que la semana sea rentable.`
    },
    {
      slug: 'vet-loop',
      name_en: 'VetLoop Premium',
      name_es: 'VetLoop Premium',
      description_en: 'From the first appointment to lifelong patient loyalty. Full cycle.',
      description_es: 'Reactivación + Upsell + Control Diario. El sistema completo para tu clínica veterinaria.',
      icon: 'RefreshCw',
      form_schema: [
        { id: 'clinica', type: 'text', label_en: 'Clinic Name', label_es: 'Nombre de tu clínica veterinaria', required: true },
        { id: 'especialidad', type: 'text', label_en: 'Specialty or Focus', label_es: 'Especialidad o enfoque (mascotas pequeñas, exóticos, rural...)', required: true },
        { id: 'dolor_retencion', type: 'textarea', label_en: 'Retention / Reactivation Pain', label_es: 'Problema principal: pacientes que no regresan o citas canceladas', required: true },
        { id: 'dolor_ingresos', type: 'textarea', label_en: 'Revenue Pain Point', label_es: 'Problema principal de ingresos (temporadas bajas, servicios poco vendidos)', required: true },
        { id: 'fase', type: 'select', label_en: 'Priority Phase', label_es: 'Fase donde necesitas más ayuda hoy', required: true,
          options: [
            { value: 'reactivacion', label_en: 'Patient Reactivation', label_es: 'Reactivación de pacientes inactivos' },
            { value: 'upsell', label_en: 'Revenue & Upsell', label_es: 'Incrementar ingresos por consulta' },
            { value: 'operacion', label_en: 'Clinic Operations & Control', label_es: 'Operación y control diario de la clínica' }
          ]
        }
      ],
      prompt_template: `Eres el Consultor Estratégico más experimentado en clínicas veterinarias y negocios de salud animal, implementando el sistema "VetLoop" — el ciclo de crecimiento sin fugas para veterinarios emprendedores.

Clínica: {{clinica}}
Especialidad: {{especialidad}}
Problema de retención: {{dolor_retencion}}
Problema de ingresos: {{dolor_ingresos}}
Fase prioritaria: {{fase}}

Activa el módulo correspondiente a la fase elegida:

Si {{fase}} = REACTIVACIÓN:
→ Diseña la Campaña de Reactivación de Clientes Inactivos más efectiva para una clínica de {{especialidad}}. Incluye: el mensaje de WhatsApp/email listo para usar, el argumento médico-emocional, la oferta de "puerta de entrada" y el calendario de seguimiento de 3 mensajes (día 1, día 5, día 10).

Si {{fase}} = UPSELL:
→ Construye el "Menú de Bienestar Preventivo {{clinica}}": un sistema de 3 paquetes escalonados (Básico / Plus / Premium) que el equipo pueda presentar al final de cada consulta. Incluye qué servicios van en cada paquete, el precio sugerido y el guion de presentación para el veterinario.

Si {{fase}} = OPERACIÓN:
→ Crea el "Protocolo de Apertura y Cierre Semanal" de la clínica: los 5 KPIs que el dueño debe revisar cada lunes, el sistema de seguimiento de citas de la semana y la política para reducir cancelaciones de último minuto en {{dolor_retencion}}.

Siempre finaliza con: "Próximo movimiento de {{clinica}}": la única acción de mayor impacto que el veterinario debe ejecutar mañana.`
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
    if (app.slug === 'vet-loop' || app.slug === 'decide-clinica') {
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

  console.log('\n✅ Micro-Apps de Veterinaria completadas.')
  console.log('Apps insertadas:')
  apps.forEach(a => console.log(` - ${a.slug} (${a.name_es})`))
}

run()

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
  console.log('Seeding Micro-Apps para Gimnasios y Centros Fitness...')

  const apps = [
    {
      slug: 'reactiva-gym',
      name_en: 'ReactivaGym',
      name_es: 'ReactivaGym',
      description_en: 'Activate members who ghosted before they cancel their membership.',
      description_es: 'Evita la cancelación. Reactiva a los socios fantasmas antes de que se den de baja.',
      icon: 'Activity',
      form_schema: [
        { id: 'member_name', type: 'text', label_en: 'Member Name', label_es: 'Nombre del Socio', required: true },
        { id: 'weeks_absent', type: 'text', label_en: 'Weeks Absent', label_es: 'Semanas sin asistir', required: true },
        { id: 'goal', type: 'text', label_en: 'Original Goal', label_es: 'Objetivo original (Bajar peso, Músculo)', required: true },
        { id: 'excuse', type: 'select', label_en: 'Assumed Reason', label_es: 'Razón supuesta de la ausencia', required: true,
          options_es: ['Falta de motivación', 'Falta de tiempo', 'Lesión', 'Vacaciones', 'Desconocida'],
          options_en: ['Lack of motivation', 'Lack of time', 'Injury', 'Vacation', 'Unknown']
        },
        { id: 'channel', type: 'select', label_en: 'Preferred Channel', label_es: 'Canal de contacto', required: true,
          options_es: ['WhatsApp', 'SMS'],
          options_en: ['WhatsApp', 'SMS']
        }
      ],
      prompt_template: `Actúa como el mejor Coach y Retenedor de Clientes de un Gimnasio. 
El gimnasio pierde mucho dinero por "deserción silenciosa". Necesitamos recuperar a este socio empáticamente.
- Socio: {{member_name}}
- Ausente por: {{weeks_absent}} semanas
- Su meta inicial era: {{goal}}
- Causa probable: {{excuse}}

Genera 2 mensajes perfectos de reactivación listos para mandar por {{channel}}:
1. "Versión Motivacional": Enfocada en la disciplina, recordando su meta inicial ({{goal}}) y removiendo fricciones (sin juzgar, invitándolo a un reinicio suave).
2. "Versión Intervención": Ofreciendo agendar una asesoría express de 10 minutos (gratis) con un entrenador para reestructurar su plan por su probable {{excuse}}.
Finaliza recomendando la mejor estrategia (versión) a seguir.`
    },
    {
      slug: 'upsell-gym',
      name_en: 'UpsellGym AI',
      name_es: 'UpsellGym AI',
      description_en: 'They pay the basic fee. Sell them PT, supplements, or nutrition.',
      description_es: 'Ya pagan mensualidad. Véndeles entrenamiento personal o suplementos.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'member_name', type: 'text', label_en: 'Member Name', label_es: 'Nombre del socio', required: true },
        { id: 'current_level', type: 'select', label_en: 'Current Experience', label_es: 'Nivel/Experiencia actual', required: true,
          options_es: ['Principiante (perdido en máquinas)', 'Intermedio (estancado)', 'Avanzado (busca optimizar)'],
          options_en: ['Beginner', 'Intermediate', 'Advanced']
        },
        { id: 'goal', type: 'text', label_en: 'Current Goal', label_es: 'Objetivo físico actual', required: true },
        { id: 'available_services', type: 'textarea', label_en: 'Gym Extras', label_es: 'Extras disponibles en el gym (PT, nutris, whey)', required: true }
      ],
      prompt_template: `Eres el Director Comercial de un Centro Fitness de Élite. 
Hay un socio que asiste regularmente pagando solo la mensualidad básica. Debemos aumentar su ticket mensual (LTV).
- Socio: {{member_name}}
- Nivel en piso: {{current_level}}
- Objetivo: {{goal}}
- Catálogo de extras del gym: {{available_services}}

Detecta los 3 'upsells' (Personal Trainer, Nutrición, Suplementos, Clases) más lógicos que resolverían la frustración de su {{current_level}}.
Para cada opción genera:
1. El producto/servicio a ofrecer.
2. "Rompehielo en el piso": Qué frase exacta debe decirle el entrenador de turno durante su rutina para sembrar la semilla de la venta.
3. El argumento lógico/físico irrefutable de por qué lo necesita para llegar a {{goal}} más rápido.`
    },
    {
      slug: 'retiene-gym',
      name_en: 'Welcome & Retain',
      name_es: 'RetieneGym',
      description_en: 'Structure the first 14 days of a newbie to guarantee they stay 12 months.',
      description_es: 'Diseña sus primeros 14 días para garantizar que se quede todo el año.',
      icon: 'Users',
      form_schema: [
        { id: 'member_name', type: 'text', label_en: 'Lead/Newbie Name', label_es: 'Nombre del nuevo afiliado', required: true },
        { id: 'fear', type: 'text', label_en: 'Main Fear/Insecurity', label_es: 'Mayor miedo/inseguridad declarada (ej. miedo a lesionarse, vergüenza)', required: true },
        { id: 'availability', type: 'select', label_en: 'Weekly Availability', label_es: 'Disponibilidad semanal', required: true,
          options_es: ['1-2 días (Ocupado)', '3-4 días (Normal)', '5+ días (Motivado)'],
          options_en: ['1-2 days', '3-4 days', '5+ days']
        },
        { id: 'gym_type', type: 'text', label_en: 'Gym Style', label_es: 'Estilo de gym (Crossfit, Convencional, Boutique)', required: true }
      ],
      prompt_template: `Actúa como Gerente de Fidelización Deportiva.
Estadísticamente, si un cliente sobrevive sus primeros 14 días sintiéndose acompañado, se queda 12 meses.
- Cliente nuevo: {{member_name}}
- Inseguridad: {{fear}}
- Viene: {{availability}}
- Tipo de gym: {{gym_type}}

Crea un Protocolo "Onboarding de 14 Días" para recepción y staff:
1. Día 1 (El Recibimiento): Checklist exacto para la recepción para eliminar el {{fear}}.
2. Semana 1 (La Fricción): Qué seguimiento por WA enviar el día 4.
3. Semana 2 (El Hábito): Un pequeño "premio" emocional a sugerir (chocar manos, mención en pizarra).
4. El guion de inducción inicial perfecto para este perfil específico.`
    },
    {
      slug: 'decide-gym',
      name_en: 'DecideGym',
      name_es: 'DecideGym',
      description_en: 'Your numbers must dictate classes, prices, and marketing.',
      description_es: 'Tus números dictan qué clases abrir, qué cerrar y dónde invertir.',
      icon: 'PieChart',
      form_schema: [
        { id: 'kpi_data', type: 'textarea', label_en: 'Dashboard Data', label_es: 'Datos del mes (Altas, Bajas, Costos de profes)', required: true },
        { id: 'problem', type: 'text', label_en: 'Main Problem', label_es: 'Problema urgente (ej. clases vacías, alta deserción)', required: true },
        { id: 'focus_area', type: 'select', label_en: 'Focus Area', label_es: 'Área a intervenir', required: true,
          options_es: ['Rentabilidad de Clases Grupales', 'Ventas de Membresías', 'Retención de Socios'],
          options_en: ['Group Classes ROI', 'Membership Sales', 'Member Retention']
        },
        { id: 'context', type: 'textarea', label_en: 'Important Context', label_es: 'Contexto (competencia nueva fuerte, verano)', required: true }
      ],
      prompt_template: `Eres un Asesor Financiero experto en la Industria Fitness. 
El dueño del Gimnasio te contrata para apagar un fuego rentabilizando su metro cuadrado.
- Datos Duros: {{kpi_data}}
- Problema central: {{problem}}
- Foco: {{focus_area}}
- Factor Externo: {{context}}

Entrega 3 decisiones de choque para aplicar esta semana.
Para cada decisión especifica:
1. El movimiento táctico (Ej: Cancelar clase de 10 AM, lanzar promo semestral, cambiar comisión de ventas).
2. Justificación matemática del impacto en LTV (Life Time Value) o CAC (Costo Adquisición).
3. ¿Cómo comunicarlo al staff hoy sin causar pánico?`
    },
    {
      slug: 'pulse-gym',
      name_en: 'PulseGym',
      name_es: 'PulseGym',
      description_en: 'Get a quick operational read of your gym at closing time.',
      description_es: 'Lectura operativa rápida de tu gimnasio a la hora de cierre.',
      icon: 'Zap',
      form_schema: [
        { id: 'daily_numbers', type: 'textarea', label_en: 'Daily Stats', label_es: 'Altas, Bajas, Renovaciones de hoy', required: true },
        { id: 'issues', type: 'textarea', label_en: 'Incidents/Broken Gear', label_es: 'Máquinas rotas, faltas de staff, quejas', required: true },
        { id: 'cleaning', type: 'select', label_en: 'Cleanliness Report', label_es: 'Reporte de baños y limpieza', required: true,
          options_es: ['Impecable', 'Aceptable con quejas menores', 'Critico/Falta insumos'],
          options_en: ['Spotless', 'Acceptable', 'Critical/Missing supplies']
        },
        { id: 'comments', type: 'textarea', label_en: 'Recep/Manager Notes', label_es: 'Notas del coordinador de turno', required: true }
      ],
      prompt_template: `Eres el Auditor Operativo de Franquicias de Gimnasios.
El dueño no fue hoy. Envíale el resumen del cierre de turno.
- Números de hoy: {{daily_numbers}}
- Incidencias Técnicas: {{issues}}
- Estado Baños/Limpieza: {{cleaning}}
- Observaciones Staff: {{comments}}

Genera el "Semáforo de Cierre":
1. Semáforo: 🟢 (Crece), 🟡 (Peligro Leve), 🔴 (Fuego Operativo). Justifícalo con una línea.
2. Pulso de Ventas Netas: Cuántos sumamos vs perdimos hoy.
3. Alerta de Instalaciones: Qué reparar MAÑANA o comprar urgente basándote en la queja de {{issues}} y la limpieza {{cleaning}}.
4. Meta de Mañana: 1 directriz clara para exigir al staff en el grupo de WhatsApp de la mañana.`
    },
    {
      slug: 'gym-loop',
      name_en: 'GymLoop Premium',
      name_es: 'GymLoop Premium',
      description_en: 'The premium retention and sales flywheel for gyms.',
      description_es: 'El ciclo premium para centros fitness. Ventas + Retención conectadas.',
      icon: 'RefreshCw',
      form_schema: [
        { id: 'gym_name', type: 'text', label_en: 'Gym Name', label_es: 'Nombre del Centro', required: true },
        { id: 'model', type: 'text', label_en: 'Business Model', label_es: 'Modelo (Low Cost, Tradicional, Boutique, Crossfit)', required: true },
        { id: 'main_pain', type: 'textarea', label_en: 'Biggest Daily Pain', label_es: 'El dolor operativo más fuerte del dueño actualmente', required: true },
        { id: 'competitor', type: 'textarea', label_en: 'Direct Threat', label_es: 'Amenaza externa principal (SmartFit al frente, etc)', required: true }
      ],
      prompt_template: `Actúa como Director General de un conglomerado de gimnasios implementando la filosofía GymLoop.
Escenario:
- Marca: {{gym_name}}
- Modelo de Negocio: {{model}}
- Dolor Insoportable: {{main_pain}}
- Amenaza Letal: {{competitor}}

Elabora la Directriz Ecosistémica (De Obligatorio Cumplimiento) dividida en 3 áreas clave para contrarrestar la amenaza y solucionar el dolor:
1. ARMA RECEPCIÓN: Un KPI único y un formato de bienvenida contra-intuitivo para que la amenaza externa ({{competitor}}) no intimide a prospectos.
2. ARMA SALA/PISO: Una regla para instructores de piso enfocada a prevenir el dolor: {{main_pain}}.
3. MOTOR BACK-OFFICE: Política CERO BAJAS SILENCIOSAS. Cuántos días deben pasar sin que el molinete pase tarjeta, para aplicar qué flujo penalizado si nadie lo llama.`
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
    if (app.slug === 'gym-loop' || app.slug === 'decide-gym') {
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

  console.log('✅ Micro-Apps de Gimnasios (Seed) completado.')
}

run()

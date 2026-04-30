import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('💼 Seeding Micro-Apps para Consultoría y Coaching de Negocios...')

  const apps = [
    {
      slug: 'coach-flow',
      name_en: 'CoachFlow AI',
      name_es: 'CoachFlow AI',
      description_en: 'Plan your next high-impact coaching session in seconds.',
      description_es: 'Planifica tu próxima sesión de coaching de alto impacto en segundos.',
      icon: 'UserCheck',
      form_schema: [
        { id: 'client_name', type: 'text', label_en: 'Client Name', label_es: 'Nombre del cliente', required: true },
        { id: 'session_objective', type: 'text', label_en: 'Main Objective', label_es: 'Objetivo principal de la sesión', required: true, placeholder_es: 'ej. Definir estrategia de precios' },
        { id: 'current_block', type: 'textarea', label_en: 'Current Blockage', label_es: 'Bloqueo actual detectado', required: true },
        { id: 'session_type', type: 'select', label_en: 'Session Type', label_es: 'Tipo de sesión', required: true,
          options: [
            { value: 'diagnostico', label_en: 'Discovery/Diagnostic', label_es: 'Diagnóstico / Descubrimiento' },
            { value: 'estrategia', label_en: 'Strategic Planning', label_es: 'Planificación Estratégica' },
            { value: 'mentalidad', label_en: 'Mindset/Breakthrough', label_es: 'Mentalidad / Superación' },
            { value: 'revision', label_en: 'Accountability/Review', label_es: 'Revisión / Accountability' }
          ]
        }
      ],
      prompt_template: `Actúa como un Master Coach Ejecutivo de clase mundial.
Debes diseñar la estructura perfecta para la sesión de {{client_name}}.
- Objetivo: {{session_objective}}
- Bloqueo: {{current_block}}
- Tipo de sesión: {{session_type}}

Genera:
1. "El Rompehielo Estratégico": Una pregunta poderosa para iniciar la sesión y enfocar al cliente.
2. "Hoja de Ruta de la Sesión": Estructura de 4 bloques de tiempo (ej. 10m Revisión, 20m Profundización, etc.).
3. "Preguntas de Indagación Profunda": 3 preguntas tipo 'Socráticas' para que el cliente encuentre la solución por sí mismo.
4. "Tarea Imposible de Ignorar": Un compromiso de acción para el cliente que garantice resultados inmediatos antes de la próxima sesión.`
    },
    {
      slug: 'upsell-consult',
      name_en: 'UpsellConsult AI',
      name_es: 'UpsellConsult AI',
      description_en: 'Move from "per hour" to "high-ticket retainer" with a surgical strategy.',
      description_es: 'Pasa del cobro por hora al "retainer" de alto valor con una estrategia quirúrgica.',
      icon: 'Zap',
      form_schema: [
        { id: 'client_profile', type: 'textarea', label_en: 'Client Profile & Results', label_es: 'Perfil del cliente y resultados logrados', required: true },
        { id: 'current_fee', type: 'text', label_en: 'Current Fee', label_es: 'Cobro actual (monto/hora)', required: true },
        { id: 'potential_roi', type: 'textarea', label_en: 'Potential ROI of long-term work', label_es: 'ROI potencial del trabajo a largo plazo', required: true },
        { id: 'resistance', type: 'text', label_en: 'Main Objection', label_es: 'Principal objeción del cliente', required: true }
      ],
      prompt_template: `Eres un Estratega de Precios y Negociación para Consultores.
Tu objetivo es ayudar al usuario a subir el nivel de su contrato con un cliente actual.
- Perfil: {{client_profile}}
- Cobro actual: {{current_fee}}
- Valor proyectado: {{potential_roi}}
- Objeción: {{resistance}}

Genera:
1. "El Argumento de Valor Puro": Cómo presentar la transición de "horas" a "resultados" enfocándote en {{potential_roi}}.
2. "Estructura del Nuevo Package": Propuesta de un Retainer o Flat Fee con beneficios exclusivos.
3. "Script de Conversación Crítica": Cómo iniciar la llamada de 'upgrade' sin parecer que solo quieres más dinero.
4. "Manejo de Objeción {{resistance}}": Un 'reframe' psicológico para desactivar su miedo al compromiso a largo plazo.`
    },
    {
      slug: 'copy-expert',
      name_en: 'CopyExpert AI',
      name_es: 'CopyExpert AI',
      description_en: 'Write content that sounds like an authority in your field.',
      description_es: 'Escribe contenido que te posicione como la autoridad máxima en tu nicho.',
      icon: 'Target',
      form_schema: [
        { id: 'topic', type: 'text', label_en: 'Topic/Insight', label_es: 'Tema o Insight a compartir', required: true },
        { id: 'target_audience', type: 'text', label_en: 'Target Audience', label_es: 'Audiencia objetivo (ej. CEOs de Tech)', required: true },
        { id: 'format', type: 'select', label_en: 'Content Format', label_es: 'Formato de contenido', required: true,
          options: [
            { value: 'linkedin', label_en: 'LinkedIn Thought Leadership', label_es: 'LinkedIn (Autoridad)' },
            { value: 'newsletter', label_en: 'Weekly Newsletter', label_es: 'Newsletter Semanal' },
            { value: 'contra_corriente', label_en: 'Contrarian View (Viral)', label_es: 'Opinión Contra-corriente' }
          ]
        },
        { id: 'key_point', type: 'textarea', label_en: 'Main point to prove', label_es: 'Punto clave a demostrar', required: true }
      ],
      prompt_template: `Actúa como un Ghostwriter de primer nivel para Consultores de Clase Mundial.
- Tema: {{topic}}
- Audiencia: {{target_audience}}
- Formato: {{format}}
- Punto clave: {{key_point}}

Tu misión es escribir una pieza de contenido que genere 'Deseo de Autoridad'.
No uses palabras genéricas como "increíble" o "importante". Usa datos, analogías fuertes y un tono de 'Experto Retador'.
Incluye:
1. Gancho (Hook) que detenga el scroll.
2. Desarrollo con una enseñanza práctica.
3. Call to Action (CTA) sutil para agendar una sesión o descargar un recurso.`
    },
    {
      slug: 'decide-funnel',
      name_en: 'DecideFunnel AI',
      name_es: 'DecideFunnel AI',
      description_en: 'Is your ads budget creating clients or just burning cash?',
      description_es: '¿Tu presupuesto en anuncios crea clientes o solo quema dinero?',
      icon: 'PieChart',
      form_schema: [
        { id: 'ad_spend', type: 'text', label_en: 'Ad Spend (Monthly)', label_es: 'Inversión en anuncios (Mensual)', required: true },
        { id: 'total_leads', type: 'text', label_en: 'Total Leads generated', label_es: 'Total de leads (prospectos)', required: true },
        { id: 'closing_rate', type: 'text', label_en: 'Closing Rate (%)', label_es: 'Tasa de cierre (%)', required: true },
        { id: 'avg_sale', type: 'text', label_en: 'Average Sale Value', label_es: 'Ticket promedio de venta', required: true }
      ],
      prompt_template: `Eres un Media Buyer y Analista de Crecimiento para Infoproductores y Consultores.
Calcula la salud financiera de este embudo:
- Inversión: {{ad_spend}}
- Leads: {{total_leads}}
- Cierre: {{closing_rate}}
- Ticket: {{avg_sale}}

Genera:
1. Calculadora de ROAS (Retorno): ¿Cuánto dinero regresa por cada dólar invertido?
2. Diagnóstico de Embudo: Identifica si el problema es de Tráfico (leads caros) o de Ventas (tasa de cierre baja).
3. Decisión Ejecutiva: "Escalar presupuesto", "Optimizar el script de ventas" o "Pausar campaña". Justifica con matemáticas.
4. Proyección: Si optimizamos la tasa de cierre un 5%, ¿cuánto dinero extra representa?`
    },
    {
      slug: 'pulse-client',
      name_en: 'PulseClient AI',
      name_es: 'PulseClient AI',
      description_en: 'Know if your client is happy or about to fire you before they say a word.',
      description_es: 'Sabe si tu cliente está feliz o a punto de despedirte antes de que diga nada.',
      icon: 'Activity',
      form_schema: [
        { id: 'last_update', type: 'textarea', label_en: 'Last client communication', label_es: 'Última comunicación/comentario del cliente', required: true },
        { id: 'delivered_results', type: 'textarea', label_en: 'Results delivered this week', label_es: 'Resultados entregados esta semana', required: true },
        { id: 'feeling', type: 'select', label_en: 'Your Intution', label_es: 'Tu intuición como consultor', required: true,
          options: [
            { value: 'green', label_en: 'Everything is flowing', label_es: 'Todo fluye bien' },
            { value: 'yellow', label_en: 'Silent or Slow (Risk)', label_es: 'Silencioso o Lento (Riesgo)' },
            { value: 'red', label_en: 'Tension/Pushback', label_es: 'Tensión / Resistencia' }
          ]
        }
      ],
      prompt_template: `Eres un Gestor de Relaciones (Account Manager) para consultorías de élite.
Evaluemos la salud del cliente:
- Comunicación: {{last_update}}
- Resultados: {{delivered_results}}
- Intuición: {{feeling}}

Genera:
1. El "Termómetro de Retención": Clasifica el riesgo de cancelación (Churn) de 0% a 100%.
2. Acción de Blindaje: Una acción específica para deleitar al cliente si está en 🟢 o para rescatarlo si está en 🟡/🔴.
3. Mensaje de Seguimiento Preventivo: Un texto que demuestre control total y proactividad, quitándole el peso al cliente de tener que preguntar.`
    },
    {
      slug: 'master-loop',
      name_en: 'MasterLoop Premium',
      name_es: 'MasterLoop Premium',
      description_en: 'The complete machine to attract, close, and retain high-ticket clients.',
      description_es: 'La máquina completa para atraer, cerrar y retener clientes de alto valor.',
      icon: 'RefreshCw',
      form_schema: [
        { id: 'consultant_name', type: 'text', label_en: 'Consultant/Brand Name', label_es: 'Nombre del consultor/marca', required: true },
        { id: 'niche', type: 'text', label_en: 'Specific Niche', label_es: 'Nicho específico', required: true },
        { id: 'current_pain', type: 'textarea', label_en: 'Biggest business bottleneck', label_es: 'Mayor cuello de botella hoy', required: true },
        { id: 'monthly_goal', type: 'text', label_en: 'Monthly Income Goal', label_es: 'Meta de ingresos mensuales', required: true }
      ],
      prompt_template: `Eres el Master de Crecimiento para Consultores. Vas a diseñar el "MasterLoop" para {{consultant_name}}.
- Nicho: {{niche}}
- Cuello de botella: {{current_pain}}
- Meta: {{monthly_goal}}

Diseña la Estrategia de 3 Pasos:
1. El Sistema de Leads Cualificados: Cómo usar {{niche}} para atraer solo a personas que puedan pagar tu ticket sin negociar el precio.
2. El Protocolo de Cierre de Alto Valor: Cómo estructurar tus llamadas de ventas para que el cliente sienta que NO contratarte es su error más costoso este año.
3. El Motor de Retención Infinita: Cómo estructurar tu entrega de servicio para que el cliente quiera renovar su contrato eternamente.
Cierra con el "Plan de los 90 días" para llegar a {{monthly_goal}}.`
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
    if (app.slug === 'master-loop' || app.slug === 'decide-funnel') {
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

  console.log('✅ Micro-Apps de Consultoría (Seed) completado.')
}

run()

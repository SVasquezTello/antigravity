import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('🏢 Seeding Micro-Apps para Coworking y Oficinas Flexibles...')

  const apps = [
    {
      slug: 'cowork-space',
      name_en: 'CoworkSpace AI',
      name_es: 'CoworkSpace AI',
      description_en: 'Optimize your desk occupancy and identify quiet zones before They become a loss.',
      description_es: 'Optimiza la ocupación de tus escritorios e identifica zonas muertas antes de que sean pérdida.',
      icon: 'Layout',
      form_schema: [
        { id: 'total_desks', type: 'text', label_en: 'Total Desks available', label_es: 'Total de escritorios disponibles', required: true },
        { id: 'current_occupancy', type: 'text', label_en: 'Current monthly members', label_es: 'Miembros mensuales actuales', required: true },
        { id: 'day_passes_avg', type: 'text', label_en: 'Avg day passes per day', label_es: 'Promedio de day-passes al día', required: true },
        { id: 'bottleneck', type: 'textarea', label_en: 'Operational issue', label_es: 'Problema operativo (ej. gente ruidosa, internet lento)', required: true }
      ],
      prompt_template: `Actúa como un Manager de Operaciones de un Coworking de primer nivel.
Tu misión es maximizar la rentabilidad del m2.
- Capacidad: {{total_desks}}
- Ocupación: {{current_occupancy}}
- Tráfico diario: {{day_passes_avg}}
- Problema: {{bottleneck}}

Genera:
1. "El Mapa de Calor": Basado en los datos, identifica si necesitas más puestos fijos o más rotación de day-passes.
2. Estrategia de "Zona de Silencio": Cómo solucionar {{bottleneck}} sin alienar a los clientes.
3. Plan de Dinamización: 2 ideas para que los de 'day-pass' se conviertan en miembros mensuales.
4. Optimización de Espacios: Si sobran {{total_desks}} - {{current_occupancy}} puestos, ¿qué otro uso temporal rentable podrías darles?`
    },
    {
      slug: 'upsell-meeting',
      name_en: 'UpsellMeeting AI',
      name_es: 'UpsellMeeting AI',
      description_en: 'The desk is paid for. Now sell them the privacy of the meeting room.',
      description_es: 'El escritorio ya está pagado. Ahora véndeles la privacidad de la sala de juntas.',
      icon: 'Users',
      form_schema: [
        { id: 'member_type', type: 'select', label_en: 'Member Type', label_es: 'Tipo de miembro', required: true,
          options: [
            { value: 'individual', label_en: 'Freelancer (Solo)', label_es: 'Freelancer (Individual)' },
            { value: 'startup', label_en: 'Small Team / Startup', label_es: 'Equipo pequeño / Startup' },
            { value: 'corporativo', label_en: 'Corporate Remote', label_es: 'Remosoto Corporativo' }
          ]
        },
        { id: 'usage_history', type: 'textarea', label_en: 'Usage habits', label_es: 'Hábitos de uso (llamadas frecuentes, visitas)', required: true },
        { id: 'rooms_available', type: 'textarea', label_en: 'Rooms/Amenities', label_es: 'Salas y servicios disponibles', required: true, placeholder_es: 'Sala zoom, Boardroom con TV, Cabinas de podcast...' }
      ],
      prompt_template: `Eres un Asesor de Comunidad en un Coworking. 
Tu trabajo es mejorar la experiencia de {{member_type}} y aumentar el "Revenue per User".
- Hábitos: {{usage_history}}
- Inventario: {{rooms_available}}

Genera:
1. El "Anuncio de Privacidad": Cómo sugerir la sala de juntas cuando detectas que {{member_type}} está haciendo muchas llamadas en el área común.
2. Paquete de Horas VIP: Propuesta de un bundle de horas de sala de {{rooms_available}} con descuento para este miembro.
3. Script de Venta Empática: Un mensaje de WhatsApp o Slack interno que diga "Noté que hoy tienes muchas reuniones, tenemos la Sala X libre por si necesitas más silencio...".
4. Upsell de Café/Catering: Cómo ofrecer snacks premium para sus reuniones.`
    },
    {
      slug: 'copy-community',
      name_en: 'CopyCommunity AI',
      name_es: 'CopyCommunity AI',
      description_en: 'Captions that build a tribe, not just list office features.',
      description_es: 'Captions que construyen una tribu, no solo una lista de servicios de oficina.',
      icon: 'MessageSquare',
      form_schema: [
        { id: 'event_desc', type: 'textarea', label_en: 'What happened at the coworking?', label_es: '¿Qué pasó en el coworking?', required: true },
        { id: 'benefit', type: 'text', label_en: 'Core Benefit', label_es: 'Beneficio clave (ej. Networking, Foco)', required: true },
        { id: 'target', type: 'text', label_en: 'Target segment', label_es: 'Segmento a atraer', required: true, placeholder_es: 'Programadores, Emprendedores, Nómadas digitales' }
      ],
      prompt_template: `Actúa como un Community Manager de un espacio de Coworking vibrante.
Escribe un post para redes sociales sobre {{event_desc}}.
- Beneficio: {{benefit}}
- Target: {{target}}

Genera:
1. El Hook de Conexión: Una frase que hable sobre el fin de la soledad del trabajo remoto.
2. El Cuerpo del Copy: Destaca cómo en este espacio se hacen {{benefit}} de forma natural.
3. Llamado a la Acción "Vigente": Invita a pedir un "Free Pass" para conocer la comunidad.
4. Hashtags de Coworking: 5-8 hashtags que mezclen trabajo y estilo de vida.`
    },
    {
      slug: 'decide-lease',
      name_en: 'DecideLease AI',
      name_es: 'DecideLease AI',
      description_en: 'Should you open a new floor or just optimize the current desks?',
      description_es: '¿Deberías abrir un nuevo piso o solo optimizar los escritorios actuales?',
      icon: 'Building',
      form_schema: [
        { id: 'expansion_cost', type: 'text', label_en: 'Expansion Rent/Fit-out', label_es: 'Costo Expansión (Renta/Obra)', required: true },
        { id: 'current_profit', type: 'text', label_en: 'Current Net Profit', label_es: 'Utilidad neta actual', required: true },
        { id: 'demand_level', type: 'select', label_en: 'Waiting list status', label_es: 'Estado de lista de espera', required: true,
          options: [
            { value: 'lleno', label_en: 'Overflowing (Rejecting daily)', label_es: 'Desbordado (Rechazo gente diario)' },
            { value: 'medio', label_en: 'Steady (Small buffer)', label_es: 'Estable (Poco margen)' },
            { value: 'bajo', label_en: 'Slow (Many empty spots)', label_es: 'Lento (Muchos huecos)' }
          ]
        }
      ],
      prompt_template: `Eres un Consultor de Real Estate y Coworking.
Decidamos el futuro del espacio:
- Inversión Expansión: {{expansion_cost}}
- Utilidad actual: {{current_profit}}
- Demanda: {{demand_level}}

Calcula:
1. Análisis de Riesgo: Si la demanda es {{demand_level}}, ¿cuánto tiempo tardarías en llenar el nuevo espacio?
2. Margen de Seguridad: Cómo afectaría {{expansion_cost}} a tu {{current_profit}} en los primeros 6 meses.
3. La "Táctica del Punto Medio": ¿Y si en lugar de expandir, subes el precio un 15% a los miembros actuales? Proyecta el resultado.
4. Veredicto Final: Instrucción clara para el dueño: Expandir / Optimizar / Pausar.`
    },
    {
      slug: 'pulse-desk',
      name_en: 'PulseDesk AI',
      name_es: 'PulseDesk AI',
      description_en: 'Know your occupancy health in 30 seconds without walking every floor.',
      description_es: 'Sabe la salud de tu ocupación en 30 segundos sin recorrer todos los pisos.',
      icon: 'Activity',
      form_schema: [
        { id: 'checkins_today', type: 'text', label_en: 'Number of check-ins today', label_es: 'Check-ins totales hoy', required: true },
        { id: 'new_members', type: 'text', label_en: 'New contracts signed', label_es: 'Nuevos contratos firmados', required: true },
        { id: 'cancellations', type: 'text', label_en: 'Churn/Cancellations', label_es: 'Cancelaciones / Churn', required: true },
        { id: 'community_vibe', type: 'textarea', label_en: 'General vibe notes', label_es: 'Notas del ambiente (ej. quejas, café terminado)', required: true }
      ],
      prompt_template: `Eres el sistema de control inteligente de un Coworking.
- Check-ins: {{checkins_today}}
- Nuevos: {{new_members}}
- Churn: {{cancellations}}
- Vibe: {{community_vibe}}

Genera:
1. El SCORE de Ocupación: Clasifica la salud del negocio hoy de 0 a 10.
2. Alerta de Retención: Si las cancelaciones son {{cancellations}}, ¿cuál es la causa probable según {{community_vibe}}?
3. La "Acción de Host": Tarea única para el community manager para mejorar el ambiente mañana.
4. Resumen Visual: Un semáforo 🟢🟡🔴 y un recordatorio de pedir café o insumos si la nota lo sugiere.`
    },
    {
      slug: 'flex-loop',
      name_en: 'FlexLoop Premium',
      name_es: 'FlexLoop Premium',
      description_en: 'The complete machine for office rental, meeting room upsells, and community growth.',
      description_en: 'La máquina completa para renta de oficina, venta de salas y crecimiento de comunidad.',
      icon: 'RefreshCw',
      form_schema: [
        { id: 'brand_name', type: 'text', label_en: 'Coworking Brand', label_es: 'Nombre del Coworking', required: true },
        { id: 'niche', type: 'text', label_en: 'Primary Member Segment', label_es: 'Segmento principal (ej. Creativos, Tech)', required: true },
        { id: 'operational_bottleneck', type: 'textarea', label_en: 'Biggest operational headache', label_es: 'Mayor dolor operativo', required: true },
        { id: 'city_context', type: 'text', label_en: 'City/Area Context', label_es: 'Contexto de la ciudad/zona', required: true }
      ],
      prompt_template: `Eres el Consultor Supremo de Oficina Flexible. Implementamos el "FlexLoop" en {{brand_name}}.
- Nicho: {{niche}}
- Dolor: {{operational_bottleneck}}
- Ciudad: {{city_context}}

Diseña el Plan Maestro de 3 Pilares:
1. El Imán de Miembros: Cómo posicionar {{brand_name}} como el HUB definitivo para {{niche}} en {{city_context}}.
2. El Protocolo de Monetización Pasiva: Cómo automatizar el upsell de salas de juntas y servicios extra para solucionar {{operational_bottleneck}}.
3. El Ciclo de Referidos de Oficina: Un sistema para que las empresas actuales te traigan a sus aliados y proveedores como nuevos miembros.
Cierra con una visión de red de sucursales para {{brand_name}}.`
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
    if (app.slug === 'flex-loop' || app.slug === 'decide-lease') {
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

  console.log('✅ Micro-Apps de Coworking (Seed) completado.')
}

run()

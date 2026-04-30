import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('📸 Seeding Micro-Apps para Fotografía y Producción Audiovisual...')

  const apps = [
    {
      slug: 'script-sesion',
      name_en: 'SessionScript AI',
      name_es: 'ScriptSesion AI',
      description_en: 'Turn a simple request into a full creative direction for your next shoot.',
      description_es: 'Convierte un pedido simple en una dirección creativa completa para tu sesión.',
      icon: 'Camera',
      form_schema: [
        { id: 'client_goal', type: 'text', label_en: 'Session Goal', label_es: 'Objetivo de la sesión', required: true, placeholder_es: 'ej. Sesión de marca personal para una abogada' },
        { id: 'mood', type: 'select', label_en: 'Desired Style/Mood', label_es: 'Estilo / Mood deseado', required: true,
          options: [
            { value: 'minimalista', label_en: 'Minimalist & Clean', label_es: 'Minimalista y Limpio' },
            { value: 'urbano', label_en: 'Urban & Edgy', label_es: 'Urbano y Atrevido' },
            { value: 'editorial', label_en: 'High-Fashion Editorial', label_es: 'Editorial de Moda' },
            { value: 'natural', label_en: 'Natural & Candid', label_es: 'Natural y Espontáneo' },
            { value: 'dark', label_en: 'Moody & Dark', label_es: 'Misterioso y Oscuro' }
          ]
        },
        { id: 'location', type: 'text', label_en: 'Location Type', label_es: 'Tipo de locación', required: true, placeholder_es: 'ej. Estudio, Cafetería antigua, Parque' },
        { id: 'props', type: 'textarea', label_en: 'Available Props', label_es: 'Elementos/Props disponibles', required: false }
      ],
      prompt_template: `Actúa como un Director Creativo Senior de Fotografía. 
Tu misión es diseñar un "Master Plan" para una sesión de fotos que deje al cliente impresionado.
- Objetivo: {{client_goal}}
- Estilo: {{mood}}
- Locación: {{location}}
- Elementos: {{props}}

Genera:
1. "El Concepto Visual": Una narrativa de 2 párrafos sobre la historia que contaremos con estas fotos.
2. "Moodboard Teórico": Describe el esquema de iluminación (ej. luz de Rembrandt, luz dura lateral, etc.), la paleta de colores dominante y el tipo de lentes (focales) sugeridos.
3. "Lista de Poses Clave": 5 poses específicas que el fotógrafo debe dirigir para lograr el estilo {{mood}}.
4. "Checklist Técnico": Qué no puede faltar en la maleta para este tipo de sesión.`
    },
    {
      slug: 'upsell-lens',
      name_en: 'UpsellLens AI',
      name_es: 'UpsellLens AI',
      description_en: 'The session is over, but the profit isn\'t. Sell albums, prints, and extra edits.',
      description_es: 'La sesión terminó, pero la venta no. Estrategias para vender álbumes y fotos extra.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'client_name', type: 'text', label_en: 'Client Name', label_es: 'Nombre del cliente', required: true },
        { id: 'session_type', type: 'text', label_en: 'Type of Session', label_es: 'Tipo de sesión realizada', required: true },
        { id: 'reaction', type: 'select', label_en: 'Client Reaction to Preview', label_es: 'Reacción del cliente al preview', required: true,
          options: [
            { value: 'encantado', label_en: 'Loved everything (Hard to pick)', label_es: 'Encantado (Le gustan todas)' },
            { value: 'neutral', label_en: 'Neutral (Likes it, but picky)', label_es: 'Neutral (Le gustan, pero es exigente)' },
            { value: 'profesional', label_en: 'Professional/Corporative', label_es: 'Corporativo (Solo busca lo funcional)' }
          ]
        },
        { id: 'premium_options', type: 'textarea', label_en: 'Premium Services/Products', label_es: 'Productos premium que ofreces', required: true, placeholder_es: 'Álbum en tapa de cuero, impresiones en lienzo, edición fine-art extra...' }
      ],
      prompt_template: `Eres un Consultor de Ventas para Estudios Fotográficos de Alto Valor.
El cliente {{client_name}} ya vio sus fotos preliminares de su sesión de {{session_type}} y su reacción fue {{reaction}}.
Es el momento perfecto para el "After-Sales Profit".

Genera:
1. El Análisis de Oportunidad: Basado en {{reaction}}, detecta los 2 productos de {{premium_options}} con más chance de ser comprados.
2. La "Técnica del Espejo": Cómo presentar la foto favorita del cliente en un producto físico para que sienta que "no puede vivir sin ella".
3. Guion de Venta Irresistible: Un mensaje para WhatsApp o Email que no venda productos, sino "la preservación de su legado familiar/profesional" a través de {{premium_options}}.
4. Estrategia de Escasez: Una pequeña oferta temporal que lo empuje a decidirse hoy mismo.`
    },
    {
      slug: 'copy-insta-lens',
      name_en: 'CopyInstaLens',
      name_es: 'CopyInstaLens',
      description_en: 'Stop using generic captions. Tell the story behind the shutter.',
      description_es: 'Deja de usar captions genéricos. Cuenta la historia detrás del obturador.',
      icon: 'PenTool',
      form_schema: [
        { id: 'photo_desc', type: 'textarea', label_en: 'What happens in the photo?', label_es: '¿Qué sucede en la foto?', required: true },
        { id: 'target_feeling', type: 'text', label_en: 'Desired Emotion', label_es: 'Emoción que quieres transmitir', required: true, placeholder_es: 'Nostalgia, Poder, Calma...' },
        { id: 'tone', type: 'select', label_en: 'Writing Tone', label_es: 'Tono de redacción', required: true,
          options: [
            { value: 'poetico', label_en: 'Poetic & Artistic', label_es: 'Poético y Artístico' },
            { value: 'detras_camara', label_en: 'Behind the Scenes/Tech', label_es: 'Behind the Scenes (Técnico)' },
            { value: 'ventas', label_en: 'Booking Oriented', label_es: 'Enfocado en Ventas/Booking' }
          ]
        }
      ],
      prompt_template: `Actúa como un Copywriter especializado en marcas visuales y lujo.
Debes escribir un caption para Instagram que haga que la gente se detenga a mirar la foto.
- Descripción de la imagen: {{photo_desc}}
- Emoción deseada: {{target_feeling}}
- Tono: {{tone}}

Genera:
1. Caption Opción A (Corto y Directo): Una frase poderosa que resuma la {{target_feeling}}.
2. Caption Opción B (Storytelling): Un relato breve sobre el momento en que se tomó la foto o el simbolismo del objeto/persona.
3. El Gancho (Hook): Las primeras 5 palabras que aparecerán antes del "ver más".
4. Set de Hashtags Estéticos: 5-8 hashtags de nicho, no genéricos.`
    },
    {
      slug: 'decide-gear',
      name_en: 'DecideGear AI',
      name_es: 'DecideGear AI',
      description_en: 'Analyze if that new lens will pay for itself or just collect dust.',
      description_es: 'Analiza si ese nuevo lente se pagará solo o solo juntará polvo.',
      icon: 'CreditCard',
      form_schema: [
        { id: 'gear_name', type: 'text', label_en: 'Equipment Name & Price', label_es: 'Equipo y precio estimado', required: true },
        { id: 'current_volume', type: 'text', label_en: 'Monthly Sessions', label_es: 'Sesiones promedio al mes', required: true },
        { id: 'upsell_potential', type: 'text', label_en: 'Potential price increase', label_es: '¿Cuánto más podrías cobrar por sesión con esto?', required: true },
        { id: 'rent_price', type: 'text', label_en: 'Rental price (per day)', label_es: 'Precio de alquiler por día', required: true },
        { id: 'maintenance', type: 'text', label_en: 'Estimated maintenance', label_es: 'Mantenimiento/Seguro anual', required: true }
      ],
      prompt_template: `Eres un Analista Financiero para Negocios Creativos.
El fotógrafo está tentado a comprar el equipo: {{gear_name}}.
Datos:
- Volumen: {{current_volume}} sesiones/mes.
- Plus de cobro por equipo: {{upsell_potential}} por sesión.
- Costo Alquiler: {{rent_price}}.
- Costo Mantenimiento: {{maintenance}}.

Calcula:
1. Punto de equilibrio (Break-even): ¿Cuántas sesiones deben realizarse específicamente para pagar la inversión?
2. Buy vs Rent Score: Del 1 al 10, ¿le conviene comprar o seguir alquilando según su volumen actual?
3. Análisis de Oportunidad: Si lo compra, ¿en cuánto tiempo recupera el capital (ROI)?
4. Conclusión Ejecutiva: Una recomendación dura (Comprar / Esperar / Alquilar) basada en los números.`
    },
    {
      slug: 'pulse-booking',
      name_en: 'PulseBooking',
      name_es: 'PulseBooking',
      description_en: 'Check your studio\'s health. Leads, bookings, and cashflow in one view.',
      description_es: 'Revisa la salud de tu estudio. Prospectos, reservas y flujo en un solo vistazo.',
      icon: 'Activity',
      form_schema: [
        { id: 'new_leads', type: 'text', label_en: 'New inquiries this week', label_es: 'Nuevos mensajes/interesados esta semana', required: true },
        { id: 'booked_sessions', type: 'text', label_en: 'Sessions booked/paid', label_es: 'Sesiones agendadas y con anticipo', required: true },
        { id: 'income', type: 'text', label_en: 'Cash collected', label_es: 'Efectivo cobrado al momento', required: true },
        { id: 'main_problem', type: 'textarea', label_en: 'What\'s holding you back?', label_es: 'Principal problema hoy (ej. la gente pregunta pero no agenda)', required: true }
      ],
      prompt_template: `Eres un Auditor de Estudios Creativos. El dueño te pasa el pulso de su negocio hoy.
- Leads: {{new_leads}}
- Reservas: {{booked_sessions}}
- Cobrado: {{income}}
- Dolor: {{main_problem}}

Genera el "Semáforo del Fotógrafo":
1. Estado Actual: 🟢 Sólido | 🟡 Estable con fugas | 🔴 Crisis de flujo. Justifica.
2. La Fuga de Energía: Basado en {{main_problem}}, identifica qué proceso está roto (Venta, Marketing o Entrega).
3. Tarea de Emergencia (15 min): La única cosa que el dueño debe hacer ahora mismo para cerrar un prospecto de {{new_leads}}.
4. Proyección: Si no cambia nada, cuánto dinero está dejando sobre la mesa.`
    },
    {
      slug: 'focus-loop',
      name_en: 'FocusLoop Premium',
      name_es: 'FocusLoop Premium',
      description_en: 'From the first "How much?" to the client referral. The total growth ecosystem.',
      description_es: 'Desde el primer "¿cuánto cuesta?" hasta la recomendación. El ecosistema total.',
      icon: 'RefreshCw',
      form_schema: [
        { id: 'studio_name', type: 'text', label_en: 'Studio Name', label_es: 'Nombre del estudio/marca', required: true },
        { id: 'niche', type: 'text', label_en: 'Your Specialty', label_es: 'Tu nicho principal (ej. Bodas, Producto, Newborn)', required: true },
        { id: 'challenge', type: 'textarea', label_en: 'Biggest business challenge', label_es: 'Mayor reto de negocio actualmente', required: true },
        { id: 'dream_client', type: 'text', label_en: 'Dream Client Description', label_es: '¿Cómo es tu cliente ideal?', required: true }
      ],
      prompt_template: `Eres el consultor de negocios más cotizado de la industria audiovisual. Vas a implementar el "FocusLoop" en {{studio_name}}.
- Nicho: {{niche}}
- Reto: {{challenge}}
- Cliente Ideal: {{dream_client}}

Diseña un Plan Maestro de 3 Pilares:
1. El Sistema de Atracción Magnética: Cómo usar tu nicho {{niche}} para atraer a {{dream_client}} mediante contenido estratégico que resuelva su dolor específico.
2. El Protocolo "Antipiratas": Una estrategia para filtrar a los clientes de "presupuesto bajo" y quedarte con los que valoran el arte.
3. El Ciclo de Referidos Infinito: Un proceso para que cada cliente de {{session_type}} te traiga al menos 2 clientes nuevos de alto nivel de forma orgánica.
Cierra con una frase motivadora pero realista sobre la escala de {{studio_name}}.`
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
    if (app.slug === 'focus-loop' || app.slug === 'decide-gear') {
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

  console.log('✅ Micro-Apps de Fotografía (Seed) completado.')
}

run()

import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('🐾 Seeding Micro-Apps para Grooming y Spas de Mascotas...')

  const apps = [
    {
      slug: 'pelu-can',
      name_en: 'PeluCan AI',
      name_es: 'PeluCan AI',
      description_en: 'Expert recommendation for the perfect cut and treatment based on breed and coat.',
      description_es: 'Recomendación experta del corte y tratamiento ideal según raza y pelaje.',
      icon: 'Scissors',
      form_schema: [
        { id: 'pet_breed', type: 'text', label_en: 'Breed', label_es: 'Raza de la mascota', required: true, placeholder_es: 'ej. Poodle, Pastor Alemán, Yorkie' },
        { id: 'coat_condition', type: 'select', label_en: 'Coat Condition', label_es: 'Estado del manto/pelaje', required: true,
          options: [
            { value: 'nudos', label_en: 'Matted / Knotty', label_es: 'Con nudos / Enredado' },
            { value: 'sucio', label_en: 'Very Dirty / Smelly', label_es: 'Muy sucio / Olor fuerte' },
            { value: 'seco', label_en: 'Dry / Dull', label_es: 'Seco / Sin brillo' },
            { value: 'normal', label_en: 'Healthy / Normal', label_es: 'Sano / Normal' }
          ]
        },
        { id: 'owner_preference', type: 'textarea', label_en: 'Owner Preference', label_es: 'Preferencia del dueño', required: false, placeholder_es: 'ej. Que no se vea muy rapado, estilo osito' }
      ],
      prompt_template: `Actúa como un Master Groomer certificado internacionalmente.
Tu misión es recomendar el servicio perfecto para esta mascota.
- Raza: {{pet_breed}}
- Estado: {{coat_condition}}
- Preferencia: {{owner_preference}}

Genera:
1. "El Diagnóstico del Manto": Breve explicación técnica de qué necesita el pelo de esta mascota según {{coat_condition}}.
2. "Propuesta de Estilo AI": Describe el corte ideal (ej. corte de cachorro, corte continental, deslanado) justificando por qué es mejor para la raza {{pet_breed}}.
3. "Servicio Complementario Sugerido": Por qué debería añadir un baño medicado, hidratación profunda o limpieza de oídos.
4. "Guion para el Dueño": Cómo explicarle al dueño por qué tu recomendación es lo mejor para el bienestar de su perro, no solo estética.`
    },
    {
      slug: 'upsell-paws',
      name_en: 'UpsellPaws AI',
      name_es: 'UpsellPaws AI',
      description_en: 'They came for a bath. They leave with a treat, a new collar, and their next appointment.',
      description_es: 'Vinieron por un baño. Se van con un snack, un collar nuevo y su próxima cita.',
      icon: 'Heart',
      form_schema: [
        { id: 'pet_name', type: 'text', label_en: 'Pet Name', label_es: 'Nombre de la mascota', required: true },
        { id: 'main_service', type: 'text', label_en: 'Main Service performed', label_es: 'Servicio principal realizado', required: true },
        { id: 'pet_behavior', type: 'select', label_en: 'Behavior during service', label_es: 'Comportamiento en la sesión', required: true,
          options: [
            { value: 'tranquilo', label_en: 'Calm & Sweet', label_es: 'Tranquilo y Dulce' },
            { value: 'ansioso', label_en: 'Anxious / Scared', label_es: 'Ansioso / Miedoso' },
            { value: 'travieso', label_en: 'Playful / Energetic', label_es: 'Juguetón / Energético' }
          ]
        },
        { id: 'retail_items', type: 'textarea', label_en: 'Items in your shop', label_es: 'Productos en tu tienda', required: true, placeholder_es: 'Snacks dentales, perfumes, bandanas, juguetes de caucho...' }
      ],
      prompt_template: `Eres un Experto en Experiencia del Cliente en Pet Shops.
El dueño viene a recoger a {{pet_name}}. Debes maximizar el ticket de venta de forma amorosa.
- Servicio: {{main_service}}
- Comportamiento: {{pet_behavior}}
- Tienda: {{retail_items}}

Genera:
1. "El Premio al Buen Comportamiento": Cómo sugerir un snack o juguete de {{retail_items}} como recompensa por ser un {{pet_behavior}} chico/a.
2. "Mantenimiento en Casa": Cómo vender un shampoo o cepillo de tu tienda explicando que ayudará a mantener el {{main_service}} por más tiempo.
3. El Guion de Cierre "Próxima Visita": Cómo asegurar la cita en 15 o30 días para que el cliente no se olvide.
4. Mensaje de WhatsApp Post-Servicio: Una foto (ficticia) con un caption que diga "¡Miren qué guapo quedó {{pet_name}}!" y una oferta para su próxima visita.`
    },
    {
      slug: 'copy-happy-paws',
      name_en: 'CopyHappyPaws',
      name_es: 'CopyHappyPaws',
      description_en: 'Captions that make owners melt and followers click "Follow".',
      description_es: 'Captions que hacen que los dueños se derritan y los seguidores den "Follow".',
      icon: 'Camera',
      form_schema: [
        { id: 'pet_action', type: 'textarea', label_en: 'What is the pet doing?', label_es: '¿Qué está haciendo la mascota?', required: true },
        { id: 'vibe', type: 'select', label_en: 'Post Vibe', label_es: 'Vibe del post', required: true,
          options: [
            { value: 'divertido', label_en: 'Funny / Meme', label_es: 'Divertido / Humor' },
            { value: 'tierno', label_en: 'Sweet / Cute', label_es: 'Tierno / Dulce' },
            { value: 'impactante', label_en: 'Before & After / Transformation', label_es: 'Antes y Después (Transformación)' }
          ]
        },
        { id: 'offer', type: 'text', label_en: 'Current Promo (Optional)', label_es: 'Promo actual (Opcional)', required: false }
      ],
      prompt_template: `Actúa como un Especialista en Marketing para Mascotas (Pet Influencer Style).
Escribe un caption para redes sociales sobre {{pet_action}}.
- Vibe: {{vibe}}
- Promo: {{offer}}

Genera:
1. Una primera línea (Hook) irresistible: Algo que haga reír o decir "awww".
2. El cuerpo del copy: Usa el lenguaje de los "dog/cat lovers" (ej. patitas, peluditos, lenguaje tierno pero profesional).
3. Call to Action: Invita a agendar o a comentar qué raza es su mascota.
4. Emojis y Hashtags: Selección de 5-8 hashtags que posicionen el post en la comunidad mascotera nacional.`
    },
    {
      slug: 'decide-groom',
      name_en: 'DecideGroom AI',
      name_es: 'DecideGroom AI',
      description_en: 'Calculate the ROI of adding a new bath station or a pet transport van.',
      description_es: 'Calcula el ROI de añadir una nueva estación de baño o una van de transporte.',
      icon: 'BarChart3',
      form_schema: [
        { id: 'investment_type', type: 'text', label_en: 'Investment (Unit/Van)', label_es: 'Inversión (Mobiliario/Van)', required: true },
        { id: 'cost', type: 'text', label_en: 'Total Cost', label_es: 'Costo Total', required: true },
        { id: 'revenue_per_service', type: 'text', label_en: 'Avg Profit per Service', label_es: 'Ganancia promedio por servicio', required: true },
        { id: 'capacity_increase', type: 'text', label_en: 'Extra Pets per Day', label_es: 'Mascotas extra por día', required: true }
      ],
      prompt_template: `Eres un Consultor Financiero de Negocios de Mascotas.
Evaluemos si la inversión en {{investment_type}} de {{cost}} es inteligente.
- Ganancia/servicio: {{revenue_per_service}}
- Incremento capacidad: {{capacity_increase}} mascotas/día.

Analiza:
1. Tiempo de Recuperación: ¿En cuántos meses el nuevo equipo se paga solo?
2. Análisis de Saturación: Si hoy rechazas clientes, ¿cuánto dinero estás perdiendo por no tener esto?
3. El Semáforo de Inversión: 0-100. ¿Es el momento ideal?
4. Recomendación de Estrategia: Cómo lanzar una "Promo de Inauguración" para llenar esa nueva capacidad desde el primer día.`
    },
    {
      slug: 'pulse-paws',
      name_en: 'PulsePaws AI',
      name_es: 'PulsePaws AI',
      description_en: 'How is the shop doing today? Wait times, occupancy, and daily sales.',
      description_es: '¿Cómo va la tienda hoy? Tiempos de espera, ocupación y ventas diarias.',
      icon: 'Activity',
      form_schema: [
        { id: 'pets_today', type: 'text', label_en: 'Pets served today', label_es: 'Mascotas atendidas hoy', required: true },
        { id: 'no_shows', type: 'text', label_en: 'Cancellations/No-shows', label_es: 'Cancelaciones / Faltas', required: true },
        { id: 'bottleneck', type: 'textarea', label_en: 'Main delay/issue', label_es: 'Principal retraso o problema', required: true },
        { id: 'total_sales', type: 'text', label_en: 'Total sales (Services + Shop)', label_es: 'Ventas totales (Servicios + Tienda)', required: true }
      ],
      prompt_template: `Eres el Sistema de Alerta Operativa de un Pet Spa.
Analicemos el cierre (o corte) del día:
- Mascotas: {{pets_today}}
- Faltas: {{no_shows}}
- Problema: {{bottleneck}}
- Ventas: {{total_sales}}

Genera:
1. "El Bark Score" (0-10): Clasifica qué tan productivo fue el día.
2. Alerta Financiera: ¿Las cancelaciones de {{no_shows}} afectaron el punto de equilibrio hoy?
3. Estrategia de Rescate 24h: Cómo contactar a los que faltaron para reagendarlos mañana y no perder el ingreso.
4. Resumen para el Dueño: Un mensaje de 3 líneas con lo bueno, lo malo y lo urgente.`
    },
    {
      slug: 'pet-loop',
      name_en: 'PetLoop Premium',
      name_es: 'PetLoop Premium',
      description_en: 'The ultimate cycle to transform a one-time puppy bath into a lifetime loyal client.',
      description_es: 'El ciclo definitivo para transformar un baño ocasional en un cliente fiel de por vida.',
      icon: 'RefreshCw',
      form_schema: [
        { id: 'spa_name', type: 'text', label_en: 'Pet Spa Name', label_es: 'Nombre del Pet Spa', required: true },
        { id: 'niche', type: 'text', label_en: 'Market Niche', label_es: 'Especialidad (ej. Razas grandes, Gatos, Estética de concurso)', required: true },
        { id: 'operational_pain', type: 'textarea', label_en: 'Biggest business pain', label_es: 'Mayor dolor de cabeza del negocio', required: true },
        { id: 'city', type: 'text', label_en: 'City/Location', label_es: 'Ciudad / Zona', required: true }
      ],
      prompt_template: `Eres el Consultor Supremo de la Industria de Mascotas. Vamos a implementar el "PetLoop" en {{spa_name}}.
- Nicho: {{niche}}
- Reto: {{operational_pain}}
- Zona: {{city}}

Diseña el Plan Maestro de 3 Pilares:
1. El Sistema de Suscripción "Pelaje Perfecto": Cómo crear un paquete de pago recurrente (mensual) para que el cliente no tenga que pensar en agendar.
2. El Protocolo de Experiencia "Wow": Pasos para que el dueño reciba una foto y video de su mascota feliz, garantizando que te recomiende en el parque de su zona.
3. El Motor de Venta Cruzada (Retail): Cómo entrenar al equipo para que venda productos de higiene cada vez que entregan una mascota.
Cierra con una visión de expansión de sucursal para {{spa_name}}.`
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
    if (app.slug === 'pet-loop' || app.slug === 'decide-groom') {
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

  console.log('✅ Micro-Apps de Mascotas (Seed) completado.')
}

run()

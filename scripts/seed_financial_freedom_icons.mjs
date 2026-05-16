import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🚀 Seeding Financial Freedom Icons Apps (Hormozi, Cardone, Ferriss, Belfort, GaryVee)...')

  const apps = [
    // 1. Alex Hormozi (Agencias / B2B)
    {
      slug: 'hormozi-100m-offer',
      name_en: '100M Offer Architect',
      name_es: 'Arquitecto de Ofertas (100M)',
      description_en: 'Create a Grand Slam Offer that makes people feel stupid saying no.',
      description_es: 'Crea una Oferta "Grand Slam" (estilo Alex Hormozi) que haga que tus clientes se sientan estúpidos al decir que no.',
      icon: 'Target',
      form_schema: [
        { id: 'nicho', type: 'text', label_es: 'Nicho (Ej: Dentistas, Abogados)', required: true },
        { id: 'resultado', type: 'text', label_es: 'Resultado Soñado (Ej: 10 pacientes nuevos al mes)', required: true },
        { id: 'objecion', type: 'text', label_es: 'Mayor objeción/miedo del cliente', required: true }
      ],
      prompt_template: 'Eres Alex Hormozi. Estructura una "Grand Slam Offer" para una agencia que atiende a {{nicho}}.\nEl resultado soñado es {{resultado}}.\nSu mayor miedo es {{objecion}}.\nDebes generar:\n1. El vehículo de entrega (Done for You, Done with You).\n2. El Precio / Valor percibido (Value Equation).\n3. La Garantía Inversa de Riesgo (Risk Reversal).\n4. Bonus por acción rápida.'
    },
    
    // 2. Grant Cardone (Real Estate / Ventas)
    {
      slug: 'cardone-10x-followup',
      name_en: '10X Follow-Up Machine',
      name_es: 'Máquina de Seguimiento 10X',
      description_en: 'Unrelenting follow-up sequences inspired by Grant Cardone.',
      description_es: 'Secuencias de seguimiento inquebrantables inspiradas en Grant Cardone para cerrar leads fríos en Bienes Raíces o B2B.',
      icon: 'Zap',
      form_schema: [
        { id: 'cliente', type: 'text', label_es: 'Nombre del prospecto', required: true },
        { id: 'contexto', type: 'text', label_es: 'Por qué no cerró en la primera llamada', required: true }
      ],
      prompt_template: 'Actúa como Grant Cardone. Tienes un prospecto llamado {{cliente}} que no cerró porque: {{contexto}}.\nEscribe una secuencia de seguimiento agresiva pero profesional de 3 toques (Mensaje de texto, Correo, y Guion para Buzón de Voz).\nEl objetivo es mantener el contacto "Top of Mind" asumiendo el cierre (Assume the close) y generando urgencia masiva. Regla 10X: No aceptamos un "Lo voy a pensar".'
    },
    
    // 3. Tim Ferriss (Productividad / Sistemas)
    {
      slug: 'ferriss-4hour-sop',
      name_en: '4-Hour SOP Generator',
      name_es: 'Generador de Sistemas (4-Hour)',
      description_en: 'Turn daily chaos into delegatable Standard Operating Procedures.',
      description_es: 'Convierte el caos diario en Procedimientos Operativos Estándar (SOPs) delegables para asistentes virtuales.',
      icon: 'Clock',
      form_schema: [
        { id: 'tarea', type: 'text', label_es: 'Tarea a delegar (Ej: Responder correos, Subir videos)', required: true },
        { id: 'pasos', type: 'textarea', label_es: 'Pasos desordenados o notas sueltas', required: true }
      ],
      prompt_template: 'Actúa como Tim Ferriss (Autor de La Semana Laboral de 4 Horas). Quiero automatizar o delegar la siguiente tarea: {{tarea}}.\nAquí están mis notas desordenadas: {{pasos}}.\nGenera un SOP (Procedimiento Operativo Estándar) perfecto, paso a paso, diseñado a prueba de tontos para que un Asistente Virtual en Filipinas pueda ejecutarlo sin hacerme una sola pregunta. Incluye reglas de excepción (If/Then).'
    },
    
    // 4. Jordan Belfort (Ventas High Ticket)
    {
      slug: 'belfort-straight-line',
      name_en: 'Straight Line Closer',
      name_es: 'Closer B2B (Línea Recta)',
      description_en: 'Handle any sales objection with Jordan Belfort\'s Straight Line methodology.',
      description_es: 'Maneja cualquier objeción de ventas B2B usando la metodología de la Línea Recta de Jordan Belfort.',
      icon: 'PhoneCall',
      form_schema: [
        { id: 'objecion', type: 'text', label_es: 'La objeción del cliente (Ej: Es muy caro, Lo voy a pensar)', required: true },
        { id: 'servicio', type: 'text', label_es: 'El servicio High-Ticket que vendes', required: true }
      ],
      prompt_template: 'Actúa como Jordan Belfort. El cliente de mi servicio de {{servicio}} me acaba de decir la siguiente objeción: "{{objecion}}".\nUsando el Sistema de Línea Recta (Certeza Lógica + Certeza Emocional), escribe el guion de respuesta exacto (Deflection/Looping) para aislar la objeción, elevar su nivel de certeza en mí y en el producto, y volver a pedir el cierre.'
    },

    // 5. Gary Vaynerchuk (Content Marketing)
    {
      slug: 'garyvee-content-engine',
      name_en: 'GaryVee Content Engine',
      name_es: 'Motor de Contenidos (GaryVee)',
      description_en: 'Turn 1 core idea into 30 pieces of micro-content for TikTok, Reels, and Twitter.',
      description_es: 'Convierte 1 idea pilar en 30 piezas de micro-contenido distribuido (Jab, Jab, Jab, Right Hook).',
      icon: 'Share2',
      form_schema: [
        { id: 'idea_pilar', type: 'textarea', label_es: 'Idea o Video Pilar (Ej: Resumen de mi Podcast)', required: true },
        { id: 'industria', type: 'text', label_es: 'Tu industria/nicho', required: true }
      ],
      prompt_template: 'Actúa como Gary Vaynerchuk (Estrategia Jab, Jab, Jab, Right Hook). Tengo esta idea pilar para la industria de {{industria}}: "{{idea_pilar}}".\nDesglosa esto en un ecosistema de contenido omnicanal:\n1. 3 Ideas para TikTok/Reels (Ganchos de 3 segundos).\n2. 3 Hilos de Twitter educativos (Los Jabs).\n3. 1 Post de LinkedIn de historia personal.\n4. 1 Right Hook (Publicación de venta directa o llamado a la acción fuerte).'
    }
  ]

  const { data: offer } = await supabase.from('offers').select('id').eq('slug', 'professional').single()
  
  if (!offer) {
    console.error('Professional offer not found.')
    return
  }

  for (const app of apps) {
    const { data: newApp, error } = await supabase.from('micro_apps').upsert(app, { onConflict: 'slug' }).select('id').single()
    if (error) {
      console.error(`Error inserting ${app.slug}:`, error.message)
      continue
    }
    if (newApp) {
      await supabase.from('offer_apps').upsert({ offer_id: offer.id, app_id: newApp.id }, { onConflict: 'offer_id,app_id' })
    }
  }

  console.log('✅ 5 Financial Freedom Icons Apps Seeded and Linked to Pro Plan.')
}

run()

import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🏗️ Cargando Sectores Finales: Inmobiliaria, Agencias y Coaches...')

  const apps = [
    // --- SECTOR INMOBILIARIA (InmoLoop) ---
    {
      slug: 'reactiva-prospecto-inmo',
      name_es: 'ReactivaInmo AI',
      name_en: 'ReactivaInmo AI',
      description_es: 'Ese cliente que vio la casa hace un mes no se ha ido. Recupéralo con estrategia.',
      description_en: 'That client who saw the house a month ago is not gone. Recover them with strategy.',
      icon: 'Home',
      form_schema: [
        { id: 'propiedad', type: 'text', label_es: 'Propiedad vista', label_en: 'Property viewed', required: true },
        { id: 'interes', type: 'select', label_es: 'Nivel de interés inicial', label_en: 'Initial interest', options_es: ['Alto', 'Medio', 'Solo curioso'], options_en: ['High', 'Medium', 'Just curious'], required: true },
        { id: 'objecion', type: 'text', label_es: 'Objeción principal', label_en: 'Main objection', required: true, placeholder_es: 'Precio, zona, falta de crédito...' }
      ],
      prompt_template: `Actúa como un Closer Inmobiliario de Alto Nivel. El prospecto vio {{propiedad}}, su interés era {{interes}} pero no cerró por: {{objecion}}. Genera 2 mensajes de WhatsApp: 1. Enfocado en la escasez (otra oferta similar) y 2. Enfocado en resolver {{objecion}} con un beneficio financiero. Tono elegante y profesional.`
    },
    {
      slug: 'brief-propiedad-pro',
      name_es: 'BriefInmo Pro',
      name_en: 'BriefInmo Pro',
      description_es: 'Convierte datos técnicos de un inmueble en un copy hipnótico de venta.',
      description_en: 'Turn technical property data into hypnotic sales copy.',
      icon: 'FileText',
      form_schema: [
        { id: 'detalles', type: 'textarea', label_es: 'Ficha técnica', label_en: 'Technical data', required: true },
        { id: 'avatar', type: 'text', label_es: 'Cliente ideal', label_en: 'Ideal buyer', required: true, placeholder_es: 'Pareja joven, inversionista, familia grande...' }
      ],
      prompt_template: `Eres Copywriter Inmobiliario. Datos: {{detalles}}. Perfil: {{avatar}}. Genera: 1. Título gancho, 2. Storytelling del inmueble (enfocado en estilo de vida para {{avatar}}), 3. Lista de amenidades técnica pero emocional y 4. Call to Action directo para visita.`
    },
    
    // --- SECTOR AGENCIAS DE MARKETING (AgencyLoop) ---
    {
      slug: 'scope-agency-pro',
      name_es: 'ScopeAgency Pro',
      name_en: 'ScopeAgency Pro',
      description_es: 'Define el alcance de un proyecto para que el cliente no pida extras gratis.',
      description_en: 'Define project scope so the client doesn\'t ask for free extras.',
      icon: 'Shield',
      form_schema: [
        { id: 'servicio', type: 'text', label_es: 'Servicio vendido', label_en: 'Service sold', required: true },
        { id: 'monto', type: 'text', label_es: 'Presupuesto', label_en: 'Budget', required: true },
        { id: 'entregables', type: 'textarea', label_es: 'Entregables principales', label_en: 'Main deliverables', required: true }
      ],
      prompt_template: `Actúa como Project Manager Senior de Agencia. Crea un documento de Alcance (SOW) para {{servicio}} con un presupuesto de {{monto}}. Detalla exactamente qué incluye {{entregables}} y, crucialmente, una sección de "FUERA DE ALCANCE" con 5 puntos comunes para evitar el Scope Creep.`
    },
    
    // --- SECTOR COACH & INFOPRODUCTOS (ExpertLoop) ---
    {
      slug: 'guion-ventas-coach',
      name_es: 'ExpertSales AI',
      name_en: 'ExpertSales AI',
      description_es: 'Guiones de venta telefónica para cerrar programas de mentoria de alto ticket.',
      description_en: 'Phone sales scripts for closing high-ticket mentorship programs.',
      icon: 'Mic',
      form_schema: [
        { id: 'programa', type: 'text', label_es: 'Nombre del programa', label_en: 'Program name', required: true },
        { id: 'precio', type: 'text', label_es: 'Precio/Inversión', label_en: 'Investment', required: true },
        { id: 'dolor', type: 'text', label_es: 'Dolor principal del alumno', label_en: 'Student pain point', required: true }
      ],
      prompt_template: `Eres el mejor Closer de High Ticket. El prospecto sufre de {{dolor}} y el programa {{programa}} cuesta {{precio}}. Genera un guion de 4 fases: 1. Diagnóstico, 2. Visualización del futuro, 3. Presentación de solución y 4. Manejo de la objeción del precio. Empatía máxima.`
    }
  ]

  const { data: plans } = await supabase.from('plans').select('id, slug')
  const multiPlan = plans.find(p => p.slug === 'professional' || p.slug === 'pro')
  const entPlan = plans.find(p => p.slug === 'enterprise')

  for (const app of apps) {
    console.log(`- Upserting ${app.slug}...`)
    const { data: inserted, error } = await supabase.from('micro_apps').upsert(app, { onConflict: 'slug' }).select('id').single()
    
    if (!error && inserted && multiPlan) {
      // Link to pro plan
      await supabase.from('plan_apps').upsert({ plan_id: multiPlan.id, app_id: inserted.id }, { onConflict: 'plan_id,app_id' })
      if (entPlan) {
        await supabase.from('plan_apps').upsert({ plan_id: entPlan.id, app_id: inserted.id }, { onConflict: 'plan_id,app_id' })
      }
    }
  }

  console.log('✅ Carga final de sectores completada.')
}

run()

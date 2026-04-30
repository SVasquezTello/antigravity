import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🏠 Seeding Micro-Apps para Inmobiliaria (Real Estate)...')

  const apps = [
    {
      slug: 'listing-copy-ai',
      name_en: 'ListingCopy AI',
      name_es: 'ListingCopy AI',
      description_en: 'Generate hypnotic property descriptions for portals like Zillow or Idealista.',
      description_es: 'Genera descripciones hipnóticas de propiedades para portales como Idealista o Zillow.',
      icon: 'Home',
      form_schema: [
        { id: 'tipo_propiedad', type: 'select', label_en: 'Property Type', label_es: 'Tipo de propiedad', required: true,
          options: [
            { value: 'piso', label_en: 'Apartment', label_es: 'Piso/Departamento' },
            { value: 'casa', label_en: 'House', label_es: 'Casa/Chalet' },
            { value: 'oficina', label_en: 'Office', label_es: 'Oficina' }
          ]
        },
        { id: 'ubicacion', type: 'text', label_en: 'Location', label_es: 'Ubicación/Zona', required: true },
        { id: 'caracteristicas_top', type: 'textarea', label_en: 'Top Features', label_es: 'Características principales (Piscina, vistas, m2)', required: true },
        { id: 'vibe', type: 'select', label_en: 'Tone/Vibe', label_es: 'Tono/Estilo', required: true,
          options: [
            { value: 'lujo', label_en: 'Luxury', label_es: 'Lujo/Exclusivo' },
            { value: 'familiar', label_en: 'Family', label_es: 'Familiar/Acogedor' },
            { value: 'inversion', label_en: 'Investment', label_es: 'Inversión/Oportunidad' }
          ]
        }
      ],
      prompt_template: `Actúa como un Copywriter Inmobiliario de élite. Escribe una descripción para un/a {{tipo_propiedad}} en {{ubicacion}}.
      
      DATOS:
      - Características: {{caracteristicas_top}}
      - Tono: {{vibe}}
      
      ESTRUCTURA:
      1. Título Gancho: Que llame la atención de inmediato.
      2. Párrafo Emocional: Describe cómo se siente vivir ahí.
      3. Lista de Beneficios: No solo características, sino qué ganan al vivir ahí.
      4. Llamado a la Acción (CTA): Urgencia suave para agendar visita.
      
      Usa un lenguaje que evoque los sentidos.`
    },
    {
      slug: 'real-estate-roi-calc',
      name_en: 'Inmo-ROI Advisor',
      name_es: 'Asesor Inmo-ROI',
      description_en: 'Analyze the profitability of a real estate investment for your clients.',
      description_es: 'Analiza la rentabilidad de una inversión inmobiliaria para tus clientes.',
      icon: 'TrendingUp',
      form_schema: [
        { id: 'precio_compra', type: 'number', label_en: 'Purchase Price', label_es: 'Precio de compra', required: true },
        { id: 'reforma_estimada', type: 'number', label_en: 'Renovation Cost', label_es: 'Coste de reforma/adecuación', required: true },
        { id: 'alquiler_esperado', type: 'number', label_en: 'Expected Rent', label_es: 'Alquiler mensual esperado', required: true },
        { id: 'gastos_fijos', type: 'textarea', label_en: 'Fixed Expenses', label_es: 'Gastos fijos (Comunidad, IBI, Seguros)', required: true }
      ],
      prompt_template: `Eres un Analista de Inversiones Inmobiliarias. Evalúa esta oportunidad:
      - Precio: {{precio_compra}}
      - Reforma: {{reforma_estimada}}
      - Alquiler: {{alquiler_esperado}}
      - Gastos: {{gastos_fijos}}
      
      CALCULA Y EXPLICA:
      1. Rentabilidad Bruta y Neta estimada.
      2. Tiempo de Recuperación de Inversión (ROI).
      3. Análisis de Riesgo: Indica 2 posibles riesgos y 2 puntos fuertes de esta operación.
      4. Veredicto: ¿Es una buena inversión?`
    }
  ]

  // Fetch plans
  const { data: plans } = await supabase.from('plans').select('id, slug')
  const proPlan = plans?.find(p => p.slug === 'professional')

  for (const app of apps) {
    console.log(`Inserting app: ${app.slug}...`)
    const { data: newApp, error: appError } = await supabase.from('micro_apps').upsert({
      slug: app.slug,
      name_en: app.name_en,
      name_es: app.name_es,
      description_en: app.description_en,
      description_es: app.description_es,
      icon: app.icon,
      form_schema: app.form_schema,
      prompt_template: app.prompt_template
    }, { onConflict: 'slug' }).select('id').single()

    if (appError) {
      console.error(`Error with ${app.slug}:`, appError.message)
      continue
    }

    if (proPlan && newApp) {
      await supabase.from('plan_apps').upsert({
        plan_id: proPlan.id,
        app_id: newApp.id
      }, { onConflict: 'plan_id,app_id' })
      console.log(`Linked ${app.slug} to Pro Plan`)
    }
  }

  console.log('\n✅ Vertical de Inmobiliaria completada.')
}

run()

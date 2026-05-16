import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🏠 Seeding Home & Garden Batch 2...')

  const apps = [
    {
      slug: 'decospace-studio-ia',
      name_en: 'DecoSpace Studio',
      name_es: 'DecoSpace Studio',
      description_en: 'AI interior design visualization and furniture catalog.',
      description_es: 'Visualización de diseño de interiores por IA y catálogo de muebles.',
      icon: 'Layout',
      form_schema: [
        { id: 'ambiente', type: 'select', label_es: 'Ambiente a decorar', options: [
          { value: 'sala', label_es: 'Sala de Estar' },
          { value: 'dormitorio', label_es: 'Dormitorio' },
          { value: 'cocina', label_es: 'Cocina' },
          { value: 'oficina', label_es: 'Oficina / Home Office' }
        ], required: true },
        { id: 'estilo', type: 'select', label_es: 'Estilo deseado', options: [
          { value: 'minimalista', label_es: 'Minimalista / Escandinavo' },
          { value: 'industrial', label_es: 'Industrial / Loft' },
          { value: 'moderno', label_es: 'Moderno / Contemporáneo' },
          { value: 'rustico', label_es: 'Rústico / Natural' }
        ], required: true },
        { id: 'presupuesto', type: 'text', label_es: 'Presupuesto estimado (opcional)', placeholder_es: 'Ej: S/5000' }
      ],
      prompt_template: 'Actúa como un diseñador de interiores premium. El usuario quiere decorar su {{ambiente}} con un estilo {{estilo}} y tiene un presupuesto de {{presupuesto}}. Genera: 1. Concepto de diseño detallado. 2. Paleta de colores sugerida (códigos HEX). 3. Lista de 5 muebles clave para comprar. 4. Consejos de iluminación y disposición espacial.'
    },
    {
      slug: 'huertosmart-ai-garden',
      name_en: 'HuertoSmart',
      name_es: 'HuertoSmart',
      description_en: 'Smart urban gardening management and crop alerts.',
      description_es: 'Gestión inteligente de huertos urbanos y alertas de cultivo.',
      icon: 'Sprout',
      form_schema: [
        { id: 'cultivo', type: 'text', label_es: '¿Qué estás cultivando?', placeholder_es: 'Ej: Tomates, Lechuga, Albahaca...', required: true },
        { id: 'espacio', type: 'select', label_es: 'Tipo de espacio', options: [
          { value: 'macetas', label_es: 'Macetas / Balcón' },
          { value: 'suelo', label_es: 'Suelo / Jardín' },
          { value: 'hidroponia', label_es: 'Hidroponía' }
        ], required: true }
      ],
      prompt_template: 'Actúa como un experto en agricultura urbana. El usuario cultiva {{cultivo}} en {{espacio}}. Genera: 1. Ficha técnica del cultivo. 2. Frecuencia de riego y abonado. 3. Guía de prevención de plagas comunes. 4. Fecha estimada de cosecha si empieza hoy.'
    },
    {
      slug: 'cleanmaster-pro-home',
      name_en: 'CleanMaster Home',
      name_es: 'CleanMaster Home',
      description_en: 'Professional cleaning checklists and staff management.',
      description_es: 'Checklists profesionales de limpieza y gestión de personal.',
      icon: 'ShieldCheck',
      form_schema: [
        { id: 'tipo_servicio', type: 'select', label_es: 'Tipo de servicio', options: [
          { value: 'profundo', label_es: 'Limpieza Profunda' },
          { value: 'mantenimiento', label_es: 'Limpieza de Mantenimiento' },
          { value: 'mudanza', label_es: 'Mudanza (Entrada/Salida)' }
        ], required: true },
        { id: 'habitaciones', type: 'number', label_es: 'Número de habitaciones', required: true }
      ],
      prompt_template: 'Actúa como un supervisor de servicios de limpieza profesional. Para un servicio {{tipo_servicio}} en una propiedad de {{habitaciones}} habitaciones, genera: 1. Checklist detallado por zona. 2. Lista de insumos recomendados. 3. Tiempo estimado de ejecución. 4. Protocolo de inspección de calidad final.'
    }
  ]

  const { data: offer } = await supabase.from('plans').select('id').eq('slug', 'professional').single()
  
  if (!offer) {
    console.error('❌ Error: Plan "professional" no encontrado.')
    return
  }

  for (const app of apps) {
    const { data: newApp, error: appError } = await supabase.from('micro_apps').upsert(app, { onConflict: 'slug' }).select('id').single()
    
    if (appError) {
      console.error(`❌ Error al insertar ${app.slug}:`, appError.message)
      continue
    }

    if (newApp) {
      await supabase.from('plan_apps').upsert({ 
        plan_id: offer.id, 
        app_id: newApp.id 
      }, { onConflict: 'plan_id,app_id' })
      console.log(`✅ App ${app.name_es} lista.`)
    }
  }

  console.log('✨ Batch 2 de Hogar y Jardín completado.')
}

run()

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('🛍️ Seeding Micro-Apps para Retail y Belleza...')

  const apps = [
    {
      slug: 'retail-upsell-ai',
      name_en: 'RetailUpsell AI',
      name_es: 'RetailUpsell AI',
      description_en: 'Generate perfect upsell suggestions for your retail customers.',
      description_es: 'Genera sugerencias de venta cruzada perfectas para tus clientes de retail.',
      icon: 'Zap',
      form_schema: [
        { id: 'producto_principal', type: 'text', label_en: 'Main Product', label_es: 'Producto principal', required: true },
        { id: 'presupuesto_cliente', type: 'text', label_en: 'Customer Budget', label_es: 'Presupuesto del cliente', required: true }
      ],
      prompt_template: `Eres un experto en Ventas de Retail. El cliente está comprando {{producto_principal}}.
      
      TAREA:
      Genera 3 opciones de Upsell/Cross-sell:
      1. COMPLEMENTO ECONÓMICO: Un accesorio imprescindible.
      2. PACK PREMIUM: Cómo convertir la compra en un kit completo.
      3. LA OFERTA IRRESISTIBLE: "Por solo X más, te llevas esto".
      
      Escribe el guion para que el vendedor lo diga de forma natural.`
    },
    {
      slug: 'beauty-marketing-pro',
      name_en: 'BeautyMarketing AI',
      name_es: 'Marketing Belleza AI',
      description_en: 'Hypnotic copy for beauty salons and aesthetic clinics.',
      description_es: 'Copy hipnótico para salones de belleza y clínicas estéticas.',
      icon: 'Sparkles',
      form_schema: [
        { id: 'tratamiento', type: 'text', label_en: 'Treatment', label_es: 'Tratamiento/Servicio', required: true },
        { id: 'beneficio_clave', type: 'textarea', label_en: 'Key Benefit', label_es: 'Beneficio clave (Ej: rejuvenecimiento, relax)', required: true }
      ],
      prompt_template: `Actúa como un Copywriter para la industria de la belleza.
      Promocionamos: {{tratamiento}}.
      Beneficio: {{beneficio_clave}}.
      
      GENERA:
      1. Un post de Instagram (con emojis).
      2. Un mensaje de WhatsApp para clientes recurrentes.
      3. Una oferta limitada de "Solo 5 cupos" para generar urgencia.`
    }
  ]

  const { data: plans } = await supabase.from('plans').select('id, slug')
  const proPlan = plans?.find(p => p.slug === 'professional')

  for (const app of apps) {
    const { data: newApp } = await supabase.from('micro_apps').upsert({
      slug: app.slug, name_en: app.name_en, name_es: app.name_es,
      description_en: app.description_en, description_es: app.description_es,
      icon: app.icon, form_schema: app.form_schema, prompt_template: app.prompt_template
    }, { onConflict: 'slug' }).select('id').single()

    if (proPlan && newApp) {
      await supabase.from('plan_apps').upsert({ plan_id: proPlan.id, app_id: newApp.id }, { onConflict: 'plan_id,app_id' })
    }
  }

  console.log('\n✅ Vertical de Retail y Belleza completada.')
}

run()

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function addApp() {
  const linkedinApp = {
    slug: 'linkedin-gen',
    name_es: 'Generador de Posts para LinkedIn',
    name_en: 'LinkedIn Post Generator',
    description_es: 'Crea contenido profesional de alto impacto para tu red.',
    description_en: 'Create high-impact professional content for your network.',
    icon: 'Linkedin',
    form_schema: [
      {
        name: 'topic',
        label_es: 'Tema Central',
        label_en: 'Main Topic',
        type: 'text',
        placeholder_es: 'Ej. Inteligencia Artificial en Ventas...',
        placeholder_en: 'Ex. AI in Sales...',
        required: true
      },
      {
        name: 'hook',
        label_es: 'Gancho (Hook)',
        label_en: 'Initial Hook',
        type: 'select',
        options_es: ['Pregunta Directa', 'Dato Estadístico', 'Historia Personal', 'Opinión Polemica'],
        options_en: ['Direct Question', 'Statistical Data', 'Personal Story', 'Controversial Opinion'],
        required: true
      },
      {
        name: 'style',
        label_es: 'Estilo de Redacción',
        label_en: 'Writing Style',
        type: 'select',
        options_es: ['Profesional', 'Casual/Narrativo', 'Minimalista', 'Educativo'],
        options_en: ['Professional', 'Casual/Narrative', 'Minimalist', 'Educational'],
        required: true
      }
    ],
    autofill_presets: [
      {
        label: 'IA News',
        values: { topic: 'Nuevos modelos de lenguaje en 2024', hook: 'Dato Estadístico', style: 'Educativo' }
      }
    ],
    prompt_template: `Actúa como un experto en Personal Branding para LinkedIn. 
    Escribe un post impactante sobre: {{topic}}.
    Usa un gancho inicial tipo: {{hook}}.
    El estilo debe ser: {{style}}.
    Asegúrate de incluir 3-5 hashtags relevantes al final y usa emojis de forma profesional.`
  }

  const { data, error } = await supabase
    .from('micro_apps')
    .insert(linkedinApp)
    .select()

  if (error) {
    console.error('Error adding app:', error)
  } else {
    console.log('Successfully added LinkedIn Generator:', data[0].id)
  }
}

addApp()

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey
)

async function seedApps() {
  const apps = [
    {
      slug: 'linkedin-gen',
      name_es: 'Generador de Posts para LinkedIn',
      name_en: 'LinkedIn Post Generator',
      description_es: 'Crea contenido profesional de alto impacto para tu red.',
      description_en: 'Create high-impact professional content for your network.',
      icon: 'FileText',
      form_schema: [
        { name: 'topic', label_es: 'Tema Central', label_en: 'Main Topic', type: 'text', placeholder_es: 'Ej. IA en Ventas...', placeholder_en: 'Ex. AI in Sales...', required: true },
        { name: 'style', label_es: 'Estilo de Redacción', label_en: 'Writing Style', type: 'select', options_es: ['Profesional', 'Casual', 'Educativo'], options_en: ['Professional', 'Casual', 'Educational'], required: true }
      ],
      prompt_template: 'Actúa como un experto en LinkedIn. Escribe un post creativo sobre {{topic}} con un estilo {{style}}.'
    },
    {
      slug: 'audience-analyst',
      name_es: 'Audience Analyst',
      name_en: 'Audience Analyst',
      description_es: 'Define y analiza a tu cliente ideal con precisión quirúrgica.',
      description_en: 'Define and analyze your ideal customer with surgical precision.',
      icon: 'Users',
      form_schema: [
        { name: 'product', label_es: 'Producto o Servicio', label_en: 'Product or Service', type: 'text', placeholder_es: 'Ej. Una app de productividad para freelancers...', placeholder_en: 'Ex. A productivity app for freelancers...', required: true },
        { name: 'tone', label_es: 'Tono del Análisis', label_en: 'Analysis Tone', type: 'select', options_es: ['Psicológico', 'Económico', 'Sociológico'], options_en: ['Psychological', 'Economic', 'Sociological'], required: true }
      ],
      prompt_template: 'Como consultor de marketing experto, analiza el público objetivo para {{product}}. Enfócate en un tono {{tone}}. Genera un reporte detallado con: 1. Demografía, 2. Puntos de dolor, 3. Motivaciones de compra.'
    },
    {
      slug: 'video-script',
      name_es: 'Video Script Pro',
      name_en: 'Video Script Pro',
      description_es: 'Guiones estructurados para TikTok, Reels y Shorts.',
      description_en: 'Structured scripts for TikTok, Reels, and Shorts.',
      icon: 'Video',
      form_schema: [
        { name: 'hook_type', label_es: 'Tipo de Gancho', label_en: 'Hook Type', type: 'select', options_es: ['Pregunta', 'Curiosidad', 'Dato loco'], options_en: ['Question', 'Curiosity', 'Crazy Data'], required: true },
        { name: 'duration', label_es: 'Duración Estimada', label_en: 'Estimated Duration', type: 'select', options_es: ['15s', '30s', '60s'], options_en: ['15s', '30s', '60s'], required: true }
      ],
      prompt_template: 'Crea un guion de video para redes sociales de {{duration}}. Empieza con un gancho de {{hook_type}}.'
    },
    {
      slug: 'seo-planner',
      name_es: 'SEO Article Planner',
      name_en: 'SEO Article Planner',
      description_es: 'Estructura artículos que posicionen en Google.',
      description_en: 'Structure articles that rank on Google.',
      icon: 'Search',
      form_schema: [
        { name: 'keyword', label_es: 'Palabra Clave principal', label_en: 'Main Keyword', type: 'text', placeholder_es: 'Ej. Mejores playas de España...', placeholder_en: 'Ex. Best beaches in Spain...', required: true }
      ],
      prompt_template: 'Crea un esquema SEO avanzado (H1, H2, H3) para un artículo sobre {{keyword}}.'
    },
    {
      slug: 'code-snippet',
      name_es: 'Code Snippet Enhancer',
      name_en: 'Code Snippet Enhancer',
      description_es: 'Optimiza, refactoriza y documenta tu código.',
      description_en: 'Optimize, refactor, and document your code.',
      icon: 'Sparkles',
      form_schema: [
        { name: 'code', label_es: 'Fragmento de Código', label_en: 'Code Fragment', type: 'textarea', placeholder_es: 'Pega tu código aquí...', placeholder_en: 'Paste your code here...', required: true },
        { name: 'goal', label_es: 'Objetivo', label_en: 'Goal', type: 'select', options_es: ['Refactorizar', 'Documentar', 'Explicar'], options_en: ['Refactor', 'Document', 'Explain'], required: true }
      ],
      prompt_template: 'Actúa como un desarrollador Senior. {{goal}} el siguiente código: \n\n{{code}}'
    },
    {
      slug: 'email-architect',
      name_es: 'Email Sequence Architect',
      name_en: 'Email Sequence Architect',
      description_es: 'Diseña secuencias de correos de alta conversión en segundos.',
      description_en: 'Design high-conversion email sequences in seconds.',
      icon: 'Mail',
      form_schema: [
        { name: 'goal', label_es: 'Objetivo de la Campaña', label_en: 'Campaign Goal', type: 'select', options_es: ['Venta Directa', 'Nurturing', 'Recuperación de Carrito'], options_en: ['Direct Sale', 'Nurturing', 'Cart Recovery'], required: true },
        { name: 'audience', label_es: 'Audiencia', label_en: 'Audience', type: 'text', placeholder_es: 'Ej. Dueños de agencias...', placeholder_en: 'Ex. Agency owners...', required: true },
        { name: 'emails_count', label_es: 'Número de Correos', label_en: 'Email Count', type: 'select', options_es: ['3', '5', '7'], options_en: ['3', '5', '7'], required: true }
      ],
      prompt_template: 'Eres un Copywriter experto. Diseña una secuencia de {{emails_count}} correos para {{audience}} con el objetivo de {{goal}}. Incluye asuntos (subject lines) potentes y cuerpo de mensaje persuasivo.'
    }
  ]

  console.log('Upserting apps to database...')
  const { data, error } = await supabase
    .from('micro_apps')
    .upsert(apps, { onConflict: 'slug' })
    .select()

  if (error) {
    console.error('Error seeding apps:', error)
  } else {
    console.log('Successfully seeded apps:', data.map(a => a.name_en).join(', '))
  }
}

seedApps()

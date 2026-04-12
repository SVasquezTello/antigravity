
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const env = readFileSync('c:/Users/DAVID/Desktop/ANTIGRAVITY/.env.local', 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key && value) acc[key.trim()] = value.trim();
    return acc;
  }, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const MOCK_APPS = [
  {
    slug: 'redactor-articulos',
    name_es: 'Redactor de Artículos SEO',
    name_en: 'SEO Article Writer',
    description_es: 'Genera artículos optimizados para buscadores a partir de un tema.',
    description_en: 'Generate search-engine optimized articles from a topic.',
    icon: 'FileText',
    form_schema: [
      {
        id: 'topic',
        label_es: 'Tema del Artículo',
        label_en: 'Article Topic',
        type: 'text',
        placeholder_es: 'Ej: El futuro de la IA en 2025',
        placeholder_en: 'Ex: The future of AI in 2025',
        required: true
      },
      {
        id: 'tone',
        label_es: 'Tono de Voz',
        label_en: 'Tone of Voice',
        type: 'select',
        options_es: ['Profesional', 'Informal', 'Entusiasta', 'Crítico'],
        options_en: ['Professional', 'Informal', 'Enthusiastic', 'Critical'],
        required: true
      },
      {
        id: 'keywords',
        label_es: 'Palabras Clave (separadas por coma)',
        label_en: 'Keywords (comma separated)',
        type: 'text',
        placeholder_es: 'Ej: tecnologia, futuro, tendencias',
        placeholder_en: 'Ex: technology, future, trends',
        required: false
      },
      {
        id: 'include_conclusion',
        label_es: 'Incluir Conclusión',
        label_en: 'Include Conclusion',
        type: 'toggle',
        required: false
      }
    ],
    autofill_presets: [
      {
        label_es: 'Tecnología',
        label_en: 'Technology',
        values: { topic: 'Avances en computación cuántica', tone: 'Profesional', keywords: 'cuantica, hardware, futuro', include_conclusion: 'true' }
      }
    ],
    prompt_template: 'Escribe un artículo sobre {{topic}} con un tono {{tone}}. Palabras clave: {{keywords}}. Incluir conclusión: {{include_conclusion}}.'
  },
  {
    slug: 'traductor-premium',
    name_es: 'Traductor Contextual',
    name_en: 'Contextual Translator',
    description_es: 'Traducciones que mantienen el sentido y estilo original.',
    description_en: 'Translations that preserve the original meaning and style.',
    icon: 'Languages',
    form_schema: [
      {
        id: 'text',
        label_es: 'Texto a traducir',
        label_en: 'Text to translate',
        type: 'textarea',
        placeholder_es: 'Pega tu texto aquí...',
        placeholder_en: 'Paste your text here...',
        required: true
      },
      {
        id: 'target_lang',
        label_es: 'Idioma de destino',
        label_en: 'Target language',
        type: 'select',
        options_es: ['Inglés', 'Español', 'Francés', 'Alemán'],
        options_en: ['English', 'Spanish', 'French', 'German'],
        required: true
      }
    ],
    prompt_template: 'Traduce el siguiente texto al {{target_lang}}: {{text}}'
  },
  {
    slug: 'resumidor-textos',
    name_es: 'Resumidor Inteligente',
    name_en: 'Smart Summarizer',
    description_es: 'Extrae las ideas principales de textos largos.',
    description_en: 'Extract main ideas from long texts.',
    icon: 'Zap',
    form_schema: [
      {
        id: 'content',
        label_es: 'Contenido extenso',
        label_en: 'Long content',
        type: 'textarea',
        placeholder_es: 'Pega el texto largo aquí...',
        placeholder_en: 'Paste long text here...',
        required: true
      },
      {
        id: 'length',
        label_es: 'Longitud del resumen',
        label_en: 'Summary length',
        type: 'select',
        options_es: ['Muy corto (bala)', 'Medio', 'Detallado'],
        options_en: ['Very short (bullets)', 'Medium', 'Detailed'],
        required: true
      }
    ],
    prompt_template: 'Resume el siguiente contenido de forma {{length}}: {{content}}'
  }
];

async function seed() {
  console.log('Seeding micro-apps...');
  const { data, error } = await supabase
    .from('micro_apps')
    .upsert(MOCK_APPS, { onConflict: 'slug' });
  
  if (error) {
    console.error('Error seeding:', error);
  } else {
    console.log('Seeded successfully:', data);
  }
}

seed();

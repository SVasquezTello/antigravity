import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const supabaseUrl = 'https://mzgabbgclbkcsbjkyklv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z2FiYmdjbGJrY3Niamt5a2x2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxODk4NywiZXhwIjoyMDkwMzk0OTg3fQ.Lr4W6x3V5TrIkZ1g9otdeOgzmhuHmj6Lr9oTstc6WD8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('Seeding Reto 08: Instagram Captions Generator...')
  
  const appId = crypto.randomUUID()

  // 1. Insert Micro App
  const { error: appError } = await supabase.from('micro_apps').insert({
    id: appId,
    slug: 'ig-captions',
    name_en: 'Instagram Captions',
    name_es: 'Captions de Instagram',
    description_en: 'Generate engaging and optimized captions for your Instagram posts with hashtags.',
    description_es: 'Genera descripciones atractivas y optimizadas para tus posts de Instagram con hashtags.',
    icon: 'Camera',
    form_schema: [
      {
        id: 'topic',
        type: 'text',
        label_en: 'What is the post about?',
        label_es: '¿De qué trata la publicación?',
        placeholder_en: 'A sunny day at the beach with friends',
        placeholder_es: 'Un día soleado en la playa con amigos',
        required: true
      },
      {
        id: 'tone',
        type: 'select',
        label_en: 'Tone of voice',
        label_es: 'Tono de voz',
        required: true,
        options: [
           { value: 'casual', label_en: 'Casual & Fun', label_es: 'Casual y Divertido' },
           { value: 'professional', label_en: 'Professional', label_es: 'Profesional' },
           { value: 'inspirational', label_en: 'Inspirational', label_es: 'Inspiracional' },
           { value: 'sales', label_en: 'Sales / Promotional', label_es: 'Ventas / Promocional' }
        ]
      },
      {
        id: 'keywords',
        type: 'textarea',
        label_en: 'Specific keywords to include',
        label_es: 'Palabras clave a incluir',
        placeholder_en: 'summer, friends, ocean',
        placeholder_es: 'verano, amigos, océano',
        required: false
      }
    ],
    autofill_presets: [
      {
        name_en: 'Vacation Photo',
        name_es: 'Foto de Vacaciones',
        values: {
           topic: 'My recent trip to the mountains, enjoying nature and hot chocolate',
           tone: 'inspirational',
           keywords: 'nature, peace, retreat'
        }
      },
      {
        name_en: 'Product Launch',
        name_es: 'Lanzamiento de Producto',
        values: {
           topic: 'Launching our new organic skincare face serum, 100% vegan',
           tone: 'sales',
           keywords: 'skincare, vegan, beauty, organic'
        }
      }
    ],
    prompt_template: `Act as an expert Instagram Social Media Manager.

I need you to generate exactly 3 different caption options for an Instagram post based on the following details:

Topic/Context: {{topic}}
Desired Tone: {{tone}}
Keywords to include (if any): {{keywords}}

For each option, make sure to include:
- A catchy first line (hook)
- The main body of the text
- A call to action (CTA) at the end
- 5-8 highly relevant formatting hashtags.

Format the output clearly using Markdown (e.g. Option 1, Option 2, Option 3), and separate them beautifully. Make the response highly creative and native to Instagram culture.`
  })

  if (appError) {
    console.error('Error inserting app:', appError)
    if (appError.code !== '23505') return // ignore if already exists
  } else {
    console.log('✅ Micro app inserted!')
  }

  // 2. Fetch Professional Plan ID
  const { data: plans, error: planError } = await supabase.from('plans').select('id, slug')
  if (planError) {
    console.error('Error fetching plans:', planError)
    return
  }

  const proPlan = plans.find(p => p.slug === 'professional' || p.slug === 'pro')
  if (!proPlan) {
    console.warn('⚠️ Professional plan not found, skipping plan assignment.')
    return
  }

  // 3. Link App to Professional Plan
  // check if link exists
  const { data: existingLink } = await supabase.from('plan_apps')
    .select('*')
    .eq('plan_id', proPlan.id)
    .eq('app_id', appId)
    .single()

  if (!existingLink) {
    const { error: linkError } = await supabase.from('plan_apps').insert({
      plan_id: proPlan.id,
      app_id: appId
    })
    
    if (linkError) {
       console.error('Error linking to plan:', linkError)
    } else {
       console.log('✅ Linked app to Professional plan!')
    }
  } else {
    console.log('App is already linked to Professional plan.')
  }

  console.log('Done seeding.')
}

run()

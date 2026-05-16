import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { callGemini } from '../src/lib/gemini.mjs'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function test() {
  console.log('🧪 Testing "ReactivaFactory" Micro-App...')

  // 1. Fetch App
  const { data: app, error } = await supabase
    .from('micro_apps')
    .select('*')
    .eq('slug', 'reactiva-factory-whatsapp')
    .single()

  if (error || !app) {
    console.error('❌ App not found:', error?.message)
    return
  }

  console.log('✅ App Template Loaded:', app.name_es)

  // 2. Prepare Dummy Data
  const inputs = {
    cliente: 'Juan Perez',
    producto: 'Engranajes de Acero 50mm',
    volumen: '500 unidades',
    dias: '5'
  }

  // 3. Fill Template
  let finalPrompt = app.prompt_template
  for (const [key, value] of Object.entries(inputs)) {
    finalPrompt = finalPrompt.replace(`{{${key}}}`, value)
  }

  console.log('📝 Processed Prompt:', finalPrompt)
  console.log('---')

  // 4. Call AI
  try {
    const result = await callGemini(finalPrompt)
    console.log('🤖 AI Response:')
    console.log(result)
  } catch (err) {
    console.error('❌ AI Error:', err.message)
  }
}

test()

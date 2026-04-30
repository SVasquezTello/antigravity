import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function validateSchemas() {
  const { data: apps } = await supabase.from('micro_apps').select('slug, form_schema')
  console.log(`Checking ${apps?.length} apps...`)
  
  let errors = 0
  apps?.forEach(app => {
    try {
      // form_schema should already be an object if fetched from Supabase via JS client
      if (typeof app.form_schema !== 'object' || app.form_schema === null) {
        console.error(`App ${app.slug} has invalid form_schema type:`, typeof app.form_schema)
        errors++
      }
    } catch (e) {
      console.error(`App ${app.slug} has unparseable form_schema:`, e.message)
      errors++
    }
  })
  
  console.log(`Validation complete. Errors found: ${errors}`)
}

validateSchemas()


import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkApps() {
  const { data, count, error } = await supabase
    .from('micro_apps')
    .select('*', { count: 'exact' })

  if (error) {
    console.error('Error fetching apps:', error)
  } else {
    console.log(`Successfully fetched ${count} apps.`)
    console.log('Sample App structure:', data[0])
    console.log('Apps:', data.map(a => a.slug))
  }
}

checkApps()

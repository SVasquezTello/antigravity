import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // use service role to bypass RLS for a test!
)

async function run() {
  console.log("Fetching apps...")
  const { data, error } = await supabase.from('micro_apps').select('*')
  console.log(error || data)
}
run()

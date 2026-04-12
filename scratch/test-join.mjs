
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testQuery() {
  const { data, error } = await supabase
    .from('users')
    .select('*, plans(*)')
    .limit(1)

  if (error) {
    console.error('Query Error:', error)
  } else {
    console.log('Query Data:', JSON.stringify(data, null, 2))
  }
}

testQuery()

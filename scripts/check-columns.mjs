import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkColumns() {
  const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'micro_apps' })
  if (error) {
    // If RPC doesn't exist, try a simple select
    const { data: row, error: selectError } = await supabase.from('micro_apps').select('*').limit(1)
    if (row && row.length > 0) {
      console.log('Columns in partners:', Object.keys(row[0]))
    } else {
      console.log('No data in partners or error:', selectError)
    }
  } else {
    console.log('Columns:', data)
  }
}

checkColumns()

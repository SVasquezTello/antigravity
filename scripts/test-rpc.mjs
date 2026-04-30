import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function testExecSql() {
  const { data, error } = await supabase.rpc('exec_sql', { sql: 'SELECT 1' })
  if (error) {
    console.error('RPC Error:', error)
  } else {
    console.log('RPC Success:', data)
  }
}

testExecSql()

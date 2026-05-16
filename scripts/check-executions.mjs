import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkExecutions() {
  const { data, count } = await supabase
    .from('app_executions')
    .select('*, micro_apps(slug, name_es)', { count: 'exact' })
    .limit(10)
  
  console.log(`Total Executions: ${count}`)
  if (data) {
    data.forEach(ex => {
      console.log(`- App: ${ex.micro_apps?.name_es || ex.app_id} | Status: ${ex.status} | Created: ${ex.created_at}`)
    })
  }
}

checkExecutions()

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testAccess() {
  const { data: users } = await supabase.from('users').select('*');
  console.log('Users:', users);

  const { data: planApps, error: planAppsError } = await supabase
    .from('plan_apps')
    .select('micro_apps(slug)')
    .eq('plan_id', users[0].plan_id);

  console.log('Plan Apps Query Error:', planAppsError);
  console.log('Plan Apps Results:', planApps);
}

testAccess()

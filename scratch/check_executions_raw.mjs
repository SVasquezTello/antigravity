import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkExecutionsRaw() {
  const { data: executions, error } = await supabase
    .from('app_executions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('--- RAW EXECUTIONS ---');
  executions.forEach(ex => {
    console.log(`[${ex.created_at}] ID: ${ex.id} | Status: ${ex.status}`);
  });
}

checkExecutionsRaw();

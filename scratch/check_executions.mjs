import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkExecutions() {
  console.log('Fetching last 5 executions...');
  const { data: executions, error } = await supabase
    .from('app_executions')
    .select('*, micro_apps(slug)')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('--- LAST EXECUTIONS ---');
  executions.forEach(ex => {
    console.log(`[${ex.created_at}] App: ${ex.micro_apps?.slug} | Status: ${ex.status} | Error: ${ex.error_message || 'None'}`);
    if (ex.status === 'completed') {
       console.log(`- Result partial: ${JSON.stringify(ex.result).substring(0, 50)}...`);
    }
  });
}

checkExecutions();

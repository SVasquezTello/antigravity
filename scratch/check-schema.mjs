import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const { data: plans } = await supabase.from('plans').select('*');
  console.log('PLANS:', JSON.stringify(plans, null, 2));

  const { data: apps } = await supabase.from('micro_apps').select('id, slug');
  console.log('APPS:', JSON.stringify(apps, null, 2));
}

main().catch(console.error);
